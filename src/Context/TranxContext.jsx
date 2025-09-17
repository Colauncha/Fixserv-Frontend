import { useReducer, useEffect } from 'react';
import {
  getTranx,
  setTranx,
  removeTranx,
  TranxContext,
} from '../Auth/tranxStorage';

const initialState = {};

const tranxReducer = (state, action) => {
  switch (action.type) {
    case 'ADD':
      return { isAuthenticated: true, token: action.payload };
    case 'REMOVE':
      return { isAuthenticated: false, token: null };
    default:
      return state;
  }
};

const loadTranxState = () => {
  try {
    const stored = getTranx();
    return stored || initialState;
  } catch {
    return initialState;
  }
};

export const TranxProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    tranxReducer,
    initialState,
    loadTranxState
  );

  useEffect(() => {
    setTranx(state);
  }, [state]);

  const addTranx = (token) => {
    dispatch({ type: 'ADD', payload: token });
  };

  const deleteTranx = () => {
    removeTranx();
    dispatch({ type: 'REMOVE' });
  };

  return (
    <TranxContext.Provider value={{ state, addTranx, deleteTranx }}>
      {children}
    </TranxContext.Provider>
  );
};

export default TranxProvider;
