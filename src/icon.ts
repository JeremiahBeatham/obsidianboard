import { addIcon } from "obsidian";

/**
 * Custom icon registered via `addIcon` rather than referenced by a Lucide name.
 * Obsidian only resolves Lucide names that exist in the specific Lucide version
 * it bundles, and `brush` is missing from some builds — which showed up as the
 * "?" (help-circle) fallback on the ribbon and mobile toolbar. Shipping the SVG
 * ourselves makes the icon render identically on every surface and version.
 */
export const TABULA_RASA_ICON_ID = "tabula-rasa";

// Lucide "brush" (MIT). Lucide art lives in a 24x24 viewBox; Obsidian's icon
// canvas is 100x100, so we scale by 100/24. Inline styles (not attributes) keep
// the stroke rendering even if a theme's `.svg-icon` CSS forces a fill.
const BRUSH_PATHS =
	'<path d="m11 10 3 3" />' +
	'<path d="M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" />' +
	'<path d="M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" />';

export const TABULA_RASA_ICON_SVG =
	`<g transform="scale(4.1667)" style="fill:none;stroke:currentColor;` +
	`stroke-width:2;stroke-linecap:round;stroke-linejoin:round">${BRUSH_PATHS}</g>`;

/** Register the bundled icon. Call once during plugin load. */
export function registerTabulaRasaIcon(): void {
	addIcon(TABULA_RASA_ICON_ID, TABULA_RASA_ICON_SVG);
}
