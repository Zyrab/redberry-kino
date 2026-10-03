export const MIN_LENGTH = 3;

export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export function mapApiErrors(errors = {}) {
  return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, messages[0]]));
}
