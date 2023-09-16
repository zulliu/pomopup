import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';

import { useGlobalDispatch, useGlobalState } from '../globalContext';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useGlobalDispatch();

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/login', { username, password });
      if (response.status === 200) {
        Cookies.set('token', response.data.token, { httpOnly: false });
        const decoded = jwt.decode(response.data.token);
        dispatch({
          type: 'SET_USER',
          payload: {
            id: decoded.user_id,
            username: decoded.username,
            tomatoNumber: decoded.tomato_number,
          },
        });
        setIsLoggedIn(true);
        try {
          const userId = decoded.user_id;
          const logs = await axios.get(`/api/getLogs?userId=${userId}`);
          dispatch({ type: 'SET_LOGS', payload: logs.data });
        } catch (error) {
        }
      }
    } catch (error) {
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
      </div>
      <button
        type="button"
        onClick={handleLogin}
        className="w-32 rounded bg-primary px-2 text-white hover:text-yellow active:bg-dark"
      >
        Login

      </button>
      <img src="/paw.svg" alt="paw" className="m-3 mb-16" style={{ width: '2rem', height: 'auto' }} />

    </div>

  );
}

export default Login;
