#!/usr/bin/env node

// Simple deployment script for Happy Paisa frontend
const fs = require('fs');
const path = require('path');

console.log('🚀 Happy Paisa Frontend Deployment');
console.log('=====================================\n');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('❌ Error: dist folder not found!');
  console.log('💡 Please run "npm run build" first');
  process.exit(1);
}

// List files in dist
console.log('📁 Production files ready for deployment:');
const files = fs.readdirSync(distPath, { withFileTypes: true });
files.forEach(file => {
  if (file.isDirectory()) {
    const subFiles = fs.readdirSync(path.join(distPath, file.name));
    console.log(`📂 ${file.name}/ (${subFiles.length} files)`);
    subFiles.forEach(subFile => {
      const filePath = path.join(distPath, file.name, subFile);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024).toFixed(1);
      console.log(`   └─ ${subFile} (${size} KB)`);
    });
  } else {
    const filePath = path.join(distPath, file.name);
    const stats = fs.statSync(filePath);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`📄 ${file.name} (${size} KB)`);
  }
});

console.log('\n🔗 Backend API URL: https://vnbnzyszoibyaruujnok.supabase.co/functions/v1/happy-paisa-api');
console.log('🌐 Target Domain: https://happypaisa.com');

console.log('\n📋 Deployment Instructions:');
console.log('1. Upload all files from the "dist/" folder to your web server');
console.log('2. Make sure files are in the root directory (public_html or www)');
console.log('3. Ensure _redirects file is included for SPA routing');
console.log('4. Test the site at https://happypaisa.com');

console.log('\n✨ Ready for deployment!');
console.log('💡 The frontend will connect to the live Supabase backend automatically');

// Check environment files
console.log('\n🔧 Environment Configuration:');
if (fs.existsSync('.env.production')) {
  console.log('✅ Production environment configured');
} else {
  console.log('⚠️  No .env.production file found');
}

if (fs.existsSync('.env')) {
  console.log('✅ Default environment configured');
} else {
  console.log('⚠️  No .env file found');
}