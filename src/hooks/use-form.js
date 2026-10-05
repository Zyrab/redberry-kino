import { useMemo, useState } from "react";
import { mapApiErrors, MSG, validate } from "../utils/validators";

/**
 * Owns everything the three forms (login, register, profile) used to repeat:
 * values, touched fields, client errors, server errors, submitting state.
 *
 * @param initial  starting values, e.g. { email: "", password: "" }
 * @param schema   a schema from validators.js.).
 */
export default function useForm({ initial, schema = {} }) {
  const [baseline, setBaseline] = useState(initial);
  const [values, setValues] = useState(initial);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Client-side errors,
  const errors = useMemo(() => validate(schema, values), [schema, values]);

  const isValid = Object.keys(errors).length === 0;
  const dirty = Object.keys(baseline).some((k) => values[k] !== baseline[k]);

  // Server error wins. Client error only shows once the field was touched.
  const fieldError = (name) => serverErrors[name] || (touched[name] ? errors[name] : undefined);

  const isFieldValid = (name) => !!values[name] && !errors[name] && !serverErrors[name];

  const formError = serverErrors.form;

  function setValue(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setServerErrors((er) => ({ ...er, [name]: undefined, form: undefined }));
  }

  const handleChange = (e) => setValue(e.target.name, e.target.value);

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  function reset(next = initial) {
    setBaseline(next);
    setValues(next);
    setTouched({});
    setServerErrors({});
  }

  /**
   * Wraps  submit logic and returns a form onSubmit handler.
   *
   *   const onSubmit = submit((vals) => login(vals));
   *   <form onSubmit={onSubmit}>
   *
   * Options:
   *   onUnauthorized(retry)  called on a 401 instead of showing an error.
   */
  const submit =
    (onSubmit, { onUnauthorized } = {}) =>
    async (e) => {
      e?.preventDefault?.();

      setTouched(Object.fromEntries(Object.keys(schema).map((k) => [k, true])));
      if (!isValid) return;

      const run = async () => {
        setSubmitting(true);
        try {
          await onSubmit(values);
        } catch (err) {
          if (err.status === 401 && onUnauthorized) onUnauthorized(run);
          else if (err.status === 422 && err.data?.errors) setServerErrors(mapApiErrors(err.data.errors));
          else setServerErrors({ form: err.data?.message || MSG.generic });
        } finally {
          setSubmitting(false);
        }
      };

      await run();
    };

  return {
    values,
    errors,
    isValid,
    dirty,
    submitting,
    formError,
    fieldError,
    isFieldValid,
    handleChange,
    handleBlur,
    setValue,
    reset,
    submit,
  };
}
