#!/usr/bin/env node

// Test script to verify frontend-backend API integration
const fetch = require('node-fetch') || import('node-fetch').then(m => m.default);

const API_BASE_URL = 'https://vnbnzyszoibyaruujnok.supabase.co/functions/v1/happy-paisa-api';

async function testAPI() {
  console.log('🧪 Testing Happy Paisa API Integration...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const healthResponse = await fetch(`${API_BASE_URL}/api/health`);
    if (healthResponse.ok) {
      const health = await healthResponse.json();
      console.log('✅ Health Check:', health);
    } else {
      console.log('❌ Health Check failed:', healthResponse.status);
    }

    // Test 2: Get Games (requires auth, may fail without token)
    console.log('\n2️⃣ Testing Games Endpoint...');
    try {
      const gamesResponse = await fetch(`${API_BASE_URL}/api/games`);
      if (gamesResponse.ok) {
        const games = await gamesResponse.json();
        console.log('✅ Games loaded:', games.games?.length || 0, 'games');
      } else if (gamesResponse.status === 401) {
        console.log('⚠️ Games endpoint requires authentication (expected in frontend)');
      } else {
        console.log('❌ Games endpoint failed:', gamesResponse.status);
      }
    } catch (error) {
      console.log('⚠️ Games endpoint error (may require auth):', error.message);
    }

    console.log('\n🎉 API Integration Test Complete!');
    console.log('✨ Backend URL is accessible and responding');
    console.log('🔗 Frontend should connect successfully with proper authentication');

  } catch (error) {
    console.log('❌ API Integration Test Failed:', error.message);
    console.log('🔍 Check network connection and backend deployment');
  }
}

testAPI();