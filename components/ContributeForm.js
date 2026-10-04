"use client";

import { useState, useActionState } from "react";
import { submitEntry, updateEntry } from "../app/contribute/actions.js";
import {
  FIELD_RULES,
  trimText,
  validatePhotoClient,
  validateTexts,
} from "../app/contribute/validation.js";
import authStyles from "../app/authStyles.js";

const formStyles = {
  form: {
    marginTop: 32,
    padding: 24,
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 10,
  },
  textarea: {
    width: "100%",
    marginTop: 2,
    padding: "12px 16px",
    fontSize: 16,
    fontFamily: "inherit",
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 8,
    color: "#242426",
    resize: "vertical",
  },
  fieldError: {
    fontSize: 13,
    color: "#B4473A",
    margin: "6px 0 0",
  },
  formError: {
    fontSize: 14,
    color: "#B4473A",
    margin: 0,
  },
  photoHint: {
    fontSize: 13,
    color: "#6B6B68",
    margin: "6px 0 0",
  },
  disabled: {
    opacity: 0.6,
    cursor: "wait",
  },
};

// The form is a client component so it can validate before submit and show
// per-field messages. Without an `entry` it creates a new row; with one it
// pre-fills the fields and updates that row instead. Owner always comes from
// the session on the server, never from the form.
export default function ContributeForm({ entry }) {
  const action = entry ? updateEntry : submitEntry;
  const [serverState, formAction, pending] = useActionState(action, null);
  const [clientErrors, setClientErrors] = useState(null);

  // Client pre-check wins while it is set; after a valid submit the server
  // response (same shape: { fieldErrors, formError }) takes over.
  const errors = clientErrors ?? serverState;

  function handleSubmit(event) {
    const formData = new FormData(event.currentTarget);

    const values = {};
    for (const rule of FIELD_RULES) {
      values[rule.name] = trimText(formData, rule.name);
    }
    const fieldErrors = validateTexts(values);

    const photo = formData.get("photo");
    if (entry) {
      // Photo is optional when editing; keep the old one unless a new file
      // was chosen.
      if (photo && photo.size > 0) {
        const photoError = validatePhotoClient(photo);
        if (photoError) {
          fieldErrors.photo = photoError;
        }
      }
    } else {
      const photoError = validatePhotoClient(photo);
      if (photoError) {
        fieldErrors.photo = photoError;
      }
    }

    if (Object.keys(fieldErrors).length > 0) {
      event.preventDefault();
      setClientErrors({ fieldErrors, formError: null });
      return;
    }

    setClientErrors(null);
  }

  function fieldError(name) {
    return errors?.fieldErrors?.[name];
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      style={formStyles.form}
    >
      {entry && <input type="hidden" name="id" value={entry.id} />}

      {errors?.formError && (
        <p style={formStyles.formError}>{errors.formError}</p>
      )}

      {FIELD_RULES.map((rule) => (
        <div key={rule.name}>
          <label htmlFor={rule.name} style={authStyles.cardLabel}>
            {rule.label.toUpperCase()}
          </label>
          {rule.name === "description" ? (
            <textarea
              id={rule.name}
              name={rule.name}
              rows={5}
              defaultValue={entry?.[rule.name] ?? ""}
              style={formStyles.textarea}
            />
          ) : (
            <input
              id={rule.name}
              name={rule.name}
              type="text"
              defaultValue={entry?.[rule.name] ?? ""}
              style={authStyles.input}
            />
          )}
          {fieldError(rule.name) && (
            <p style={formStyles.fieldError}>{fieldError(rule.name)}</p>
          )}
        </div>
      ))}

      <label htmlFor="photo" style={authStyles.cardLabel}>
        PHOTO (JPEG, PNG, OR WEBP — MAX 4 MB)
      </label>
      <input
        id="photo"
        name="photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={authStyles.input}
      />
      {entry && (
        <p style={formStyles.photoHint}>
          Leave the photo empty to keep the current one.
        </p>
      )}
      {fieldError("photo") && (
        <p style={formStyles.fieldError}>{fieldError("photo")}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={
          pending
            ? { ...authStyles.button, ...formStyles.disabled }
            : authStyles.button
        }
      >
        {pending ? "Saving…" : entry ? "Save changes" : "Add entry"}
      </button>
    </form>
  );
}