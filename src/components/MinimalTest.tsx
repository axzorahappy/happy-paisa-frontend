export default function MinimalTest() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white', 
      fontSize: '24px',
      minHeight: '100vh'
    }}>
      <h1>🚨 MINIMAL TEST - If you see this, React is working!</h1>
      <p>Time: {new Date().toLocaleString()}</p>
      <button onClick={() => alert('Button clicked!')}>
        Click me to test JavaScript
      </button>
    </div>
  );
}