"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import {
  findUserById,
  getSessionUserId,
  mockLogIn,
  mockLogOut,
  mockSignUp,
} from "@/features/auth/lib/mockAuthStore";

/**
 * Public auth interface. A real Cognito-backed AuthProvider can replace the
 * internals of this file without any consuming component changing —
 * signUp/logIn/logOut/currentUser is the entire contract.
 */
export interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // MOCK: restores session from localStorage (an external system, so this
    // effect legitimately syncs React state from it on mount). Replace with
    // a Cognito session/token check in Phase 2.
    const sessionUserId = getSessionUserId();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, not derived render state
    setCurrentUser(sessionUserId ? findUserById(sessionUserId) : null);
    setIsLoading(false);
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      // MOCK: replace with Cognito signUp() in Phase 2.
      const user = mockSignUp(name, email, password);
      setCurrentUser(user);
    },
    [],
  );

  const logIn = useCallback(async (email: string, password: string) => {
    // MOCK: replace with Cognito initiateAuth()/signIn() in Phase 2.
    const user = mockLogIn(email, password);
    setCurrentUser(user);
  }, []);

  const logOut = useCallback(() => {
    // MOCK: replace with Cognito signOut() in Phase 2.
    mockLogOut();
    setCurrentUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ currentUser, isLoading, signUp, logIn, logOut }),
    [currentUser, isLoading, signUp, logIn, logOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
