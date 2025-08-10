import { AppState, AppAction, ActionType } from '../types/state';

export const initialState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: false,
  },
  game: {
    currentAnimation: 'idle',
    showTomato: false,
    tomatoNumber: 0,
    items: [],
    userItems: [],
    logs: [],
    environmentSettings: {
      rugTexture: '/carpet3.jpg',
      wallTexture: '/wall.jpg',
    },
    dogMesh: 'corgi',
  },
  ui: {
    isLoading: false,
    message: '',
    error: null,
  },
};

export function appReducer(state: AppState = initialState, action: AppAction): AppState {
  switch (action.type) {
    // Auth Actions
    case ActionType.LOGIN_START:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: true,
        },
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case ActionType.LOGIN_SUCCESS:
      return {
        ...state,
        auth: {
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          isLoading: false,
        },
        game: {
          ...state.game,
          tomatoNumber: action.payload.user.tomatoNumber,
        },
        ui: {
          ...state.ui,
          error: null,
        },
      };

    case ActionType.LOGIN_FAILURE:
      return {
        ...state,
        auth: {
          ...state.auth,
          isLoading: false,
        },
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case ActionType.LOGOUT:
      return {
        ...initialState,
      };

    // Game Actions
    case ActionType.SET_ANIMATION:
      return {
        ...state,
        game: {
          ...state.game,
          currentAnimation: action.payload,
        },
      };

    case ActionType.SET_TOMATO_VISIBILITY:
      return {
        ...state,
        game: {
          ...state.game,
          showTomato: action.payload,
        },
      };

    case ActionType.INCREMENT_TOMATO:
      return {
        ...state,
        game: {
          ...state.game,
          tomatoNumber: state.game.tomatoNumber + 1,
        },
      };

    case ActionType.SET_TOMATO_NUMBER:
      return {
        ...state,
        game: {
          ...state.game,
          tomatoNumber: action.payload,
        },
      };

    // Data Actions
    case ActionType.SET_ITEMS:
      return {
        ...state,
        game: {
          ...state.game,
          items: action.payload,
        },
      };

    case ActionType.SET_USER_ITEMS:
      return {
        ...state,
        game: {
          ...state.game,
          userItems: action.payload,
        },
      };

    case ActionType.SET_LOGS:
      return {
        ...state,
        game: {
          ...state.game,
          logs: action.payload,
        },
      };

    case ActionType.ADD_LOG:
      return {
        ...state,
        game: {
          ...state.game,
          logs: [...state.game.logs, action.payload],
        },
      };

    // UI Actions
    case ActionType.SET_LOADING:
      return {
        ...state,
        ui: {
          ...state.ui,
          isLoading: action.payload,
        },
      };

    case ActionType.SET_MESSAGE:
      return {
        ...state,
        ui: {
          ...state.ui,
          message: action.payload,
        },
      };

    case ActionType.SET_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };

    case ActionType.CLEAR_ERROR:
      return {
        ...state,
        ui: {
          ...state.ui,
          error: null,
        },
      };

    // Environment Actions
    case ActionType.SET_RUG_TEXTURE:
      return {
        ...state,
        game: {
          ...state.game,
          environmentSettings: {
            ...state.game.environmentSettings,
            rugTexture: action.payload,
          },
        },
      };

    case ActionType.SET_WALL_TEXTURE:
      return {
        ...state,
        game: {
          ...state.game,
          environmentSettings: {
            ...state.game.environmentSettings,
            wallTexture: action.payload,
          },
        },
      };

    case ActionType.SWITCH_DOG:
      return {
        ...state,
        game: {
          ...state.game,
          dogMesh: action.payload,
        },
      };

    default:
      return state;
  }
}