import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ["./test/setup.js"],
    include: ["./test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    // Some *.test.js files (e.g. TestUtils.test.js, PolygonSplitterData.test.js) are
    // shared helper modules rather than spec files and intentionally define no tests.
    passWithNoTests: true,
  },
});
