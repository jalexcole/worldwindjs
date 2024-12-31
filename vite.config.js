import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "build/dist", // Output directory
    sourcemap: true, // Enable inline source maps (equivalent to "inline-source-map")
    rollupOptions: {
      input: "./examples/simple-example.html", // Entry file
      output: {
        entryFileNames: "worldwind.min.js", // Output file name
        assetFileNames: "images/[hash][ext][query]", // Asset file naming
      },
    },
    minify: false, // Disable minification
  },
  resolve: {
    extensions: [".ts", ".js"], // Resolve .ts and .js files
  },
  plugins: [],
  esbuild: {
    // TypeScript handling is natively supported by Vite's esbuild
    loader: "ts", // Handle TypeScript files
    include: ["src/**/*.ts"], // Specify the file patterns
    exclude: ["node_modules"], // Exclude node_modules
  },
  assetsInclude: ["**/*.png", "**/*.svg", "**/*.jpg", "**/*.jpeg", "**/*.gif"], // Include asset types
});
