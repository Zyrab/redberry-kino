import { useEffect } from "react";
import { useSearchParams } from "react-router";

import { useAuth } from "../../context/auth-context";
import useTickets from "../../hooks/use-tickets";

import "../../styles/my-profile.css";

import Tabs from "../../components/ui/tabs";

import PersonalInfo from "./personal-info";
import MyTickets from "./my-tickets";

const TAB_IDS = ["profile", "tickets"];

export default function MyProfile() {
  const { user, loading, openAuthModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tickets = useTickets({ enabled: Boolean(user) });

  const param = searchParams.get("tab");
  const tab = TAB_IDS.includes(param) ? param : "profile";

  useEffect(() => {
    if (!loading && !user) openAuthModal("login");
  }, [loading, user]);

  if (loading || !user) return null;

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
            { id: "tickets", label: "My Tickets", count: tickets.loading ? undefined : tickets.upcoming.length },
          ]}
        />
      </div>

      {tab === "profile" && <PersonalInfo />}
      {tab === "tickets" && (
        <MyTickets upcoming={tickets.upcoming} past={tickets.past} loading={tickets.loading} error={tickets.error} onUpdate={tickets.updateOrder} />
      )}
    </section>
  );
}
