# TabulaRasa — CLAUDE.md

## Project Overview
Obsidian community plugin for finger/Apple Pencil sketching directly inside a vault. Pressure-tapered strokes, live inline previews, re-editable `.sketch` files; images only generated on export.

- **Repo:** `JeremiahBeatham/TabulaRasa` (public)
- **Vault ID:** unassigned — needs a {Project B-###} number
- **Live:** distributed via BRAT; community-plugins submission in progress
- **Hosting:** n/a (Obsidian plugin, bundled with esbuild)
- **Tier:** Product/App

## Dev Constraints
- Mobile-only dev (iPhone) — no terminal, no local preview.
- Plugin is TypeScript, bundled via esbuild; standard Obsidian plugin scaffolding (manifest.json, versions.json).
- `ROADMAP.md` predates this doc set — see note at top of `PHASES.md`.

## Working Style (default)
- Short, direct answers. No preamble.
- Trunk-based, one branch at a time, Jeremiah names every branch.
- Commit directly to active branch. No PR unless asked.
- Always update this file first when direction changes.

## Where things live
| Jeremiah says... | File |
|---|---|
| status / phases | `PHASES.md` |
| architecture | `ARCHITECTURE.md` |
| team / branch ownership | `TEAM.md` |
| personas | `PERSONAS.md` |

---

## Reorg Status

**Campaign:** BeathamBase doc standard + light refactor (active multi-repo reorg across all 20 repos)
**Status:** Not started

### BeathamBase doc standard
Root keeps only: `README.md`, `CLAUDE.md`, `LICENSE` (if present), `SECURITY.md` (if present). Everything else goes in `docs/`. CLAUDE.md must have a routing table pointing to `docs/` paths.

### What needs to happen

1. **Branch:** `TabulaRasa/reorg`
2. `mkdir docs` then `git mv` these root files into it: `ARCHITECTURE.md`, `PERSONAS.md`, `PHASES.md`, `PRD.md`, `TEAM.md`
3. Keep `LICENSE` at root (BeathamBase standard allows it)
4. Update this CLAUDE.md: add routing table pointing to `docs/` paths; remove/update the `ROADMAP.md` reference in Dev Constraints (it doesn't appear to exist at root)
5. Update `README.md` if it links to root-level docs
6. Run `npm audit` — check for vulnerabilities in the esbuild-based TypeScript build
7. **No rename needed** — `TabulaRasa` is already PascalCase
8. **PR → squash merge → delete branch**

### Notes
Public repo — Obsidian community plugin. TypeScript + esbuild, standard Obsidian plugin scaffolding (`manifest.json`, `versions.json`, `version-bump.mjs`). Has `.editorconfig`, `.github/`, `LICENSE`. Community plugin submission in progress per CLAUDE.md. `ROADMAP.md` is referenced in Dev Constraints but doesn't appear to be in the repo — likely already removed; clean up that reference.
