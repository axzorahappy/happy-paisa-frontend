import React from 'react';

export default function TestPage() {
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#1a1a2e', 
      minHeight: '100vh', 
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#00ff88' }}>✅ React is Working!</h1>
      <p>This is a test page to verify the frontend is running correctly.</p>
      
      <div style={{ 
        backgroundColor: '#16213e', 
        padding: '1rem', 
        borderRadius: '8px', 
        margin: '1rem 0' 
      }}>
        <h2>🚀 Server Status:</h2>
        <ul>
          <li>Frontend: Running on http://localhost:5173</li>
          <li>Backend: Running on http://localhost:3001</li>
          <li>React: ✅ Successfully loaded</li>
        </ul>
      </div>

      <div style={{ 
        backgroundColor: '#0f3460', 
        padding: '1rem', 
        borderRadius: '8px', 
        margin: '1rem 0' 
      }}>
        <h2>🔧 Next Steps:</h2>
        <ol>
          <li>If you can see this page, React is working fine</li>
          <li>The white screen was likely caused by import errors</li>
          <li>We'll fix the leaderboard components step by step</li>
        </ol>
      </div>

      <button 
        onClick={() => {
          console.log('Test button clicked!');
          alert('React is working! ✅');
        }}
        style={{
          backgroundColor: '#00ff88',
          color: '#1a1a2e',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Test Button - Click Me!
      </button>
    </div>
  );
}