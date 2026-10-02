import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createUserAccount, getCurrentUser, signInUser, signOutUser } from "./auth";

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCurrentUser()
      .then((currentUser) => { if (active) setUser(currentUser); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const createAccount = useCallback(async (form) => {
    const currentUser = await createUserAccount(form);
    setUser(currentUser);
    return currentUser;
  }, []);

  const signIn = useCallback(async (form) => {
    const currentUser = await signInUser(form);
    setUser(currentUser);
    return currentUser;
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isLoading, isLoggedIn: Boolean(user), createAccount, signIn, signOut }), [user, isLoading, createAccount, signIn, signOut]);
  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within GlobalProvider.");
  return context;
}
