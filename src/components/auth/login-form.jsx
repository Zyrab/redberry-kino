import { useState } from "react";
import { useAuth } from "../../context/auth-context";
import { isEmail, MIN_LENGTH, mapApiErrors } from "../../utils/validators";
import Button from "../ui/button";
import TextInput from "../ui/text-input";

export default function LoginForm() {
  const { login, switchMode } = useAuth();
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const filled = values.email && values.password;
  const hasErrors = Object.values(errors).some((error) => error !== undefined);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined, form: undefined }));
  }

  function validate() {
    const next = {};
    if (!isEmail(values.email)) next.email = "Enter a valid email";
    if (values.password.length < MIN_LENGTH) next.password = `At least ${MIN_LENGTH} characters`;
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) return setErrors(next);

    setSubmitting(true);
    try {
      await login(values);
    } catch (err) {
      if (err.status === 422 && err.data?.errors) setErrors(mapApiErrors(err.data.errors));
      else setErrors({ form: err.data?.message || "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <header className="auth-header">
        <h2 className="text-h2">Log in</h2>
        <p className="text-body-s auth-subtitle">Welcome back to Kino XII</p>
      </header>

      <TextInput
        label="Email"
        name="email"
        type="email"
        placeholder="example@gmail.com"
        value={values.email}
        onChange={handleChange}
        error={errors.email}
        success={isEmail(values.email)}
      />
      <TextInput
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={values.password}
        onChange={handleChange}
        error={errors.password}
        success={values.password.length >= MIN_LENGTH}
      />

      {errors.form && (
        <p className="auth-form-error text-body-s" role="alert">
          {errors.form}
        </p>
      )}

      <Button type="submit" disabled={!filled || hasErrors || submitting}>
        Log in
      </Button>

      <p className="auth-switch text-body-m">
        Don't have an account?{" "}
        <button type="button" className="auth-switch-link text-button" onClick={() => switchMode("register")}>
          Sign up
        </button>
      </p>
    </form>
  );
}
