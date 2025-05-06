
// Script to update package.json for library publishing
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the current package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add library-specific configurations
const updatedPackageJson = {
  ...packageJson,
  name: "gs-components-library", // Change to your desired package name
  version: "0.1.0",
  description: "A modern UI component library",
  main: "dist/gs-components.umd.js",
  module: "dist/gs-components.es.js",
  types: "dist/index.d.ts",
  files: [
    "dist"
  ],
  scripts: {
    ...packageJson.scripts,
    "build:lib": "vite build --config vite.lib.config.ts",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "prepublishOnly": "npm run build:lib"
  },
  peerDependencies: {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  },
  publishConfig: {
    access: "public"
  }
};

// Write the updated package.json
fs.writeFileSync(
  packageJsonPath,
  JSON.stringify(updatedPackageJson, null, 2),
  'utf8'
);

console.log('Package.json updated for library publishing');
