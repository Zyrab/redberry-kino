import { useAuth } from "../../context/auth-context";
import { loginSchema } from "../../utils/validators";
import Button from "../ui/button";
import TextInput from "../ui/text-input";
import useForm from "../../hooks/use-form";

export default function LoginForm() {
  const { login, switchMode } = useAuth();
  const { values, fieldError, isFieldValid, handleChange, handleBlur, submitting, formError, submit } = useForm({
    initial: { email: "", password: "" },
    schema: loginSchema,
  });

  return (
    <form className="auth-form" onSubmit={submit((vals) => login(vals))} noValidate>
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
        onBlur={handleBlur}
        error={fieldError("email")}
        success={isFieldValid("email")}
      />
      <TextInput
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={fieldError("password")}
        success={isFieldValid("password")}
      />

      {formError && (
        <p className="auth-form-error text-body-s" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={!values.email || !values.password || submitting}>
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
