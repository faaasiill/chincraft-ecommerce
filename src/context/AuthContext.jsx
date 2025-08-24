import { createContext, useContext, useEffect, useState } from "react";
import {
  logout,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  subscribeToAuthChanges,
  resetPassword,
} from "../api/firebase/auth";
import { userService } from "../api/firebase/firebaseService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Listen to auth changes and fetch user role from Firestore
useEffect(() => {
  const unsubscribe = subscribeToAuthChanges(async (authData) => {
    try {
      setUser(authData.user);
      setError(authData.error || null);

      if (authData.user) {
        const userData = await userService.getUserById(authData.user.uid);
        setRole(userData?.role || 'user');
        if (userData?.blocked) {
          console.log('User blocked, logging out');
          setError('Your account has been blocked.');
          await logout();
        }
      } else {
        setRole(null);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication error');
      setRole('user');
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  });
  return () => unsubscribe();
}, []);

  // Enhanced login functions with better error handling
  const enhancedEmailLogin = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithEmail(email, password);
      return result;
    } catch (err) {
      console.error('Email login error:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enhancedGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithGoogle();
      return result;
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enhancedEmailSignup = async (email, password, additionalData = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signUpWithEmail(email, password);
      return result;
    } catch (err) {
      console.error('Email signup error:', err);
      setError(err.message || 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enhancedLogout = async () => {
    try {
      setLoading(true);
      setError(null);
      await logout();
      setUser(null);
      setRole(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message || 'Failed to logout');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const enhancedResetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await resetPassword(email);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to send password reset email');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      const userData = await userService.getUserById(user.uid);
      if (userData) {
        setRole(userData.role || 'user');
        
        // Check if user is blocked
        if (userData.blocked) {
          setError('Your account has been blocked. Please contact support.');
          await logout();
          return;
        }
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
    }
  };

  const value = {
    user,
    role,
    loading,
    error,
    initializing,
    googleLogin: enhancedGoogleLogin,
    emailSignup: enhancedEmailSignup,
    emailLogin: enhancedEmailLogin,
    logout: enhancedLogout,
    resetPassword: enhancedResetPassword,
    clearError,
    refreshUserData,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    isAuthenticated: !!user && !loading && !initializing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};