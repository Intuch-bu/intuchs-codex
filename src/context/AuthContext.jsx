import { createContext, useContext, useState } from "react";
import {
  getCurrentUser,
  loginUser as login,
  logoutUser,
  resetUserPassword,
  updateUserProfile,
} from "@/lib/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const loginUser = (email, password) => {
    const loggedInUser = login(email, password);

    if (loggedInUser) {
      setUser(loggedInUser);
    }

    return loggedInUser;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) {
      return { ok: false, error: "Not logged in" };
    }

    const result = updateUserProfile(user.id, updates);

    if (result.ok) {
      setUser(result.user);
    }

    return result;
  };

  const resetPassword = (currentPassword, newPassword) => {
    if (!user) {
      return { ok: false, error: "Not logged in" };
    }

    const result = resetUserPassword(user.id, currentPassword, newPassword);

    if (result.ok) {
      setUser(result.user);
    }

    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loginUser,
        logout,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
