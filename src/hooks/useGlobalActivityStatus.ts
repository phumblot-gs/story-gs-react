
import { useState, useEffect } from 'react';

export const useGlobalActivityStatus = () => {
  const [pendingRequests, setPendingRequests] = useState<number>(0);
  const [isIdle, setIsIdle] = useState<boolean>(false);

  const startRequest = () => {
    setPendingRequests(prev => prev + 1);
    setIsIdle(true);
  };

  const endRequest = () => {
    setPendingRequests(prev => Math.max(0, prev - 1));
  };

  // Mettre à jour l'état isIdle quand le nombre de requêtes change
  useEffect(() => {
    if (pendingRequests === 0) {
      setIsIdle(false);
    } else {
      setIsIdle(true);
    }
  }, [pendingRequests]);

  return { isIdle, startRequest, endRequest };
};
