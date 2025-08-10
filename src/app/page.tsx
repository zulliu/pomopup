'use client';

import React, { useState } from 'react';
import Canvas from './components/canvas';
import MenuPan from './components/menupan';
import SideBar from './components/sideBar';
import Login from './components/login';
import Register from './components/register';
import TimerTabs from './components/TimerTabs';
import PomodoroTimer from './components/pomodoroTimer';
import TypewriterTextBox from './components/typewriterBox';
import { AppProvider, useAuth, useGame } from './contexts/AppContext';

function HomeContent() {
  const { isAuthenticated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(true);
  const [activeTab, setActiveTab] = useState('pomodoro');
  const [message, setMessage] = useState('');
  const gameState = useGame();
  
  // Unified layout detection
  const [layoutInfo, setLayoutInfo] = useState<{
    mode: 'landscape' | 'portrait' | 'mobile';
    aspectRatio: number;
    isMobile: boolean;
    canvasHeightPercent: number;
  }>({
    mode: 'landscape',
    aspectRatio: 1.5,
    isMobile: false,
    canvasHeightPercent: 50
  });
  
  React.useEffect(() => {
    const detectLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const aspectRatio = width / height;
      
      // Mobile phones - keep original mobile layout
      if (width < 768 && aspectRatio < 0.7) {
        setLayoutInfo({
          mode: 'mobile',
          aspectRatio,
          isMobile: true,
          canvasHeightPercent: 45
        });
      }
      // iPad/tablets - portrait with canvas priority
      else if (aspectRatio <= 1.0) {
        const canvasHeightPercent = aspectRatio > 0.7 ? 60 : 50;
        setLayoutInfo({
          mode: 'portrait',
          aspectRatio,
          isMobile: false,
          canvasHeightPercent
        });
      }
      // Desktop/landscape
      else {
        setLayoutInfo({
          mode: 'landscape',
          aspectRatio,
          isMobile: false,
          canvasHeightPercent: 100
        });
      }
    };
    
    detectLayout();
    window.addEventListener('resize', detectLayout);
    return () => window.removeEventListener('resize', detectLayout);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center font-exe-pixel text-2xl">
        <img
          src="/plogo.svg"
          alt="logo"
          className="ml-2 mb-16"
          style={{ width: '20%', height: 'auto' }}
        />

        {isRegistering ? (
          <Register setIsRegistering={setIsRegistering} />
        ) : (
          <Login />
        )}

        <div className="mt-4 mx-auto items-center justify-center">
          <button
            type="button"
            className="mx-auto"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? 'Have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full items-center justify-center font-exe-pixel">
      {/* Landscape Layout - width > height */}
      {layoutInfo.mode === 'landscape' && (
      <div className="flex h-full w-full max-w-[2780px] mx-auto px-4" style={{ minHeight: '500px' }}>
        {/* Left Sidebar - Fixed width */}
        <div className="w-20 flex-shrink-0">
          <SideBar />
        </div>

        {/* Main Content - Canvas priority on extreme screens */}
        <div className="flex-1 flex justify-center">
          {/* 3D Canvas - Priority sizing */}
          <div className="h-full flex items-center justify-center" 
               style={{ 
                 width: '100%',
                 maxWidth: '600px',
                 minWidth: 'min(400px, 50vw)' 
               }}>
            <div className="w-full h-full">
              <Canvas layoutInfo={layoutInfo} />
            </div>
          </div>

          {/* Menu Panel - Scrollable on short screens */}
          <div className="h-full overflow-y-auto bg-[#e8e8e8]"
               style={{ 
                 width: '100%',
                 maxWidth: '600px',
                 minWidth: '300px'
               }}>
            <div style={{ minHeight: '500px' }}>
              <MenuPan activeTab={activeTab} />
            </div>
          </div>
        </div>

        {/* Right Tabs */}
        <div className="w-20 flex-shrink-0">
          <TimerTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
      )}

      {/* Portrait Layout - height > width */}
      {layoutInfo.mode === 'portrait' && (
      <div className="flex flex-col h-full w-full overflow-hidden bg-[#e2d6d8]">
        {/* Top - Canvas with dynamic height */}
        <div 
          className="w-full flex items-center justify-center"
          style={{ height: `${layoutInfo.canvasHeightPercent}%` }}
        >
          <Canvas layoutInfo={layoutInfo} />
        </div>
        
        {/* Bottom - Use mobile MenuPan layout */}
        <div 
          className="w-full bg-[#e8e8e8] flex flex-col"
          style={{ height: `${100 - layoutInfo.canvasHeightPercent}%` }}
        >
          {/* Mode Toggle */}
          <div className="h-12 flex items-center justify-center bg-white/80 gap-2">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className={`px-4 py-1 rounded-full transition-all ${
                activeTab === 'pomodoro'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setActiveTab('break')}
              className={`px-4 py-1 rounded-full transition-all ${
                activeTab === 'break'
                  ? 'bg-yellow text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Break
            </button>
          </div>
          
          {/* Use mobile MenuPan */}
          <div className="flex-1 overflow-y-auto">
            <MenuPan activeTab={activeTab} mobile setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
      )}

      {/* Mobile Layout - phones with original design */}
      {layoutInfo.mode === 'mobile' && (
      <div className="flex flex-col h-full w-full overflow-hidden bg-[#e2d6d8] items-center justify-center">
        <div className="w-full h-full flex flex-col" style={{ maxHeight: '900px' }}>
          {/* 3D Canvas */}
          <div className="flex-shrink-0" style={{ minHeight: '35vh', maxHeight: '50vh', height: '45vh' }}>
            <div className="h-full w-full">
              <Canvas layoutInfo={layoutInfo} />
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="h-12 flex items-center justify-center bg-white/80 gap-2">
            <button
              onClick={() => setActiveTab('pomodoro')}
              className={`px-4 py-1 rounded-full transition-all ${
                activeTab === 'pomodoro'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => setActiveTab('break')}
              className={`px-4 py-1 rounded-full transition-all ${
                activeTab === 'break'
                  ? 'bg-yellow text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              Break
            </button>
          </div>

          {/* Control Panel */}
          <div className="flex-1 flex flex-col bg-[#e8e8e8]" style={{ minHeight: '35vh', maxHeight: '55vh' }}>
            <MenuPan activeTab={activeTab} mobile setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
      )}
    </main>
  );
}

function Home() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  );
}

export default Home;
