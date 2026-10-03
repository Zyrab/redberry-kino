import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setLoading(false);
      return;
    }
    api("/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      setUser(null);
      openAuthModal("login");
    };

    window.addEventListener("auth-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth-unauthorized", handleUnauthorized);
  }, []);

  function finishAuth({ token, user }) {
    localStorage.setItem("token", token);
    setUser(user);
    const replay = modal?.onSuccess;
    setModal(null);
    replay?.(); // continue the protected action, no second click
  }

  async function login(credentials) {
    const res = await api("/login", { method: "POST", body: credentials });
    finishAuth(res.data);
  }

  async function register(formData) {
    const res = await api("/register", { method: "POST", body: formData });
    finishAuth(res.data);
  }

  async function logout() {
    await api("/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("token");
    setUser(null);
  }

  const openAuthModal = (mode = "login", onSuccess) => {
    console.log("opened");
    setModal({ mode, onSuccess });
  };
  const closeAuthModal = useCallback(() => setModal(null), []);
  const switchMode = (mode) => setModal((m) => (m ? { ...m, mode } : m));

  return (
    <AuthContext.Provider value={{ user, loading, modal, login, register, logout, openAuthModal, closeAuthModal, switchMode }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
