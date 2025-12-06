import { useState, useEffect, useCallback } from "react";
import authService from "../api/authService.js";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((res) => {
        setUser(res || null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authService
      .login(email, password)
      .then((res) => res)
      .catch((err) => {
        return { success: false, error: err };
      });

    return { success: true, data: result };
  }, []);

  const signup = useCallback(async (email, password, name) => {
    const result = await authService
      .register(email, password, name)
      .then((res) => res)
      .catch((err) => {
        return { success: false, error: err };
      });
    return { success: true, data: result };
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  return { user, loading, login, signup, logout };
}
