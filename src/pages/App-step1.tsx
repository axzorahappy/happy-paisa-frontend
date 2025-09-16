import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Simple test components
function HomePage() {
  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      color: 'white',
      fontSize: '20px',
      padding: '40px',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🏠 Happy Paisa Homepage</h1>
      <p>Welcome to Happy Paisa!</p>
      <div style={{ marginTop: '30px' }}>
        <a href="/dashboard" style={{ 
          color: '#7c4dff', 
          textDecoration: 'none',
          fontSize: '18px',
          border: '2px solid #7c4dff',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          🎮 Go to Games Dashboard
        </a>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: 'white',
      fontSize: '18px',
      padding: '40px',
      minHeight: '100vh'
    }}>
      <h1>🎮 Games Dashboard</h1>
      <p>Your gaming rewards dashboard!</p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {/* Game Cards */}
        {[
          { name: 'Happy Clicker', icon: '👆', difficulty: 'Easy', reward: 100 },
          { name: 'Memory Match', icon: '🧠', difficulty: 'Medium', reward: 150 },
          { name: 'Math Quiz', icon: '🧮', difficulty: 'Hard', reward: 200 }
        ].map((game, index) => (
          <div key={index} style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
              {game.icon}
            </div>
            <h3>{game.name}</h3>
            <p style={{ color: '#94a3b8' }}>Difficulty: {game.difficulty}</p>
            <p style={{ color: '#22c55e' }}>Max Reward: {game.reward} HP</p>
            <button
              onClick={() => alert(`🎮 ${game.name} game would start here!`)}
              style={{
                backgroundColor: '#7c4dff',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ▶️ Play
            </button>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <a href="/" style={{ 
          color: '#7c4dff', 
          textDecoration: 'none',
          fontSize: '16px'
        }}>
          ← Back to Homepage
        </a>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      color: 'white',
      fontSize: '20px',
      padding: '40px',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <a href="/" style={{ color: '#7c4dff' }}>Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}