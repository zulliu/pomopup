import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import PomodoroTimer from './pomodoroTimer';
import TypewriterTextBox from './typewriterBox';
import SideBar from './sideBar';
import { useGlobalDispatch, useGlobalState } from '../globalContext';

interface MenuPanProps {
  activeTab?: string;
  mobile?: boolean;
  setActiveTab?: (tab: string) => void;
}

function MenuPan({
  activeTab = 'pomodoro',
  mobile = false,
  setActiveTab,
}: MenuPanProps) {
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
      const userDataResponse = await axios.get(
        `/api/getUserData?userId=${userId}`,
      );
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

  // Mobile layout - compact single screen
  if (mobile) {
    return (
      <div id="menu-pan" className="h-full flex flex-col justify-between py-3">
        {/* Status Message Bar - Styled */}
        <div className="px-4">
          <TypewriterTextBox text={message} key={message} mobile />
        </div>

        {/* Timer and Controls - Main interaction area */}
        <div className="flex-1 w-full">
          <PomodoroTimer setMessage={setMessage} activeTab={activeTab} mobile />
        </div>

        {/* Bottom Bar - Tomato count and quick actions */}
        <div
          className="h-14 flex items-center justify-between px-4 rounded-xl mx-3 bg-white/80"
          style={{ boxShadow: '0 0.3rem #c9bbc8' }}
        >
          <div className="flex items-center gap-2">
            <img src="/tomato.svg" alt="Tomato" className="w-7 h-7" />
            <span className="text-2xl font-bold">
              {globalState?.tomatoNumber || 0}
            </span>
          </div>
          <SideBar mobile />
        </div>
      </div>
    );
  }

  // Desktop layout - distributed vertically
  return (
    <div id="menu-pan" className="h-full flex flex-col justify-between py-8">
      {/* Top spacing */}
      <div className="flex-grow-0" />

      {/* Timer section - centered in available space */}
      <div className="flex-shrink-0">
        <PomodoroTimer setMessage={setMessage} activeTab={activeTab} />
      </div>

      {/* Message box */}
      <div className="flex-shrink-0 py-6">
        <TypewriterTextBox text={message} key={message} />
      </div>

      {/* Tomato count - pushed toward bottom */}
      <div className="flex-shrink-0 flex items-center justify-center">
        <div className="flex flex-col items-center text-3xl">
          <img src="/tomato.svg" alt="Tomato Icon" className="w-16 h-16 mb-2" />
          <span>
            Tomato:
            {globalState?.tomatoNumber || 0}
          </span>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="flex-grow-0" />
    </div>
  );
}

export default MenuPan;
