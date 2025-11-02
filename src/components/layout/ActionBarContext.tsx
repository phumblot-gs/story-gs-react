import { createContext, useContext, useState, useCallback, useRef } from 'react';

export interface ActionBarState {
  selectedCount: number;
  translationKey?: string;
  onDeselectAll?: () => void;
  instanceId: string;
}

interface ActionBarContextValue {
  registerActionBar: (instanceId: string, state: Omit<ActionBarState, 'instanceId'>) => void;
  unregisterActionBar: (instanceId: string) => void;
  updateActionBar: (instanceId: string, state: Partial<Omit<ActionBarState, 'instanceId'>>) => void;
  getActiveActionBar: () => ActionBarState | null;
}

const ActionBarContext = createContext<ActionBarContextValue | null>(null);

export function useActionBarContext() {
  const context = useContext(ActionBarContext);
  if (!context) {
    throw new Error('useActionBarContext must be used within ActionBarProvider');
  }
  return context;
}

/**
 * Provider pour gérer l'état global des ActionBar
 * 
 * Permet de :
 * - Enregistrer/désenregistrer des ActionBar
 * - Mettre à jour leur état (compteur, traduction, etc.)
 * - Gérer la priorité : la dernière ActionBar modifiée devient active
 */
export function ActionBarProvider({ children }: { children: React.ReactNode }) {
  const [actionBars, setActionBars] = useState<Map<string, ActionBarState>>(new Map());
  const activeInstanceIdRef = useRef<string | null>(null);

  const registerActionBar = useCallback((instanceId: string, state: Omit<ActionBarState, 'instanceId'>) => {
    setActionBars((prev) => {
      const next = new Map(prev);
      next.set(instanceId, { ...state, instanceId });
      activeInstanceIdRef.current = instanceId;
      return next;
    });
  }, []);

  const unregisterActionBar = useCallback((instanceId: string) => {
    setActionBars((prev) => {
      const next = new Map(prev);
      next.delete(instanceId);
      if (activeInstanceIdRef.current === instanceId) {
        // Trouver la dernière ActionBar modifiée
        const entries = Array.from(next.entries());
        activeInstanceIdRef.current = entries.length > 0 ? entries[entries.length - 1][0] : null;
      }
      return next;
    });
  }, []);

  const updateActionBar = useCallback((instanceId: string, state: Partial<Omit<ActionBarState, 'instanceId'>>) => {
    setActionBars((prev) => {
      const next = new Map(prev);
      const current = next.get(instanceId);
      if (current) {
        next.set(instanceId, { ...current, ...state });
        activeInstanceIdRef.current = instanceId;
      }
      return next;
    });
  }, []);

  const getActiveActionBar = useCallback((): ActionBarState | null => {
    const activeId = activeInstanceIdRef.current;
    if (!activeId) return null;
    return actionBars.get(activeId) || null;
  }, [actionBars]);

  return (
    <ActionBarContext.Provider
      value={{
        registerActionBar,
        unregisterActionBar,
        updateActionBar,
        getActiveActionBar,
      }}
    >
      {children}
    </ActionBarContext.Provider>
  );
}

