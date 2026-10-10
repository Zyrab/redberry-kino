import { useState } from "react";

import Tabs from "../../components/ui/tabs";

import TicketCard from "./ticket-card";

export default function MyTickets({ upcoming, past, loading, error, onUpdate }) {
  const [filter, setFilter] = useState("upcoming");
  const orders = filter === "upcoming" ? upcoming : past;

  return (
    <div className="my-tickets">
      <Tabs
        variant="tickets"
        active={filter}
        onChange={setFilter}
        tabs={[
          { id: "upcoming", label: "Upcoming", count: loading ? undefined : upcoming.length },
          { id: "past", label: "Past", count: loading ? undefined : past.length },
        ]}
      />

      {loading ? (
        <p className="text-body-s">Loading tickets...</p>
      ) : error ? (
        <p className="text-body-s ticket-error" role="alert">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-body-s">No {filter} tickets found.</p>
      ) : (
        <div className="tickets-list">
          {orders.map((order) => (
            <TicketCard key={order.id} order={order} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
