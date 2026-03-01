import { createContext, useState, useEffect } from "react";
import { getMe } from "../services/auth.api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // attempt to restore session when provider mounts
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const { user } = await getMe();
        setUser(user);
      } catch (err) {
        if (err?.status && err.status !== 401) {
          console.error("Auth init error:", err);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
