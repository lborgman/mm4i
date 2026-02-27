// @ts-check

const SUPABASE_SIGN_IN_VER = "0.9.00";
console.log(`\nhere is supabase-sign-in.js, module,${SUPABASE_SIGN_IN_VER}`);
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
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                // redirectTo: window.location.href // The spec allowed an empty # at the end...
                redirectTo: window.location.origin + window.location.pathname
            }
        });
        console.log("data:", data, "error:", error);
        if (error) {
            debugger;
        }
    } catch (err) {
        console.log(err);
        debugger;
    }
}

export async function signOut() {
    await supabase.auth.signOut();
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession()
    // console.log("getSession", session);
    return await session  // null if not signed in
}


export async function checkSignedIn() {
    const currentSession = await getSession();
    console.log({ currentSession });
    return currentSession;
}

/**
 * 
 * @param {string} width 
 * @returns {HTMLButtonElement}
 */
export async function mkSignInButton(width) {
    const eltIframe = window.frameElement;
    if (!eltIframe) {
        debugger;
        throw Error("mkSigInButton: not in an <iframe>");
    }
    const currentSession = await getSession();
    // const user_metadata = currentSession?.user.user_metadata;
    // const avatar_url = user_metadata?.avatar_url || "./img/account_circle.svg";
    // const full_name = user_metadata?.full_name;
    // return { avatar_url, full_name }
    // const modMdc = await importFc4i("util-mdc");
    // const btn = mkElt("button");
    const btn = document.createElement("button");
    btn.style = `
        background-repeat: no-repeat;
        background-size: contain;
        position: fixed;
        top: 0;
        left: 0;
        border: none;
        z-index: 99999;
        width: ${width};
        aspect-ratio: 1 / 1;
    `;
    btn.addEventListener("click", async evt => {
        evt.stopPropagation();
        const currentSession = await getSession();
        if (!currentSession) {
            setSizeSigningIn();
            await signIn();
            // const s = await signIn();
            // const newSession = await getSession();
            // console.log("AFTER signIn", s, newSession);
            // debugger;
        } else {
            signOut();
        }
        // await setImage();
        // setSizeNormal();
        // getSize();
    });
    document.body.appendChild(btn);
    setSizeNormal();
    // await setImage();
    getSize();

    supabase.auth.onAuthStateChange(async (event, session) => {
        // console.log("SUPABASE AuthStateChange", event, session);
        setImage(session);
        /*
        if (event === "INITIAL_SESSION" && !session) {
            // Retry once after a short delay
            await new Promise(resolve => setTimeout(resolve, 200));
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
                setImage(retrySession);
            } else {
                debugger;
            }
        }
        */
    });
    return btn;

    // windowSign?.close();

    async function setImage(session) {
        const currentSession = session || await getSession();
        const user_metadata = currentSession?.user.user_metadata;
        const hasImage = !!user_metadata;
        // console.log("setImage", !!currentSession, !!user_metadata, "hasImage:", hasImage);
        // const avatar_url = user_metadata?.avatar_url || "./img/account_circle.svg";
        const avatar_url = hasImage ? user_metadata.avatar_url : "./img/account_circle.svg";
        // console.log({ avatar_url });
        btn.style.backgroundImage = `url(${avatar_url})`;
    }
    function setSizeNormal() {
        console.log("setSizeNormal");
        eltIframe.classList.remove("supabase-signing-in");
    }
    function setSizeSigningIn() {
        console.log("setSizeSigningIn");
        eltIframe.classList.add("supabase-signing-in");
    }
    function getSize() {
        // getBoundingClientRect
        const br = eltIframe.getBoundingClientRect();
        const w = br.width;
        // return w;
        btn.style.width = w + "px";
    }

}

/*
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
*/
