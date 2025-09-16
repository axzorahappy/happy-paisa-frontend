import React, { useState } from 'react';

interface SimpleLeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
  onBonusAwarded?: (userId: string, amount: number) => void;
}

export default function SimpleLeaderboard({ isOpen, onClose, onBonusAwarded }: SimpleLeaderboardProps) {
  if (!isOpen) return null;

  const mockUsers = [
    { id: '1', username: 'GamerPro2024', score: 15420, earnings: 8750, rank: 1 },
    { id: '2', username: 'MathWizard', score: 14890, earnings: 8200, rank: 2 },
    { id: '3', username: 'MemoryMaster', score: 13650, earnings: 7800, rank: 3 },
    { id: '4', username: 'You', score: 11850, earnings: 6500, rank: 4 },
  ];

  const handleAwardBonuses = () => {
    const bonuses = [1000, 500, 250];
    mockUsers.slice(0, 3).forEach((user, index) => {
      if (onBonusAwarded) {
        const bonusAmount = bonuses[index] || 50;
        onBonusAwarded(user.id, bonusAmount);
      }
    });
    alert('🎉 Bonuses awarded to top 3 players!');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        border: '1px solid #333'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #333',
          paddingBottom: '1rem'
        }}>
          <div>
            <h2 style={{ color: '#FFD700', margin: 0, fontSize: '1.5rem' }}>
              🏆 Leaderboard
            </h2>
            <p style={{ color: '#ccc', margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              Top players and rankings
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={handleAwardBonuses}
              style={{
                backgroundColor: '#FFD700',
                color: '#1a1a2e',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}
            >
              💰 Award Bonuses
            </button>
            
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Bonus Info */}
        <div style={{
          backgroundColor: '#2a2a4e',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          border: '1px solid #FFD700'
        }}>
          <h3 style={{ color: '#FFD700', margin: '0 0 0.5rem 0', fontSize: '1rem' }}>
            ⚡ Bonus Rewards
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ textAlign: 'center', color: '#FFD700' }}>
              🥇<br/>1,000 HP<br/><span style={{ color: '#ccc' }}>1st Place</span>
            </div>
            <div style={{ textAlign: 'center', color: '#C0C0C0' }}>
              🥈<br/>500 HP<br/><span style={{ color: '#ccc' }}>2nd Place</span>
            </div>
            <div style={{ textAlign: 'center', color: '#CD7F32' }}>
              🥉<br/>250 HP<br/><span style={{ color: '#ccc' }}>3rd Place</span>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ color: 'white' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#ccc' }}>Rankings</h3>
          {mockUsers.map((user) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                backgroundColor: user.username === 'You' ? '#4a4a7e' : '#333',
                borderRadius: '8px',
                border: user.username === 'You' ? '1px solid #6a6aae' : '1px solid #444'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  minWidth: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: user.rank <= 3 ? '#FFD700' : '#666',
                  color: user.rank <= 3 ? '#1a1a2e' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {user.rank}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {user.username}
                    {user.username === 'You' && (
                      <span style={{ 
                        backgroundColor: '#6a6aae', 
                        color: 'white', 
                        padding: '0.2rem 0.5rem', 
                        borderRadius: '10px', 
                        fontSize: '0.7rem' 
                      }}>
                        You
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#ccc' }}>
                    {user.earnings.toLocaleString()} HP earned
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 'bold' }}>
                  {user.score.toLocaleString()} pts
                </div>
                {user.rank <= 3 && (
                  <div style={{ 
                    fontSize: '0.7rem', 
                    color: '#FFD700', 
                    backgroundColor: '#3a3a5e', 
                    padding: '0.2rem 0.4rem', 
                    borderRadius: '10px',
                    marginTop: '0.2rem'
                  }}>
                    +{[1000, 500, 250][user.rank - 1]} HP
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}