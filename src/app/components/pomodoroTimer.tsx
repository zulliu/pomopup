import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay, faPause, faRefresh, faCouch, faBed,
} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import {
  useGlobalDispatch, useSceneHandlers, useUserData, useGlobalState,
} from '../globalContext';
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
  DECREASE: 8,
};

function CustomButton({
  icon, label, onClick, primary = true,
}) {
  return (
    <button type="button" className="flex flex-col items-center mx-10 text-3xl tracking-widest font-semibold" onClick={onClick}>
      <div className={
        `${primary ? 'bg-primary hover:text-yellow' : 'bg-yellow hover:text-primary'}  active:bg-dark w-16 h-16 flex items-center justify-center rounded-xl text-white text-4xl`
}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      {label}
    </button>
  );
}

function PomodoroTimer({ setMessage }) {
  const TIMER = TIMER_TEST;
  const [minutes, setMinutes] = useState(TIMER.POMO);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPause, setPause] = useState(false);
  const [isRest, setRest] = useState(false);

  const sceneHandlers = useSceneHandlers();
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

    const randomIndex = Math.floor(Math.random() * (items.length - 1)) + 1;
    return items[randomIndex];
  };

  const updateUserItemsWithRandomItem = (randomItem) => {
    const userItems = Cookies.get('userItems') ? JSON.parse(Cookies.get('userItems')) : [];

    // Check if user already has this item
    const existingItem = userItems.find((item) => item.item_id === randomItem.item_id);

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
      // sceneHandlers.leave();
      dispatch({ type: 'SET_ANIMATION', payload: 'leave' });
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
      // sceneHandlers.layDown();
      dispatch({ type: 'SET_ANIMATION', payload: 'lay' });
    }
    setRest(true);
    setMessage('Have a good rest!');
  };

  const resetTimer = (taskEnd = false) => {
    if (!isActive) {
      return;
    }
    setIsActive(false);
    // sceneHandlers.back();
    dispatch({ type: 'SET_ANIMATION', payload: 'back' });

    setMinutes(TIMER.POMO);
    setSeconds(0);
    if (!taskEnd) {
      setMessage(`${puppyName} Rushed Home!`);
    } else if (Math.random() > 0.2) {
      setTimeout(() => {
        setMessage('Wait...', 100);
        const randomItem = getRandomItem();
        updateUserItemsWithRandomItem(randomItem);
        setMessage(`There's something else... ${puppyName} brought you a ${randomItem.name}!`);
      }, 5000);
    }
  };

  const resetRest = () => {
    if (!isActive) {
      return;
    }
    // sceneHandlers.standUp();
    dispatch({ type: 'SET_ANIMATION', payload: 'up' });
    setMessage('Welcome back from your rest!');
    setRest(false);
    setMinutes(TIMER.SHORT);
    setSeconds(0);
  };

  const addLog = async (startTime, endTime) => {
    try {
      await axios.post('/api/addLog', { userId, startTime, endTime });
    } catch (error) {
    }
  };

  const fetchLogs = async () => {
    try {
      const logs = await axios.get(`/api/getLogs?userId=${userId}`);
      dispatch({ type: 'SET_LOGS', payload: logs.data });
    } catch (error) {}
  };

  useEffect(() => {
    if (sceneHandlers.jump) {
      setTimeout(() => {
        sceneHandlers.jump();
        setMessage(`...${puppyName} is so happy to see you!`, 10);
      }, 500);
    }
  }, []);

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

            const startTime = new Date(Date.now()
              - (minutes * 60 + seconds) * 1000).toLocaleString();
            const endTime = new Date().toLocaleString();
            try {
              axios.post('/api/incrementTomato', { userId }).then((response) => {
                if (response.status === 200) {
                  const newTomatoNumber = globalState.tomatoNumber + 1;
                  dispatch({ type: ACTIONS.SET_TOMATO_VISIBILITY, payload: true });

                  dispatch({
                    type: ACTIONS.SET_TOMATO_NUMBER,
                    payload: newTomatoNumber,
                  });
                  setMessage(`Task complete, ${puppyName}'s back! ${puppyName} brought you back a Tomato!`);
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

  const [activeTab, setActiveTab] = useState('pomodoro'); // 'pomodoro' or 'break'

  const setBreakDuration = (duration) => {
    setIsActive(false);
    setMinutes(duration);
    setSeconds(0);
  };

  return (
    <div className="relative flex flex-row items-center container mx-auto justify-center">
      {/* Side Tabs */}
      <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 flex flex-col justify-center text-2xl">
        <button
          onClick={() => setActiveTab('pomodoro')}
          className={`${activeTab === 'pomodoro' ? 'z-10 shadow-md' : ''} bg-primary px-6 py-2 rounded-md transform rotate-90 my-6`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => setActiveTab('break')}
          className={`${activeTab === 'break' ? 'z-10 shadow-md' : ''} bg-yellow px-6 py-2 rounded-md transform rotate-90 my-6`}
        >
          Break
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex justify-center m-8 mb-2">
          <img src="/1.gif" alt="P Logo" />
        </div>

        <div className="flex justify-center h-16 items-center">
          <p className="text-8xl tracking-widest mt-0 leading-none">
            {minutes.toString().padStart(2, '0')}
            :
            {seconds.toString().padStart(2, '0')}
          </p>
        </div>

        {/* Posdoro Buttons */}
        {activeTab === 'pomodoro' && (
        <div className="flex my-8">
          <CustomButton icon={faPlay} label="START" onClick={startTimer} />
          <CustomButton icon={faPause} label="PAUSE" onClick={pauseTimer} />
          <CustomButton icon={faRefresh} label="RESET" onClick={() => resetTimer(false)} />
        </div>
        )}

        {/* Break Buttons */}
        {activeTab === 'break' && (
        <div className="flex my-8">
          <CustomButton icon={faCouch} label="SHORT BREAK" onClick={startRest} primary={false} />
          <CustomButton icon={faBed} label="LONG BREAK" onClick={pauseTimer} primary={false} />
        </div>
        )}
      </div>
    </div>
  );
}
export default PomodoroTimer;
