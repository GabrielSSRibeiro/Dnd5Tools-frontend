import { createContext, useContext } from "react";

export const myContext = createContext({});

export function ContextProvider({ children }) {
  const values = {};

  return <myContext.Provider value={values}>{children}</myContext.Provider>;
}

export function useMyContext() {
  const context = useContext(myContext);
  return context;
}
