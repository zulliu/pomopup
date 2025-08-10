// User and Authentication Types
export interface User {
  id: number;
  username: string;
  tomatoNumber: number;
  puppyName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

// Game State Types
export type AnimationType = 'idle' | 'leave' | 'back' | 'lay' | 'up';

export interface GameState {
  // Animation
  currentAnimation: AnimationType;

  // Tomato system
  showTomato: boolean;
  tomatoNumber: number;

  // Items
  items: Item[];
  userItems: UserItem[];

  // Logs
  logs: TimerLog[];

  // Environment
  environmentSettings: {
    rugTexture: string;
    wallTexture: string;
  };
  dogMesh: string;
}

// UI State
export interface UIState {
  isLoading: boolean;
  message: string;
  error: string | null;
}

// Combined App State
export interface AppState {
  auth: AuthState;
  game: GameState;
  ui: UIState;
}

// Data Types
export interface Item {
  item_id: number;
  name: string;
  description: string;
  scale: number;
  position: number[];
  price?: number;
}

export interface UserItem {
  user_item_id: number;
  user_id: number;
  item_id: number;
  quantity: number;
  item?: Item;
}

export interface TimerLog {
  log_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  memo?: string;
}

// Action Types
export enum ActionType {
  // Auth Actions
  LOGIN_START = 'LOGIN_START',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',

  // Game Actions
  SET_ANIMATION = 'SET_ANIMATION',
  SET_TOMATO_VISIBILITY = 'SET_TOMATO_VISIBILITY',
  INCREMENT_TOMATO = 'INCREMENT_TOMATO',
  SET_TOMATO_NUMBER = 'SET_TOMATO_NUMBER',

  // Data Actions
  SET_ITEMS = 'SET_ITEMS',
  SET_USER_ITEMS = 'SET_USER_ITEMS',
  SET_LOGS = 'SET_LOGS',
  ADD_LOG = 'ADD_LOG',

  // UI Actions
  SET_LOADING = 'SET_LOADING',
  SET_MESSAGE = 'SET_MESSAGE',
  SET_ERROR = 'SET_ERROR',
  CLEAR_ERROR = 'CLEAR_ERROR',

  // Environment Actions
  SET_RUG_TEXTURE = 'SET_RUG_TEXTURE',
  SET_WALL_TEXTURE = 'SET_WALL_TEXTURE',
  SWITCH_DOG = 'SWITCH_DOG',
}

// Action Interfaces
export type AppAction =
  | { type: ActionType.LOGIN_START }
  | { type: ActionType.LOGIN_SUCCESS; payload: { user: User; token: string } }
  | { type: ActionType.LOGIN_FAILURE; payload: string }
  | { type: ActionType.LOGOUT }
  | { type: ActionType.SET_ANIMATION; payload: AnimationType }
  | { type: ActionType.SET_TOMATO_VISIBILITY; payload: boolean }
  | { type: ActionType.INCREMENT_TOMATO }
  | { type: ActionType.SET_TOMATO_NUMBER; payload: number }
  | { type: ActionType.SET_ITEMS; payload: Item[] }
  | { type: ActionType.SET_USER_ITEMS; payload: UserItem[] }
  | { type: ActionType.SET_LOGS; payload: TimerLog[] }
  | { type: ActionType.ADD_LOG; payload: TimerLog }
  | { type: ActionType.SET_LOADING; payload: boolean }
  | { type: ActionType.SET_MESSAGE; payload: string }
  | { type: ActionType.SET_ERROR; payload: string }
  | { type: ActionType.CLEAR_ERROR }
  | { type: ActionType.SET_RUG_TEXTURE; payload: string }
  | { type: ActionType.SET_WALL_TEXTURE; payload: string }
  | { type: ActionType.SWITCH_DOG; payload: string };
