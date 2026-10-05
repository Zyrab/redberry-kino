import "../../styles/navbar.css";
import SearchInput from "../search-input/search-input";
import Button from "../ui/button";
import AccountMenu from "./account-menu";

import { useAuth } from "../../context/auth-context";
import { Link } from "react-router";

export default function Navbar() {
  const { openAuthModal, loading, user } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="text-h1 navbar-logo">
          <Link to="/">
            KINO <span>XII</span>
          </Link>
        </h1>
        <Link className="text-overline navbar-link" to="/sessions">
          SESSIONS
        </Link>
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
