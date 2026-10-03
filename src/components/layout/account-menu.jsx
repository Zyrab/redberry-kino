import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/auth-context";
import Icon from "../ui/icon";
import "../../styles/account-menu.css";

function Avatar({ user }) {
  const initials = (user.fullName || user.username)
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span className="account-avatar">
      {user.avatar ? <img src={user.avatar} alt="" /> : <span className="text-label-s">{initials}</span>}
      <span className={`account-dot ${user.profileComplete ? "is-complete" : "is-incomplete"}`} />
    </span>
  );
}

export default function AccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const firstName = (user.fullName || user.username).split(" ")[0];

  return (
    <div className="account-menu" ref={ref}>
      <button className="account-trigger" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Avatar user={user} />
        <span className="text-label-m">{firstName}</span>
        <Icon name="arrow" className={`account-chevron ${open ? "is-open" : ""}`} />
      </button>

      {open && (
        <div className="account-dropdown">
          <div className="account-header">
            <Avatar user={user} />
            <div>
              <p className="text-label-m">{user.fullName || user.username}</p>
              <p className="text-body-s account-email">{user.email}</p>
            </div>
          </div>

          {user.profileComplete ? (
            <p className="account-status is-complete text-label-m">
              Profile Complete <Icon name="check" />
            </p>
          ) : (
            <div className="account-status is-incomplete">
              <p className="text-label-m">Profile incomplete</p>
              <p className="text-body-s description">Please complete your profile to enable booking</p>
            </div>
          )}

          <Link to="/my-profile?tab=profile" className="account-item text-label-m" onClick={() => setOpen(false)}>
            <Icon name="user" /> My Profile
          </Link>
          <Link to="/my-profile?tab=tickets" className="account-item text-label-m" onClick={() => setOpen(false)}>
            <Icon name="ticket" /> My Tickets
          </Link>
          <hr className="account-divider" />
          <button className="account-item account-logout text-label-m" onClick={logout}>
            <Icon name="logOut" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
