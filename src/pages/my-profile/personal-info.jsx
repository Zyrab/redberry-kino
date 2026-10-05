import { useState } from "react";

import Button from "../../components/ui/button";
import SelectInput from "../../components/ui/select-input";
import TextInput from "../../components/ui/text-input";

import { useAuth } from "../../context/auth-context";
import { useFilterOptions } from "../../context/filter-options-context";
import useForm from "../../hooks/use-form";

import { api } from "../../utils/api";
import { profileSchema, todayISO } from "../../utils/validators";

const toValues = (user) => ({
  fullName: user?.fullName ?? "",
  mobileNumber: user?.mobileNumber ?? "",
  dateOfBirth: user?.dateOfBirth ?? "",
  preferredVenueId: user?.preferredVenue?.id ? String(user.preferredVenue.id) : "",
});

function ageNotice(age) {
  if (age >= 18) return `You are ${age}, you can buy tickets for all age ratings`;
  if (age >= 16) return `You are ${age}, you cannot buy tickets for 18+ titles`;
  return `You are ${age}, you cannot buy tickets for 16+ or 18+ titles`;
}

export default function PersonalInfo() {
  const { user, updateUser, openAuthModal } = useAuth();
  const { venues } = useFilterOptions();

  const { values, fieldError, isFieldValid, handleChange, handleBlur, submitting, formError, reset, submit, dirty, isValid } = useForm({
    initial: toValues(user),
    schema: profileSchema,
  });
  const [saved, setSaved] = useState(false);

  const onSubmit = submit(
    async (vals) => {
      const body = new FormData();
      body.append("fullName", vals.fullName.trim());
      body.append("mobileNumber", vals.mobileNumber);
      body.append("dateOfBirth", vals.dateOfBirth);
      body.append("preferredVenueId", vals.preferredVenueId);

      const res = await api("/profile", { method: "PUT", body });
      updateUser(res.data);
      reset(toValues(res.data));
      setSaved(true);
    },
    { onUnauthorized: (retry) => openAuthModal("login", retry) },
  );

  return (
    <form className="personal-info" onSubmit={onSubmit} noValidate>
      <TextInput
        label="Full name"
        name="fullName"
        value={values.fullName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={fieldError("fullName")}
        success={isFieldValid("fullName")}
      />

      <TextInput label="Email" name="email" type="email" value={user?.email} disabled info="Set at registration and cannot be changed" />

      <TextInput
        label="Mobile number"
        name="mobileNumber"
        placeholder="5XX XXX XXX"
        value={values.mobileNumber}
        onChange={handleChange}
        onBlur={handleBlur}
        error={fieldError("mobileNumber")}
        success={isFieldValid("mobileNumber")}
      />

      <TextInput
        label="Date of birth"
        name="dateOfBirth"
        type="date"
        max={todayISO()}
        value={values.dateOfBirth}
        onChange={handleChange}
        onBlur={handleBlur}
        error={fieldError("dateOfBirth")}
        success={isFieldValid("dateOfBirth")}
      />
      {user?.age != null && user?.dateOfBirth && <p className="text-body-s profile-age">{ageNotice(user.age)}</p>}

      <SelectInput
        label="Preferred Venue (Optional)"
        name="preferredVenueId"
        placeholder="Select a venue"
        value={values.preferredVenueId}
        onChange={handleChange}
        options={venues?.map((v) => ({ value: String(v.id), label: v.name }))}
        error={fieldError("preferredVenueId")}
      />

      {formError && (
        <p className="profile-form-error text-body-s" role="alert">
          {formError}
        </p>
      )}
      {saved && !dirty && (
        <p className="profile-saved text-body-s" role="status">
          Changes saved
        </p>
      )}

      <Button type="submit" disabled={!dirty || !isValid || submitting}>
        {submitting ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
