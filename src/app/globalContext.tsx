// This file provides backward compatibility for components still using old context
// It wraps the new AppContext to provide the old API

import React, { createContext, useContext } from 'react';
import { 
  AppProvider as NewAppProvider, 
  useAppState, 
  useAppDispatch,
  useAppActions,
  useAuth,
  useGame 
} from './contexts/AppContext';
import { ActionType } from './types/state';

// Re-export ACTIONS for backward compatibility
export const ACTIONS = ActionType;

// Create contexts for backward compatibility
const GlobalStateContext = createContext<any>(null);
const GlobalDispatchContext = createContext<any>(null);

// Compatibility wrapper
export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <NewAppProvider>
      <GlobalCompatibilityProvider>
        {children}
      </GlobalCompatibilityProvider>
    </NewAppProvider>
  );
}

function GlobalCompatibilityProvider({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  
  // Map new state structure to old structure for compatibility
  const compatState = {
    currentAnimation: state.game.currentAnimation,
    showTomato: state.game.showTomato,
    tomatoNumber: state.game.tomatoNumber,
    items: state.game.items,
    userItems: state.game.userItems,
    logs: state.game.logs,
    environmentSettings: state.game.environmentSettings,
    dogMesh: state.game.dogMesh,
    user: state.auth.user ? {
      id: state.auth.user.id,
      username: state.auth.user.username,
      tomatoNumber: state.auth.user.tomatoNumber,
    } : null,
  };

  return (
    <GlobalStateContext.Provider value={compatState}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
}

// Compatibility hooks
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    // If not in compatibility wrapper, use new state directly
    const state = useAppState();
    return {
      currentAnimation: state.game.currentAnimation,
      showTomato: state.game.showTomato,
      tomatoNumber: state.game.tomatoNumber,
      items: state.game.items,
      userItems: state.game.userItems,
      logs: state.game.logs,
      environmentSettings: state.game.environmentSettings,
      dogMesh: state.game.dogMesh,
    };
  }
  return context;
};

export const useGlobalDispatch = () => {
  const context = useContext(GlobalDispatchContext);
  if (!context) {
    return useAppDispatch();
  }
  return context;
};

export const useUserData = () => {
  const auth = useAuth();
  return auth.user;
};

// Re-export new hooks
export { useAppActions, useAppState, useAuth, useGame } from './contexts/AppContext';