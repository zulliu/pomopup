export const JUMP_VELOCITY = 0.1;
export const GRAVITY = 0.01;

export const initialState = {
  currentAnimation: 'idle',
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  velocity: 0,
  yPosition: 0,
  isJumping: false,
  jumpCount: 0,
  frameCount: 0,
  leaving: false,
  hasReset: false,
  comingBack: false,
  layingDown: false,
  standingUp: false,
  tomatoState: 'picked',
  showTooltip: false,
  showTomato: false,
  logs: [],
  purchasedItems: [],
  environmentSettings: {
    rugTexture: '/carpet3.jpg',
    wallTexture: '/wall.jpg',
  },
  dogMesh: 'corgi',
};

export const ACTIONS = {
  JUMP: 'JUMP',
  LEAVE: 'LEAVE',
  BACK: 'BACK',
  RESET: 'RESET',
  RESET_LEAVE: 'RESET_LEAVE',
  RESET_BACK: 'RESET_BACK',
  START_ACTION: 'START_ACTION',
  INCREMENT_FRAME: 'INCREMENT_FRAME',
  UPDATE_JUMP: 'UPDATE_JUMP',
  INCREMENT_JUMP_COUNT: 'INCREMENT_JUMP_COUNT',
  RESET_APPLIED: 'RESET_APPLIED',
  INCREMENT_TOMATO: 'INCREMENT_TOMATO',
  LAY_DOWN: 'LAY_DOWN',
  STAND_UP: 'STAND_UP',
  TOGGLE_TOOLTIP: 'TOGGLE_TOOLTIP',
  SET_TOMATO_VISIBILITY: 'SET_TOMATO_VISIBILITY',
  SET_TOMATO_NUMBER: 'SET_TOMATO_NUMBER',
  RESET_MESH_STATE: 'RESET_MESH_STATE',
  PURCHASE_ITEM: 'PURCHASE_ITEM',
  SET_RUG_TEXTURE: 'SET_RUG_TEXTURE',
  SET_WALL_TEXTURE: 'SET_WALL_TEXTURE',
  ADD_PURCHASED_ITEM: 'ADD_PURCHASED_ITEM',
  SWITCH_DOG: 'SWITCH_DOG',
  SET_ANIMATION: 'SET_ANIMATION',
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.JUMP:
      return {
        ...state,
        velocity: JUMP_VELOCITY,
        yPosition: 0,
        jumpCount: 0,
        isJumping: true,
      };
    case ACTIONS.LEAVE:
      return {
        ...state,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        leaving: true,
      };
    case ACTIONS.RESET_LEAVE:
      return { ...state, leaving: false };
    case ACTIONS.BACK:
      return {
        ...state,
        leaving: action.type === ACTIONS.LEAVE,
        comingBack: action.type === ACTIONS.BACK,
        rotation: -Math.PI / 2,
        frameCount: 0,
      };
    case ACTIONS.RESET_BACK:
      return { ...state, comingBack: false };
    case ACTIONS.RESET:
      return { ...initialState, hasReset: true };
    case ACTIONS.RESET_MESH_STATE:
      return {
        ...state,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        isJumping: false,
        leaving: false,
        comingBack: false,
        layingDown: false,
        standingUp: false,
        showTomato: false,
        hasReset: true,
        showTooltip: false,
      };
    case ACTIONS.RESET_APPLIED:
      return { ...state, hasReset: false };
    case ACTIONS.UPDATE_JUMP:
      return { ...state, velocity: action.velocity, yPosition: action.yPosition };
    case ACTIONS.INCREMENT_JUMP_COUNT:
      return { ...state, jumpCount: state.jumpCount + 1 };
    case ACTIONS.START_ACTION:
      return { ...state, [action.action]: true, frameCount: 0 };
    case ACTIONS.INCREMENT_FRAME:
      return { ...state, frameCount: state.frameCount + 1 };
    case ACTIONS.INCREMENT_TOMATO:
      return {
        ...state,
        tomatoNumber: state.tomatoNumber + 1,
      };

    case 'SET_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: action.payload,
      };

    case ACTIONS.LAY_DOWN:
      return {
        ...state,
        ...state,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        leaving: false,
        comingBack: false,
        standingUp: false,
        showTomato: false,
        layingDown: action.payload && action.payload.layingDown !== undefined
          ? action.payload.layingDown : true,
        frameCount: 0,
      };

    case ACTIONS.STAND_UP:
      return {
        ...state,
        standingUp: action.payload && action.payload.standingUp !== undefined
          ? action.payload.standingUp : true,
        frameCount: 0,
      };

    case ACTIONS.TOGGLE_TOOLTIP:
      return {
        ...state,
        showTooltip: action.payload.showTooltip !== undefined
          ? action.payload.showTooltip : !state.showTooltip,
      };
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
    case 'SET_ITEMS':
      return {
        ...state,
        items: action.payload,
      };
    case 'SET_LOGS':
      return {
        ...state,
        logs: action.payload,
      };
    case 'SET_USER_ITEMS':
      return {
        ...state,
        userItems: action.payload,
      };
    case ACTIONS.PURCHASE_ITEM: {
      const item = state.shopItems.find((i) => i.id === action.payload.itemId);
      if (!item || state.tomatoNumber < item.price) {
        console.warn('Not enough tomatoes or item not found!');
        return state; // If the user doesn't have enough tomatoes or item is not found
      }
      return {
        ...state,
        tomatoNumber: state.tomatoNumber - item.price, // Deduct tomatoes
        userItems: [...state.userItems, item], // Add the purchased item
      };
    }
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

    case ACTIONS.ADD_PURCHASED_ITEM:
      return {
        ...state,
        purchasedItems: [...state.purchasedItems, action.payload],
      };
    case ACTIONS.SWITCH_DOG:
      return {
        ...state,
        dogMesh: action.payload,
      };
    case ACTIONS.SET_ANIMATION:
      return {
        ...state,
        currentAnimation: action.payload,
      };
    default:
      return state;
  }
}
