import React, { useState } from 'react';
import PomodoroTimer from './pomodoroTimer';
import TypewriterTextBox from './typewriterBox';
import { useSceneHandlers, useUserData, useGlobalState } from '../globalContext';

function MenuPan() {
  const [message, setMessage] = useState('');
  const sceneHandlers = useSceneHandlers();
  const globalState = useGlobalState();
  return (
    <div id="menu-pan" className="h-full">
      <PomodoroTimer
        setMessage={setMessage}
      />
      <TypewriterTextBox text={message} key={message} />
      <div className="h-1/6 flex items-end justify-center">
        <div className="flex flex-col items-center mx-auto text-3xl  ">
          <img src="/tomato.svg" alt="Tomato Icon" className="ml-2" style={{ width: '30%', height: 'auto' }} />
          Tomato:
          {' '}
          {globalState?.user.tomatoNumber}
        </div>
      </div>
      <button type="button" className="btn" onClick={sceneHandlers.jump}>Jump</button>
      <button type="button" className="btn" onClick={sceneHandlers.leave}>Leave</button>
      <button type="button" className="btn" onClick={sceneHandlers.back}>Back</button>
      <button type="button" className="btn" onClick={sceneHandlers.resetState}>Reset</button>
      <button type="button" className="btn" onClick={sceneHandlers.layDown}>Lay</button>
      <button type="button" className="btn" onClick={sceneHandlers.standUp}>Up</button>

      <button type="button" className="btn" onClick={sceneHandlers.toggleTomato}>Toggle Tomato</button>
    </div>
  );
}

export default MenuPan;
