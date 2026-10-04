"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server.js";
import {
  FIELD_RULES,
  MAX_PHOTO_BYTES,
  trimText,
  validateTexts,
} from "./validation.js";

// MIME type -> extension used in the generated photo filename. The extension
// comes from the detected image type, never from the user's original filename
// (OWASP file-upload guidance: never trust user filenames).
const PHOTO_TYPES = {
  "image/jpeg": { ext: "jpg", signature: [0xff, 0xd8, 0xff] },
  "image/png": {
    ext: "png",
    signature: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  },
  // RIFF header; "WEBP" must also appear at byte offset 8.
  "image/webp": { ext: "webp", signature: [0x52, 0x49, 0x46, 0x46] },
};

async function checkPhotoContent(photo) {
  const spec = PHOTO_TYPES[photo.type];
  if (!spec) {
    return { error: "Photo must be a jpeg, png, or webp image." };
  }
  const bytes = new Uint8Array(await photo.arrayBuffer());
  const signatureOk = spec.signature.every((byte, i) => bytes[i] === byte);
  const webpOk =
    photo.type !== "image/webp" ||
    (bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50);
  if (!signatureOk || !webpOk) {
    return {
      error: "That file does not look like a photo — use a jpeg, png, or webp image.",
    };
  }
  return { ext: spec.ext };
}

export async function submitEntry(prevState, formData) {
  const supabase = await createClient();

  // Owner always comes from the session, never from the form.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { formError: "Your session is not signed in — log in and try again." };
  }

  // Trim every text field, then re-validate on the server (never trust the
  // client's checks alone).
  const values = {};
  for (const rule of FIELD_RULES) {
    values[rule.name] = trimText(formData, rule.name);
  }
  const fieldErrors = validateTexts(values);

  const photo = formData.get("photo");
  let photoExt = null;
  if (!photo || photo.size === 0) {
    fieldErrors.photo = "Choose a photo (jpeg, png, or webp, max 4 MB).";
  } else if (photo.size > MAX_PHOTO_BYTES) {
    fieldErrors.photo = "Photo must be 4 MB or smaller.";
  } else {
    const checked = await checkPhotoContent(photo);
    if (checked.error) {
      fieldErrors.photo = checked.error;
    } else {
      photoExt = checked.ext;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Photon path is <user id>/<random uuid>.<ext> in the photos bucket — a
  // generated name per user, so no one can be served or overwrite a file
  // they should not touch.
  const photoPath = `${user.id}/${crypto.randomUUID()}.${photoExt}`;
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(photoPath, photo, { contentType: photo.type });

  if (uploadError) {
    console.error("contribute: photo upload failed:", uploadError);
    return {
      formError: "Your photo could not be uploaded — please try again.",
    };
  }

  const { data: urlData } = supabase.storage
    .from("photos")
    .getPublicUrl(photoPath);

  // Insert only the entry fields, owner, and photo_url; id and created_at
  // get their defaults from the table.
  const { data: inserted, error: insertError } = await supabase
    .from("entries")
    .insert({
      title: values.title,
      title_km: values.title_km,
      description: values.description,
      location: values.location,
      source: values.source,
      material: values.material,
      period: values.period,
      owner: user.id,
      photo_url: urlData.publicUrl,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("contribute: entry insert failed:", insertError);
    // The photo was already uploaded; remove the orphan object so the bucket
    // does not fill up with unused files. Best effort only.
    await supabase.storage
      .from("photos")
      .remove([photoPath])
      .catch(() => {});
    return { formError: "Your entry could not be saved — please try again." };
  }

  redirect(`/entries/${inserted.id}`);
}