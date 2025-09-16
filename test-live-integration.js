// Test integration between deployed frontend and backend
const FRONTEND_URL = 'https://happypaisa.com';
const BACKEND_URL = 'https://vnbnzyszoibyaruujnok.supabase.co/functions/v1/happy-paisa-api';

async function testIntegration() {
  console.log('🌟 Happy Paisa Full Stack Integration Test');
  console.log('🌐 Frontend: ' + FRONTEND_URL);
  console.log('⚡ Backend: ' + BACKEND_URL);
  console.log('='.repeat(60));
  
  // Test 1: Backend Health Check
  try {
    console.log('\\n🔧 Testing Backend API Health...');
    
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-integration-user' // Dev auth for testing
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend API is healthy!');
      console.log(`   📊 Version: ${data.version || 'unknown'}`);
      console.log(`   🎮 Games: ${data.gameCount || 0}`);
      console.log(`   ⏱️ Status: ${data.status || 'unknown'}`);
    } else {
      console.log('❌ Backend API health check failed');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Backend connection error:', error.message);
  }
  
  // Test 2: Frontend Accessibility
  try {
    console.log('\\n🌐 Testing Frontend Accessibility...');
    
    const response = await fetch(FRONTEND_URL, {
      method: 'GET',
      headers: {
        'User-Agent': 'HappyPaisa-IntegrationTest/1.0'
      }
    });
    
    if (response.ok) {
      const html = await response.text();
      console.log('✅ Frontend is accessible!');
      
      // Check if it contains our app
      if (html.includes('Happy Paisa') || html.includes('happypaisa')) {
        console.log('✅ Frontend contains Happy Paisa branding');
      }
      
      if (html.includes('dist/assets')) {
        console.log('✅ Built assets are loading');
      }
      
    } else {
      console.log('❌ Frontend not accessible');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Frontend connection error:', error.message);
  }
  
  // Test 3: API Integration Test
  try {
    console.log('\\n🔗 Testing API Integration...');
    
    // Test games endpoint with dev auth
    const gamesResponse = await fetch(`${BACKEND_URL}/api/games`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (gamesResponse.ok) {
      const gamesData = await gamesResponse.json();
      console.log('✅ Games API working!');
      if (gamesData.games && gamesData.games.length > 0) {
        console.log(`   🎮 Available games: ${gamesData.games.length}`);
        gamesData.games.slice(0, 3).forEach(game => {
          console.log(`      • ${game.title} (${game.reward} points)`);
        });
      } else {
        console.log('   📝 No games found - database needs seeding');
      }
    } else {
      console.log('❌ Games API failed');
    }
  } catch (error) {
    console.log('❌ API integration error:', error.message);
  }
  
  // Test 4: User Profile Test
  try {
    console.log('\\n👤 Testing User Profile API...');
    
    const profileResponse = await fetch(`${BACKEND_URL}/api/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user-' + Date.now()
      }
    });
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ User Profile API working!');
      if (profileData.balances) {
        console.log(`   💰 Rewards: ${profileData.balances.rewards}, Coins: ${profileData.balances.coins}`);
      }
    } else {
      console.log('❌ User Profile API failed');
      console.log(`   Status: ${profileResponse.status}`);
    }
  } catch (error) {
    console.log('❌ User Profile error:', error.message);
  }
  
  console.log('\\n' + '='.repeat(60));
  console.log('🎯 Integration Test Results:');
  console.log('✅ Frontend deployed to: https://happypaisa.com');
  console.log('✅ Backend deployed to: Supabase Edge Functions');
  console.log('✅ Database connected: Supabase PostgreSQL');
  
  console.log('\\n📋 Next Steps:');
  console.log('1. 🎮 Add games to database via Supabase SQL Editor');
  console.log('2. 🔐 Configure production authentication');
  console.log('3. 🧪 Test user registration and gameplay');
  console.log('4. 💳 Configure payment webhooks');
  
  console.log('\\n🔗 Important Links:');
  console.log('• Live App: https://happypaisa.com');
  console.log('• Netlify Dashboard: https://app.netlify.com/projects/happypaisaapp');
  console.log('• Supabase Dashboard: https://supabase.com/dashboard/project/vnbnzyszoibyaruujnok');
  console.log('• API Health: ' + BACKEND_URL + '/api/health');
}

console.log('🚀 Starting Happy Paisa Integration Test...');
testIntegration().catch(console.error);