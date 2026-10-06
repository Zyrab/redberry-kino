import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // if token exists gets current user
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

  // trigered when token expires, shows login modal and removes old token
  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      setUser(null);
      openAuthModal("login");
    };

    window.addEventListener("auth-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth-unauthorized", handleUnauthorized);
  }, []);

  // when loged in after protected action, reaplays the action
  function finishAuth({ token, user }) {
    localStorage.setItem("token", token);
    setUser(user);
    const replay = modal?.onSuccess;
    setModal(null);
    replay?.();
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

  //  mode = login | register,
  // onSuccess to navigate on guarded routes or replay an action that requires user loged in
  const openAuthModal = (mode = "login", onSuccess) => setModal({ mode, onSuccess });
  const closeAuthModal = useCallback(() => setModal(null), []);
  const switchMode = (mode) => setModal((m) => (m ? { ...m, mode } : m));
  const requireAuth = () => (action) => (user ? action() : openAuthModal("login", action));

  const updateUser = setUser;
  return (
    <AuthContext.Provider
      value={{ user, updateUser, loading, modal, login, register, logout, openAuthModal, closeAuthModal, switchMode, requireAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
