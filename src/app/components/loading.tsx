import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // To display feedback to the user

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      setMessage(response.data); // Display the success message from the server
      // Optionally redirect the user to their dashboard or main app
    } catch (error) {
      setMessage('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login</button>
      <div>{message}</div>
      {' '}
      {/* Display feedback */}
    </div>
  );
}

export default Login;
