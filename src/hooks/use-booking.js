import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../context/auth-context";
import { useFilterOptions } from "../context/filter-options-context";

import { holdSeats, releaseHold, submitOrder } from "../utils/booking-api";
import { BOOKING_MSG, getBlocker } from "../utils/booking";
import { apiMessage } from "../utils/validators";

import useBookTickets from "./use-book-tickets";
import useSeatSelection from "./use-seat-selection";

export default function useBooking({ sessionId, onClose }) {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const options = useFilterOptions();
  const { ticketTypes = [], maxSeatsPerOrder = 3 } = options;
  const { session, seats, loading, error, refetchSeats } = useBookTickets(sessionId);
  const selection = useSeatSelection({ session, ticketTypes, maxSeats: maxSeatsPerOrder });

  const [step, setStep] = useState("seats"); // seats | checkout | confirmed
  const [hold, setHold] = useState(null); // { holdId, expiresAt (ms), subtotal }
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState(null);
  const [holding, setHolding] = useState(false);

  // ---- derived ----
  const blocker = session ? getBlocker(user, session.movie) : null;
  const { lines } = selection;
  const canNext = !blocker && !holding && lines.length > 0 && !lines.some((l) => l.violation);

  // ---- recovery: every failure path ends up here ----
  // back to step 1 with a fresh map. dropCodes keeps the rest of the selection; without it, all is cleared.
  function backToSeats(text, dropCodes) {
    if (hold) releaseHold(hold.holdId).catch(() => {});
    if (dropCodes) selection.dropByCodes(dropCodes);
    else selection.clear();
    setHold(null);
    setStep("seats");
    setMessage(text);
    refetchSeats();
  }

  const expire = () => backToSeats(BOOKING_MSG.holdExpired);

  // returns true when the error was fully handled (login modal or seat conflict)
  function recover(err, replay) {
    if (err.status === 401) openAuthModal("login", replay);
    else if (err.status === 409) {
      const codes = err.data?.contested ?? [];
      backToSeats(codes.length ? BOOKING_MSG.conflict(codes) : apiMessage(err), codes);
    } else return false;
    return true;
  }

  // ---- actions ----
  async function next() {
    setHolding(true);
    setMessage(null);
    try {
      const res = await holdSeats(sessionId, lines);
      setHold({ holdId: res.holdId, expiresAt: new Date(res.expiresAt).getTime(), subtotal: res.subtotal });
      setStep("checkout");
    } catch (err) {
      if (!recover(err, next)) setMessage(apiMessage(err));
    } finally {
      setHolding(false);
    }
  }

  async function pay(buyer) {
    try {
      setOrder(await submitOrder(hold.holdId, buyer));
      setHold(null);
      setStep("confirmed");
    } catch (err) {
      if (recover(err, () => pay(buyer))) return;
      if (err.status === 422 && !err.data?.errors) return backToSeats(err.data?.message || BOOKING_MSG.holdExpired);
      throw err;
    }
  }

  const holdRef = useRef(null);
  useEffect(() => {
    holdRef.current = hold;
  }, [hold]);

  useEffect(
    () => () => {
      if (holdRef.current) releaseHold(holdRef.current.holdId).catch(() => {});
    },
    [],
  );

  function close() {
    onClose();
  }

  const leaveTo = (path) => () => {
    close();
    navigate(path);
  };

  return {
    // data
    user,
    session,
    seats,
    ticketTypes,
    maxSeats: maxSeatsPerOrder,
    loading: loading || options.loading,
    error,
    // flow state
    step,
    hold,
    order,
    message,
    holding,
    blocker,
    canNext,
    selection,
    actions: {
      next,
      pay,
      close,
      expire,
      toSeats: () => setStep("seats"),
      toProfile: leaveTo("/my-profile?tab=profile"),
      toTickets: leaveTo("/my-profile?tab=tickets"),
      toHome: leaveTo("/"),
    },
  };
}
