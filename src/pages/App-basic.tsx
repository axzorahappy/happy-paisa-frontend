import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

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

// Fixed Simple Leaderboard Modal Component
function SimpleLeaderboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      console.log('Leaderboard modal opened, fetching data...');
      fetchLeaderboard();
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    console.log('Fetching leaderboard from backend...');
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/leaderboard');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Leaderboard data received:', data);
      
      setPlayers(data.slice(0, 10)); // Top 10 players
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      setError(`Error: ${error.message}`);
      
      // Fallback mock data with more visual variety
      const mockPlayers = [
        { id: '1', username: 'GamerPro2024', score: 1250, avatar: '🎮', totalEarnings: 1250 },
        { id: '2', username: 'HappyClicker', score: 1100, avatar: '👆', totalEarnings: 1100 },
        { id: '3', username: 'BrainMaster', score: 950, avatar: '🧠', totalEarnings: 950 },
        { id: '4', username: 'MathWizard', score: 850, avatar: '🧮', totalEarnings: 850 },
        { id: '5', username: 'MemoryChamp', score: 750, avatar: '🏆', totalEarnings: 750 },
        { id: '6', username: 'QuickSolver', score: 650, avatar: '⚡', totalEarnings: 650 },
        { id: '7', username: 'GameMaster', score: 550, avatar: '👾', totalEarnings: 550 },
        { id: '8', username: 'PuzzlePro', score: 450, avatar: '🧩', totalEarnings: 450 }
      ];
      
      console.log('Using fallback mock data:', mockPlayers);
      setPlayers(mockPlayers);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  console.log('Rendering leaderboard modal, loading:', loading, 'players:', players.length);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: 'white', margin: 0, fontSize: '24px' }}>
            🏆 Leaderboard
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ✕ Close
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '15px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            ⚠️ {error} (Using fallback data)
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>⏳</div>
            <p>Loading leaderboard...</p>
          </div>
        ) : players.length > 0 ? (
          <div>
            <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '15px' }}>
              🔄 Top {players.length} Players
            </div>
            
            {players.map((player, index) => (
              <div key={player.id || index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                marginBottom: '8px',
                backgroundColor: index < 3 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                border: index < 3 ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    minWidth: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: index < 3 ? '#fbbf24' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {index + 1}
                  </div>
                  
                  <div style={{ fontSize: '20px' }}>
                    {player.avatar || '👤'}
                  </div>
                  
                  <div>
                    <div style={{ color: 'white', fontWeight: '500', fontSize: '14px' }}>
                      {player.username || `Player ${index + 1}`}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                      Rank #{index + 1}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: '16px' }}>
                    {(player.score || player.totalScore || player.totalEarnings || 0).toLocaleString()}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                    Happy Paisa
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>😔</div>
            <p>No players found</p>
          </div>
        )}
        
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            💡 Pro Tip
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            Play more games to earn Happy Paisa and climb the leaderboard!
          </div>
        </div>
        
        {/* Debug info */}
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: 'rgba(100, 100, 100, 0.1)',
          borderRadius: '6px',
          fontSize: '11px',
          color: '#94a3b8'
        }}>
          Debug: {players.length} players loaded, Backend: {error ? 'Failed' : 'OK'}
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [totalEarned, setTotalEarned] = useState(350);
  const [gamesPlayed, setGamesPlayed] = useState(12);

  const handleOpenLeaderboard = () => {
    console.log('Opening leaderboard modal...');
    setShowLeaderboard(true);
  };

  const handleCloseLeaderboard = () => {
    console.log('Closing leaderboard modal...');
    setShowLeaderboard(false);
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      color: 'white',
      fontSize: '18px',
      padding: '40px',
      minHeight: '100vh'
    }}>
      {/* Header with Stats */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '30px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1>🎮 Games Dashboard</h1>
          <p style={{ color: '#94a3b8', margin: '10px 0' }}>
            Play mini-games and earn Happy Paisa rewards!
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center',
            minWidth: '120px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}>
              {totalEarned}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Total Earned
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            padding: '15px',
            textAlign: 'center',
            minWidth: '120px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7' }}>
              {gamesPlayed}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              Games Played
            </div>
          </div>
          
          <button
            onClick={handleOpenLeaderboard}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '15px 20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        {/* Game Cards */}
        {[
          { name: 'Happy Clicker', icon: '👆', difficulty: 'Easy', reward: 100, color: '#22c55e' },
          { name: 'Memory Match', icon: '🧠', difficulty: 'Medium', reward: 150, color: '#f59e0b' },
          { name: 'Math Quiz', icon: '🧮', difficulty: 'Hard', reward: 200, color: '#ef4444' }
        ].map((game, index) => (
          <div key={index} style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'transform 0.2s ease'
          }}>
            {/* Game Header */}
            <div style={{
              height: '120px',
              background: `linear-gradient(135deg, ${game.color}66, ${game.color}33)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{ fontSize: '3rem', opacity: 0.8 }}>
                {game.icon}
              </div>
              
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: `${game.color}33`,
                color: game.color,
                border: `1px solid ${game.color}66`
              }}>
                {game.difficulty}
              </div>
              
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '15px',
                padding: '6px 10px'
              }}>
                <span>🪙</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '12px' }}>
                  {game.reward}
                </span>
              </div>
            </div>

            {/* Game Info */}
            <div style={{ padding: '20px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>
                {game.name}
              </h3>
              <p style={{ color: '#94a3b8', margin: '0 0 20px 0', fontSize: '14px' }}>
                {game.difficulty === 'Easy' ? 'Click as fast as you can for 30 seconds!' :
                 game.difficulty === 'Medium' ? 'Match pairs of cards and train your memory' :
                 'Solve math problems as fast as you can'}
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                  🏆 Up to {game.reward} HP
                </div>
                
                <button
                  onClick={() => {
                    alert(`🎮 ${game.name} game would start here!`);
                    // Simulate earning points
                    const earned = Math.floor(Math.random() * game.reward) + 10;
                    setTotalEarned(prev => prev + earned);
                    setGamesPlayed(prev => prev + 1);
                  }}
                  style={{
                    backgroundColor: game.color,
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  ▶️ Play
                </button>
              </div>
            </div>
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

      {/* Leaderboard Modal with debug info */}
      <SimpleLeaderboard
        isOpen={showLeaderboard}
        onClose={handleCloseLeaderboard}
      />
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