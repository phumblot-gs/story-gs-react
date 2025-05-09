
import React, { createContext, useContext } from 'react';
import { useGlobalActivityStatus } from '@/hooks/useGlobalActivityStatus';

interface ActivityStatusContextType {
  isIdle: boolean;
  hasActivity: boolean;
  startRequest: () => void;
  endRequest: () => void;
  setActivityStatus: (status: boolean) => void;
}

const ActivityStatusContext = createContext<ActivityStatusContextType>({
  isIdle: false,
  hasActivity: false,
  startRequest: () => {},
  endRequest: () => {},
  setActivityStatus: () => {},
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
