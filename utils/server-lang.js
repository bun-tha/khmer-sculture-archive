import { cookies } from "next/headers";

// The language the server should render and validate in, read from the same
// "lang" cookie the header toggle writes, so client and server agree.
export async function serverLang() {
  const store = await cookies();
  return store.get("lang")?.value === "km" ? "km" : "en";
}