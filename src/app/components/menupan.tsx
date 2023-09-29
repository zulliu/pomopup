import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import PomodoroTimer from './pomodoroTimer';
import TypewriterTextBox from './typewriterBox';
import { useSceneHandlers, useGlobalDispatch, useGlobalState } from '../globalContext';

function MenuPan() {
  const [message, setMessage] = useState('');
  const globalState = useGlobalState();
  const dispatch = useGlobalDispatch();
  const userId = Cookies.get('user_id');

  const getUserData = async () => {
    try {
      if (!userId) {
        console.error('User ID not found in cookies.');
        return;
      }

      // Fetch user data
      const userDataResponse = await axios.get(`/api/getUserData?userId=${userId}`);
      Cookies.set('puppy_name', userDataResponse.data.active_puppy_name);
      dispatch({ type: 'SET_LOGS', payload: userDataResponse.data.timerlogs });

      // Update tomato number (if available in the response)
      if (userDataResponse.data.tomato_number !== undefined) {
        dispatch({
          type: 'SET_TOMATO_NUMBER',
          payload: userDataResponse.data.tomato_number,
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div id="menu-pan" className="h-full">
      <PomodoroTimer
        setMessage={setMessage}
      />
      <TypewriterTextBox text={message} key={message} />
      <div className="h-1/6 flex items-end justify-center">
        <div className="flex flex-col items-center mx-auto text-3xl mb-4 ">
          <img src="/tomato.svg" alt="Tomato Icon" className="ml-2" style={{ width: '30%', height: 'auto' }} />
          Tomato:
          {' '}
          {globalState?.tomatoNumber}
        </div>
      </div>
    </div>
  );
}

export default MenuPan;
