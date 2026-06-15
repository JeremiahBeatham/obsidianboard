import { Point, SketchDoc, Stroke, ToolName } from "./model";
import { renderDocToContext, strokeToOutline, fillOutline } from "./export";

export interface BrushSettings {
	tool: ToolName;
	color: string;
	size: number;
	opacity: number;
}

export interface SketchCanvasOptions {
	palmRejection: boolean;
	onChange: () => void;
}

/**
 * Interactive drawing surface. Owns a <canvas>, handles Pointer Events with
 * pressure + coalesced events for an iOS-Notes-like feel, and maintains an
 * undo/redo stack over the SketchDoc's strokes.
 */
export class SketchCanvas {
	readonly el: HTMLCanvasElement;
	private ctx: CanvasRenderingContext2D;
	private doc: SketchDoc;
	private brush: BrushSettings;
	private readonly options: SketchCanvasOptions;

	private dpr = 1;
	/** Maps a client pixel to a logical doc coordinate. */
	private cssScale = 1;

	private activeStroke: Stroke | null = null;
	private activePointerId: number | null = null;
	/** True while a stylus pointer is down (used for palm rejection). */
	private penActive = false;

	private undoStack: SketchDoc["strokes"][] = [];
	private redoStack: SketchDoc["strokes"][] = [];

	constructor(
		parent: HTMLElement,
		doc: SketchDoc,
		brush: BrushSettings,
		options: SketchCanvasOptions,
	) {
		this.doc = doc;
		this.brush = brush;
		this.options = options;

		this.el = parent.createEl("canvas", { cls: "obsidianboard-canvas" });
		const ctx = this.el.getContext("2d");
		if (!ctx) throw new Error("Could not acquire 2D drawing context");
		this.ctx = ctx;

		this.registerPointerHandlers();
	}

	setBrush(brush: BrushSettings): void {
		this.brush = brush;
	}

	getDoc(): SketchDoc {
		return this.doc;
	}

	/** Resize the backing canvas to fit its container while preserving aspect. */
	resize(): void {
		const parent = this.el.parentElement;
		if (!parent) return;
		const rect = parent.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) return;

		// Fit the document into the available space, preserving aspect ratio.
		const aspect = this.doc.width / this.doc.height;
		let cssWidth = rect.width;
		let cssHeight = cssWidth / aspect;
		if (cssHeight > rect.height) {
			cssHeight = rect.height;
			cssWidth = cssHeight * aspect;
		}

		this.dpr = window.devicePixelRatio || 1;
		this.cssScale = this.doc.width / cssWidth;

		this.el.style.width = `${cssWidth}px`;
		this.el.style.height = `${cssHeight}px`;
		this.el.width = Math.round(this.doc.width * this.dpr);
		this.el.height = Math.round(this.doc.height * this.dpr);

		this.redraw();
	}

	/** Full re-render of the document plus any in-progress stroke. */
	redraw(): void {
		const { ctx } = this;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, this.el.width, this.el.height);
		ctx.scale(this.dpr, this.dpr);
		renderDocToContext(ctx, this.doc);
		if (this.activeStroke) this.drawStroke(this.activeStroke);
	}

	clear(): void {
		this.pushUndo();
		this.doc.strokes = [];
		this.redraw();
		this.options.onChange();
	}

	canUndo(): boolean {
		return this.undoStack.length > 0;
	}

	canRedo(): boolean {
		return this.redoStack.length > 0;
	}

	undo(): void {
		const prev = this.undoStack.pop();
		if (!prev) return;
		this.redoStack.push(this.doc.strokes.slice());
		this.doc.strokes = prev;
		this.redraw();
		this.options.onChange();
	}

	redo(): void {
		const next = this.redoStack.pop();
		if (!next) return;
		this.undoStack.push(this.doc.strokes.slice());
		this.doc.strokes = next;
		this.redraw();
		this.options.onChange();
	}

	destroy(): void {
		this.el.remove();
	}

	// --- input handling -------------------------------------------------

	private registerPointerHandlers(): void {
		this.el.addEventListener("pointerdown", this.onPointerDown);
		this.el.addEventListener("pointermove", this.onPointerMove);
		this.el.addEventListener("pointerup", this.onPointerUp);
		this.el.addEventListener("pointercancel", this.onPointerUp);
		this.el.addEventListener("pointerleave", this.onPointerUp);
	}

	private shouldIgnore(evt: PointerEvent): boolean {
		// Palm rejection: once a stylus is in use, ignore finger/touch input.
		if (
			this.options.palmRejection &&
			this.penActive &&
			evt.pointerType === "touch"
		) {
			return true;
		}
		return false;
	}

	private onPointerDown = (evt: PointerEvent): void => {
		if (evt.button !== undefined && evt.button > 0) return; // ignore right/middle
		if (this.shouldIgnore(evt)) return;

		if (evt.pointerType === "pen") this.penActive = true;
		this.activePointerId = evt.pointerId;
		this.el.setPointerCapture(evt.pointerId);

		this.pushUndo();
		this.redoStack = [];

		this.activeStroke = {
			tool: this.brush.tool,
			color: this.brush.color,
			size: this.brush.size,
			opacity: this.brush.opacity,
			points: [this.toPoint(evt)],
		};
		evt.preventDefault();
	};

	private onPointerMove = (evt: PointerEvent): void => {
		if (this.activePointerId !== evt.pointerId || !this.activeStroke) return;
		const events =
			typeof evt.getCoalescedEvents === "function"
				? evt.getCoalescedEvents()
				: [evt];
		for (const e of events.length ? events : [evt]) {
			this.activeStroke.points.push(this.toPoint(e));
		}
		this.redraw();
		evt.preventDefault();
	};

	private onPointerUp = (evt: PointerEvent): void => {
		if (this.activePointerId !== evt.pointerId) return;
		if (evt.pointerType === "pen") this.penActive = false;
		if (this.el.hasPointerCapture(evt.pointerId)) {
			this.el.releasePointerCapture(evt.pointerId);
		}
		this.activePointerId = null;

		const stroke = this.activeStroke;
		this.activeStroke = null;
		if (!stroke) return;

		if (stroke.tool === "eraser") {
			this.applyEraser(stroke);
		} else {
			this.doc.strokes.push(stroke);
		}
		this.redraw();
		this.options.onChange();
	};

	/** Convert a pointer event to a logical document-space point with pressure. */
	private toPoint(evt: PointerEvent): Point {
		const rect = this.el.getBoundingClientRect();
		const x = (evt.clientX - rect.left) * this.cssScale;
		const y = (evt.clientY - rect.top) * this.cssScale;
		// Mouse/touch often report pressure 0; fall back to a neutral 0.5.
		let p = evt.pressure;
		if (!p || p <= 0) p = evt.pointerType === "pen" ? 0.5 : 0.5;
		return { x, y, p };
	}

	private drawStroke(stroke: Stroke): void {
		if (stroke.tool === "eraser") return;
		const outline = strokeToOutline(stroke);
		this.ctx.globalAlpha = stroke.opacity;
		this.ctx.fillStyle = stroke.color;
		fillOutline(this.ctx, outline);
		this.ctx.globalAlpha = 1;
	}

	/** Remove any stroke whose points fall within the eraser path radius. */
	private applyEraser(eraser: Stroke): void {
		const radius = eraser.size;
		const kept = this.doc.strokes.filter((stroke) => {
			if (stroke.tool === "eraser") return false;
			return !this.strokeIntersectsEraser(stroke, eraser, radius);
		});
		this.doc.strokes = kept;
	}

	private strokeIntersectsEraser(
		stroke: Stroke,
		eraser: Stroke,
		radius: number,
	): boolean {
		const threshold = radius + stroke.size / 2;
		const thresholdSq = threshold * threshold;
		for (const ep of eraser.points) {
			for (const sp of stroke.points) {
				const dx = ep.x - sp.x;
				const dy = ep.y - sp.y;
				if (dx * dx + dy * dy <= thresholdSq) return true;
			}
		}
		return false;
	}

	private pushUndo(): void {
		this.undoStack.push(this.doc.strokes.slice());
		// Cap history to keep memory in check on mobile.
		if (this.undoStack.length > 50) this.undoStack.shift();
	}
}
