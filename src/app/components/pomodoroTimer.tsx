import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faPause,
  faRefresh,
  faCouch,
  faBed,
} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { useGlobalDispatch, useGlobalState } from '../globalContext';
import { ACTIONS } from './stateManage';

const TIMER_SETTING = {
  POMO: 25,
  SHORT: 5,
  LONG: 15,
  DECREASE: 59,
};

const TIMER_TEST = {
  POMO: 1,
  SHORT: 1,
  LONG: 1,
  DECREASE: 7,
};

function CustomButton({ icon, label, onClick, primary = true }) {
  return (
    <button
      type="button"
      className="flex flex-col items-center mx-10 text-3xl tracking-widest font-semibold"
      onClick={onClick}
    >
      <div
        className={`${
          primary
            ? 'bg-primary hover:text-yellow'
            : 'bg-yellow hover:text-primary'
        }  active:bg-dark w-16 h-16 flex items-center justify-center rounded-xl text-white text-4xl`}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      {label}
    </button>
  );
}

function PomodoroTimer({ setMessage, activeTab = 'pomodoro', mobile = false }) {
  const TIMER = TIMER_TEST;
  const [minutes, setMinutes] = useState(TIMER.POMO);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPause, setPause] = useState(false);
  const [isRest, setRest] = useState(false);

  const dispatch = useGlobalDispatch();
  const globalState = useGlobalState();

  const minutesRef = useRef(minutes);
  const secondsRef = useRef(seconds);
  const userId = Cookies.get('user_id');
  const puppyName = Cookies.get('puppy_name');

  useEffect(() => {
    minutesRef.current = minutes;
    secondsRef.current = seconds;
  }, [minutes, seconds]);

  const getRandomItem = () => {
    const items = Cookies.get('items') ? JSON.parse(Cookies.get('items')) : [];

    if (items.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  };

  const updateUserItemsWithRandomItem = (randomItem) => {
    if (!randomItem) return;

    const userItems = Cookies.get('userItems')
      ? JSON.parse(Cookies.get('userItems'))
      : [];

    // Check if user already has this item
    const existingItem = userItems.find(
      (item) => item.item_id === randomItem.item_id,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      userItems.push({
        user_id: userId,
        ...randomItem,
        quantity: 1,
      });
    }

    Cookies.set('userItems', JSON.stringify(userItems));
    dispatch({ type: 'SET_USER_ITEMS', payload: userItems });
  };

  const startTimer = () => {
    setIsActive(true);
    if (!isPause) {
      dispatch({ type: ACTIONS.SET_ANIMATION, payload: 'leave' });
      dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
    }
    setPause(false);
    setMessage(`Timer start. ${puppyName} has left the house.`);
  };

  const pauseTimer = () => {
    setIsActive(false);
    setPause(true);
  };

  const startRest = () => {
    setIsActive(true);
    if (!isRest) {
      dispatch({ type: ACTIONS.SET_ANIMATION, payload: 'lay' });
      dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
    }
    setRest(true);
    setMessage('Have a good rest!');
  };

  const resetTimer = (taskEnd = false) => {
    if (!isActive) {
      return;
    }
    setIsActive(false);
    dispatch({ type: ACTIONS.SET_ANIMATION, payload: 'back' });
    dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });

    setMinutes(TIMER.POMO);
    setSeconds(0);
    if (!taskEnd) {
      setMessage(`${puppyName} Rushed Home!`);
    } else if (Math.random() > 0.2) {
      setTimeout(() => {
        setMessage('Wait...', 100);
        const randomItem = getRandomItem();
        if (randomItem) {
          updateUserItemsWithRandomItem(randomItem);
          setMessage(
            `There's something else... ${puppyName} brought you a ${randomItem.name}!`,
          );
        }
      }, 5000);
    }
  };

  const resetRest = () => {
    if (!isActive) {
      return;
    }
    dispatch({ type: ACTIONS.SET_ANIMATION, payload: 'up' });
    dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: false });
    setMessage('Welcome back from your rest!');
    setRest(false);
    setMinutes(TIMER.SHORT);
    setSeconds(0);
  };

  const addLog = async (startTime, endTime) => {
    try {
      await axios.post('/api/addLog', { userId, startTime, endTime });
    } catch (error) {}
  };

  const fetchLogs = async () => {
    try {
      const logs = await axios.get(`/api/getLogs?userId=${userId}`);
      dispatch({ type: 'SET_LOGS', payload: logs.data });
    } catch (error) {}
  };

  // Initial welcome message
  useEffect(() => {
    if (puppyName) {
      setMessage(`${puppyName} is happy to see you!`);
    }
  }, [puppyName]);

  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        if (secondsRef.current > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else if (secondsRef.current === 0) {
          if (minutesRef.current === 0) {
            clearInterval(interval);
            setIsActive(false);
          } else {
            setMinutes((prevMinutes) => prevMinutes - 1);
            setSeconds(TIMER.DECREASE);
          }
        }

        if (minutesRef.current === 0 && secondsRef.current === 0) {
          if (!isRest) {
            setIsActive(false);

            const startTime = new Date(
              Date.now() - (minutes * 60 + seconds) * 1000,
            ).toLocaleString();
            const endTime = new Date().toLocaleString();
            try {
              axios
                .post('/api/incrementTomato', { userId })
                .then((response) => {
                  if (response.status === 200) {
                    const newTomatoNumber = globalState.tomatoNumber + 1;
                    dispatch({
                      type: ACTIONS.SET_TOMATO_VISIBILITY,
                      payload: true,
                    });

                    dispatch({
                      type: ACTIONS.SET_TOMATO_NUMBER,
                      payload: newTomatoNumber,
                    });
                    setMessage(
                      `Task complete, ${puppyName}'s back! ${puppyName} brought you back a Tomato!`,
                    );
                    addLog(startTime, endTime);
                    fetchLogs();
                  }
                });
            } catch (error) {}
            resetTimer(true);
          } else {
            resetRest();
          }
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  // Mobile layout - logo above timer, buttons centered
  if (mobile) {
    return (
      <div className="h-full w-full flex items-center">
        {/* Left section - Logo and Timer (responsive width) */}
        <div className="flex flex-col items-center justify-center px-4">
          <img
            src="/1.gif"
            alt="P Logo"
            className="w-20 h-20 sm:w-24 sm:h-24 mb-2"
          />
          <p className="text-3xl sm:text-4xl font-bold tracking-wider text-center">
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </p>
        </div>

        {/* Right section - Buttons centered (remaining space) */}
        <div className="flex-1 flex items-center justify-center">
          {activeTab === 'pomodoro' ? (
            <div className="flex gap-4 sm:gap-5">
              <div className="flex flex-col items-center">
                <button
                  onClick={startTimer}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-primary hover:bg-dark active:bg-dark rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
                  style={{ boxShadow: '0 0.3rem #A3869C' }}
                >
                  <FontAwesomeIcon icon={faPlay} className="text-2xl" />
                </button>
                <span className="text-2xl font-semibold mt-1">START</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={pauseTimer}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-primary hover:bg-dark active:bg-dark rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
                  style={{ boxShadow: '0 0.3rem #A3869C' }}
                >
                  <FontAwesomeIcon icon={faPause} className="text-2xl" />
                </button>
                <span className="text-2xl font-semibold mt-1">PAUSE</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => resetTimer(false)}
                  className="w-12 h-12 sm:w-14 sm:h-14 bg-primary hover:bg-dark active:bg-dark rounded-xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-all"
                  style={{ boxShadow: '0 0.3rem #A3869C' }}
                >
                  <FontAwesomeIcon icon={faRefresh} className="text-2xl" />
                </button>
                <span className="text-2xl font-semibold mt-1">RESET</span>
              </div>
            </div>
          ) : (
            <div className="flex gap-4 sm:gap-5">
              <button
                onClick={startRest}
                className="px-3 py-2 sm:px-5 sm:py-3 bg-yellow hover:bg-yellow/80 active:bg-yellow/80 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-all text-sm sm:text-base"
                style={{ boxShadow: '0 0.3rem #e8d98f' }}
              >
                SHORT
              </button>
              <button
                onClick={pauseTimer}
                className="px-3 py-2 sm:px-5 sm:py-3 bg-yellow hover:bg-yellow/80 active:bg-yellow/80 rounded-xl text-white font-bold shadow-lg active:scale-95 transition-all text-sm sm:text-base"
                style={{ boxShadow: '0 0.3rem #e8d98f' }}
              >
                LONG
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout - original
  return (
    <div className="flex flex-col items-center container mx-auto justify-center">
      <div className="flex flex-col items-center">
        <div className="flex justify-center m-4 md:m-8 mb-2">
          <img src="/1.gif" alt="P Logo" className="w-20 md:w-auto" />
        </div>

        <div className="flex justify-center h-16 items-center">
          <p className="text-5xl md:text-8xl tracking-widest mt-0 leading-none">
            {minutes.toString().padStart(2, '0')}:
            {seconds.toString().padStart(2, '0')}
          </p>
        </div>

        {/* Pomodoro Buttons */}
        {activeTab === 'pomodoro' && (
          <div className="flex my-4 md:my-8 scale-75 md:scale-100">
            <CustomButton icon={faPlay} label="START" onClick={startTimer} />
            <CustomButton icon={faPause} label="PAUSE" onClick={pauseTimer} />
            <CustomButton
              icon={faRefresh}
              label="RESET"
              onClick={() => resetTimer(false)}
            />
          </div>
        )}

        {/* Break Buttons */}
        {activeTab === 'break' && (
          <div className="flex my-4 md:my-8 scale-75 md:scale-100">
            <CustomButton
              icon={faCouch}
              label="SHORT BREAK"
              onClick={startRest}
              primary={false}
            />
            <CustomButton
              icon={faBed}
              label="LONG BREAK"
              onClick={pauseTimer}
              primary={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default PomodoroTimer;
