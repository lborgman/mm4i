// @ts-check
const AI_HELPERS_VER = "0.0.1";
window["logConsoleHereIs"](`here is ai-helpers.js, module, ${AI_HELPERS_VER}`);
if (document.currentScript) { throw "ai-helpers.js is not loaded as module"; }

const mkElt = window["mkElt"];
const importFc4i = window["importFc4i"];

// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

const modApp = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js");
const modAiFirebase = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-ai.js");
// import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
function getFirebaseApp() {

    const firebaseConfig = {
        apiKey: "AIzaSyANd3vgrDROcCw4ZdZ2_xCXwcfGd8ZWH_o",
        authDomain: "accessgemini-830df.firebaseapp.com",
        projectId: "accessgemini-830df",
        storageBucket: "accessgemini-830df.firebasestorage.app",
        messagingSenderId: "836879860847",
        appId: "1:836879860847:web:d73903e879266f7cb1f99a"
    };
    const firebaseApp = modApp.initializeApp(firebaseConfig);
    return firebaseApp;
}

// Initialize Firebase
// const firebaseApp = modApp.initializeApp(firebaseConfig);
const firebaseApp = getFirebaseApp();

// Initialize the Gemini Developer API backend service
const aiGeminiThroughFirebase = modAiFirebase.getAI(firebaseApp, { backend: new modAiFirebase.GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
export const modelAiGeminiThroughFirebase = modAiFirebase.getGenerativeModel(aiGeminiThroughFirebase, { model: "gemini-2.5-flash" });

/*
export async function askGemini(prompt) {
    // Provide a prompt that contains text
    // const prompt = "Write a story about a magic backpack."
    // To generate text output, call generateContent with the text input
    let text = "(no result)";
    const result = { text };
    try {
        const generated = await modelAiGeminiThroughFirebase.generateContent(prompt);
        const response = generated.response;
        const text = response.text();
        result.text = text;
        console.log(text);
    } catch (err) {
        result.error = err;
    }
    return result;
}
// promiseDOMready
const promGeminiOk = new Promise(function (resolve, reject) {
    const prompt = "Are you ok?"
    askGemini(prompt).then(answer => {
        console.log("Gemini answer:", answer);
        if (answer.error) {
            reject(answer.error);
        } else {
            resolve(true);
        }
    });
});

export async function checkGeminiOk() {
    return promGeminiOk;
}
*/

/**
 * @typedef {Object} aiInfo
 * @property {boolean} testedChat
 * @property {boolean} q
 * @property {string|undefined} comment
 * @property {string} url
 * @property {string|undefined} androidIntent
 * @property {string} urlImg
 */
/**
 * 
 * @param {aiInfo} aiInfo
 * @returns {aiInfo}
 */
const mkAIinfo = (aiInfo) => { return aiInfo }

// https://chatgpt.com/share/68c0514e-c81c-8004-a196-d4f7f60c3930
const infoAI = {
    "Claude": mkAIinfo({
        testedChat: true,
        q: false,
        comment: undefined,
        url: "https://claude.ai",
        androidIntent: undefined,
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg"
    }),
    "ChatGPT": mkAIinfo({
        testedChat: true,
        q: false,
        comment: undefined,
        // url: "https://chatgpt.openai.com",
        url: "https://chatgpt.com/",
        androidIntent: "intent://chat.openai.com/#Intent;scheme=https;package=com.openai.chatgpt;end",
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/b/b5/ChatGPT_logo_Square.svg"

    }),
    "Gemini": mkAIinfo({
        testedChat: true,
        q: false,
        comment: undefined,
        url: "https://gemini.google.com/app", undefined,
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg"
    }),
    "Grok": mkAIinfo({
        testedChat: true,
        q: false,
        comment: "I have asked xAI about OAuth",
        url: "https://grok.com",
        androidIntent: undefined,
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Grok-feb-2025-logo.svg"
    }),
    "Perplexity": mkAIinfo({
        testedChat: true,
        q: true,
        comment: undefined,
        url: "https://www.perplexity.ai/search",
        androidIntent: undefined,
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg"
    }),
}



export async function generateMindMap(fromLink) {
    const modMdc = await importFc4i("util-mdc");
    const modTools = await importFc4i("toolsJs");
    const modMMhelpers = await importFc4i("mindmap-helpers");
    const inpLink = modMdc.mkMDCtextFieldInput(undefined, "text");
    const tfLink = modMdc.mkMDCtextField("Link to article/video", inpLink);
    const eltNotReady = mkElt("p", undefined, "Please try, but it is no ready!");
    eltNotReady.style = `color:red; font-size:1.2rem`;

    /*
    let eltOk = "";
    try {
        await checkGeminiOk();
    } catch (err) {
        const eltNoAPI = mkElt("details", undefined, [
            mkElt("summary", undefined, "Can't use Gemini at the moment"),
            `Gemini API Error: ${err}`,
        ]);
        eltNoAPI.style.color = "red";
        eltOk = eltNoAPI;
    }
    */

    const eltStatus = mkElt("div", undefined, "(empty)");
    if (fromLink) {
        inpLink.value = fromLink;
        checkInpLink();
    }
    inpLink.addEventListener("input", async _evt => {
        checkInpLink();
    });
    async function checkInpLink() {
        const funHasInternet = window["PWAhasInternet"];
        if (funHasInternet) {
            // const i = await window["PWAhasInternet"]();
            const i = await funHasInternet();
            if (!i) {
                eltStatus.textContent = "No internet connection";
                return;
            }
        }
        const b = divPrompt;
        const u = inpLink.value.trim();
        // console.log({ u });
        if (u.length < 13) {
            eltStatus.textContent = `Url too short: ${u.length} < 13`;
            b.inert = true;
            return;
        }
        if (!u.startsWith("https://")) {
            eltStatus.textContent = "Link must begin with 'https://'";
            b.inert = true;
            return;
        }
        // "head"
        b.inert = false;
        const r = await isReachableUrl(u);
        if (!r) {
            eltStatus.textContent = "Can't see if link is ok";
        } else {
            eltStatus.textContent = "Link seems ok";
        }
        updatePromptAi();
        const divWays = document.getElementById("div-ways");
        if (!divWays) throw Error(`Could not find element "div-ways"`);
        divWays.style.display = "block";
    }
    async function isReachableUrl(url) {
        let reachable = false;
        let resp;
        // let error;
        try {
            resp = await fetch(url, { method: "HEAD" });
            reachable = resp.ok;
        } catch (err) {
            console.log("HEAD", { err, resp });
            // error = err;
        }
        if (!reachable) {
            try {
                resp = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Range": "bytes=0-0" // Request only the first byte
                    }
                });
                reachable = resp.ok;
            } catch (err) {
                console.log("GET", { err, resp });
                // error = err;
            }
            finally {
                if (!reachable) {
                    // debugger;
                }
            }
        }
        return reachable;
    }



    let promptAi;
    function updatePromptAi() {
        promptAi = makeAIprompt(inpLink.value.trim(), 4);
        const bPrompt = document.getElementById("prompt-ai");
        if (!bPrompt) throw Error(`Could not find "prompt-ai"`);
        bPrompt.textContent = promptAi;
    }
    function makeAIprompt(link, maxDepth = 4) {
        const rules = [
            `*Summarize the article (or video)
                "${link}"
              into a mind map and
              output a strict, parse-ready JSON node array
              (flat; fields: id, name, parentid, and notes).`,
            `*Optional field "notes": For details, markdown format.`,
            `*Give as much details as in a text summary.`,
            `*Limit the hiearchy to max depth ${maxDepth} levels.`,
            `*Return only valid JSON (no text before or after).`,
            `*Check that the JSON is parseable in Chromium browsers.`
        ];
        let n = 0;
        const arr = rules
            .map(m => { return m.trim(); })
            .map(m => { return m.replaceAll(/ +/g, " "); })
            .map(m => { return modTools.normalizeLineEndings(m); })
            .map(m => {
                if (m.startsWith("*")) {
                    return `${++n}. ` + m.slice(1);
                }
            })
            ;
        return arr.join("\n\n");
        console.log({ arr });
        debugger;
        return `
1. Summarize the article (or video)
   "${link}"
   into a mind map and
   output a strict, parse-ready JSON node array
   (flat; fields: id, name, parentid, and notes).
2. Optional field "notes": Details. Markdown format.
3. Give as much details as in a text summary.
4. Limit the hiearchy to max depth ${maxDepth} levels.
5. Return only valid JSON (no text before or after).
6. Check that the JSON is parseable in Chromium browsers.
                `
        /*
        return `
You are an assistant that summarizes content into a structured mind map.

Task:
1. Read and process the content at this link: "${link}"
- If it's an article: extract and summarize the text. 
- If it's a video: use the transcript or main spoken content for the summary.
2. Summarize the content into hierarchical key points:
- Main idea
- Major subtopics
- Supporting details
3. Limit the hierarchy to a maximum depth of ${maxDepth} levels.
4. Output the result as a flat node array in **valid JSON syntax**, where:
- "id": unique number for each node
- "name": text for the node
- "parentId": id of the parent node (null for the main topic)
- "notes": additional context or supporting detail (empty string if not available)

Output format example:
[
{ "id": 1, "name": "Main Topic", "parentId": null, "notes": "Overall summary" },
{ "id": 2, "name": "Subtopic A", "parentId": 1, "notes": "Key points about A" },
{ "id": 3, "name": "Subtopic B", "parentId": 1, "notes": "Key points about B" },
{ "id": 4, "name": "Detail A1", "parentId": 2, "notes": "Supporting detail for A" }
]

Important:
- Give my strict JSON, parser-ready.
- Your answer must contain only the JSON.
`;
        */
    }


    let jsonNodeArray;

    const divPrompt = mkDivPrompt();
    divPrompt.inert = true;
    function mkDivPrompt() {
        const bPrompt = mkElt("div", undefined, promptAi);
        bPrompt.id = "prompt-ai";
        bPrompt.style = `
            white-space: pre-wrap;
            background-color: white;
            color: darkgreen;
            padding: 5px;
            padding-right: 0px;
        `;
        const divNewPrompt = mkElt("div", undefined, [
            mkElt("details", undefined, [
                mkElt("summary", undefined, "Show AI prompt"),
                // mkElt("div", undefined, bPrompt)
                bPrompt
            ])
        ]);
        divNewPrompt.style = `
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                `;
        return divNewPrompt;
    }

    const eltAItextarea = mkElt("textarea");
    eltAItextarea.style = `
                width: 100%;
                min-height: 4rem;
                resize: vertical;
            `;

    const eltAItextareaStatus = mkElt("div");
    eltAItextareaStatus.style.lineHeight = "1";
    let toDoIt;
    eltAItextarea.addEventListener("input", _evt => {
        clearTimeout(toDoIt);
        eltAItextareaStatus.style.color = "unset";
        // valid
        const strAIraw = eltAItextarea.value.trim();
        if (strAIraw.length == 0) {
            eltAItextareaStatus.textContent = "";
            return;
        }
        const { strAIjson, cleaned } = getJsonFromAIstr(strAIraw);

        const tellError = (txt) => {
            const divError = mkElt("div", undefined, txt);
            divError.style.userSelect = "all";
            divError.style.color = "darkred";
            divError.style.userSelect = "all";
            divError.style.marginTop = "10px";
            eltAItextareaStatus.textContent = "";
            eltAItextareaStatus.appendChild(mkElt("div", undefined, `Tell your AI that the JSON had this error:`));
            eltAItextareaStatus.appendChild(divError);
        }
        try {
            const j = JSON.parse(strAIjson);
            const nodeArray = modMMhelpers.nodeArrayFromAI2jsmindFormat(j);
            const res = modMMhelpers.isValidMindmapNodeArray(nodeArray);
            if (res.isValid) {
                const msgStatus = strAIjson == strAIraw ? "OK" : `OK (cleaned: ${cleaned.join(", ")})`;
                eltAItextareaStatus.textContent = msgStatus;
                eltAItextareaStatus.style.backgroundColor = "greenyellow";
                toDoIt = setTimeout(() => {
                    // "make mindmap"
                    const eltDialog = eltAItextareaStatus.closest("div.mdc-dialog");
                    if (!eltDialog) throw Error('Could not find .closest("div.mdc-dialg")');
                    eltDialog.remove();
                    doMakeGeneratedMindmap();
                }, 3000);
            } else {
                tellError(res.error);
                // tellError(res.message);
                // const objJsonErrorDetails = modTools.extractJSONparseError(res.message, strAIjson);
                // console.log({objJsonErrorDetails});
            }
        } catch (err) {
            tellError(err.message);
            const objJsonErrorDetails = modTools.extractJSONparseError(err.message, strAIjson);
            console.log({ objJsonErrorDetails });
            const eltBefore = mkElt("span", undefined,
                objJsonErrorDetails.context.before
            );
            const eltAfter = mkElt("span", undefined,
                objJsonErrorDetails.context.after
            );
            const eltErrorChar = mkElt("span", undefined,
                objJsonErrorDetails.context.errorChar
            );
            eltErrorChar.style.color = "red";
            const divErrorPos = mkElt("div", undefined, [
                eltBefore,
                eltErrorChar,
                eltAfter
            ]);
            divErrorPos.style = `
                padding: 10px;
                margin-top: 10px;
                background-color: yellow;
            `;
            eltAItextareaStatus.append(divErrorPos)
        }
    });

    const eltAIprovidersTrouble = mkElt("details", undefined, [
        mkElt("summary", undefined, "AI providers do not let me ask for you"),
        mkElt("div", undefined, [
            "TODO: explain this problem"
        ])
    ]);
    const eltContentProviderTrouble = mkElt("details", undefined, [
        mkElt("summary", undefined, "Content providers are blocking AI access"),
        mkElt("div", undefined, [
            `Many content providers are currently blocking AI agents from accessing their web pages.
                    This is a complicated problems.
                    I have described part of it here:
                    `,
            mkElt("div", undefined,
                mkElt("a", {
                    href: "https://tinyurl.com/AIvsContProv",
                    target: "_blank"
                }, "Why AI cant summarize a link when you ask it")
            ),
        ]),
    ]);

    const eltDivAI = mkElt("p", undefined, [
        mkElt("div", undefined, "Paste the JSON-formatted answer you got from AI:"),
        eltAItextarea,
        eltAItextareaStatus,
    ]);
    eltDivAI.classList.add("VK_FOCUS");

    const cardInput = mkElt("p", { class: "mdc-card display-flex" }, [
        mkElt("div", undefined, `Article or video to summarize as a mindmap:`),
        tfLink,
        eltStatus,
    ]);
    cardInput.style = `
                NOdisplay: flex;
                gap: 10px; 
                flex-direction: column;
                padding: 20px;
            `;
    // cardInput.classList.add("VK_FOCUS");

    const divAIhardWay = mkElt("div");
    divAIhardWay.style = `
        display: flex;
        flex-direction: row;
        flex-flow: wrap;
        gap: 10px;
        margin-bottom: 10px;
        `;

    const keyLsAIhard = "mm4i-ai-hardway";
    let valLsAIhard = localStorage.getItem(keyLsAIhard) || "none";
    {
        const radAI = mkElt("input", { type: "radio", name: "ai", value: "none", checked: true });
        const eltAI = mkElt("label", undefined, [radAI, "none"]);
        eltAI.classList.add("elt-ai");
        eltAI.style.background = "lightgray";
        divAIhardWay.appendChild(eltAI);
        // @ts-ignore
        // radAI.checked = true;
    }
    Object.entries(infoAI).forEach(e => {
        const [k, v] = e;
        const { testedChat, q, urlImg } = v;
        const radAI = mkElt("input", { type: "radio", name: "ai", value: k });
        const imgAI = mkElt("span");
        imgAI.style = `
            height: 20px;
            width: 20px;
            background-image: url(${urlImg});
            background-size: cover;
            background-position: top left;
        `;
        const eltAI = mkElt("label", undefined, [radAI, imgAI, k]);
        eltAI.classList.add("elt-ai");
        if (testedChat) { eltAI.style.backgroundColor = "yellowgreen"; }
        if (q) { eltAI.style.borderColor = "greenyellow"; }
        divAIhardWay.appendChild(eltAI);
    });
    divAIhardWay.addEventListener("change", evt => {
        const t = evt.target;
        if (!t) return;
        // @ts-ignore
        const nameAI = t.value;
        // const nameAI = t.getAttribute("value");
        localStorage.setItem(keyLsAIhard, nameAI);
    });
    const radCurrentAI = divAIhardWay.querySelector(`input[type=radio][value=${valLsAIhard}`);
    // @ts-ignore
    radCurrentAI.checked = true;
    const btnCopyAndOpenAI = modMdc.mkMDCbutton("Copy prompt and open AI", "raised");
    btnCopyAndOpenAI.style.textTransform = "none";
    btnCopyAndOpenAI.addEventListener("click", async evt => {
        evt.stopPropagation();
        const modTools = await importFc4i("toolsJs");
        await modTools.copyTextToClipboard(promptAi);

        const divHardWay = document.getElementById("hard-way");
        if (!divHardWay) throw Error('Could not find "#hard-way"');
        divHardWay.querySelector("input[type=radio][name=ai]:checked");
        const inpAI = divHardWay.querySelector("input[type=radio][name=ai]:checked");
        if (!inpAI) { throw Error("no selection of AI") }
        // @ts-ignore
        const nameAI = inpAI.value;
        if (nameAI == "none") {
            modMdc.mkMDCsnackbar("Copied prompt for AI");
            return;
        }
        const info = infoAI[nameAI];
        if (!info) { throw Error(`Did not find info for AI "${nameAI}"`); }
        const urlAIweb = info.url;
        const urlAIintent = info.androidIntent;
        if (!urlAIweb) {
            modMdc.mkMDCsnackbar(`Copied prompt, do not know how to open AI "${nameAI}"`);
            return;
        }
        modMdc.mkMDCsnackbar(`Copied prompt, opening AI "${nameAI}"`);
        let urlWeb = urlAIweb;
        if (info.q) {
            const objUrl = new URL(urlWeb);
            objUrl.searchParams.append("q", promptAi);
            urlWeb = objUrl.href;
        }
        let urlIntent = info.androdIntent;
        if (urlIntent) {
            if (info.q) {
                const objUrl = new URL(urlIntent);
                objUrl.searchParams.append("q", promptAi);
                urlIntent = objUrl.href;
            }
        }
        setTimeout(() => {
            // const ret = window.open(url, "_blank");
            // const handle = _openWithFallback(urlIntent, urlWeb);
            // console.log("open ai url", { handle });
            openIntentFallbackUrl(urlIntent, urlWeb)
        }, 2000);
    });

    /**
     * Open app, fallback to web page.
     * This version is Chrome specific.
     * https://grok.com/share/bGVnYWN5LWNvcHk%3D_0aeb999f-448c-473c-89c4-ad3713907f09
     * 
     * @param {string} intentUrl 
     * @param {string} webUrl 
     */
    async function openIntentFallbackUrl(intentUrl, webUrl) {

        /** @type {Window|null} */
        let appWindow;

        let canOnlyUrl = !intentUrl;
        if (!canOnlyUrl) {
            const userAgent = navigator.userAgent.toLowerCase();
            const isAndroid = userAgent.indexOf("android") > -1;
            canOnlyUrl = !isAndroid;
        }


        if (canOnlyUrl) {
            appWindow = window.open(webUrl, "_blank");
            if (appWindow == null) {
                modMdc.mkMDCdialogConfirm("Popups are blocked, can't open url", "Close");
                return null;
            }
            return appWindow;
        }

        if (intentUrl) {
            console.log('Attempting to open app...');
            appWindow = window.open(intentUrl, '_blank');
            if (appWindow == null) {
                modMdc.mkMDCdialogConfirm("Popups are blocked, can't open app", "Close");
                return null;
            }
            return appWindow;
        }

        // Chrome-specific: Use a single timeout to check if the app opened
        setTimeout(() => {
            if (appWindow && !appWindow.closed) {
                // Window still open, app likely didn't launch
                // FIX-ME: Will chrome try to close it???
                console.log('App not found, redirecting to web page...');
                // appWindow.location.href = webUrl;
                appWindow.close();
                appWindow = window.open(webUrl, "_blank");
            } else {
                // Window closed or null, assume app opened
                console.log('App opened successfully!');
            }
        }, 1000);

    }
    /**
     * https://chatgpt.com/share/68c20d3b-e168-8004-8cea-c80d30949054
     * 
     * @param {string} intentUrl 
     * @param {string} webUrl 
     * @returns {Promise<Window|null>}
     */
    async function _openWithFallback(intentUrl, webUrl) {
        const modTools = await importFc4i("toolsJs");
        setTimeout(() => { check(); }, 2000);
        let win = null;
        if (intentUrl) {
            try {
                win = window.open(intentUrl, "_blank");
                // win == null always means popups are blocked
                if (win == null) {
                    modTools.mkMDCsnackbar("Popups are blocked, can't open intent");
                    return null;
                }
                return win;
            } catch (e) {
                // Firefox throw synchronously if scheme is unsupported
                const msg = `Opening intent ${intentUrl} failed: ${e.message}`;
                console.error(msg);
                modTools.mkMDCsnackbar(msg);
            }
        }
        if (!win) {
            try {
                win = window.open(webUrl, "_blank");
                // win == null always means popups are blocked
                if (win == null) {
                    modTools.mkMDCsnackbar("Popups are blocked, can't open url");
                    return null;
                }
                return win;
            } catch (e) {
                // blocked
                const msg = `Opening ${webUrl} failed: ${e.message}`;
                console.error(msg);
                modTools.mkMDCsnackbar(msg);
            }
        }
        return null;

        // In case a useless about:blank tab was opened (desktop case)
        function check() {
            if (!win) return;
            try {
                // If location is still about:blank after ~1s → fallback
                if (win.location.href === "about:blank" || win.location.href === "about:blank#blocked") {
                    win.close();
                    modTools.mkMDCsnackbar(`The url does not seem to have been opened`);
                }
            } catch (e) {
                // Cross-origin error usually means the OS intercepted successfully (Android) → do nothing
            }
        }
    }


    const cardPrompt = mkElt("p", { class: "mdc-card display-flex" }, [
        `I have created an AI prompt that you should use.`,
        divPrompt,
    ]);
    cardPrompt.style = `
                NOdisplay: flex;
                gap: 10px; 
                flex-direction: column;
                padding: 20px;
            `;


    const btnEasyWay = modMdc.mkMDCbutton("Make mindmap", "raised");


    const eltWhyThisTrouble = mkElt("details", { class: "mdc-card" }, [
        mkElt("summary", undefined, "This should have been more easy!"),
        mkElt("div", undefined, [
            mkElt("p", undefined, `
                    Yes, it should be more easy.
                    I have asked xAI to fix a little part of this for Grok:
                `),
            mkElt("p", { style: "margin-left: 20px;" },
                mkElt("a", { href: "https://x.com/lborgman/status/1964425427339923809" },
                    "Can xAI fix it for their AI (Grok)?")
            ),
            mkElt("p", undefined, `
                    The tweet is short and not so easy to understand, perhaps.
                    Below are some a little bit more easy to understand
                    details about two problems I see.
                    (There are more problems, though.)
                `),
            eltContentProviderTrouble,
            eltAIprovidersTrouble,
        ])
    ]);
    eltWhyThisTrouble.style = `
                padding: 10px;
                background-color: #fff6;
                color: black;
            `;



    const divWhyNotEasy = mkElt("div", undefined, [
        mkElt("p", undefined, [
            `The intention here is to send the prompt 
            to the AI of your choice and then show the mindmap
            that the AI made.
            `,
        ]),
        mkElt("p", undefined, [
            `Unfortunately it can't be done this easy yet.
            So for now please click on the HARD WAY tab above.
            `,
        ]),

        eltWhyThisTrouble
    ]);
    divWhyNotEasy.style.display = "none";
    divWhyNotEasy.style.color = "red";
    btnEasyWay.addEventListener("click", _evt => {
        btnEasyWay.style.display = "none";
        divWhyNotEasy.style.display = "unset";
    });
    const divListAIeasyWay = mkElt("div");
    divListAIeasyWay.style = ` display: flex; flex-direction: row; gap: 10px; flex-wrap: wrap; `;

    const selectHeader = mkElt("div", undefined, "Select AI to use:");
    selectHeader.style = `
        font-weight: bold;
        margin-bottom: 20px;
    `

    const divSelectAIeasyWay = mkElt("div", { class: "NOmdc-card" }, [
        selectHeader,
        divListAIeasyWay
    ]);
    Object.entries(infoAI).forEach(e => {
        const [k, v] = e;
        const { testedChat, q } = v;
        const radAI = mkElt("input", { type: "radio", name: "ai" });
        const eltAI = mkElt("label", undefined, [radAI, k]);
        eltAI.classList.add("elt-ai");
        if (testedChat) { eltAI.style.backgroundColor = "yellow"; }
        if (q) { eltAI.style.borderColor = "greenyellow"; }
        divListAIeasyWay.appendChild(eltAI);
    });

    const styleWays = " background-color: #80800036; padding: 10px; ";
    const divEasyWay = mkElt("div", undefined, [
        divSelectAIeasyWay,
        mkElt("p", undefined, btnEasyWay),
        divWhyNotEasy
    ]);
    divEasyWay.id = "easy-way";
    divEasyWay.style = styleWays;

    const divListAIhardWay = mkElt("div");
    divListAIhardWay.style = `
        display: flex;
        flex-direction: row;
        gap: 10px;
        flex-wrap: wrap;
        `;
    const divHardWay = mkElt("div", undefined, [
        mkElt("div", undefined, cardPrompt),
        // divListAIhardWay,
        divAIhardWay,
        mkElt("div", undefined, btnCopyAndOpenAI),
        mkElt("div", undefined, eltDivAI),
    ]);
    divHardWay.id = "hard-way";
    divHardWay.style = styleWays;

    // const tabRecs = ["Easy way", "Hard way"];
    // const contentElts = mkElt("div", undefined, [divEasyWay, divHardWay]);
    const tabRecs = ["Hard way", "Easy way"];
    const contentElts = mkElt("div", undefined, [divHardWay, divEasyWay]);
    if (tabRecs.length != contentElts.childElementCount) throw Error("Tab bar setup number mismatch");
    const eltTabs = modMdc.mkMdcTabBarSimple(tabRecs, contentElts, undefined);

    const divTabs = mkElt("p", undefined, [eltTabs, contentElts]);
    const divWays = mkElt("div", undefined, [
        mkElt("p", undefined, "Choose how to proceed:"),
        divTabs
    ]);
    divWays.id = "div-ways";
    // divWays.style = styleWays;
    divWays.style.display = "none";
    // ebbrowserInfoKeys



    const body = mkElt("div", undefined, [
        eltNotReady,
        // eltOk,
        mkElt("h2", undefined, "Make mindmap from link"),
        mkElt("div", undefined, cardInput),
        divWays,
    ]);
    modMdc.mkMDCdialogAlert(body, "Close");
    async function doMakeGeneratedMindmap() {
        const strAIraw = eltAItextarea.value;


        const { strAIjson } = getJsonFromAIstr(strAIraw);
        jsonNodeArray = JSON.parse(strAIjson);
        console.log({ jsonNodeArray });

        const nodeArray = modMMhelpers.nodeArrayFromAI2jsmindFormat(jsonNodeArray);


        // debugger;
        const mindStored = {
            data: nodeArray,
            format: "node_array",
            key: "key-generate",
            meta: { name: "key-generate" }
        }
        const modJsEditCommon = await importFc4i("jsmind-edit-common");
        const jm = await modJsEditCommon.displayOurMindmap(mindStored);
        jm.select_node(jm.get_root());
        jm.NOT_SAVEABLE = "This mindmap is made from a link";
        document.getElementById("mm4i-btn-history")?.remove();
        // addShareMarker
        const addAIgeneratedMarker = () => {
            // if (spTitle == null) throw Error("spTitle == null");
            const divInfo = mkElt("div", undefined,
                mkElt("b", undefined, "AI generated mindmap"),
            );
            // divInfo.classList.add("fixed-at-bottom");
            divInfo.style = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            `;
            const eltTellGenerated = mkElt("div", undefined, [
                divInfo,
                // btnInfoLinked
            ]);
            eltTellGenerated.style = `
                    position: fixed; bottom: 0; left: 0;
                    min-height: 50px; min-width: 100px;
                    max-width: 270px;
                    NOdisplay: flex;
                    gap: 10px;
                    padding: 10px;
                    z-index: 99999;
                    color: black;
                    background-color: magenta;
                    background-color: #f068f0;
                `;
            eltTellGenerated.id = "generated-marker";
            eltTellGenerated.classList.add("generated-marker");
            eltTellGenerated.classList.add("fixed-at-bottom");
            document.body.appendChild(eltTellGenerated);
        }
        addAIgeneratedMarker();
    }
    /**
     * 
     * @param {string} strAI 
     * @returns {Object}
     */
    function getJsonFromAIstr(strAI) {
        function cleanJsonString(jsonString) {
            // Remove common problematic Unicode characters
            return jsonString
                .replace(/\u200B/g, '') // Zero-width space
                .replace(/\u200C/g, '') // Zero-width non-joiner
                .replace(/\u200D/g, '') // Zero-width joiner
                .replace(/\uFEFF/g, '') // Byte order mark
                .replace(/\u00A0/g, ' ') // Non-breaking space to regular space
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
                .trim(); // Remove leading/trailing whitespace
        }

        // You may get more from the AI than the JSON:
        let strOnlyJson = cleanJsonString(strAI);
        const cleaned = [];

        // Remove prompt if it is there:
        const dummyPromptAI = makeAIprompt("dummy");
        const a = dummyPromptAI.split("\n");
        const l = a.length;
        const lastLine = a[l - 2];
        const pp = strOnlyJson.indexOf(lastLine);
        if (pp > -1) {
            strOnlyJson = strOnlyJson.slice(pp + lastLine.length);
            cleaned.push("prompt");
        }

        // Remove anyting before or after json:
        const p1 = strOnlyJson.indexOf("[");
        if (p1 > -1) {
            strOnlyJson = strOnlyJson.slice(p1);
            cleaned.push("before");
        }
        const p2 = strOnlyJson.indexOf("]");
        if (p2 > -1) {
            strOnlyJson = strOnlyJson.slice(0, p2 + 1);
            cleaned.push("after");
        }
        const strAIjson = strOnlyJson;
        return { strAIjson, cleaned };
    }

}
