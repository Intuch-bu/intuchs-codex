import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { fetchUserProfile } from "@/api/blogApi";
import { AuthContext } from "@/context/AuthContextValue";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    try {
      const res = await fetchUserProfile();
      return res.data || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    // Check initial session
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const profile = await loadUserProfile();
        setUser({
          ...data.session.user,
          ...profile,
          email: data.session.user.email,
        });
      }
      setIsLoading(false);
    };

    initSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const profile = await loadUserProfile();
          setUser({
            ...session.user,
            ...profile,
            email: session.user.email,
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        } else if (event === "USER_UPDATED" && session?.user) {
          const profile = await loadUserProfile();
          setUser({
            ...session.user,
            ...profile,
            email: session.user.email,
          });
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [loadUserProfile]);

  const loginUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const profile = await loadUserProfile();
    const mergedUser = {
      ...data.user,
      ...profile,
      email: data.user.email,
    };
    setUser(mergedUser);
    return mergedUser;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  const registerUser = async ({ name, username, email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  };

  const updateProfile = async (updates) => {
    if (!user) {
      return { ok: false, error: "Not logged in" };
    }

    try {
      const res = await import("@/api/blogApi").then((mod) =>
        mod.updateUserProfile({
          name: updates.name,
          username: updates.username,
          profile_pic: updates.profileImage || updates.profile_pic || "",
          bio: updates.bio || "",
          bio_extra: updates.bio_extra || "",
        })
      );

      if (res.data) {
        setUser((prev) => ({
          ...prev,
          ...res.data,
        }));
      }

      return { ok: true, user: res.data };
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to update profile";
      const field = err.response?.data?.field || null;
      return { ok: false, error: msg, field };
    }
  };

  const resetPassword = async (currentPassword, newPassword) => {
    if (!user) {
      return { ok: false, error: "Not logged in" };
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { ok: false, error: error.message };
      }

      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || "Failed to reset password" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
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
