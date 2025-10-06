import { createContext } from 'react';

const TranxContext = createContext();

const getTranx = () => {
  return JSON.parse(localStorage.getItem('tranx')) || null;
};

const setTranx = (tranx) => {
    localStorage.setItem('tranx', JSON.stringify(tranx));
};

// TODO: fix removeTranx to actually remove a specific transaction
const removeTranx = (tranx) => {
  JSON.parse(localStorage.setItem('tranx', tranx));
};

export { TranxContext, getTranx, setTranx, removeTranx };
