import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src"],
	splitting: false,
	format: ["esm"], // usar 'esm' em vez de 'cjs'
	sourcemap: true,
	clean: true,
});
