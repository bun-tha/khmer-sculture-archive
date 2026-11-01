import HomeClient from "../components/HomeClient.js";
import { serverLang } from "../utils/server-lang.js";

// Server wrapper: reads the language cookie once, passes it to the client
// half of the home page, so rendering never depends on client-side state.
export default async function HomePage() {
  const lang = await serverLang();
  return <HomeClient lang={lang} />;
}