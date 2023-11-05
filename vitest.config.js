import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // environment: 'happy-dom',
    environment: 'jsdom',
    include: ["./test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
