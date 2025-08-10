import React, { useState } from 'react';
import { useAppActions, useUI } from '../contexts/AppContext';

interface RegisterProps {
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
}

function Register({ setIsRegistering }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [puppyName, setPuppyName] = useState('');
  const [message, setMessage] = useState('');
  const { register } = useAppActions();
  const { isLoading } = useUI();

  const handleRegister = async () => {
    try {
      if (!username || !password || !puppyName) {
        setMessage('Please fill in all fields');
        return;
      }
      
      setMessage('');
      await register(username, password, puppyName);
      setMessage('Registration successful!');
    } catch (error: any) {
      setMessage(error.response?.data?.error || 'Registration failed');
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
        <input
          className="rounded my-1 p-2"
          value={puppyName}
          onChange={(e) => setPuppyName(e.target.value)}
          placeholder="Puppy's name?"
          disabled={isLoading}
        />
      </div>

      <button
        type="button"
        className="w-32 rounded bg-primary px-2 text-white disabled:opacity-50"
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Register'}
      </button>
      
      <img src="/paw.svg" alt="paw" className="m-3 mb-16" style={{ width: '2rem', height: 'auto' }} />

      {message && (
        <div className={message.includes('successful') ? 'text-green-500' : 'text-red-500'}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Register;