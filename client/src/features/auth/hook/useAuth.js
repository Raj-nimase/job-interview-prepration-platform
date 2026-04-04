import { useContext, useCallback } from "react";
import { AuthContext } from "../context/auth.context";
import { login, getMe, logout, register } from "../services/auth.api";
import { toast } from "react-hot-toast";

export const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  /**
   * @description Logs in a user with the provided credentials.
   * @param {Object} payload - The login credentials (e.g., email and password).
   * @returns {Promise<Object>} The response from the login API, including user data.
   * @throws Will log an error if the login process fails.
   */
  const loginUser = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const response = await login(payload);
        setUser(response.user);
        if (response.user?.id) {
          localStorage.setItem("userId", response.user.id);
        }
        return response;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading],
  );

  /**
   * @description Registers a new user with the provided information.
   * @param {Object} payload - The registration information (e.g., name, email, password).
   * @returns {Promise<void>} Resolves when the registration process is complete.
   * @throws Will log an error if the registration process fails.
   */
  const registerUser = useCallback(
    async (payload) => {
      setLoading(true);
      try {
        const response = await register(payload);
        setUser(response.user);
        if (response.user?.id) {
          localStorage.setItem("userId", response.user.id);
        }
        return response;
      } catch (error) {
        console.error("Register error:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading],
  );

  /**
   * @description Fetches the current authenticated user's information.
   * @returns {Promise<Object|null>} The current user's information, or null if not authenticated.
   * @throws Will log an error if the fetch process fails (except for 401 Unauthorized).
   */
  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMe();
      setUser(response.user);
      if (response.user?.id) {
        localStorage.setItem("userId", response.user.id);
      }
      return response.user;
    } catch (error) {
      if (error?.status && error.status !== 401) {
        console.error("Fetch user error:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  /**
   * @description Logs out the current user.
   * @returns {Promise<void>} Resolves when the logout process is complete.
   * @throws Will log an error if the logout process fails.
   */
  const logoutUser = useCallback(async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      localStorage.removeItem("userId");
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
