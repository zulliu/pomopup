'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Canvas from './components/canvas';
import MenuPan from './components/menupan';
import SideBar from './components/sideBar';
import { GlobalProvider } from './globalContext';
import Login from './components/login';
import Register from './components/register';

interface RegisterProps {
  setIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function Home() {
  const [isCanvasReady, setIsCanvasReady] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get('token'));
  }, []);

  return (
    <GlobalProvider>
      {!isLoggedIn ? (
        <div className="flex flex-col h-screen w-full items-center justify-center font-exe-pixel text-2xl">
          <img src="/plogo.svg" alt="logo" className="ml-2 mb-16" style={{ width: '20%', height: 'auto' }} />

          {isRegistering ? (
            <Register setIsRegistering={setIsRegistering} setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
          )}
          <div className="mt-4 mx-auto items-center justify-center">
            <button type="button" className="mx-auto" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? 'Have an account? Login' : "Don't have an account? Register"}
            </button>
          </div>

        </div>

      ) : (
        <main className="flex h-screen w-full items-center justify-center font-exe-pixel">
          {isCanvasReady ? (
            <div className="h-full flex w-11/12">
              <div className="w-1/12">
                <SideBar setIsLoggedIn={setIsLoggedIn} />
              </div>

              <div className="w-1/2">
                <Canvas />
              </div>
              <div className="w-5/12">
                <MenuPan />
              </div>
            </div>
          ) : (
            <div className="flex mx-auto items-center">Loading your puppy...</div>
          )}
        </main>
      )}
    </GlobalProvider>
  );
}

export default Home;
