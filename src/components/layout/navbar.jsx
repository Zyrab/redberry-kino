import "../../styles/navbar.css";
import SearchInput from "../ui/search-input";
import Button from "../ui/button";

export default function Navbar() {
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
        <div className="navbar-actions">
          <Button>Sign up</Button>
          <Button variant="secondary">Log in</Button>
        </div>
      </div>
    </nav>
  );
}
