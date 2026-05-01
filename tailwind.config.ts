import type { Config } from "tailwindcss";

// The whole theme (colors, spacing, fontFamily, animations…) lives in
// tailwind-preset.cjs so consumer projects can extend the same source of
// truth via `presets: [require('@gs/gs-components-library/tailwind-preset')]`.
// This config keeps only what's local to the lib's own dev / Storybook build:
// `content` paths and the safelist.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const gsPreset = require("./tailwind-preset.cjs");

export default {
	presets: [gsPreset],
	content: [
		"./index.html",
		"./src/**/*.{ts,tsx,js,jsx}",
		"./.storybook/**/*.{ts,tsx,js,jsx}"
	],
	safelist: [
		// Padding utilities pour s'assurer qu'elles sont générées même si non détectées
		'pl-1', 'pl-2', 'pl-3', 'pl-4', 'pl-5', 'pl-6', 'pl-8',
		'pr-1', 'pr-2', 'pr-3', 'pr-4', 'pr-5', 'pr-6', 'pr-8',
		'pt-1', 'pt-2', 'pt-3', 'pt-4', 'pt-5', 'pt-6', 'pt-8',
		'pb-1', 'pb-2', 'pb-3', 'pb-4', 'pb-5', 'pb-6', 'pb-8',
	],
} satisfies Config;
