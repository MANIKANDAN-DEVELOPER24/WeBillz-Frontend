
import { useState, useEffect } from "react";
import api from "../api/api"; // axios client we made

export default function useSession() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // check session on mount (verify token)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      api.get("/users/me/")  
        .then((res) => {
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        })
        .catch(() => {
          logout(); // invalid or expired token
        });
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login/", { username, password });

      // SimpleJWT default returns: { access, refresh }
      const { access, refresh, user } = res.data;

      localStorage.setItem("token", access);   // access token for auth
      localStorage.setItem("refresh", refresh); // keep refresh if needed
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      } else {
        setUser(null);
      }

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.detail || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, login, logout };
}
