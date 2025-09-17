import { useContext } from 'react';
import { TranxContext } from './TranxContext';

const useTranx = () => {
  const context = useContext(TranxContext);
  if (!context) {
    throw new Error('useTranx must be used within an AuthProvider');
  }
  return context;
};

export default useTranx;
