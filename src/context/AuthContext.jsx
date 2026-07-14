import { useState } from "react";
import {
  getCurrentUser,
  loginUser as login,
  logoutUser,
  registerUser as register,
  resetUserPassword,
  updateUserProfile,
} from "@/lib/mockAuth";
import { AuthContext } from "@/context/AuthContextValue";

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

  const registerUser = (newUser) => {
    return register(newUser);
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
        registerUser,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

