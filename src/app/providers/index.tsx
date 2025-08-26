import React from 'react';
import { StoreProvider } from './StoreProvider';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
};