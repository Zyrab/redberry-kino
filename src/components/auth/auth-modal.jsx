import { useAuth } from "../../context/auth-context";
import Modal from "../ui/modal";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import "../../styles/auth.css";

export default function AuthModal() {
  const { modal, closeAuthModal } = useAuth();
  if (!modal) return null;

  return (
    <Modal onClose={closeAuthModal} className={`auth-modal auth-modal-${modal.mode}`}>
      {modal.mode === "login" ? <LoginForm /> : <RegisterForm />}
    </Modal>
  );
}
