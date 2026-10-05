export const MIN_LENGTH = 3;
export const NAME_MAX = 50;
export const MIN_AGE = 12;

export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const AVATAR_MAX = 2 * 1024 * 1024;

export const MSG = {
  // Profile
  nameRequired: "Name is required",
  nameShort: `Name must be at least ${MIN_LENGTH} characters`,
  nameLong: `Name must not exceed ${NAME_MAX} characters`,
  mobileRequired: "Mobile number is required",
  mobileNotFive: "Georgian mobile numbers must start with 5",
  mobileLength: "Mobile number must be exactly 9 digits",
  mobileFormat: "Please enter a valid Georgian mobile number (9 digits starting with 5)",
  dobRequired: "Date of birth is required",
  dobInvalid: "Please enter a valid date of birth",
  dobTooYoung: `You must be at least ${MIN_AGE} years old to create an account`,

  // Auth
  emailRequired: "Email is required",
  emailInvalid: "Enter a valid email",
  passwordRequired: "Password is required",
  passwordShort: `At least ${MIN_LENGTH} characters`,
  usernameRequired: "Username is required",
  usernameShort: `At least ${MIN_LENGTH} characters`,
  confirmRequired: "Please confirm your password",
  confirmMismatch: "Passwords don't match",

  // Avatar
  avatarType: "Only JPG, PNG or WebP images are allowed",
  avatarSize: "Image must be 2MB or smaller",

  generic: "Something went wrong. Please try again.",
};

export const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value ?? "");

const blank = (v) => !String(v ?? "").trim();

export function mapApiErrors(errors = {}) {
  return Object.fromEntries(Object.entries(errors).map(([field, messages]) => [field, [].concat(messages)[0]]));
}

export const normalizeMobile = (v) => String(v ?? "").replace(/\s/g, "");

const pad = (n) => String(n).padStart(2, "0");
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());

/**
 * Whole years between an ISO date (YYYY-MM-DD) and today.
 * Compares year/month/day numbers directly, so Feb 29 does not roll over.
 * Only used for the "at least 12" check. The age shown to the user comes from the API.
 */
function yearsSince(iso, today = new Date()) {
  const [y, m, d] = iso.split("-").map(Number);
  const month = today.getMonth() + 1;
  const birthdayPassed = month > m || (month === m && today.getDate() >= d);
  return today.getFullYear() - y - (birthdayPassed ? 0 : 1);
}

export const rules = {
  email(v) {
    if (blank(v)) return MSG.emailRequired;
    if (!isEmail(v.trim())) return MSG.emailInvalid;
  },

  password(v) {
    if (!v) return MSG.passwordRequired;
    if (v.length < MIN_LENGTH) return MSG.passwordShort;
  },

  username(v) {
    if (blank(v)) return MSG.usernameRequired;
    if (v.trim().length < MIN_LENGTH) return MSG.usernameShort;
  },

  password_confirmation(v, all) {
    if (!v) return MSG.confirmRequired;
    if (v !== all.password) return MSG.confirmMismatch;
  },

  fullName(v) {
    const name = String(v ?? "").trim();
    if (!name) return MSG.nameRequired;
    if (name.length < MIN_LENGTH) return MSG.nameShort;
    if (name.length > NAME_MAX) return MSG.nameLong;
  },

  mobileNumber(v) {
    const mobile = normalizeMobile(v);
    if (!mobile) return MSG.mobileRequired;
    if (!/^\d+$/.test(mobile)) return MSG.mobileFormat;
    if (mobile[0] !== "5") return MSG.mobileNotFive;
    if (mobile.length !== 9) return MSG.mobileLength;
  },

  dateOfBirth(v) {
    if (!v) return MSG.dobRequired;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return MSG.dobInvalid;
    if (v > todayISO()) return MSG.dobInvalid;
    if (yearsSince(v) < MIN_AGE) return MSG.dobTooYoung;
  },
};

export function validateAvatar(file) {
  if (!file) return undefined;
  if (!AVATAR_TYPES.includes(file.type)) return MSG.avatarType;
  if (file.size > AVATAR_MAX) return MSG.avatarSize;
}

// Schemas: which rule applies to which field
export const loginSchema = {
  email: rules.email,
  password: rules.password,
};

export const registerSchema = {
  username: rules.username,
  email: rules.email,
  password: rules.password,
  password_confirmation: rules.password_confirmation,
};

export const profileSchema = {
  fullName: rules.fullName,
  mobileNumber: rules.mobileNumber,
  dateOfBirth: rules.dateOfBirth,
};

export function validate(schema, values) {
  const errors = {};
  for (const [field, rule] of Object.entries(schema)) {
    const message = rule(values[field], values);
    if (message) errors[field] = message;
  }
  return errors;
}
