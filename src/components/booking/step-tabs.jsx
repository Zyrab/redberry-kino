export default function StepTabs({ step, onBack }) {
  const canGoBack = step === "checkout" && onBack;
  const First = canGoBack ? "button" : "span";
  return (
    <div className="booking-tabs" aria-label="Booking steps">
      <First
        type={canGoBack ? "button" : undefined}
        onClick={canGoBack ? onBack : undefined}
        className={`booking-tab text-overline ${step === "seats" ? "is-active" : ""}`}
      >
        SEATS
      </First>
      <span className={`booking-tab text-overline ${step === "checkout" ? "is-active" : ""}`}>CHECKOUT</span>
    </div>
  );
}
