import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // To display feedback to the user

  const handleRegister = async () => {
    try {
      const response = await axios.post('/api/register', { username, password });
      setMessage(response.data);
    } catch (error) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center h-1/3 w-1/2 ">
      <div className="flex flex-col mb-2">
        <input
          className="rounded my-1 p-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          className="rounded my-1 p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          className="rounded my-1 p-2"
          type="password"
          placeholder="Puppy's name?"
        />
      </div>

      <button
        type="button"
        className="w-32 rounded bg-primary px-2 text-white"
        onClick={handleRegister}
      >
        Register

      </button>
      <img src="/paw.svg" alt="paw" className="m-3 mb-16" style={{ width: '2rem', height: 'auto' }} />

      <div>{message}</div>
      {' '}
    </div>

  );
}

export default Register;
