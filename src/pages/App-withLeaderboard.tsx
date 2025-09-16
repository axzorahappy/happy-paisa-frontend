import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Enhanced Homepage Component
function HomePage() {
  return (
    <div style={{
      backgroundColor: '#0f0f23',
      background: 'radial-gradient(ellipse at center, rgba(120, 77, 255, 0.15) 0%, #0f0f23 70%)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '800px', padding: '40px' }}>
        {/* Hero Section */}
        <div style={{ marginBottom: '60px' }}>
          <h1 style={{ 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            margin: '0 0 20px 0',
            background: 'linear-gradient(135deg, #7c4dff, #bb86fc, #03dac6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🎮 Happy Paisa
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            color: '#a9a9c7',
            margin: '0 0 40px 0'
          }}>
            Play Mini-Games. Earn Real Rewards.
          </p>
          <p style={{ 
            fontSize: '1.1rem', 
            color: '#7c7c9a',
            lineHeight: 1.6,
            marginBottom: '50px'
          }}>
            The ultimate gaming platform where your skills translate into Happy Paisa rewards. 
            Challenge yourself with 5 exciting mini-games and climb the global leaderboard!
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          {[
            { icon: '🎮', title: '5 Mini-Games', desc: 'Clicker, Memory, Math, Snake & Word Puzzle' },
            { icon: '🏆', title: 'Global Leaderboard', desc: 'Compete with players worldwide' },
            { icon: '💰', title: 'Real Rewards', desc: 'Earn Happy Paisa for your achievements' },
            { icon: '📱', title: 'Mobile Ready', desc: 'Play anywhere, anytime, any device' }
          ].map((feature, index) => (
            <div key={index} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '30px 20px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                {feature.icon}
              </div>
              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: '600', 
                margin: '0 0 10px 0',
                color: 'white'
              }}>
                {feature.title}
              </h3>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#94a3b8',
                margin: 0,
                lineHeight: 1.4
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div>
          <a href="/dashboard" style={{
            display: 'inline-block',
            padding: '15px 40px',
            backgroundColor: '#7c4dff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            marginRight: '20px',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#6c42d8';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#7c4dff';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          >
            🚀 Start Playing Now
          </a>
          
          <a href="/leaderboard-demo" style={{
            display: 'inline-block',
            padding: '15px 40px',
            backgroundColor: 'transparent',
            color: '#7c4dff',
            textDecoration: 'none',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
            border: '2px solid #7c4dff',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#7c4dff';
            e.currentTarget.style.color = 'white';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#7c4dff';
          }}
          >
            🏆 View Leaderboard
          </a>
        </div>
      </div>
    </div>
  );
}

// Enhanced Leaderboard Modal Component
function EnhancedLeaderboard({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
      // Set up auto-refresh every 5 seconds
      const interval = setInterval(fetchLeaderboard, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/leaderboard');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      setPlayers(data.slice(0, 10));
      setError('');
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(`Backend Error: ${err.message}`);
      
      // Enhanced fallback data
      const mockPlayers = [
        { id: '1', username: 'ProGamer2024', score: 15750, avatar: '🎮', totalEarnings: 15750, rank: 1 },
        { id: '2', username: 'ClickMaster', score: 14200, avatar: '👆', totalEarnings: 14200, rank: 2 },
        { id: '3', username: 'BrainBox', score: 13650, avatar: '🧠', totalEarnings: 13650, rank: 3 },
        { id: '4', username: 'MathWiz', score: 12800, avatar: '🧮', totalEarnings: 12800, rank: 4 },
        { id: '5', username: 'SnakeChamp', score: 11900, avatar: '🐍', totalEarnings: 11900, rank: 5 },
        { id: '6', username: 'WordSmith', score: 10500, avatar: '📝', totalEarnings: 10500, rank: 6 },
        { id: '7', username: 'QuickThink', score: 9300, avatar: '⚡', totalEarnings: 9300, rank: 7 },
        { id: '8', username: 'PuzzlePro', score: 8150, avatar: '🧩', totalEarnings: 8150, rank: 8 }
      ];
      setPlayers(mockPlayers);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '550px',
        width: '90%',
        maxHeight: '85vh',
        overflowY: 'auto',
        border: '1px solid rgba(124, 77, 255, 0.3)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '25px'
        }}>
          <div>
            <h2 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '28px',
              fontWeight: 'bold'
            }}>
              🏆 Global Leaderboard
            </h2>
            <p style={{
              color: '#94a3b8',
              fontSize: '14px',
              margin: '5px 0 0 0'
            }}>
              {error ? 'Offline Mode' : '🔄 Live Data - Updates every 5s'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 15px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            ✕ Close
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            ⚠️ {error} (Showing demo data)
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
            <div style={{ 
              fontSize: '40px', 
              marginBottom: '15px',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}>⏳</div>
            <p style={{ fontSize: '18px' }}>Loading leaderboard...</p>
          </div>
        ) : players.length > 0 ? (
          <div>
            {/* Top 3 Special Display */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '10px',
              marginBottom: '25px'
            }}>
              {players.slice(0, 3).map((player, index) => {
                const podiumColors = ['#ffd700', '#c0c0c0', '#cd7f32'];
                const podiumEmojis = ['🥇', '🥈', '🥉'];
                return (
                  <div key={player.id} style={{
                    backgroundColor: `${podiumColors[index]}15`,
                    borderRadius: '12px',
                    padding: '15px 10px',
                    textAlign: 'center',
                    border: `2px solid ${podiumColors[index]}40`
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                      {podiumEmojis[index]}
                    </div>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>
                      {player.avatar}
                    </div>
                    <div style={{ 
                      color: 'white', 
                      fontWeight: 'bold', 
                      fontSize: '12px',
                      marginBottom: '5px'
                    }}>
                      {player.username}
                    </div>
                    <div style={{ 
                      color: '#22c55e', 
                      fontWeight: 'bold', 
                      fontSize: '14px'
                    }}>
                      {(player.score || player.totalScore || player.totalEarnings || 0).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rest of Players */}
            <div style={{ marginTop: '20px' }}>
              <h4 style={{ 
                color: '#94a3b8', 
                fontSize: '14px', 
                marginBottom: '15px',
                textAlign: 'center'
              }}>
                🎯 Remaining Top Players
              </h4>
              {players.slice(3).map((player, index) => (
                <div key={player.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
                  marginBottom: '8px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      minWidth: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {index + 4}
                    </div>
                    
                    <div style={{ fontSize: '22px' }}>
                      {player.avatar || '👤'}
                    </div>
                    
                    <div>
                      <div style={{ color: 'white', fontWeight: '500', fontSize: '15px' }}>
                        {player.username || `Player ${index + 4}`}
                      </div>
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                        Rank #{index + 4}
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
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'white', padding: '40px' }}>
            <div style={{ fontSize: '30px', marginBottom: '10px' }}>😔</div>
            <p>No players found</p>
          </div>
        )}
        
        {/* Pro Tip */}
        <div style={{ 
          marginTop: '25px', 
          padding: '15px', 
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ color: '#22c55e', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            💡 Pro Tip
          </div>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>
            Play different games to earn more Happy Paisa and climb the leaderboard faster!
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Dashboard Component
function EnhancedDashboard() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [totalEarned, setTotalEarned] = useState(850);
  const [gamesPlayed, setGamesPlayed] = useState(24);
  const [recentRewards, setRecentRewards] = useState([
    { gameType: 'clicker', amount: 85, timestamp: Date.now() - 120000, icon: '👆' },
    { gameType: 'memory', amount: 150, timestamp: Date.now() - 300000, icon: '🧠' },
    { gameType: 'snake', amount: 200, timestamp: Date.now() - 600000, icon: '🐍' }
  ]);

  const games = [
    { 
      id: 'clicker', 
      name: 'Happy Clicker', 
      icon: '👆', 
      difficulty: 'Easy', 
      reward: 100, 
      color: '#22c55e',
      time: '30 sec',
      desc: 'Click as fast as you can for 30 seconds!'
    },
    { 
      id: 'memory', 
      name: 'Memory Match', 
      icon: '🧠', 
      difficulty: 'Medium', 
      reward: 150, 
      color: '#f59e0b',
      time: '1-2 min',
      desc: 'Match pairs of cards and train your memory'
    },
    { 
      id: 'math', 
      name: 'Math Quiz', 
      icon: '🧮', 
      difficulty: 'Hard', 
      reward: 200, 
      color: '#ef4444',
      time: '2-3 min',
      desc: 'Solve math problems as fast as you can'
    },
    { 
      id: 'snake', 
      name: 'Snake Game', 
      icon: '🐍', 
      difficulty: 'Medium', 
      reward: 250, 
      color: '#10b981',
      time: '2-5 min',
      desc: 'Eat food and grow as long as possible'
    },
    { 
      id: 'word', 
      name: 'Word Puzzle', 
      icon: '📝', 
      difficulty: 'Medium', 
      reward: 180, 
      color: '#f97316',
      time: '1-2 min',
      desc: 'Unscramble letters to form words'
    }
  ];

  const handlePlayGame = (game: any) => {
    const earned = Math.floor(Math.random() * game.reward) + 20;
    setTotalEarned(prev => prev + earned);
    setGamesPlayed(prev => prev + 1);
    setRecentRewards(prev => [
      { gameType: game.id, amount: earned, timestamp: Date.now(), icon: game.icon },
      ...prev.slice(0, 4)
    ]);
    alert(`🎮 ${game.name} Complete!\n💰 You earned ${earned} Happy Paisa!`);
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      minHeight: '100vh',
      padding: '30px',
      color: 'white'
    }}>
      {/* Enhanced Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            margin: '0 0 10px 0',
            background: 'linear-gradient(135deg, #7c4dff, #bb86fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🎮 Games Dashboard
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '1.1rem' }}>
            Choose your game and start earning Happy Paisa rewards!
          </p>
        </div>
        
        {/* Enhanced Stats */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            minWidth: '140px',
            border: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#22c55e' }}>
              {totalEarned.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '5px' }}>
              💰 Total Earned
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(168, 85, 247, 0.2)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            minWidth: '140px',
            border: '1px solid rgba(168, 85, 247, 0.3)'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#a855f7' }}>
              {gamesPlayed}
            </div>
            <div style={{ fontSize: '14px', color: '#94a3b8', marginTop: '5px' }}>
              🎯 Games Played
            </div>
          </div>
          
          <button
            onClick={() => setShowLeaderboard(true)}
            style={{
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              padding: '20px 25px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '140px',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ fontSize: '24px', marginBottom: '5px' }}>🏆</div>
            <div>Leaderboard</div>
          </button>
        </div>
      </div>

      {/* Recent Rewards Section */}
      {recentRewards.length > 0 && (
        <div style={{
          background: 'linear-gradient(to right, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.15))',
          borderRadius: '16px',
          padding: '25px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          marginBottom: '40px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: 'white',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            🏆 Recent Rewards
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentRewards.slice(0, 3).map((reward, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '15px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '24px' }}>
                    {reward.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: 'white', fontSize: '16px', textTransform: 'capitalize' }}>
                      {reward.gameType === 'clicker' ? 'Happy Clicker' :
                       reward.gameType === 'memory' ? 'Memory Match' :
                       reward.gameType === 'math' ? 'Math Quiz' :
                       reward.gameType === 'snake' ? 'Snake Game' :
                       reward.gameType === 'word' ? 'Word Puzzle' :
                       `${reward.gameType} Game`}
                    </div>
                    <div style={{ fontSize: '14px', color: '#94a3b8' }}>
                      {new Date(reward.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🪙</span>
                  <span style={{ fontWeight: 'bold', color: '#22c55e', fontSize: '18px' }}>
                    +{reward.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Games Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '25px'
      }}>
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Game Header */}
            <div style={{
              height: '140px',
              background: `linear-gradient(135deg, ${game.color}66, ${game.color}33)`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '4rem', opacity: 0.9 }}>
                {game.icon}
              </div>
              
              {/* Difficulty Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                left: '15px',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                backgroundColor: `${game.color}33`,
                color: game.color,
                border: `1px solid ${game.color}66`
              }}>
                {game.difficulty}
              </div>
              
              {/* Time Badge */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                padding: '8px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '500',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                color: 'white'
              }}>
                ⏱️ {game.time}
              </div>
              
              {/* Max Reward */}
              <div style={{
                position: 'absolute',
                bottom: '15px',
                right: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '15px',
                padding: '8px 12px'
              }}>
                <span>🪙</span>
                <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '14px' }}>
                  {game.reward}
                </span>
              </div>
            </div>

            {/* Game Info */}
            <div style={{ padding: '25px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '22px', fontWeight: '600' }}>
                {game.name}
              </h3>
              <p style={{ 
                color: '#94a3b8', 
                margin: '0 0 20px 0', 
                fontSize: '14px',
                lineHeight: 1.5
              }}>
                {game.desc}
              </p>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ color: '#94a3b8', fontSize: '13px' }}>
                  🏆 Up to {game.reward} HP
                </div>
                
                <button
                  onClick={() => handlePlayGame(game)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    backgroundColor: game.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '600',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ▶️ Play Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '50px', textAlign: 'center' }}>
        <a href="/" style={{ 
          color: '#7c4dff', 
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: '500'
        }}>
          ← Back to Homepage
        </a>
      </div>

      {/* Enhanced Leaderboard Modal */}
      <EnhancedLeaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
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
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '20px' }}>🎮</div>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px', color: '#94a3b8' }}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <a href="/" style={{ 
        color: '#7c4dff',
        textDecoration: 'none',
        fontSize: '18px',
        fontWeight: '600',
        padding: '12px 24px',
        border: '2px solid #7c4dff',
        borderRadius: '10px'
      }}>
        🏠 Go Back Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<EnhancedDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}