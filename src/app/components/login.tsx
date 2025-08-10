import React, { useState } from 'react';
import { useAppActions, useUI } from '../contexts/AppContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAppActions();
  const { isLoading } = useUI();

  const handleLogin = async () => {
    try {
      setErrorMessage('');
      await login(username, password);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center h-1/3 w-1/2">
      <div className="flex flex-col mb-2">
        <input
          className="rounded my-1 p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          disabled={isLoading}
        />
        <input
          className="rounded my-1 p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          disabled={isLoading}
        />
      </div>
      
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        className="w-32 rounded bg-primary px-2 text-white hover:text-yellow active:bg-dark disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Login'}
      </button>
      
      <img src="/paw.svg" alt="paw" className="m-3 mb-16" style={{ width: '2rem', height: 'auto' }} />
      
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">{errorMessage}</div>
      )}
    </div>
  );
}

export default Login;