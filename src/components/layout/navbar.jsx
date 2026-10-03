import "../../styles/navbar.css";
import SearchInput from "../ui/search-input";
import Button from "../ui/button";
import AccountMenu from "./account-menu";

import { useAuth } from "../../context/auth-context";

export default function Navbar() {
  const { openAuthModal, loading, user } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="text-h1 navbar-logo">
          KINO <span>XII</span>
        </h1>
        <p className="text-overline">SESSIONS</p>
      </div>
      <div className="navbar-right">
        <SearchInput />
        {loading ? null : user ? (
          <AccountMenu />
        ) : (
          <div className="navbar-actions">
            <Button onClick={() => openAuthModal("register")}>Sign up</Button>
            <Button variant="secondary" onClick={() => openAuthModal("login")}>
              Log in
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}
