import React, { createContext, useContext, useCallback } from 'react';
import ToastContainer from '../components/ToastContainer';

interface ToastContextData {
  addToast(): void;
  removeToast(): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const addToast = useCallback(() => {
    console.log('Add Toast');
  }, []);
  const removeToast = useCallback(() => {
    console.log('Remove toast');
  }, []);
  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
      }}
    >
      <ToastContainer />
      {children}
    </ToastContext.Provider>
  );
};

function useToast(): ToastContextData {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');

  return context;
}

export { ToastProvider, useToast };
