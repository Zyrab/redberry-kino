import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/auth-context";
import { isEmail, MIN_LENGTH, mapApiErrors } from "../../utils/validators";
import Button from "../ui/button";
import Icon from "../ui/icon";
import TextInput from "../ui/text-input";

const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATAR_MAX = 2 * 1024 * 1024;

export default function RegisterForm() {
  const { register, switchMode } = useAuth();
  const fileRef = useRef(null);
  const [values, setValues] = useState({ username: "", email: "", password: "", password_confirmation: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const filled = Object.values(values).every(Boolean);
  const hasErrors = Object.values(errors).some((error) => error !== undefined);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined, form: undefined }));
  }

  function handleAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!AVATAR_TYPES.includes(file.type)) {
      setErrors((er) => ({ ...er, avatar: "Only JPG, PNG or WebP images are allowed" }));
    } else if (file.size > AVATAR_MAX) {
      setErrors((er) => ({ ...er, avatar: "Image must be 2MB or smaller" }));
    } else {
      setErrors((er) => ({ ...er, avatar: undefined }));
      if (preview) URL.revokeObjectURL(preview);
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
    e.target.value = "";
  }

  function validate() {
    const next = {};
    if (values.username.length < MIN_LENGTH) next.username = `At least ${MIN_LENGTH} characters`;
    if (!isEmail(values.email)) next.email = "Enter a valid email";
    if (values.password.length < MIN_LENGTH) next.password = `At least ${MIN_LENGTH} characters`;
    if (values.password_confirmation !== values.password) next.password_confirmation = "Passwords don't match";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) return setErrors(next);

    const body = new FormData();
    Object.entries(values).forEach(([k, v]) => body.append(k, v));
    if (avatar) body.append("avatar", avatar);

    setSubmitting(true);
    try {
      await register(body);
    } catch (err) {
      if (err.status === 422 && err.data?.errors) setErrors(mapApiErrors(err.data.errors));
      else setErrors({ form: err.data?.message || "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <header className="auth-header">
        <h2 className="text-h2">Sign up</h2>
        <p className="text-body-s auth-subtitle">Welcome back to Kino XII</p>
      </header>

      <div className="auth-avatar">
        <button type="button" className="auth-avatar-btn" onClick={() => fileRef.current.click()} aria-label="Upload avatar">
          {preview ? <img src={preview} alt="Avatar preview" /> : <Icon name="upload" />}
        </button>
        <div>
          <p className="text-button">Upload avatar (optional)</p>
          <p className="text-body-s auth-subtitle">JPG, PNG or WEBP</p>
          {errors.avatar && <p className="auth-form-error text-body-s">{errors.avatar}</p>}
        </div>
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp" hidden onChange={handleAvatar} />
      </div>

      <TextInput
        label="Username"
        name="username"
        placeholder="User"
        value={values.username}
        onChange={handleChange}
        error={errors.username}
        success={values.username.length >= MIN_LENGTH}
      />
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

      <div className="auth-row">
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
        <TextInput
          label="Confirm password"
          name="password_confirmation"
          type="password"
          placeholder="••••••••"
          value={values.password_confirmation}
          onChange={handleChange}
          error={errors.password_confirmation}
          success={!!values.password_confirmation && values.password_confirmation === values.password}
        />
      </div>

      {errors.form && (
        <p className="auth-form-error text-body-s" role="alert">
          {errors.form}
        </p>
      )}

      <Button type="submit" disabled={!filled || hasErrors || submitting}>
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
