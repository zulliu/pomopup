import React from 'react';

interface TimerTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function TimerTabs({ activeTab, setActiveTab }: TimerTabsProps) {
  return (
    <div className='h-full flex flex-col justify-center items-center space-y-8'>
      <button
        onClick={() => setActiveTab('pomodoro')}
        className={`${
          activeTab === 'pomodoro' ? 'z-10 shadow-lg scale-110' : 'opacity-70'
        } bg-primary px-4 py-2 rounded-md transform rotate-90 transition-all duration-200 text-white text-xl font-semibold`}
      >
        Pomodoro
      </button>
      <button
        onClick={() => setActiveTab('break')}
        className={`${
          activeTab === 'break' ? 'z-10 shadow-lg scale-110' : 'opacity-70'
        } bg-yellow px-4 py-2 rounded-md transform rotate-90 transition-all duration-200 text-white text-xl font-semibold`}
      >
        Break
      </button>
    </div>
  );
}

export default TimerTabs;