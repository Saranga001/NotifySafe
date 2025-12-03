import { useState, useEffect, useCallback } from "react";
import authService from "../api/authService.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    authService
      .getCurrentUser()
      .then((res) => {
        if (!mounted) return;
        setUser(res || null);
      })
      .catch(() => {
        if (!mounted) return;
        setUser(null);
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authService.login(email, password);
    return result;
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    const result = await authService.register(email, password, displayName);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout };
}
