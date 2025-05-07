
import React, { createContext, useContext } from 'react';
import { useGlobalActivityStatus } from '@/hooks/useGlobalActivityStatus';

interface ActivityStatusContextType {
  isIdle: boolean;
  startRequest: () => void;
  endRequest: () => void;
}

const ActivityStatusContext = createContext<ActivityStatusContextType>({
  isIdle: false,
  startRequest: () => {},
  endRequest: () => {},
});

export const ActivityStatusProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const activityStatus = useGlobalActivityStatus();

  return (
    <ActivityStatusContext.Provider value={activityStatus}>
      {children}
    </ActivityStatusContext.Provider>
  );
};

export const useActivityStatusContext = () => useContext(ActivityStatusContext);
