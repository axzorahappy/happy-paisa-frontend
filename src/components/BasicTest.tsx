function BasicTest() {
  console.log("BasicTest component is rendering!");
  
  return (
    <div style={{
      backgroundColor: 'blue',
      color: 'white',
      padding: '50px',
      fontSize: '30px',
      textAlign: 'center',
      minHeight: '100vh'
    }}>
      <h1>🟦 BASIC TEST SUCCESS!</h1>
      <p>If you see this blue screen, React is working!</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  );
}

export default BasicTest;