#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n🎉 Passy Setup Checker\n');

let hasErrors = false;
let hasWarnings = false;

// Check for .env.local
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local file found');
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => 
    !envContent.includes(varName) || envContent.includes(`${varName}=your_`)
  );
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing or unconfigured environment variables:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    hasWarnings = true;
  } else {
    console.log('✅ All required environment variables configured');
  }
} else {
  console.log('❌ .env.local file not found');
  console.log('   Run: cp .env.local.example .env.local');
  hasErrors = true;
}

// Check for node_modules
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies installed');
} else {
  console.log('❌ Dependencies not installed');
  console.log('   Run: npm install');
  hasErrors = true;
}

// Check for Firebase configuration files
if (fs.existsSync('firestore.rules')) {
  console.log('✅ Firestore rules file found');
} else {
  console.log('⚠️  Firestore rules file not found');
  hasWarnings = true;
}

if (fs.existsSync('firebase.json')) {
  console.log('✅ Firebase config file found');
} else {
  console.log('⚠️  Firebase config file not found');
  hasWarnings = true;
}

console.log('\n📋 Summary:');

if (hasErrors) {
  console.log('❌ Setup incomplete. Please fix the errors above.');
  console.log('\n📖 For detailed setup instructions, see SETUP.md');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Setup mostly complete, but some items need attention.');
  console.log('\n📖 For detailed setup instructions, see SETUP.md');
  console.log('\n✨ You can still run the dev server with: npm run dev');
} else {
  console.log('✅ Everything looks good!');
  console.log('\n🚀 Run the development server with: npm run dev');
  console.log('📖 Visit http://localhost:3000 to see your app\n');
}

