import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth-context";
import useForm from "../../hooks/use-form";

import { registerSchema, validateAvatar } from "../../utils/validators";

import Button from "../ui/button";
import Icon from "../ui/icon";
import TextInput from "../ui/text-input";

const INITIAL = { username: "", email: "", password: "", password_confirmation: "" };

export default function RegisterForm() {
  const { register, switchMode } = useAuth();
  const { values, fieldError, isFieldValid, handleChange, handleBlur, submitting, formError, submit } = useForm({
    initial: INITIAL,
    schema: registerSchema,
  });

  const fileRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [avatarError, setAvatarError] = useState();

  const filled = Object.values(values).every(Boolean);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function handleAvatar(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const error = validateAvatar(file);
    setAvatarError(error);
    if (error) return;

    if (preview) URL.revokeObjectURL(preview);
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  }

  const onSubmit = submit((vals) => {
    const body = new FormData();
    body.append("username", vals.username.trim());
    body.append("email", vals.email.trim());
    body.append("password", vals.password);
    body.append("password_confirmation", vals.password_confirmation);
    if (avatar) body.append("avatar", avatar);
    return register(body);
  });

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <header className="auth-header">
        <h2 className="text-h2">Sign up</h2>
        <p className="text-body-s auth-subtitle">Welcome to Kino XII</p>
      </header>

      <div className="auth-avatar">
        <button type="button" className="auth-avatar-btn" onClick={() => fileRef.current.click()} aria-label="Upload avatar">
          {preview ? <img src={preview} alt="Avatar preview" /> : <Icon name="upload" />}
        </button>
        <div>
          <p className="text-button">Upload avatar (optional)</p>
          <p className="text-body-s auth-subtitle">JPG, PNG or WEBP</p>
          {(avatarError || fieldError("avatar")) && <p className="auth-form-error text-body-s">{avatarError || fieldError("avatar")}</p>}
        </div>
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" hidden onChange={handleAvatar} />
      </div>

      <TextInput
        label="Username"
        name="username"
        placeholder="User"
        value={values.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={fieldError("username")}
        success={isFieldValid("username")}
      />
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

      <div className="auth-row">
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
        <TextInput
          label="Confirm password"
          name="password_confirmation"
          type="password"
          placeholder="••••••••"
          value={values.password_confirmation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={fieldError("password_confirmation")}
          success={isFieldValid("password_confirmation")}
        />
      </div>

      {formError && (
        <p className="auth-form-error text-body-s" role="alert">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={!filled || submitting}>
        Sign up
      </Button>

      <p className="auth-switch text-body-m">
        Already have an account?{" "}
        <button type="button" className="auth-switch-link text-button" onClick={() => switchMode("login")}>
          Log in
        </button>
      </p>
    </form>
  );
}
