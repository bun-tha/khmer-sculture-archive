"use client";

import { useState, useActionState } from "react";
import { deleteEntry } from "../app/contribute/actions.js";

const styles = {
  row: {
    marginTop: 24,
    display: "flex",
    gap: 12,
  },
  link: {
    color: "#5B7CAD",
    textDecoration: "none",
    fontSize: 14,
    padding: "8px 16px",
    border: "1px solid #DDDDDA",
    borderRadius: 8,
    cursor: "pointer",
  },
  button: {
    color: "#242426",
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 14,
    cursor: "pointer",
  },
  danger: {
    color: "#FFFFFF",
    backgroundColor: "#B4473A",
    border: "none",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 14,
    cursor: "pointer",
  },
  disabled: {
    opacity: 0.6,
    cursor: "wait",
  },
  confirm: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#FFFFFF",
    border: "1px solid #DDDDDA",
    borderRadius: 10,
  },
  confirmText: {
    margin: 0,
    fontSize: 14,
    color: "#242426",
  },
  notice: {
    fontSize: 13,
    color: "#B4473A",
    margin: "6px 0 0",
  },
};

// Owner-only actions for an entry page: Edit links to the edit form, Delete
// asks for confirmation before it calls the delete server action.
export default function EntryActions({ id }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteEntry, null);

  if (confirming) {
    return (
      <div style={styles.confirm}>
        <p style={styles.confirmText}>
          Delete this entry? This cannot be undone.
        </p>
        {state?.formError && <p style={styles.notice}>{state.formError}</p>}
        <form
          action={formAction}
          style={{ display: "flex", gap: 12, marginTop: 12 }}
        >
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            disabled={pending}
            style={pending ? { ...styles.danger, ...styles.disabled } : styles.danger}
          >
            {pending ? "Deleting…" : "Delete"}
          </button>
          <button type="button" onClick={() => setConfirming(false)} style={styles.button}>
            Cancel
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.row}>
      <a href={`/entries/${id}/edit`} style={styles.link}>
        Edit
      </a>
      <button type="button" onClick={() => setConfirming(true)} style={styles.button}>
        Delete
      </button>
    </div>
  );
}