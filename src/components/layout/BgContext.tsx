import { createContext, useContext } from 'react';

type BgContext = 'white' | 'grey' | 'black' | undefined;

const BgContext = createContext<BgContext>(undefined);

export function useBgContext() {
  return useContext(BgContext);
}

export const BgProvider = BgContext.Provider;
