import Navbar from "./navbar";
import AuthModal from "../auth/auth-modal";
import { Outlet } from "react-router";
import Footer from "./footer";

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
}
