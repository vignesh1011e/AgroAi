import { useEffect, useState } from "react";
import API from "../services/api";
import { AuthContext } from "./AuthContext";

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("agro_user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("agro_user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("agro_token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/auth/me");

        const currentUser = response.data.user;

        setUser(currentUser);

        localStorage.setItem(
          "agro_user",
          JSON.stringify(currentUser)
        );
      } catch {
        localStorage.removeItem("agro_token");
        localStorage.removeItem("agro_user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    const response = await API.post(
      "/auth/register",
      userData
    );

    const currentUser = response.data.user;

    localStorage.setItem(
      "agro_token",
      response.data.token
    );

    localStorage.setItem(
      "agro_user",
      JSON.stringify(currentUser)
    );

    setUser(currentUser);

    return response.data;
  };

  const login = async (email, password) => {
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    const currentUser = response.data.user;

    localStorage.setItem(
      "agro_token",
      response.data.token
    );

    localStorage.setItem(
      "agro_user",
      JSON.stringify(currentUser)
    );

    setUser(currentUser);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("agro_token");
    localStorage.removeItem("agro_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};