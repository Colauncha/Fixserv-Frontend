import { createContext } from 'react';

const TranxContext = createContext();

const getTranx = () => {
  return JSON.parse(localStorage.getItem('tranx')) || null;
};

const setTranx = (tranx) => {
  let existing = getTranx() || [];
  if (
    !existing.some((item) => JSON.stringify(item) === JSON.stringify(tranx))
  ) {
    existing.push(tranx);
    localStorage.setItem('tranx', JSON.stringify(existing));
  }
};

// TODO: fix removeTranx to actually remove a specific transaction
const removeTranx = (tranx) => {
  JSON.parse(localStorage.setItem('tranx', tranx));
};

export { TranxContext, getTranx, setTranx, removeTranx };
