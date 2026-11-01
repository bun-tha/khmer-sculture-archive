// Shared validation for the /contribute form. Imported by both the client
// form (instant feedback before submit) and the server action (the real
// gate). Plain JS on purpose — no "use client" / "use server".

import { getLang, t } from "../../utils/i18n.js";

export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
export const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const FIELD_RULES = [
  { name: "title", labelKey: "field.title", min: 1, max: 120 },
  { name: "title_km", labelKey: "field.titleKm", min: 1, max: 120 },
  { name: "description", labelKey: "field.description", min: 20, max: 2000 },
  { name: "location", labelKey: "field.location", min: 1, max: 200 },
  { name: "source", labelKey: "field.source", min: 1, max: 200 },
  { name: "material", labelKey: "field.material", min: 1, max: 100 },
  { name: "period", labelKey: "field.period", min: 1, max: 100 },
];

export function trimText(formData, name) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function validateTexts(values, lang = getLang()) {
  const errors = {};
  for (const rule of FIELD_RULES) {
    const text = values[rule.name] ?? "";
    if (text.length < rule.min || text.length > rule.max) {
      errors[rule.name] = t("errors.length", lang, {
        label: t(rule.labelKey, lang),
        min: rule.min,
        max: rule.max,
      });
    }
  }

  // In addition to the length rule, the Khmer title must contain at least
  // one Khmer character (U+1780–U+17FF). When the length rule already failed
  // (empty or too short), keep its message; otherwise make sure the text is
  // actually written in Khmer script.
  const titleKm = values.title_km ?? "";
  if (!errors.title_km && !/[\u1780-\u17FF]/.test(titleKm)) {
    errors.title_km =
      lang === "km"
        ? t("errors.script", "km")
        : `${t("errors.script", "en")} ${t("errors.script", "km")}`;
  }

  return errors;
}

// Client-side photo checks only. The server repeats these (plus a real file
// signature check) because anything the client sends can be forged.
export function validatePhotoClient(file, lang = getLang()) {
  if (!file || file.size === 0) {
    return t("errors.photoRequired", lang);
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return t("errors.photoSize", lang);
  }
  const okType = ALLOWED_PHOTO_TYPES.includes(file.type);
  const okExt = /\.(jpe?g|png|webp)$/i.test(file.name || "");
  if (!okType && !okExt) {
    return t("errors.photoType", lang);
  }
  return null;
}