import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { useAuth } from "../../context/auth-context";

import "../../styles/my-profile.css";

import Tabs from "../../components/ui/tabs";

import PersonalInfo from "./personal-info";

const TAB_IDS = ["profile", "tickets"];

export default function MyProfile() {
  const { user, loading, openAuthModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("tab");
  const tab = TAB_IDS.includes(param) ? param : "profile";

  useEffect(() => {
    if (!loading && !user) openAuthModal("login");
  }, [loading, user]);

  if (loading || !user) return null;

  const upcomingCount = 2;

  return (
    <section className="my-profile">
      <div className="my-profile-header">
        <h1 className="text-h1">My Profile</h1>
        <Tabs
          variant="profile"
          active={tab}
          onChange={(id) => setSearchParams({ tab: id })}
          tabs={[
            { id: "profile", label: "Personal Information" },
            { id: "tickets", label: "My Tickets", count: upcomingCount },
          ]}
        />
      </div>

      {tab === "profile" && <PersonalInfo />}
      {tab === "tickets" && <p>Tickets tab coming next</p>}
    </section>
  );
}
