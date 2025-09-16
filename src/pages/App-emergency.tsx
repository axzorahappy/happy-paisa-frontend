function App() {
  return (
    <div style={{
      backgroundColor: '#ff0000',
      color: 'white',
      fontSize: '24px',
      padding: '50px',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <h1>🔥 EMERGENCY DEBUG MODE 🔥</h1>
      <p>If you see this RED screen, React is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
      <p>No routing, no complex components, just pure React!</p>
    </div>
  );
}

export default App;