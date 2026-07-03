# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

WorldWindJS is a community fork of NASA's Web WorldWind — a 3D/2D planetary globe engine in JavaScript (WebGL-based). It is a library, not an app: consumers import it and attach a `WorldWindow` to a `<canvas>`. The npm package ships a prebuilt bundle (`build/dist/worldwind.min.js`); source in `src/` is ES modules.

## Commands

- `npm install` — install dependencies
- `npm run build` — build the library via Vite (`vite.config.js`) into `build/dist/`
- `npm run dev` — run Vite dev server over `examples/` (opens `simple-example.html` on port 8080)
- `npm test` — run the unit tests with Vitest
- `npm test -- path/to/File.test.js` — run a single test file
- `npm test -- -t "test name"` — run tests matching a name pattern
- `npm run lint` — run ESLint (flat config in `eslint.config.js`)

There is no `test:watch` script; use `npx vitest --config vitest.config.js` directly for watch mode.

### Legacy build tooling (not part of the current npm scripts)
- `Gruntfile.js` + `karma.conf.js` define an older RequireJS/AMD build and Karma+Jasmine test run. This predates the ES module / Vite conversion and is not wired into `package.json` scripts — don't assume it works or extend it for new work.
- `webpack.config.js` exists from an earlier build-tool experiment (this branch is literally named `webpack`) but `package.json` currently builds with Vite, not webpack. Treat Vite as the source of truth for building unless told otherwise.

## Architecture

### Module structure
- `src/WorldWind.js` is the library's public API surface: it re-exports every public class/constant as named exports (the historical `WorldWind` global/namespace). When adding a new public class, add a corresponding `export { default as X } from "..."` line here — consumers and examples rely on `WorldWind.ClassName` being present.
- `src/index.js` is a separate, much smaller/newer entry point — currently re-exports only a couple of symbols directly (e.g. `Angle`). Don't assume it mirrors `WorldWind.js`; check both when changing public exports.
- Source is organized by subsystem under `src/`:
  - `geom/` — math primitives (Vec2/Vec3, Matrix, Sector, Position, Location, Line, Plane, Frustum, etc.)
  - `globe/` — the globe model, elevation models/coverages, projections support
  - `projections/` — 2D map projection implementations
  - `layer/` — `Layer` subclasses (imagery providers like Bing/BMNG, control layers like compass/atmosphere)
  - `render/` — the rendering pipeline: `DrawContext`, framebuffer/tile controllers, texture handling
  - `shaders/` — GLSL-backed shader program wrappers used by `render/`
  - `shapes/` — geographic shapes/placemarks drawn on the globe
  - `pick/` — GPU/color-based picking support
  - `navigate/`, `gesture/` — camera navigation and input handling
  - `formats/` — parsers/exporters for KML, GeoJSON, Shapefile, WKT, GeoTIFF, AAIGrid, Collada
  - `ogc/` — OGC service clients/models (WMS, WMTS, WCS, WFS, GML, OWS)
  - `cache/`, `error/`, `util/` — supporting infrastructure (caching, custom error types, math/color/date/tile utilities, the editor and measure tools under `util/`)
- `WorldWindow` (`src/WorldWindow.js`) is the central object applications create: it owns the WebGL context for a canvas, the globe, the layer list, and drives the per-frame render loop through `render/DrawContext`.

### Build outputs
- Vite (`vite.config.js`) treats `examples/simple-example.html` as its entry and emits `build/dist/worldwind.min.js` (despite the name, minification is currently disabled in config) plus copied image assets.
- `example-node/` demonstrates consuming the built output (`build/dist/worldwind.min.js`) from Node using the `canvas` package to provide a 2D context — useful for sanity-checking that a build actually exports what's expected.

### Examples and apps
- `examples/` contains ~80 paired `.html`/`.js` files, each a minimal standalone demo of one feature (layers, formats, picking, shapes, measurement, etc.). When adding a feature, an accompanying example here is the established way to demonstrate it.
- `apps/` contains larger reference applications (as opposed to single-feature demos).
- `.vscode/launch.json` has a Chrome launch config per example, pointed at `http://localhost:5500/examples/<Name>.html` — these expect a static server (e.g. Live Preview) on port 5500, separate from the Vite dev server on port 8080.

## Testing notes

- Tests live under `test/`, mirroring `src/`'s subsystem folders (`formats/`, `geom/`, `globe/`, `ogc/`, `render/`, `util/`).
- Despite `test/README.md` describing a Karma/Jasmine/RequireJS workflow, the tests actually run on **Vitest** with **happy-dom** (`vitest.config.js`) — the README is stale, don't follow it for new tests.
- Test files import source modules directly as ES modules (e.g. `import DrawContext from "../src/render/DrawContext.js"`) and use `describe`/`it`/`expect` imported from `vitest`.
- `test/util/TestUtils.test.js` provides shared helpers (e.g. `TestUtils.getMockWwd(globe)`) for constructing a mock `WorldWindow`/globe without a real canvas/WebGL context — reuse it rather than hand-rolling globe/window mocks.

## Licensing

Source files carry an Apache 2.0 header attributing NASA/ESA plus notices for bundled third-party code (ES6-Promise, libtess.js, Proj4, JSZip). Preserve these headers in existing files; new files should follow the same header convention as neighboring files in the same directory.
