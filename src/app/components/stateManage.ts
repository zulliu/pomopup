export const JUMP_VELOCITY = 0.1;
export const GRAVITY = 0.01;

export const initialState = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  velocity: 0,
  yPosition: 0,
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
  logs: [{
    log_id: 4,
    user_id: 1,
    start_time: '2023-09-16T13:04:32.195Z',
    end_time: null,
    memo: null,
  }],
};

export const ACTIONS = {
  JUMP: 'JUMP',
  LEAVE: 'LEAVE',
  BACK: 'BACK',
  RESET: 'RESET',
  START_ACTION: 'START_ACTION',
  INCREMENT_FRAME: 'INCREMENT_FRAME',
  PICK_TOMATO: 'PICK_TOMATO',
  DROP_TOMATO: 'DROP_TOMATO',
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
};

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.JUMP:
      return {
        ...state, velocity: JUMP_VELOCITY, yPosition: 0, jumpCount: 0,
      };
    case ACTIONS.LEAVE:
    case ACTIONS.BACK:
      return {
        ...state,
        leaving: action.type === ACTIONS.LEAVE,
        comingBack: action.type === ACTIONS.BACK,
        rotation: { y: action.type === ACTIONS.BACK ? -Math.PI / 2 : 0 },
        frameCount: 0,
      };
    case ACTIONS.RESET:
      return { ...initialState, hasReset: true };
    case ACTIONS.RESET_MESH_STATE:
      return {
        ...state,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
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
        user: {
          ...state.user,
          tomatoNumber: state.user.tomatoNumber + 1,
        },
      };
    case 'SET_USER':
      return {
        ...state,
        user: {
          ...state.user,
          id: action.payload.id,
          username: action.payload.username,
          tomatoNumber: action.payload.tomatoNumber,
        },
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
        user: {
          ...state.user,
          tomatoNumber: action.payload.tomatoNumber,
        },
      };
    case 'SET_LOGS':
      return {
        ...state,
        logs: action.payload,
      };
    default:
      return state;
  }
}
