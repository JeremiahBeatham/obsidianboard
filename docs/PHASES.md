# TabulaRasa — Phases

> Supersedes `ROADMAP.md`. Phases are intent, not hard commitments, and may reorder based on feedback.

## Current Status
| Phase | Status |
|---|---|
| Shipped (v0.1.x → v0.7.0) | Done — see below |
| Next (UX polish) | 1 open item |
| Later (bigger features) | 2 planned |
| Distribution | Rebrand done; community-store submission pending |

**Active branch:** `main`
**Last updated:** 2026-06-19

---

## Shipped (v0.1.x → v0.7.0)
- [x] Natural, pressure-tapered drawing (perfect-freehand) — finger, Apple Pencil, mouse, stylus; velocity-based taper when there's no real pressure
- [x] Mobile-first input: Pointer Events, coalesced sampling, no accidental scrolling, optional palm rejection
- [x] Pen, highlighter, whole-stroke eraser; color palette; brush sizes; undo/redo; clear
- [x] Pinch-to-zoom, two-finger pan, wheel-zoom, fit-to-screen
- [x] Theme-aware pen (white on dark, black on light)
- [x] Re-editable `.sketch` (JSON) files with autosave + explicit save
- [x] On-demand PNG/SVG export (embed-in-note or save-only — no surprise image files)
- [x] Live inline previews of `.sketch` embeds (Reading view + Live Preview), kept in sync, click-to-edit
- [x] Rebrand to **Tabula Rasa**, community-store prep (LICENSE, compliant id/name)
- [x] Consistent bundled tool icon across ribbon/view tab/commands ([#6](https://github.com/JeremiahBeatham/TabulaRasa/issues/6), v0.2.1)
- [x] On-canvas resize: aspect presets (square, 4:3, 16:9, A4), anchor/scale-to-fit, fit-to-drawing ([#8](https://github.com/JeremiahBeatham/TabulaRasa/issues/8), v0.3.0)
- [x] Brush-size picker: slider, presets, live preview popover ([#10](https://github.com/JeremiahBeatham/TabulaRasa/issues/10), v0.4.0)
- [x] Color picker: custom color + recent colors alongside palette ([#11](https://github.com/JeremiahBeatham/TabulaRasa/issues/11), v0.5.0)
- [x] Pinch-to-rotate ("twist") canvas to draw from any angle; Fit to screen resets it ([#9](https://github.com/JeremiahBeatham/TabulaRasa/issues/9), v0.6.0)
- [x] Eraser modes: whole-stroke and partial/segment erasing ([#12](https://github.com/JeremiahBeatham/TabulaRasa/issues/12), v0.7.0)

## Next — UX Polish
- [ ] [#7 — Audit: which controls belong in settings vs. on the canvas](https://github.com/JeremiahBeatham/TabulaRasa/issues/7)

## Later — Bigger Features
- [ ] [#13 — Selection tool (lasso/rectangle + move/scale/delete/duplicate)](https://github.com/JeremiahBeatham/TabulaRasa/issues/13)
- [ ] [#14 — Smart snapping / shape recognition (straight line, circle)](https://github.com/JeremiahBeatham/TabulaRasa/issues/14)

## Distribution
- [x] Rebrand to store-compliant id/name (`tabula-rasa` / "Tabula Rasa")
- [ ] Add LICENSE, screenshots, final README polish
- [ ] Submit to the [Obsidian community plugins list](https://github.com/obsidianmd/obsidian-releases) (entry in `community-plugins.json` + PR)
- Until then: install via [BRAT](https://github.com/TfTHacker/obsidian42-brat)
