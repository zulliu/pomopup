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
        const decoded = jwt.decode(response.data.token);
        Cookies.set('token', response.data.token, { httpOnly: false });
        Cookies.set('user_id', decoded.user_id);
        dispatch({
          type: 'SET_TOMATO_NUMBER',
          payload: decoded.tomato_number,
        });

        setIsLoggedIn(true);
        try {
          const userId = decoded.user_id;
          // fetch log
          const logs = await axios.get(`/api/getLogs?userId=${userId}`);
          dispatch({ type: 'SET_LOGS', payload: logs.data });

          // fetch user-specific items
          const itemsResponse = await axios.get(`/api/getItemsByUserId?userId=${userId}`);
          dispatch({ type: 'SET_USER_ITEMS', payload: itemsResponse.data });
          Cookies.set('userItems', JSON.stringify(itemsResponse.data));
        } catch (error) {}
        try {
          const itemsResponse = await axios.get('/api/getAllItems');
          dispatch({ type: 'SET_ITEMS', payload: itemsResponse.data });
          Cookies.set('items', JSON.stringify(itemsResponse.data));
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      }
    } catch (error) {}
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
