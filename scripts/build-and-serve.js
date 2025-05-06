
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Setup dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure scripts directory exists
const scriptsDir = path.join(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

console.log('⚙️ Configuring package.json for library publishing...');
try {
  execSync('node scripts/update-package.js', { stdio: 'inherit' });
  console.log('✅ Package.json updated successfully');
} catch (error) {
  console.error('❌ Failed to update package.json:', error);
  process.exit(1);
}

console.log('🏗️ Building component library...');
try {
  execSync('npm run build:lib', { stdio: 'inherit' });
  console.log('✅ Component library built successfully');
} catch (error) {
  console.error('❌ Failed to build component library:', error);
  process.exit(1);
}

console.log('📚 Building Storybook documentation...');
try {
  execSync('npm run build-storybook', { stdio: 'inherit' });
  console.log('✅ Storybook documentation built successfully');
} catch (error) {
  console.error('❌ Failed to build Storybook:', error);
  process.exit(1);
}

console.log('🎉 All done! Your component library and documentation are ready.');
console.log('\nTo use the component library in another project:');
console.log('1. Run: npm pack');
console.log('2. In your project: npm install /path/to/gs-components-library-0.1.0.tgz');
console.log('\nTo view Storybook documentation:');
console.log('- Run: npx serve storybook-static');
