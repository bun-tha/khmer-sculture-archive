// Shared validation for the /contribute form. Imported by both the client
// form (instant feedback before submit) and the server action (the real
// gate). Plain JS on purpose — no "use client" / "use server".

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const FIELD_RULES = [
  { name: "title", label: "Title", min: 1, max: 120 },
  { name: "title_km", label: "Khmer title", min: 1, max: 120 },
  { name: "description", label: "Description", min: 20, max: 2000 },
  { name: "location", label: "Location", min: 1, max: 200 },
  { name: "source", label: "Source", min: 1, max: 200 },
  { name: "material", label: "Material", min: 1, max: 100 },
  { name: "period", label: "Period", min: 1, max: 100 },
];

export function trimText(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function validateTexts(values) {
  const errors = {};
  for (const rule of FIELD_RULES) {
    const text = values[rule.name] ?? "";
    if (text.length < rule.min || text.length > rule.max) {
      errors[rule.name] =
        `${rule.label} must be ${rule.min}–${rule.max} characters.`;
    }
  }

  // In addition to the length rule, the Khmer title must contain at least
  // one Khmer character (U+1780–U+17FF). When the length rule already failed
  // (empty or too short), keep its message; otherwise make sure the text is
  // actually written in Khmer script, not just any 1–120 characters.
  const titleKm = values.title_km ?? "";
  if (!errors.title_km && !/[\u1780-\u17FF]/.test(titleKm)) {
    errors.title_km = "The Khmer title must be written in Khmer script.";
  }

  return errors;
}

// Client-side photo checks only. The server repeats these (plus a real file
// signature check) because anything the client sends can be forged.
export function validatePhotoClient(file) {
  if (!file || file.size === 0) {
    return "Choose a photo (jpeg, png, or webp, max 4 MB).";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "Photo must be 4 MB or smaller.";
  }
  const okType = ALLOWED_PHOTO_TYPES.includes(file.type);
  const okExt = /\.(jpe?g|png|webp)$/i.test(file.name || "");
  if (!okType && !okExt) {
    return "Photo must be a jpeg, png, or webp image.";
  }
  return null;
}