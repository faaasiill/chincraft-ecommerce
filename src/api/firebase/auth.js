import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Google provider
const googleProvider = new GoogleAuthProvider();

// Google Login
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Ensure user doc exists and set role only if not already set
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const updates = {};
    if (!userSnap.exists()) {
      updates.email = user.email;
      updates.createdAt = new Date();
    }
    if (!userSnap.exists() || !userSnap.data()?.role) {
      updates.role = "user";
    }
    if (Object.keys(updates).length > 0) {
      await setDoc(userRef, updates, { merge: true });
    }
    return { user, role: userSnap.exists() && userSnap.data()?.role ? userSnap.data().role : "user" };
  } catch (error) {
    console.error("Google Sign-In Error:", error.message);
    throw new Error(`Google Sign-in failed: ${error.message}`);
  }
};

// Email + Password Signup
export const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    // Create user doc in Firestore, set role only if not already set (though for new signup, it shouldn't exist)
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const updates = {};
    if (!userSnap.exists()) {
      updates.email = email;
      updates.createdAt = new Date();
    }
    if (!userSnap.exists() || !userSnap.data()?.role) {
      updates.role = "user";
    }
    if (Object.keys(updates).length > 0) {
      await setDoc(userRef, updates, { merge: true });
    }
    return { user, role: userSnap.exists() && userSnap.data()?.role ? userSnap.data().role : "user" };
  } catch (error) {
    console.error("Signup Error", error.message);
    throw new Error(`Signup failed: ${error.message}`);
  }
};

// Email + Password Login
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    // Fetch user role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const role = userDoc.exists() ? userDoc.data().role || "user" : "user";
    return { user, role };
  } catch (error) {
    console.error("Login Error", error.message);
    throw new Error(`Login failed: ${error.message}`);
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Logout Error:", error.message);
    throw new Error(`Logout failed: ${error.message}`);
  }
};

// Listen to Auth State (user logged in/out)
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const role = userDoc.exists() ? userDoc.data().role || userDoc.data().role : "user";
        callback({ user: currentUser, role });
      } catch (error) {
        console.error("Auth State Error: ", error.message);
        callback({
          user: currentUser,
          role: null,
          error: `Failed to fetch role: ${error.message}`,
        });
      }
    } else {
      callback({ user: null, role: null });
    }
  });
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent successfully" };
  } catch (error) {
    console.error("Password reset Error", error.message);
    throw new Error(`Password reset failed: ${error.message}`);
  }
};