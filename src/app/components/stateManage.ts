export const JUMP_VELOCITY = 0.1;
export const GRAVITY = 0.01;

export const initialState = {
  // Animation state
  currentAnimation: 'idle',
  
  // Game state
  showTomato: false,
  tomatoNumber: 0,
  
  // User data
  logs: [],
  items: [],
  userItems: [],
  purchasedItems: [],
  
  // Environment
  environmentSettings: {
    rugTexture: '/carpet3.jpg',
    wallTexture: '/wall.jpg',
  },
  dogMesh: 'corgi',
};

export const ACTIONS = {
  // Animation control
  SET_ANIMATION: 'SET_ANIMATION',
  
  // Game state
  SET_TOMATO_VISIBILITY: 'SET_TOMATO_VISIBILITY',
  SET_TOMATO_NUMBER: 'SET_TOMATO_NUMBER',
  INCREMENT_TOMATO: 'INCREMENT_TOMATO',
  
  // User data
  SET_ITEMS: 'SET_ITEMS',
  SET_USER_ITEMS: 'SET_USER_ITEMS',
  SET_LOGS: 'SET_LOGS',
  PURCHASE_ITEM: 'PURCHASE_ITEM',
  ADD_PURCHASED_ITEM: 'ADD_PURCHASED_ITEM',
  
  // Environment
  SET_RUG_TEXTURE: 'SET_RUG_TEXTURE',
  SET_WALL_TEXTURE: 'SET_WALL_TEXTURE',
  SWITCH_DOG: 'SWITCH_DOG',
};

export function reducer(state, action) {
  switch (action.type) {
    // Animation control
    case ACTIONS.SET_ANIMATION:
      return {
        ...state,
        currentAnimation: action.payload,
      };
    
    // Game state
    case ACTIONS.SET_TOMATO_VISIBILITY:
      return {
        ...state,
        showTomato: action.payload,
      };
    case ACTIONS.SET_TOMATO_NUMBER:
      return {
        ...state,
        tomatoNumber: action.payload,
      };
    case ACTIONS.INCREMENT_TOMATO:
      return {
        ...state,
        tomatoNumber: state.tomatoNumber + 1,
      };
    
    // User data
    case ACTIONS.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    case ACTIONS.SET_LOGS:
      return {
        ...state,
        logs: action.payload,
      };
    case ACTIONS.SET_USER_ITEMS:
      return {
        ...state,
        userItems: action.payload,
      };
    case ACTIONS.PURCHASE_ITEM: {
      const item = state.shopItems?.find((i) => i.id === action.payload.itemId);
      if (!item || state.tomatoNumber < item.price) {
        console.warn('Not enough tomatoes or item not found!');
        return state;
      }
      return {
        ...state,
        tomatoNumber: state.tomatoNumber - item.price,
        userItems: [...state.userItems, item],
      };
    }
    case ACTIONS.ADD_PURCHASED_ITEM:
      return {
        ...state,
        purchasedItems: [...state.purchasedItems, action.payload],
      };
    
    // Environment
    case ACTIONS.SET_RUG_TEXTURE:
      return {
        ...state,
        environmentSettings: {
          ...state.environmentSettings,
          rugTexture: action.payload,
        },
      };
    case ACTIONS.SET_WALL_TEXTURE:
      return {
        ...state,
        environmentSettings: {
          ...state.environmentSettings,
          wallTexture: action.payload,
        },
      };
    case ACTIONS.SWITCH_DOG:
      return {
        ...state,
        dogMesh: action.payload,
      };
    
    default:
      return state;
  }
}
