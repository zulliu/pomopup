import React, {
  createContext, useContext, useReducer, useState,
} from 'react';
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { reducer, initialState } from './components/stateManage';

const GlobalStateContext = createContext();
const GlobalDispatchContext = createContext();
const SceneHandlersContext = createContext();
const SetSceneHandlersContext = createContext();
const UserDataContext = createContext();

function getUserDataFromToken() {
  const token = Cookies.get('token');
  if (!token) return null;

  const decoded = jwt.decode(token);
  return decoded || null;
}

const userDataFromToken = getUserDataFromToken();
const itemsFromCookie = Cookies.get('items') ? JSON.parse(Cookies.get('items')) : [];
const userItemsFromCookie = Cookies.get('userItems') ? JSON.parse(Cookies.get('userItems')) : [];

const initialGlobalState = {

  user: {
    id: userDataFromToken?.user_id || null,
    username: userDataFromToken?.username || null,
    tomatoNumber: userDataFromToken?.tomato_number || 0,
  },
  items: itemsFromCookie,
  userItems: userItemsFromCookie,
  ...initialState,
};

function GlobalProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialGlobalState);
  const [userData, setUserData] = useState(getUserDataFromToken());
  const [sceneHandlers, setSceneHandlers] = useState({
    jump: null,
    leave: null,
    back: null,
    reset: null,
    toggleTomato: null,
  });

  return (
    <UserDataContext.Provider value={userData}>
      <GlobalStateContext.Provider value={state}>
        <GlobalDispatchContext.Provider value={dispatch}>
          <SceneHandlersContext.Provider value={sceneHandlers}>
            <SetSceneHandlersContext.Provider value={setSceneHandlers}>
              {children}
            </SetSceneHandlersContext.Provider>
          </SceneHandlersContext.Provider>
        </GlobalDispatchContext.Provider>
      </GlobalStateContext.Provider>
    </UserDataContext.Provider>

  );
}

// Use these hooks in your components
const useGlobalState = () => useContext(GlobalStateContext);
const useGlobalDispatch = () => useContext(GlobalDispatchContext);
const useSceneHandlers = () => useContext(SceneHandlersContext);
const useSetSceneHandlers = () => useContext(SetSceneHandlersContext);
const useUserData = () => useContext(UserDataContext);

export {
  GlobalProvider,
  useGlobalState,
  useGlobalDispatch,
  useSceneHandlers,
  useSetSceneHandlers,
  useUserData,
};
