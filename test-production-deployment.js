#!/usr/bin/env node

// Production deployment test script for Happy Paisa
const https = require('https');
const http = require('http');

const FRONTEND_URL = 'https://happypaisa.com';
const BACKEND_URL = 'https://vnbnzyszoibyaruujnok.supabase.co/functions/v1/happy-paisa-api';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https:') ? https : http;
    
    lib.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    }).on('error', reject);
  });
}

async function testDeployment() {
  console.log('🚀 Testing Happy Paisa Production Deployment');
  console.log('==============================================\n');

  try {
    // Test 1: Frontend Availability
    console.log('1️⃣ Testing Frontend (happypaisa.com)...');
    try {
      const frontendResponse = await makeRequest(FRONTEND_URL);
      if (frontendResponse.status === 200) {
        console.log('✅ Frontend is live and responding');
        
        // Check if it contains our app
        if (frontendResponse.body.includes('Happy Paisa') || frontendResponse.body.includes('root')) {
          console.log('✅ Frontend content looks correct');
        } else {
          console.log('⚠️ Frontend content may not be updated yet');
        }
      } else {
        console.log(`❌ Frontend returned status: ${frontendResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Frontend is not accessible:', error.message);
    }

    // Test 2: Backend Health Check
    console.log('\n2️⃣ Testing Backend API...');
    try {
      const backendResponse = await makeRequest(`${BACKEND_URL}/api/health`);
      if (backendResponse.status === 200) {
        const healthData = JSON.parse(backendResponse.body);
        console.log('✅ Backend API is responding');
        console.log(`📊 API Status: ${healthData.status}`);
        console.log(`🎮 Games Available: ${healthData.gameCount || 'N/A'}`);
        console.log(`⏱️ API Uptime: ${healthData.uptime || 'N/A'}ms`);
      } else {
        console.log(`❌ Backend API returned status: ${backendResponse.status}`);
      }
    } catch (error) {
      console.log('❌ Backend API is not accessible:', error.message);
    }

    // Test 3: CORS and Integration
    console.log('\n3️⃣ Testing CORS Configuration...');
    try {
      const corsResponse = await makeRequest(`${BACKEND_URL}/api/health`);
      const corsHeaders = corsResponse.headers;
      
      if (corsHeaders['access-control-allow-origin']) {
        console.log('✅ CORS headers present');
        console.log(`🔗 CORS Origin: ${corsHeaders['access-control-allow-origin']}`);
      } else {
        console.log('⚠️ CORS headers not found - may cause frontend issues');
      }
    } catch (error) {
      console.log('⚠️ Could not check CORS:', error.message);
    }

    // Summary
    console.log('\n🎉 Production Deployment Test Complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Visit https://happypaisa.com in your browser');
    console.log('2. Try logging in with Supabase authentication');
    console.log('3. Test playing games and earning rewards');
    console.log('4. Verify all features work end-to-end');
    
    console.log('\n🔧 If issues occur:');
    console.log('- Check Netlify deployment logs for frontend');
    console.log('- Check Supabase Edge Function logs for backend');
    console.log('- Wait 5-10 minutes for deployment propagation');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Run the test
console.log('⏳ Starting production deployment test...\n');
testDeployment();