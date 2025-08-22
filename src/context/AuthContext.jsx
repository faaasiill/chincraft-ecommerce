import { createContext, useContext, useEffect, useState } from "react";
import {
  logout,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  subscribeToAuthChanges,
  resetPassword,
} from "../api/firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((authData) => {
      setUser(authData.user);
      setRole(authData.role);
      setError(authData.error || null);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    role,
    loading,
    error,
    googleLogin: signInWithGoogle,
    emailSignup: signUpWithEmail,
    emailLogin: signInWithEmail,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
