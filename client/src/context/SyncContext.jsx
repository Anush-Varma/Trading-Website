import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";

const SyncContext = createContext();

export function SyncProvider({ children }) {
  const [isSynced, setIsSynced] = useState(false);
  const [globalSelectedButton, setGlobalSelectedButton] = useState(2);

  // Memoize callbacks to prevent recreating them on every render
  const updateSelectedButton = useCallback(
    (buttonIndex) => {
      if (isSynced) {
        setGlobalSelectedButton(buttonIndex);
      }
    },
    [isSynced]
  );

  const toggleSync = useCallback((value) => {
    setIsSynced(value);
  }, []);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      isSynced,
      globalSelectedButton,
      updateSelectedButton,
      toggleSync,
    }),
    [isSynced, globalSelectedButton, updateSelectedButton, toggleSync]
  );

  return (
    <SyncContext.Provider value={contextValue}>{children}</SyncContext.Provider>
  );
}

export function useSync() {
  return useContext(SyncContext);
}
