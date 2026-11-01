// Single source of UI strings, en + km.
//
// t(key, lang, vars) resolves a dotted key in the requested language and falls
// back to the other language, then to the key itself. t2(key) joins en + km
// for the bilingual labels the archive already shows. hasLang(key) tells you
// whether a translation exists, so code can leave a fallback for missing
// Khmer until it is written. The active language is "en" for now; the toggle
// (Step 3) will call setLang(). Khmer strings left as "" are listed in the PR.

export const strings = {
  en: {
    nav: {
      login: "Log in",
      signup: "Sign up",
      logout: "Log out",
      myEntries: "My entries",
    },
    common: {
      retry: "Try again",
    },
    home: {
      kicker: "KHMER LIVING ARCHIVE",
      curatedBy: "CURATED BY",
      source: "SOURCE",
      searchPlaceholder: "Search the archive...",
      all: "All",
      count: "showing {shown} of {total} entries",
      loading: "Loading the archive…",
      error: "The archive is unreachable right now — try again in a moment.",
      emptyInvite: "No entries in the archive yet — be the first to contribute.",
      emptySearch:
        "Nothing carved from that search yet — try a shorter word, or clear the box to see everything.",
      footer:
        "Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026. This archive is under construction all semester. Come back in December.",
    },
    my: {
      title: "My entries",
      needLoginPre: "You need to",
      needLoginPost: "to see your entries.",
      count: "{n} entries",
      countOne: "{n} entry",
      empty: "You have not added anything yet.",
      contributeLink: "Contribute",
      error: "Your entries could not be loaded. Check your connection and try again.",
      status: {
        pending: "Waiting for review",
        published: "Published",
        returned: "Returned for changes",
      },
    },
    field: {
      email: "Email",
      password: "Password",
      title: "Title",
      titleKm: "Khmer title",
      description: "Description",
      location: "Location",
      source: "Source",
      material: "Material",
      period: "Period",
      photo: "Photo",
    },
    errors: {
      length: "{label} must be {min}–{max} characters.",
      script: "The Khmer title must be written in Khmer script.",
      photoRequired: "Choose a photo (jpeg, png, or webp, max 4 MB).",
      photoSize: "Photo must be 4 MB or smaller.",
      photoType: "Photo must be a jpeg, png, or webp image.",
      photoLooksWrong:
        "That file does not look like a photo — use a jpeg, png, or webp image.",
      notSignedIn: "Your session is not signed in — log in and try again.",
      entryNotFound: "That entry could not be found.",
      ownEntriesOnly: "You can only edit your own entries.",
      photoUploadFailed: "Your photo could not be uploaded — please try again.",
      entryNotSaved: "Your entry could not be saved — please try again.",
      changeNotSaved: "That change wasn't saved",
    },
    form: {
      photoHint: "Leave the photo empty to keep the current one.",
      submit: "Add entry",
      save: "Save changes",
      saving: "Saving…",
      success:
        "Thank you! Your entry was received and is waiting for review. It will appear in the archive once approved.",
      seeEntries: "See your entries",
    },
    entry: {
      contributedBy: "Contributed by {name}",
      back: "← Back to the archive",
    },
    actions: {
      edit: "Edit",
      delete: "Delete",
      deleting: "Deleting…",
      cancel: "Cancel",
      confirm: "Delete this entry? This cannot be undone.",
    },
    login: {
      title: "Log in",
      description: "Log in to contribute entries to the archive.",
      invalid: "Invalid email or password",
      checkEmail:
        "Account created — check your email for a confirmation link, then log in.",
      newHere: "New here?",
      createAccount: "Create an account",
    },
    signup: {
      title: "Create an account",
      description: "Sign up to contribute entries to the archive.",
      error: "That account could not be created — try again.",
      hasAccount: "Already have an account?",
    },
    contributePage: {
      title: "Contribute",
      description: "Add a new entry to the archive. Every field is required.",
      needLoginPre: "You need to",
      needLoginPost: "to add an entry to the archive.",
      noAccountYet: "No account yet?",
    },
    editPage: {
      title: "Edit entry",
      description: "Update this entry. Fields left unchanged keep their values.",
      needLoginPre: "You need to",
      needLoginPost: "to edit this entry.",
    },
  },
  km: {
    nav: {
      login: "ចូល",
      signup: "ចុះឈ្មោះ",
      logout: "ចាកចេញ",
      myEntries: "ធាតុរបស់ខ្ញុំ",
    },
    common: {
      retry: "ព្យាយាមម្តងទៀត",
    },
    home: {
      kicker: "KHMER LIVING ARCHIVE",
      curatedBy: "ថែរក្សាដោយ",
      source: "ប្រភព",
      searchPlaceholder: "ស្វែងរកក្នុងប័ណ្ណសារ...",
      all: "ទាំងអស់",
      count: "បង្ហាញ {shown} ក្នុងចំណោម {total} ធាតុ",
      loading: "កំពុងផ្ទុកប័ណ្ណសារ…",
      error: "",
      emptyInvite: "",
      emptySearch: "",
      footer: "",
    },
    my: {
      title: "ធាតុរបស់ខ្ញុំ",
      needLoginPre: "អ្នកត្រូវ",
      needLoginPost: "ដើម្បីមើលធាតុរបស់អ្នក។",
      count: "{n} ធាតុ",
      countOne: "{n} ធាតុ",
      empty: "អ្នកមិនទាន់បានបន្ថែមអ្វីនៅឡើយទេ។",
      contributeLink: "ចូលរួមចំណែក",
      error: "",
      status: {
        pending: "កំពុងរង់ចាំការត្រួតពិនិត្យ",
        published: "បានផ្សព្វផ្សាយ",
        returned: "ត្រឡប់មកវិញដើម្បីកែសម្រួល",
      },
    },
    field: {
      email: "អ៊ីមែល",
      password: "ពាក្យសម្ងាត់",
      title: "ចំណងជើង",
      titleKm: "ចំណងជើងជាភាសាខ្មែរ",
      description: "ការពិពណ៌នា",
      location: "ទីតាំង",
      source: "ប្រភព",
      material: "សម្ភារៈ",
      period: "សម័យកាល",
      photo: "រូបថត",
    },
    errors: {
      length: "{label} ត្រូវមានពី {min} ដល់ {max} តួអក្សរ។",
      script: "ចំណងជើងត្រូវតែសរសេរជាអក្សរខ្មែរ។",
      photoRequired: "",
      photoSize: "",
      photoType: "",
      photoLooksWrong: "",
      notSignedIn: "",
      entryNotFound: "",
      ownEntriesOnly: "",
      photoUploadFailed: "",
      entryNotSaved: "",
      changeNotSaved: "",
    },
    form: {
      photoHint: "",
      submit: "បន្ថែមធាតុ",
      save: "រក្សាទុកការផ្លាស់ប្តូរ",
      saving: "កំពុងរក្សាទុក…",
      success:
        "អរគុណ! ការបញ្ជូនរបស់អ្នកត្រូវបានទទួលហើយ ហើយកំពុងរង់ចាំការត្រួតពិនិត្យ។ វានឹងបង្ហាញក្នុងប័ណ្ណសារនៅពេលត្រូវបានអនុម័ត។",
      seeEntries: "មើលធាតុរបស់អ្នក",
    },
    entry: {
      contributedBy: "រួមចំណែកដោយ {name}",
      back: "← ត្រឡប់ទៅប័ណ្ណសារ",
    },
    actions: {
      edit: "កែសម្រួល",
      delete: "លុប",
      deleting: "កំពុងលុប…",
      cancel: "បោះបង់",
      confirm: "",
    },
    login: {
      title: "ចូល",
      description: "",
      invalid: "",
      checkEmail: "",
      newHere: "ថ្មីនៅទីនេះ?",
      createAccount: "បង្កើតគណនី",
    },
    signup: {
      title: "បង្កើតគណនី",
      description: "",
      error: "",
      hasAccount: "មានគណនីរួចហើយ?",
    },
    contributePage: {
      title: "ចូលរួមចំណែក",
      description: "",
      needLoginPre: "អ្នកត្រូវ",
      needLoginPost: "ដើម្បីបន្ថែមធាតុក្នុងប័ណ្ណសារ។",
      noAccountYet: "មិនទាន់មានគណនី?",
    },
    editPage: {
      title: "កែសម្រួលធាតុ",
      description: "",
      needLoginPre: "អ្នកត្រូវ",
      needLoginPost: "ដើម្បីកែសម្រួលធាតុនេះ។",
    },
  },
};

function find(obj, key) {
  const parts = key.split(".");
  let node = obj;
  for (const part of parts) {
    if (node && typeof node === "object" && part in node) {
      node = node[part];
    } else {
      return undefined;
    }
  }
  return typeof node === "string" ? node : undefined;
}

// Fallback language used only when a caller forgets to pass lang to t().
// Client components must receive lang via props (from serverLang()) and hand
// it explicitly to t(); nothing reads a cookie here anymore.
export function getLang() {
  return "en";
}

export function hasLang(key) {
  return (
    find(strings.en, key) !== undefined ||
    find(strings.km, key) !== undefined
  );
}

export function t(key, lang, vars) {
  const requested = lang === "km" || lang === "en" ? lang : getLang();
  const fallback = requested === "km" ? "en" : "km";
  const value =
    find(strings[requested], key) ?? find(strings[fallback], key) ?? key;
  if (!vars) {
    return value;
  }
  return value.replace(/\{(\w+)\}/g, (match, name) =>
    vars[name] !== undefined ? vars[name] : match
  );
}

// Bilingual label/status line, matching how the archive already displays
// "English / ភាសាខ្មែរ".
export function t2(key) {
  return `${t(key, "en")} / ${t(key, "km")}`;
}