import { useContext, useCallback } from "react";
import { AuthContext } from "../context/auth.context";
import { login, getMe, logout, register } from "../services/auth.api";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const loginUser = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const response = await login(payload);
        setUser(response.user);
        toast.success("Logged in successfully");
        return response;
      } catch (error) {
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading],
  );

  const registerUser = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const response = await register(payload);
        setUser(response.user);
      } catch (error) {
        console.error("Register error:", error);
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading],
  );

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMe();
      setUser(response.user);
      return response.user;
    } catch (error) {
      if (error?.status && error.status !== 401) {
        console.error("Fetch user error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  const logoutUser = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return {
    loginUser,
    registerUser,
    fetchCurrentUser,
    logoutUser,
    user,
    loading,
  };
};
