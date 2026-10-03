import Navbar from "./navbar";
import AuthModal from "../auth/auth-modal";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <AuthModal />
    </>
  );
}
