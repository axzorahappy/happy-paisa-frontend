import React, { useState } from 'react';
import SimpleLeaderboard from './SimpleLeaderboard';

export default function SimpleDashboard() {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [recentRewards, setRecentRewards] = useState([
    { gameType: 'clicker', amount: 150, timestamp: Date.now() - 300000 },
    { gameType: 'memory', amount: 200, timestamp: Date.now() - 600000 }
  ]);

  const getTotalEarned = () => {
    return recentRewards.reduce((total, reward) => total + reward.amount, 0);
  };

  const handleBonusAwarded = (userId: string, amount: number) => {
    console.log(`💰 Bonus awarded: ${amount} Happy Paisa to user ${userId}`);
    setRecentRewards(prev => [
      { gameType: 'bonus', amount, timestamp: Date.now() },
      ...prev.slice(0, 4)
    ]);
  };

  const games = [
    {
      id: 'clicker',
      title: 'Happy Clicker',
      description: 'Click as fast as you can for 30 seconds!',
      icon: '👆',
      difficulty: 'Easy',
      maxReward: 100
    },
    {
      id: 'memory',
      title: 'Memory Match',
      description: 'Match pairs of cards and train your memory',
      icon: '🧠',
      difficulty: 'Medium',
      maxReward: 150
    },
    {
      id: 'math',
      title: 'Math Quiz',
      description: 'Solve math problems as fast as you can',
      icon: '🧮',
      difficulty: 'Hard',
      maxReward: 200
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      padding: '1.5rem', 
      backgroundColor: '#0f172a', 
      minHeight: '100vh', 
      color: 'white' 
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: 'white', 
            margin: '0 0 0.5rem 0' 
          }}>
            🎮 Games Dashboard
          </h1>
          <p style={{ 
            color: '#94a3b8', 
            margin: 0 
          }}>
            Play mini-games and earn Happy Paisa rewards!
          </p>
        </div>
        
        {/* Stats */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            minWidth: '100px'
          }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#22c55e' 
            }}>
              {getTotalEarned()}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#94a3b8' 
            }}>
              Total Earned
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            minWidth: '100px'
          }}>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#a855f7' 
            }}>
              {recentRewards.length}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#94a3b8' 
            }}>
              Games Played
            </div>
          </div>
          
          <button
            onClick={() => setShowLeaderboard(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            🏆 Leaderboard
          </button>
        </div>
      </div>

      {/* Recent Rewards */}
      {recentRewards.length > 0 && (
        <div style={{
          background: 'linear-gradient(to right, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.2))',
          borderRadius: '12px',
          padding: '1.5rem',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          marginBottom: '2rem'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'white',
            margin: '0 0 1rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🏆 Recent Rewards
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recentRewards.slice(0, 3).map((reward, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>
                    {reward.gameType === 'clicker' ? '👆' : 
                     reward.gameType === 'memory' ? '🧠' : 
                     reward.gameType === 'math' ? '🧮' : 
                     reward.gameType === 'bonus' ? '💰' : '🎮'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: 'white', textTransform: 'capitalize' }}>
                      {reward.gameType === 'bonus' ? 'Bonus Reward' : `${reward.gameType} Game`}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      {new Date(reward.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>🪙</span>
                  <span style={{ fontWeight: 'bold', color: '#22c55e' }}>
                    +{reward.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Games Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {games.map((game) => (
          <div
            key={game.id}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {/* Game Header */}
            <div style={{
              height: '120px',
              background: `linear-gradient(135deg, ${getDifficultyColor(game.difficulty)}66, ${getDifficultyColor(game.difficulty)}33)`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '3rem', opacity: 0.8 }}>
                {game.icon}
              </div>
              
              {/* Difficulty Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '500',
                backgroundColor: `${getDifficultyColor(game.difficulty)}33`,
                color: getDifficultyColor(game.difficulty),
                border: `1px solid ${getDifficultyColor(game.difficulty)}66`
              }}>
                {game.difficulty}
              </div>
              
              {/* Max Reward */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '9999px',
                padding: '0.25rem 0.5rem'
              }}>
                <span>🪙</span>
                <span style={{ 
                  color: '#fbbf24', 
                  fontWeight: 'bold', 
                  fontSize: '0.875rem' 
                }}>
                  {game.maxReward}
                </span>
              </div>
            </div>

            {/* Game Info */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0
                }}>
                  {game.title}
                </h3>
              </div>
              
              <p style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                margin: '0 0 1rem 0',
                lineHeight: 1.5
              }}>
                {game.description}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#94a3b8',
                  fontSize: '0.75rem'
                }}>
                  <span>🏆</span>
                  <span>Up to {game.maxReward} HP</span>
                </div>
                
                <button
                  onClick={() => alert(`🎮 ${game.title} game would start here!`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem'
                  }}
                >
                  ▶️ Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard Modal */}
      <SimpleLeaderboard
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        onBonusAwarded={handleBonusAwarded}
      />
    </div>
  );
}