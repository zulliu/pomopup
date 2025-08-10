import React, { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { AppState, AppAction, ActionType, User } from '../types/state';
import { appReducer, initialState } from '../reducers/appReducer';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  actions: {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    register: (username: string, password: string, puppyName: string) => Promise<void>;
    loadUserData: (userId: number) => Promise<void>;
    setAnimation: (animation: string) => void;
    setTomatoVisibility: (visible: boolean) => void;
    incrementTomato: () => void;
    setMessage: (message: string) => void;
  };
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [isInitializing, setIsInitializing] = useState(true);

  // Load user data helper (defined before useEffect)
  const loadUserDataInternal = async (userId: number) => {
    try {
      // Load all items
      const itemsResponse = await axios.get('/api/getAllItems');
      dispatch({ type: ActionType.SET_ITEMS, payload: itemsResponse.data });
      
      // Load user items
      const userItemsResponse = await axios.get(`/api/getItemsByUserId?userId=${userId}`);
      dispatch({ type: ActionType.SET_USER_ITEMS, payload: userItemsResponse.data });
      
      // Load logs
      const logsResponse = await axios.get(`/api/getLogs?userId=${userId}`);
      dispatch({ type: ActionType.SET_LOGS, payload: logsResponse.data });
      
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Initialize auth state from token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const decoded = jwt.decode(token) as any;
          if (decoded) {
            const user: User = {
              id: decoded.user_id,
              username: decoded.username,
              tomatoNumber: decoded.tomato_number || 0,
              puppyName: decoded.puppy_name,
            };
            dispatch({ 
              type: ActionType.LOGIN_SUCCESS, 
              payload: { user, token } 
            });
            
            // Load user data if authenticated
            await loadUserDataInternal(decoded.user_id);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          Cookies.remove('token');
        }
      }
      setIsInitializing(false);
    };
    
    initializeAuth();
  }, []);

  // Login action
  const login = useCallback(async (username: string, password: string) => {
    dispatch({ type: ActionType.LOGIN_START });
    
    try {
      const response = await axios.post('/api/login', { username, password });
      
      if (response.status === 200) {
        const token = response.data.token;
        const decoded = jwt.decode(token) as any;
        
        // Store only token in cookie
        Cookies.set('token', token, { expires: 1/24 }); // 1 hour
        
        const user: User = {
          id: decoded.user_id,
          username: decoded.username,
          tomatoNumber: decoded.tomato_number || 0,
          puppyName: decoded.puppy_name,
        };
        
        dispatch({ 
          type: ActionType.LOGIN_SUCCESS, 
          payload: { user, token } 
        });
        
        // Load additional user data
        await loadUserData(decoded.user_id);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ type: ActionType.LOGIN_FAILURE, payload: errorMessage });
      throw error;
    }
  }, []);

  // Register action
  const register = useCallback(async (username: string, password: string, puppyName: string) => {
    dispatch({ type: ActionType.LOGIN_START });
    
    try {
      // Register user
      const registerResponse = await axios.post('/api/register', { 
        username, 
        password, 
        puppyName 
      });
      
      const { userId } = registerResponse.data;
      
      // Add puppy
      await axios.post('/api/addPuppy', { 
        user_id: userId, 
        mesh_id: 'corgi', 
        puppy_name: puppyName 
      });
      
      // Auto-login
      await login(username, password);
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({ type: ActionType.LOGIN_FAILURE, payload: errorMessage });
      throw error;
    }
  }, [login]);

  // Load user data
  const loadUserData = useCallback(async (userId: number) => {
    return loadUserDataInternal(userId);
  }, []);

  // Logout action
  const logout = useCallback(() => {
    Cookies.remove('token');
    dispatch({ type: ActionType.LOGOUT });
  }, []);

  // Animation actions
  const setAnimation = useCallback((animation: string) => {
    dispatch({ 
      type: ActionType.SET_ANIMATION, 
      payload: animation as any 
    });
  }, []);

  const setTomatoVisibility = useCallback((visible: boolean) => {
    dispatch({ 
      type: ActionType.SET_TOMATO_VISIBILITY, 
      payload: visible 
    });
  }, []);

  const incrementTomato = useCallback(() => {
    dispatch({ type: ActionType.INCREMENT_TOMATO });
  }, []);

  // UI actions
  const setMessage = useCallback((message: string) => {
    dispatch({ 
      type: ActionType.SET_MESSAGE, 
      payload: message 
    });
  }, []);

  const actions = {
    login,
    logout,
    register,
    loadUserData,
    setAnimation,
    setTomatoVisibility,
    incrementTomato,
    setMessage,
  };

  // Show loading screen during initialization
  if (isInitializing) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center font-exe-pixel">
        <img
          src="/plogo.svg"
          alt="logo"
          className="ml-2 mb-8 animate-pulse"
          style={{ width: '20%', height: 'auto' }}
        />
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="mt-4 text-2xl text-gray-600">Loading your puppy...</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hooks for accessing context
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context.state;
}

export function useAppDispatch() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppProvider');
  }
  return context.dispatch;
}

export function useAppActions() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppActions must be used within AppProvider');
  }
  return context.actions;
}

// Convenience hook for auth state
export function useAuth() {
  const state = useAppState();
  return state.auth;
}

// Convenience hook for game state
export function useGame() {
  const state = useAppState();
  return state.game;
}

// Convenience hook for UI state
export function useUI() {
  const state = useAppState();
  return state.ui;
}