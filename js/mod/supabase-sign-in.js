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

export async function signOut() {
    await supabase.auth.signOut();
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session  // null if not signed in
}


export async function checkSignedIn() {
    const currentSession = await getSession();
    console.log({ currentSession });
    return currentSession;
}

export async function mkSignInButton() {
    const currentSession = await getSession();
    const user_metadata = currentSession?.user.user_metadata;
    const avatar_url = user_metadata?.avatar_url || "./img/account_circle.svg";
    const full_name = user_metadata?.full_name;
    // return { avatar_url, full_name }
    // const modMdc = await importFc4i("util-mdc");
    const btn = mkElt("button");
    btn.style = `
        background-repeat: no-repeat;
        background-size: contain;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99999;
        width: 50px;
        aspect-ratio: 1 / 1;
    `;
    btn.addEventListener("click", async evt => {
        evt.stopPropagation();
        const currentSession = await getSession();
        if (!currentSession) {
            signIn();
        } else {
            signOut();
        }
    });
    setImage();
    document.body.appendChild(btn);
    return btn;

    async function setImage() {
        const currentSession = await getSession();
        const user_metadata = currentSession?.user.user_metadata;
        const avatar_url = user_metadata?.avatar_url || "./img/account_circle.svg";
        btn.style.backgroundImage = `url(${avatar_url})`;
    }
}

let windowSign;
export async function signInPopup() {
    const { data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            skipBrowserRedirect: true,
            redirectTo: window.location.origin + "/supabase-oauth/callback.html",
        },
    });
    console.log("data.url", data.url);
    windowSign =
        window.open(data.url, "_blank", "width=500,height=600");
}

supabase.auth.onAuthStateChange((event, session) => {
    debugger;
    if (event === "SIGNED_IN") {
        // updateUserIcon(session);
    } else if (event === "SIGNED_OUT") {
        // updateUserIcon(null);
    }
    windowSign?.close();
});