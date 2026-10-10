import { useState } from "react";

import Button from "../ui/button";
import TextInput from "../ui/text-input";

import StepTabs from "./step-tabs";
import OrderSummary from "./order-summary";

import { checkoutSchema, mapApiErrors, MSG, validate } from "../../utils/validators";

const masks = {
  cardNumber: (v) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim(),
  expiry: (v) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  },
  cvv: (v) => v.replace(/\D/g, "").slice(0, 3),
};

export default function CheckoutStep({ booking }) {
  const { session, selection, hold, user, actions } = booking;
  const { lines } = selection;
  const total = hold.subtotal;

  const [values, setValues] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    mobileNumber: user?.mobileNumber ?? "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const errors = validate(checkoutSchema, values);
  const fieldError = (name) => serverErrors[name] || (touched[name] ? errors[name] : undefined);
  const ok = (name) => !!values[name] && !errors[name] && !serverErrors[name];

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: masks[name] ? masks[name](value) : value }));
    setServerErrors((er) => ({ ...er, [name]: undefined, form: undefined }));
  }
  const handleBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  async function submit(e) {
    e?.preventDefault();
    if (submitting) return;
    setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await actions.pay(values);
    } catch (err) {
      if (err.status === 422 && err.data?.errors) setServerErrors(mapApiErrors(err.data.errors));
      else setServerErrors({ form: err.data?.message || MSG.generic });
    } finally {
      setSubmitting(false);
    }
  }

  const field = (name, label, props = {}) => (
    <TextInput
      label={label}
      name={name}
      value={values[name]}
      onChange={handleChange}
      onBlur={handleBlur}
      error={fieldError(name)}
      success={ok(name)}
      {...props}
    />
  );

  return (
    <>
      <div className="booking-left">
        <StepTabs step="checkout" onBack={actions.toSeats} />
        <form className="booking-form" onSubmit={submit} noValidate>
          {field("fullName", "Full name")}
          <div className="booking-row">
            {field("email", "Email", { type: "email" })}
            {field("mobileNumber", "Mobile number")}
          </div>

          <hr className="booking-divider" />

          {field("cardNumber", "Card number", { placeholder: "e.g. 1234 4567 8901 2345", inputMode: "numeric" })}
          <div className="booking-row">
            {field("expiry", "Expiry", { placeholder: "e.g. 12/34", inputMode: "numeric" })}
            {field("cvv", "CVV", { placeholder: "e.g. 123", inputMode: "numeric" })}
          </div>

          {serverErrors.form && (
            <p className="text-body-s booking-error" role="alert">
              {serverErrors.form}
            </p>
          )}
        </form>
      </div>

      <OrderSummary session={session} lines={lines} total={total}>
        <Button onClick={submit} disabled={submitting}>
          {submitting ? "Processing..." : "Pay: Complete order"}
        </Button>
      </OrderSummary>
    </>
  );
}
