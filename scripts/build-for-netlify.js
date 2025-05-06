
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Paths
const rootDir = path.join(__dirname, '..');
const netlifyTomlPath = path.join(rootDir, 'netlify.toml');

// Ensure netlify.toml exists
if (!fs.existsSync(netlifyTomlPath)) {
  console.log('Creating netlify.toml configuration file...');
  const netlifyConfig = `[build]
  command = "npm run build-storybook"
  publish = "storybook-static"

[build.environment]
  NODE_VERSION = "18"
`;
  fs.writeFileSync(netlifyTomlPath, netlifyConfig, 'utf8');
  console.log('✅ netlify.toml created successfully');
}

// Update package.json
console.log('📦 Updating package.json with Storybook scripts...');
try {
  execSync('node scripts/update-package.js', { stdio: 'inherit' });
  console.log('✅ Package.json updated successfully');
} catch (error) {
  console.error('❌ Failed to update package.json:', error);
  process.exit(1);
}

// Build Storybook
console.log('📚 Building Storybook documentation...');
try {
  execSync('npm run build-storybook', { stdio: 'inherit' });
  console.log('✅ Storybook documentation built successfully');
} catch (error) {
  console.error('❌ Failed to build Storybook:', error);
  process.exit(1);
}

console.log('🎉 All done! Your Storybook is ready for Netlify deployment.');
console.log('\nTo deploy to Netlify:');
console.log('1. Go to https://app.netlify.com/ and sign in or create an account');
console.log('2. Click "Add new site" > "Import an existing project"');
console.log('3. Connect to your Git provider and select this repository');
console.log('4. Ensure build command is set to "npm run build-storybook"');
console.log('5. Ensure publish directory is set to "storybook-static"');
console.log('6. Click "Deploy site"');
