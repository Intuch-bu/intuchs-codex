import { createContext, useContext, useState } from "react";
import {
  getCurrentUser,
  loginUser as login,
  logoutUser,
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loginUser,
        logout,
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
