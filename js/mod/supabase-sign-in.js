// @ts-check

const SUPABASE_SIGN_IN_VER = "0.9.00";
logConsoleHereIs(`here is supabase-sign-in.js, module,${SUPABASE_SIGN_IN_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"

const supabase = createClient(
  // "https://xxxx.supabase.co",
  // Project ID mejnjeznpbwuxaiwwalx
  "https://mejnjeznpbwuxaiwwalx.supabase.co",

  // "your-anon-public-key"
  "sb_publishable_XQmN_X72TnTDiiAOZc-4NQ_HvwJxtck"
)

export async function signIn() {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  })
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session  // null if not signed in
}