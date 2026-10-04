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

// Trim every text field and validate the lengths. Shared by create and update
// so the two forms behave identically.
function trimmedFields(formData) {
  const values = {};
  for (const rule of FIELD_RULES) {
    values[rule.name] = trimText(formData, rule.name);
  }
  return { values, fieldErrors: validateTexts(values) };
}

// Uploads a photo to <user id>/<random uuid>.<ext> in the photos bucket and
// returns its public URL. The filename is generated, never taken from the
// user's original filename. Callers validate type, size, and signature first
// (with checkPhotoContent) so the upload only ever runs on a good file.
async function uploadPhoto(supabase, userId, photo, ext) {
  const photoPath = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(photoPath, photo, { contentType: photo.type });
  if (uploadError) {
    console.error("contribute: photo upload failed:", uploadError);
    return { error: "Your photo could not be uploaded — please try again." };
  }
  const { data: urlData } = supabase.storage
    .from("photos")
    .getPublicUrl(photoPath);
  return { photoPath, photoUrl: urlData.publicUrl };
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
  const { values, fieldErrors } = trimmedFields(formData);

  // Validate the photo (required, size, type, and file signature) WITHOUT
  // uploading yet. The upload only happens once every check has passed.
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

  const uploaded = await uploadPhoto(supabase, user.id, photo, photoExt);
  if (uploaded.error) {
    return { fieldErrors: { photo: uploaded.error } };
  }

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
      photo_url: uploaded.photoUrl,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("contribute: entry insert failed:", insertError);
    // The photo was already uploaded; remove the orphan object so the bucket
    // does not fill up with unused files. Best effort only.
    await supabase.storage
      .from("photos")
      .remove([uploaded.photoPath])
      .catch(() => {});
    return { formError: "Your entry could not be saved — please try again." };
  }

  redirect(`/entries/${inserted.id}`);
}

export async function updateEntry(prevState, formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { formError: "Your session is not signed in — log in and try again." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { formError: "That entry could not be found." };
  }

  // Only the owner may update this entry.
  const { data: existing, error: fetchError } = await supabase
    .from("entries")
    .select("id, owner, photo_url")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !existing) {
    console.error("contribute: entry fetch for update failed:", fetchError);
    return { formError: "That entry could not be found." };
  }
  if (existing.owner !== user.id) {
    console.error("contribute: update forbidden — owner mismatch");
    return { formError: "You can only edit your own entries." };
  }

  const { values, fieldErrors } = trimmedFields(formData);

  // Photo is optional when editing: if a new file was chosen, validate its
  // size, type, and signature now but do NOT upload yet.
  const photo = formData.get("photo");
  let photoExt = null;
  if (photo && photo.size > 0) {
    if (photo.size > MAX_PHOTO_BYTES) {
      fieldErrors.photo = "Photo must be 4 MB or smaller.";
    } else {
      const checked = await checkPhotoContent(photo);
      if (checked.error) {
        fieldErrors.photo = checked.error;
      } else {
        photoExt = checked.ext;
      }
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Upload the new photo only now that every check passed; otherwise keep
  // the existing one.
  let photoUrl = existing.photo_url;
  let uploaded = null;
  if (photoExt) {
    uploaded = await uploadPhoto(supabase, user.id, photo, photoExt);
    if (uploaded.error) {
      return { fieldErrors: { photo: uploaded.error } };
    }
    photoUrl = uploaded.photoUrl;
  }

  // UPDATE ... and verify that a row actually came back.
  const { data: updated, error: updateError } = await supabase
    .from("entries")
    .update({
      title: values.title,
      title_km: values.title_km,
      description: values.description,
      location: values.location,
      source: values.source,
      material: values.material,
      period: values.period,
      photo_url: photoUrl,
    })
    .eq("id", id)
    .eq("owner", user.id)
    .select("id")
    .maybeSingle();

  if (updateError || !updated) {
    console.error("contribute: entry update failed:", updateError);
    if (uploaded?.photoPath) {
      await supabase.storage
        .from("photos")
        .remove([uploaded.photoPath])
        .catch(() => {});
    }
    return { formError: "That change wasn't saved" };
  }

  redirect(`/entries/${updated.id}`);
}

export async function deleteEntry(prevState, formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { formError: "Your session is not signed in — log in and try again." };
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { formError: "That entry could not be found." };
  }

  // DELETE ... and verify that a row actually came back.
  const { data: deleted, error: deleteError } = await supabase
    .from("entries")
    .delete()
    .eq("id", id)
    .eq("owner", user.id)
    .select("id")
    .maybeSingle();

  if (deleteError || !deleted) {
    console.error("contribute: entry delete failed:", deleteError);
    return { formError: "That change wasn't saved" };
  }

  redirect("/");
}