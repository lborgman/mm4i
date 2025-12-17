// @ts-check
const AI_HELPERS_VER = "0.0.1";

// @ts-ignore
window["logConsoleHereIs"](`here is ai-helpers.js, module, ${AI_HELPERS_VER}`);
if (document.currentScript) { throw "ai-helpers.js is not loaded as module"; }

// @ts-ignore
const mkElt = window["mkElt"];

// @ts-ignore
const importFc4i = window["importFc4i"];

// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

// const modApp = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js");
// const modAiFirebase = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-ai.js");
// import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const modTools = await importFc4i("toolsJs");
const modMMhelpers = await importFc4i("mindmap-helpers");

const userAgent = navigator.userAgent.toLowerCase();
const isAndroid = userAgent.indexOf("android") > -1;

// @ts-ignore
/** @type { import('../../js/mod/local-settings.js') } */
const modLocalSettings = await importFc4i("local-settings");
/** @extends modLocalSettings.LocalSetting */
class SettingsMm4iAI extends modLocalSettings.LocalSetting {
    /**
     * 
     * @param {string} key 
     * @param {string|number|boolean} defaultValue 
     */
    constructor(key, defaultValue) { super("mm4i-settings-ai-", key, defaultValue); }
}
const settingPuterAImodel = new SettingsMm4iAI("puter-ai-model", "");
// const settingHuggingFaceAImodel = new SettingsMm4iAI("hugging-face-ai-model", "");
const settingUsedAIname = new SettingsMm4iAI("used-ai-name", "groq");

const settingTemperatureType = new SettingsMm4iAI("ai-temperature-type", "careful");
const arrTemperatureTypes = ["careful", "normal", "creative"];
/**
 * 
 * @param {string} tempType 
 * @returns {number}
 */
const tempType2temperature = (tempType) => {
    switch (tempType) {
        // case "careful": return 0.2;
        case "careful": return 0.15;
        // case "normal": return 0.4;
        case "normal": return 0.3;
        // Too many errors with 1.0
        // case "creative": return 0.6;
        case "creative": return 0.5;
        default:
            console.error(`Bad tempType: "${tempType}"`);
            settingTemperatureType.reset();
            return 0.15;
    }
}

const settingProceedAPI = new SettingsMm4iAI("proceed-api", true);
const settingNotifyReadySec = new SettingsMm4iAI("notify-ready-api", 10);

/** @type {string|Object} resAI */ let lastResAI;
/** @type {string} */ let tofLastResAI;

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
/*
function _getFirebaseApp() {

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
*/

// Initialize Firebase
// const firebaseApp = getFirebaseApp();

// Initialize the Gemini Developer API backend service
// const aiGeminiThroughFirebase = modAiFirebase.getAI(firebaseApp, { backend: new modAiFirebase.GoogleAIBackend() });

// Create a `GenerativeModel` instance with a model that supports your use case
// export const modelAiGeminiThroughFirebase = modAiFirebase.getGenerativeModel(aiGeminiThroughFirebase, { model: "gemini-2.5-flash" });


/**
 * @typedef {(prompt: string, apiKey: string) => Promise<string | Error>} funCallAI
 */

/**
 * @typedef {Object.<string, any>} aiInfo
 * @property {string} company
 * @property {string} urlDescription
 * @property {boolean} [qW]
 * @property {boolean} [qA]
 * @property {string} [comment]
 * @property {string} [urlChat]
 * @property {boolean} [isPWA] - is urlChat a PWA?
 * @property {string} [urlImg]
 * @property {string} [android]
 * @property {string} [pkg]
 * @property {funCallAI} [fun]
 * @property {string} [urlAPIkey]
 */

/**
 * 
 * @param {aiInfo} aiInfo
 * @returns {aiInfo}
 */
const mkAIinfo = (aiInfo) => { return aiInfo }

/** * @param {aiInfo} aiInfo * @param {string} key * @returns {boolean|funCallAI|string} */
function getAIinfoValue(aiInfo, key) {
    const rec = aiInfo[key];
    if (Array.isArray(rec)) { return rec[0]; }
    return rec;
}
/** * @param {aiInfo} aiInfo * @param {string} key * @returns {string|undefined} */
function _getAIinfoComment(aiInfo, key) {
    const rec = aiInfo[key];
    if (Array.isArray(rec)) { return rec[1]; }
    return undefined;
}

// https://chatgpt.com/share/68c0514e-c81c-8004-a196-d4f7f60c3930
/**
 * @type {Object<string,aiInfo>}
 */
const infoAIs = {
    "HuggingFace": mkAIinfo({
        company: "Hugging Face",
        urlDescription: "https://huggingface.co/",
        // callHuggingFaceAPI
        fun: callHuggingFaceInference,
        urlImg: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg",
        urlAPIkey: "https://huggingface.co/settings/tokens",
    }),
    "Gemini": mkAIinfo({
        company: "Google",
        urlDescription: "https://gemini.google/about/",
        fun: callGeminiAPI,
        pkg: "com.google.android.apps.bard",
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg",
        urlChat: "gemini.google.com/app",
        isPWA: false, // 2025-10-04
        canReadYouTube: true,
        urlAPIkey: "https://support.gemini.com/hc/en-us/articles/360031080191-How-do-I-create-an-API-key"
    }),
    "ChatGPT": mkAIinfo({
        company: "OpenAI",
        urlDescription: "https://openai.com/index/chatgpt/",
        android: "intent://chat.openai.com/?q=PLACEHOLDER#Intent;scheme=https;package=com.openai.chatgpt;end;",
        fun: callOpenAIapi,
        pkg: "com.openai.chatgpt",
        qA: true,
        qW: true,
        urlChat: "chatgpt.com",
        isPWA: false, // 2025-10-04
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/b/b5/ChatGPT_logo_Square.svg"
    }),
    "Claude": mkAIinfo({
        company: "Anthropic",
        urlDescription: "https://www.anthropic.com/",
        pkg: "com.anthropic.claude",
        urlChat: "claude.ai",
        isPWA: true, // 2025-10-04
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg"
    }),
    "Grok": mkAIinfo({
        company: "xAI",
        urlDescription: "https://x.ai/grok",
        // fun: callGrokApi, // The other version seems better, but I can not test with a valid key
        fun: callOpenAIapi,
        pkg: "ai.x.grok",
        qW: true,
        urlChat: "grok.com/chat",
        isPWA: true, // 2025-10-04
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Grok-feb-2025-logo.svg"
    }),

    "groq": mkAIinfo({
        company: "groq",
        urlDescription: "https://console.groq.com/",
        fun: callGroqAPI,
        urlAPIkey: "https://console.groq.com/keys",
        urlImg: "./img/groq-image.svg"
    }),

    "Hugging Face": mkAIinfo({
        company: "Hugging FAce",
        urlDescription: "https://huggingface.co/",
        fun: callHuggingFaceAPI,
        // pkg: "ai.x.grok",
        // qW: true,
        // urlChat: "grok.com/chat",
        isPWA: false, // 2025-10-12, dummy
        urlImg: "https://huggingface.co/front/assets/huggingface_logo-noborder.svg"
    }),


    "Le Chat": mkAIinfo({
        company: "Mistral",
        urlDescription: "https://mistral.ai/products/le-chat",
        // fun: callGrokApi, // The other version seems better, but I can not test with a valid key
        // fun: callOpenAIapi,
        fun: callMistralAPI,
        urlAPIkey: "https://console.mistral.ai/",
        // pkg: "ai.x.grok",
        qW: false,
        urlChat: "chat.mistral.ai/",
        isPWA: false, // 2025-10-11
        urlImg: "./img/mistral-ai-rainbow.svg"
    }),



    "Perplexity": mkAIinfo({
        company: "Perplexity",
        urlDescription: "https://www.perplexity.ai/hub/getting-started",
        android: "intent://perplexity.sng.link/A6awk/ppas?q=PLACEHOLDER#Intent;scheme=singular-perplexity;package=ai.perplexity.app.android;end;",
        qW: true,
        pkg: "ai.perplexity.app.android",
        urlChat: "perplexity.ai",
        isPWA: false, // 2025-10-04
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg"
    }),
}
/**
 * @type {Object<string,string[][]>}
 */
const testIntentsAI = {
    "Gemini":
        [
            [
                'intent://search/#Intent;scheme=app;package=com.google.android.googlequicksearchbox;end;',
                "Opens Google Play"
            ],
            [
                "intent://gemini.google.com/?q=PLACEHOLDER#Intent;scheme=https;package=com.google.gemini;end;",
                "Opens Google Play"
            ],
            [
                "intent://gemini.google.com/?q=PLACEHOLDER#Intent;scheme=https;package=com.google.android.apps.gemini;end;",
                "Opens Google Play"
            ],
        ],
    "ChatGPT":
        [
            [
                "intent://chat.openai.com/?q=PLACEHOLDER#Intent;scheme=https;package=com.openai.chatgpt;end;",
                "Opens android app and q works"
            ],
        ],
    "Claude": [],
    "Grok":
        [
            [
                "intent://#Intent;package=ai.x.grok;end;",
                "Opens Google play"
            ],
            [
                "https://play.google.com/store/apps/details?id=ai.x.grok",
                "Does nothing"
            ],
            [
                "intent://#Intent;component=ai.x.grok/.MainActivity;end",
                "Does nothing"
            ],
            [
                "https://play.google.com/store/apps/details?id=ai.x.grok",
                "Does nothing"
            ],
            [
                "https://play.google.com/store/apps/details?id=ai.x.grok",
            ],
            [
                "market://details?id=ai.x.grok",
                "Opens https://market.android.com/details?id=ai.x.grok;"
            ],
        ],
    "Perplexity":
        [
            [
                "intent://perplexity.sng.link/A6awk/ppas?q=PLACEHOLDER#Intent;scheme=singular-perplexity;package=ai.perplexity.app.android;end;",
                "Starts app, but q does not work"
            ],
        ]
}


const txtBtnCopyCliboard = "I've copied AI answer";

/** @type {function|undefined} */
let initAItextarea;
/**
 * 
 * @param {string} fromLink 
 */
export async function generateMindMap(fromLink) {
    const modMdc = await importFc4i("util-mdc");
    // const modMMhelpers = await importFc4i("mindmap-helpers");
    const inpLink = modMdc.mkMDCtextFieldInput(undefined, "text");
    const tfLink = modMdc.mkMDCtextField("Link to article/video", inpLink);
    initAItextarea = onAItextareaInput;

    /** @type {Promise<string>|undefined} */
    let promFetch;

    // const eltStatus = mkElt("div", undefined, "(empty)");
    const eltStatus = mkElt("div");
    eltStatus.style.minHeight = "1.25em";
    eltStatus.style.lineHeight = "normal";
    eltStatus.style.backgroundColor = "yellowgreen";
    if (fromLink) {
        inpLink.value = fromLink;
        checkInpLink();
    }
    inpLink.addEventListener("input", async () => {
        divPrompt.inert = true;
        btnGo.inert = true;
        // FIX-ME: cancel fetch
        promFetch = undefined;
        debouncedCheckInpLink();
    });
    inpLink.addEventListener("change", async () => {
        // FIX-ME: cancel fetch
        promFetch = undefined;
        debouncedCheckInpLink();
    });

    let promInpLink;
    async function debouncedCheckInpLink() {
        const p = modTools.callDebouncedGemini(checkInpLink, 300);
        console.log("debounce", p);
        promInpLink = p;
        return p;
    }

    /** @type {string|null} */
    let youTubeVideoId = null;
    async function checkInpLink() {
        const modPWA = await importFc4i("pwa");
        if (!(await modPWA.PWAhasInternet())) {
            eltStatus.textContent = "No internet connection";
            return;
        }

        const eltDialogContent = inpLink.closest("div.mdc-dialog__content");
        eltStatus.textContent = "";

        const linkSource = inpLink.value.trim();

        youTubeVideoId = modTools.isValidYouTubeID(linkSource) ? linkSource : modTools.getYouTubeVideoId(linkSource);
        // console.log({ youTubeVideoId });
        if (youTubeVideoId) {
            eltDialogContent.classList.add("is-youtube-video");

            const eltLogo = mkEltYouTubeLogo("18px");
            eltStatus.appendChild(eltLogo);
            btnGo.inert = false;
            return;
        }
        eltDialogContent.classList.remove("is-youtube-video");

        // const b = divPrompt;

        const vu = await modTools.isValidUrlFormat(linkSource);
        eltStatus.textContent = "";
        if (vu != true) {
            eltStatus.append(vu.message);
            divPrompt.inert = true;
            btnGo.inert = true;
            return false;
        }
        divPrompt.inert = false;
        btnGo.inert = false;

        const divWays = document.getElementById("div-ways");
        if (!divWays) throw Error(`Could not find element "div-ways"`);
        divWays.style.display = "block";
        return true;
    }
    // @ts-ignore
    async function _isReachableUrl(url) {
        let reachable = false;
        let resp;
        // let error;
        try {
            resp = await fetch(url, { method: "HEAD" });
            reachable = resp.ok;
        } catch (err) {
            const errorMsg = String(err);
            console.log("HEAD", errorMsg, { err, resp });
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
            } catch (error) {
                const errorMsg = String(error);
                console.log("GET", errorMsg, { error, resp });
            }
            finally {
                if (!reachable) {
                    // debugger;
                }
            }
        }
        return reachable;
    }

    /**
     * 
     * @param {string} height 
     * @returns {HTMLDivElement}
     */
    function mkEltYouTubeLogo(height) {
        const eltLogo = mkElt("div");
        eltLogo.style.aspectRatio = "502 / 210.65";
        eltLogo.style.height = height;
        eltLogo.style.display = "inline-block";

        eltLogo.style.backgroundColor = "red";
        const urlYouTubeLogo = "https://upload.wikimedia.org/wikipedia/commons/e/e1/Logo_of_YouTube_%282015-2017%29.svg";
        eltLogo.style.backgroundImage = `url("${urlYouTubeLogo}")`;
        eltLogo.style.backgroundSize = "contain";
        return eltLogo;
    }


    /**
     * @typedef {"YouTubeId" | "link" | "text" | "none"} AIpromptDataType
     */
    /**
     * @typedef {Object} AIpromptData
     * @property {AIpromptDataType} dataType
     * @property {string} data
     */

    // let promptAI = "";

    /**
     * @param {string} linkSource
     * @param {boolean} [needToFetch]
     * @return {Promise<AIpromptData>}
     */
    async function getAIpromptData(linkSource, needToFetch = true) {
        /**
         * 
         * @param {AIpromptDataType} tpe 
         * @param {*} [data]
         */
        const makeReturn = (tpe, data = undefined) => {
            return {
                dataType: tpe,
                data
            }

        }

        // if (needToFetch && youTubeVideoId) { throw Error("Both youTubeVideoId and needToFetch"); }
        if (youTubeVideoId) { return makeReturn("YouTubeId", youTubeVideoId); }

        /** @type {boolean} */
        // const validLinkFormat = await debouncedCheckInpLink();
        // debugger;
        const validLinkFormat = promInpLink ? await promInpLink
            : await modTools.isValidUrlFormat(linkSource, undefined, false);
        if (!validLinkFormat) {
            return makeReturn("none", `validLinkFormat == "${validLinkFormat}"`); // { validLinkFormat }; // FIX-ME: invalid format???
        }

        if (!needToFetch) { return makeReturn("link", linkSource); }

        promFetch = promFetch ||
            modTools.fetchFreshViaProxy(await modTools.getFetchableLink(linkSource));
        const txt = await promFetch;
        return makeReturn("text", txt);

        // XpromptAI = XmakeAIprompt(inpLink.value.trim(), 4);
        // const bPrompt = document.getElementById("prompt-ai");
        // if (!bPrompt) throw Error(`Could not find "prompt-ai"`);
        // bPrompt.textContent = XpromptAI;
    }
    /**
     * 
     * @param {AIpromptData} promptData 
     * @param {number} maxDepth 
     * @returns {string}
     */
    function makeAIprompt(promptData, maxDepth = 4) {
        // Today (2025-11-16) this is how the link must be handled:
        // A) If it is a YouTube video then Gemini must be used since
        //    it is the only AI with access to the info on YouTube.com
        // B) Otherwise the page linked to must be fetched since
        //    today no AI seems to fetch the page by
        //    themselves (they use what the already has fetched - which
        //    might contain something very different).

        const endMark = "----";
        const articleMark = ">>> ARTICLE >>>";

        let specRule;
        let txtArticle;
        switch (promptData.dataType) {
            case "link":
                debugger;
                const nocacheLink = /** @type {string} */ (modTools.addSafeCacheBuster(promptData.data));
                specRule =
                    `*Open and read the actual web page at "${nocacheLink}"
                    using the web tool (do not rely on memory or guesses).
                    If you do not have the ability to open and read a web page
                    then just return "ERROR: I do not have the ability to fetch a web page".
                    `;
                break;
            case "text":
                const htmlArticle = promptData.data;
                txtArticle = extractText(htmlArticle);
                if (!txtArticle) {
                    // debugger;
                    return null;
                }
                specRule =
                    `*The text you should summarize is found below after "${articleMark}".  `;
                break;
            case "none":
                debugger; // FIX-ME: invalid link, catch it earlier!
                break;
            default:
                throw Error(`Unexpected data type: "${promptData.dataType}"`);
        }
        // debugger;

        const rules = [
            `*If this prompt does not end with ${endMark}, consider it incomplete and notify the user
              that the prompt appears to be cut off.`,

            /*
              `*Open and read the actual web page at "${nocacheLink}"
                using the web tool (do not rely on memory or guesses).`,
            */
            specRule,

            `*Summarize the article (or video) 
              into 1 mind map (with 1 root node) and
              output a strict, parse-ready JSON node tree
              (node fields: id, name, parentid, and notes).`,
            // output a strict, parse-ready JSON node array
            // (flat; fields: id, name, parentid, and notes).`,

            `*Optional field "notes": For details, markdown format.`,
            `*Give as much details as in a text summary.`,
            `*Limit the hiearchy to max depth ${maxDepth} levels.`,
            `*Return only valid JSON (no text before or after).`,
            // `*Validate that the JSON is parseable in Chromium browsers.`,
            `*Preserve escaped newlines (\\n) inside string values for JSON validity;
              they should represent Markdown line breaks when rendered.`
        ];
        if (txtArticle) {
            rules.push(articleMark);
            rules.push(txtArticle);
        }
        rules.push(`${endMark}`);



        let n = 0;
        const arr = rules
            .map(m => { return m.trim(); })
            .map(m => { return m.replaceAll(/\n/g, " "); })
            .map(m => { return m.replaceAll(/ +/g, " "); })
            .map(m => { return modTools.normalizeLineEndings(m); })
            .map(m => {
                if (m.startsWith("*")) {
                    return `${++n}. ` + m.slice(1);
                } else {
                    return m;
                }
            })
            ;
        const prompt = arr.join(";\n\n");
        logEstimateAItokens(prompt, "makeAIprompt");
        return prompt;

        console.log({ arr });
        debugger; // eslint-disable-line no-debugger
        const OLDprompt =
            `
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
                `;
        logEstimateAItokens(OLDprompt, "makeAIprompt");
        return OLDprompt;
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

    async function getAIprompt() {
        const linkSource = inpLink.value.trim();
        const promptData = await getAIpromptData(linkSource);
        // console.log({ promptData });
        const prompt = makeAIprompt(promptData);
        return prompt;
    }


    let theValidJsonNodeArray;
    let theValidRoot;

    const divPrompt = mkDivPrompt();
    divPrompt.id = "mk-div-prompt";
    divPrompt.inert = true;
    function mkDivPrompt() {
        // const bPrompt = mkElt("div", undefined, XpromptAI);
        const bPrompt = mkElt("div");
        bPrompt.id = "prompt-ai";
        bPrompt.style = `
            white-space: pre-wrap;
            background-color: white;
            color: darkgreen;
            padding: 5px;
            padding-right: 0px;
        `;
        // const btnCopyPrompt = modMdc.mkMDCbutton("Copy AI Prompt", "raised");
        // const btnCopyPrompt = modMdc.mkMDCbutton("", "outlined", "content_copy");
        const btnCopyPrompt = modMdc.mkMDCiconButton("content_copy", "Copy AI prompt");
        btnCopyPrompt.addEventListener("click", async () => {
            // evt.stopPropagation();
            const prompt = await getAIprompt();
            await modTools.copyTextToClipboard(prompt);
            setCSSforAIautomated(false);
            setCSSforAIonClipboard(true);
            setCliboardInert(false);
            divUserSteps.textContent = `
                The AI prompt has been copied to the clipboard.
                You can use it in the AI chat you prefer.
                Copy the AI answer and then click the button below.
            `;
        });
        const eltPromptSummary = mkElt("summary", undefined, "Show");
        eltPromptSummary.style = `
            position: absolute;
            top: 10px;
            left: 140px;
        `;
        const eltPromptDetails = mkElt("details", undefined, [
            eltPromptSummary,
            mkElt("div", undefined, [
                mkElt("p", undefined,
                    `I have created the AI prompt below.
                        It will be given to the AI you use if possible
                        and copied to the clipboard otherwise.`),
                bPrompt
            ])
        ]);
        eltPromptDetails.addEventListener("toggle", async () => {
            const isOpenNow = eltPromptDetails.open;
            if (isOpenNow) {
                // debugger;
                const prompt = await getAIprompt();

                const bPrompt = document.getElementById("prompt-ai");
                if (!bPrompt) throw Error(`Could not find "prompt-ai"`);

                if (prompt == null) {
                    const eltCantGetArticle = mkElt("div", undefined,
                        "Sorry, can't read this article"
                    );
                    eltCantGetArticle.style.color = "red";
                    eltCantGetArticle.style.fontSize = "1.2em";
                    bPrompt.appendChild(eltCantGetArticle);
                    return;
                }
                bPrompt.textContent = prompt;
            }
        })

        const divNewPrompt = mkElt("div", undefined, [
            "AI prompt:",
            btnCopyPrompt,
        ]);
        divNewPrompt.style = `
                    display: flex;
                    flex-direction: row;
                    position: relative;
                `;
        const divPromptOuter = mkElt("div", undefined, [
            divNewPrompt,
            eltPromptDetails
        ]);
        divPromptOuter.id = "div-prompt-outer";
        divPromptOuter.style.position = "relative";
        return divPromptOuter;
    }

    const eltAItextarea = mkElt("textarea");
    eltAItextarea.id = "textarea-response";
    eltAItextarea.style = `
                width: 100%;
                min-height: 4rem;
                resize: vertical;
            `;

    const divAIjsonErrorInResult = mkElt("div");
    divAIjsonErrorInResult.classList.add("ai-json-error");
    divAIjsonErrorInResult.id = "ai-json-error-in-result";

    const btnInfoTrouble = modMdc.mkMDCbutton("??", "raised");
    btnInfoTrouble.title = "What happened?";
    btnInfoTrouble.addEventListener("click", () => {
        const currentAIname = /** @type {string} */ (settingUsedAIname.value);
        // getWhatToDoForUser(nameAI, divUserSteps);
        let { way } = getWayToCallAI(currentAIname);
        const isAPI = (way == "API");
        const infoThisAI = infoAIs[currentAIname];
        const { qA, qW } = infoThisAI;
        const qValue = isAndroid ? qA : qW;
        const needPaste = (isAndroid && !qA) || ((!isAndroid) && !qW);
        const needStart = needPaste || (qValue != "auto");
        console.log({ isAPI, needPaste, needStart });
        // json was not

        const btnShowJson = modMdc.mkMDCbutton("Show JSON", "raised");
        const strBad = tofLastResAI == "string" ? lastResAI : JSON.stringify(lastResAI, undefined, 4);
        const preAIraw = mkElt("pre", undefined, strBad);
        preAIraw.style = `
                    background-color: white;
                    padding: 5px;
                    overflow-x: auto;
                    border: 1px solid lightgray;
                    `;
        btnShowJson.addEventListener("click", () => {
            const body = mkElt("div", undefined, [
                mkElt("h3", undefined, `AI answer (${tofLastResAI})`),
                preAIraw
            ]);
            modMdc.mkMDCdialogAlert(body, "Close");
        });
        const btnCopyError = modMdc.mkMDCbutton("Copy", "raised", "content_copy");
        btnCopyError.addEventListener("click", async () => {
            // const de = document.getElementById("div-ai-json-error");
            // if (!de) throw Error(`Could not find "#div-ai-json-error"`)
            const de = divAIjsonError;
            if (!de) throw Error(`!de`)
            const errorText = de.textContent;
            const copied = await modTools.copyTextToClipboard(errorText);
            if (copied) modMdc.mkMDCsnackbar(`Copied "${errorText}"`);
        });
        const divButtons = mkElt("div", undefined, [
            btnCopyError,
            btnShowJson,
        ]);
        divButtons.style.display = "flex";
        divButtons.style.gap = "10px";
        // if (divErrorLocation == undefined) throw Error(`divErrorLocation is ${divErrorLocation}`)
        divErrorLocation?.remove();
        // if (divAIjsonError == undefined) throw Error(`divAIjsonError is ${divErrorLocation}`)
        divAIjsonError?.remove();
        const divWhatUserCanDo = mkElt("div");
        divWhatUserCanDo.style.lineHeight = "normal";
        divWhatUserCanDo.appendChild(
            mkElt("p", { style: "font-style:italic;" },
                `
                We have tested this AI but not seen this error.
                We will log the error and try to find out what to do.
                `
            ));
        if (isAPI) {
            divWhatUserCanDo.appendChild(
                mkElt("p", undefined, "This AI is automated so there is nothing you can do."));
        } else {
            if (needStart) {
                divWhatUserCanDo.appendChild(
                    mkElt("p", undefined,
                        `
                        You may try to copy the error and add it to the prompt with 
                        "Avoid this problem: " before.
                    `
                    ));
            } else {
                divWhatUserCanDo.appendChild(
                    mkElt("p", undefined, "There is nothing you can do."));
            }
        }
        const body = mkElt("div", undefined, [
            mkElt("h2", undefined, "JSON was not ok"),
            divWhatUserCanDo,
            divAIjsonError,
            divErrorLocation,
            divButtons,
        ]);
        modMdc.mkMDCdialogAlert(body, "Close");
    });

    const divError = mkElt("div", undefined, [divAIjsonErrorInResult, btnInfoTrouble]);
    divError.id = "div-error";
    divError.style.display = "none";

    const eltAItextareaStatus = mkElt("div");
    eltAItextareaStatus.style.lineHeight = "1";
    // @ts-ignore
    let toDoIt; let eltDialog;
    /** @type {HTMLDivElement|undefined} */
    let divErrorLocation;
    /** @type {HTMLDivElement|undefined} */
    let divAIjsonError;
    function onAItextareaInput() {
        eltAItextareaStatus.style.color = "unset";
        // valid
        // @ts-ignore
        const strAIraw = eltAItextarea.value.trim();
        if (strAIraw.length == 0) {
            eltAItextareaStatus.textContent = "";
            return;
        }
        handleAIres(strAIraw);
    }

    /** * @param {string|Object} resAI */
    function handleAIres(resAI) {

        lastResAI = resAI;
        tofLastResAI = typeof lastResAI;

        /** @param {string} txt */
        const tellError = (txt) => {
            document.documentElement.classList.add("ai-response-error");
            // divGoStatus.style.color = "red";
            divGoStatus.append(" -- *ERROR*");
            divAIjsonError = mkElt("div", undefined, txt);
            if (divAIjsonError == undefined) throw Error(`divAIjsonError == undefined`);
            divAIjsonError.classList.add("ai-json-error");
            divAIjsonError.id = "ai-json-error-in-popup";

            divAIjsonErrorInResult.textContent = "Error: AI answer format trouble";

            divError.style.display = "";
            console.error("tellError", txt);
            debugger;
        }
        try {
            // throw "TEST MY ERROR";
            let cleaned, jsonAI;
            if (tofLastResAI == "string") {
                const res = getJsonFromAIstr(resAI);
                const strAIonlyJson = res.strAIjson;
                cleaned = res.cleaned;
                jsonAI = JSON.parse(strAIonlyJson);
            } else {
                jsonAI = resAI;
            }

            // const jsonAI = tofResAI == "string" ? JSON.parse(strAIonlyJson) : resAI;
            const nodeArray = nodeArrayFromAI2jsmindFormat(jsonAI);
            const res = modMMhelpers.isValidMindmapNodeArray(nodeArray);
            if (res.isValid) {
                // throw "TEST RES NOT VALID ERROR";
                theValidJsonNodeArray = nodeArray;
                theValidRoot = res.root;
                placeNodeChildren(theValidRoot);
                function placeNodeChildren(root_node) {
                    root_node.isroot = true;
                    // @ts-ignore
                    const rootId = root_node.id;
                    // @ts-ignore
                    const rootChildren = [];
                    // @ts-ignore
                    nodeArray.forEach(n => { if (n.parentid == rootId) rootChildren.push(n); });
                    // @ts-ignore
                    rootChildren.forEach(n => n.direction = 1);
                }




                const msgStatus = tofLastResAI !== "string" ? "OK" :
                    (!cleaned ? "OK" : `OK (cleaned: ${cleaned.join(", ")})`);
                eltAItextareaStatus.textContent = msgStatus;
                eltAItextareaStatus.style.backgroundColor = "greenyellow";

                eltDialog = eltAItextareaStatus.closest("div.mdc-dialog");
                if (!eltDialog) throw Error('Could not find .closest("div.mdc-dialg")');

                eltDialog.style.opacity = "1";
                const secOpacity = 0.7;
                eltDialog.style.transition = `opacity ${secOpacity}s`;
                // const secDelay = 1.6 + 2;
                const secDelay = 1.6 + 0;
                eltDialog.style.transitionDelay = `${secDelay}s`;
                eltDialog.style.opacity = "0";
                toDoIt = setTimeout(() => {
                    // @ts-ignore
                    eltDialog.remove();
                    doMakeGeneratedMindmap(inpLink.value.trim(), nodeArray, theValidRoot);
                }, (secDelay + secOpacity) * 1000);
            } else {
                tellError(res.error);
            }
        } catch (error) {
            const errorMsg = String(error);
            eltAItextareaStatus.textContent = "";
            // @ts-ignore
            tellError(errorMsg);
            divErrorLocation = mkElt("div");
            if (tofLastResAI == "string") {
                const objJsonErrorDetails = modTools.extractJSONparseError(errorMsg, strAIonlyJson);
                if (divErrorLocation == undefined) throw Error(`divErrorLocation == undefined`);
                divErrorLocation.id = "div-error-location";

                if (objJsonErrorDetails.context) {
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
                    divErrorLocation.textContent = "";
                    divErrorLocation.appendChild(eltBefore);
                    divErrorLocation.appendChild(eltErrorChar);
                    divErrorLocation.appendChild(eltAfter);
                    divErrorLocation.style.padding = "10px";
                    divErrorLocation.style.marginTop = "10px";
                    divErrorLocation.style.backgroundColor = "yellow";
                    divErrorLocation.style.whiteSpace = "pre-wrap";
                    // eltAItextareaStatus.append(divErrorLocation);
                }
            }
        }
    }

    // @ts-ignore
    eltAItextarea.addEventListener("input", _evt => {
        // @ts-ignore
        clearTimeout(toDoIt);
        // @ts-ignore
        if (eltDialog) { eltDialog.style.opacity = "1"; }
        onAItextareaInput();
    });
    // @ts-ignore
    eltAItextarea.addEventListener("change", _evt => {
        // @ts-ignore
        clearTimeout(toDoIt);
        // @ts-ignore
        if (eltDialog) { eltDialog.style.opacity = "1"; }
        onAItextareaInput();
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
            // @ts-ignore
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

    const eltTellPasteAnswer = mkElt("div", undefined,
        "If the button above does not work you can instead paste AI´s answer here:");
    const divAIpaste = mkElt("div", undefined, [
        eltTellPasteAnswer,
        eltAItextarea,
    ]);
    divAIpaste.id = "div-ai-paste";
    divAIpaste.style.display = "none";

    // const btnCopyCliboard = modMdc.mkMDCbutton("I've copied AI´s answer", "raised");
    const btnCopyCliboard = modMdc.mkMDCbutton(txtBtnCopyCliboard, "raised");
    btnCopyCliboard.style.textTransform = "none";
    btnCopyCliboard.addEventListener("click", async () => {
        const txt = await modTools.getTextFromClipboard();
        console.log("btnCopyClipboad, length: ", txt.length);
        handleAIres(txt);
    });
    const divBtnCopyClipboard = mkElt("div", undefined, [
        btnCopyCliboard,
    ]);

    const eltDivAIclipboard = mkElt("div", undefined, [
        divBtnCopyClipboard,
        divAIpaste,
        eltAItextareaStatus,
    ]);
    eltDivAIclipboard.id = "div-ai-clipboard";
    // eltDivAIclipboard.classList.add("VK_FOCUS");



    const btnNotifyTest = modMdc.mkMDCbutton("Test notification", "raised");
    btnNotifyTest.addEventListener("click", () => {
        const txtDelay = prompt("Test notification, delay (seconds):", "30");
        // @ts-ignore
        const secDelay = parseInt(txtDelay);
        setTimeout(() => {
            modTools.showNotification("Test notification", `Delay ${secDelay} seconds`);
        }, secDelay * 1000);
    });





    const cardInput = mkElt("p", { class: "mdc-card display-flex" }, [
        mkElt("div", undefined, `Article or video to summarize as a mindmap: `),
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

    const divEltsAI = mkElt("div", { class: "elts-ai" });
    divEltsAI.id = "elts-ai";
    divEltsAI.style.marginBottom = "10px";

    const btnShowAllAIs = modMdc.mkMDCbutton("All AI:s", "outlined");
    btnShowAllAIs.id = "btn-show-all-ais";
    btnShowAllAIs.addEventListener("click", evt => {
        evt.stopPropagation();
        const e = document.getElementById("elts-ai");
        if (!e) throw Error("Could not find #elts-ai");
        e.classList.remove("show-only-selected-ai");
    });


    // the ai options
    const chkProceed = settingProceedAPI.getInputElement();
    chkProceed.style.marginRight = "7px";
    const lblProceed = mkElt("label", undefined, [
        chkProceed,
        "No stop when shared to"
    ]);
    const inpNotify = settingNotifyReadySec.getInputElement();
    inpNotify.style.width = "4ch";
    const lblNotify = mkElt("label", undefined, [
        "Notify if took > ", inpNotify, " seconds"
    ]);
    const eltDivAIautomated = mkElt("div", { class: "mdc-card" }, [
        mkElt("b", undefined, "For Automated AIs:"),
        lblProceed,
        // mkElt("div", undefined, btnNotifyTest)
        mkElt("div", undefined, lblNotify)
    ]);
    eltDivAIautomated.id = "div-ai-automated";

    const divOptions = mkElt("div", undefined, [eltDivAIautomated]);
    divOptions.style.marginLeft = "20px";
    divOptions.style.paddingBottom = "20px";
    const sumOptions = mkElt("summary", undefined, "Options");
    sumOptions.style = "position:absolute; right:0; top:0";
    const detOptions = mkElt("details", undefined, [
        sumOptions,
        divOptions,
    ]);



    const spanH = mkElt("span"); // This is just for the height!
    spanH.style = "width:0px;height:40px;background:red;display:inline-block;";

    const divB = mkElt("div", undefined, [
        spanH,
        btnShowAllAIs,
    ]);
    divB.style.display = "flex";
    const divShowAllAIs = mkElt("div", undefined, [
        divB,
        detOptions
    ]);
    divShowAllAIs.style =
        // "width:100%; display:flex; flex-direction:row; justify-content:space-between; align-items:center; position:relative;";
        "width:100%; position:relative;";
    divShowAllAIs.id = "div-show-all-ais"
    divShowAllAIs.classList.add("youtube-hide");
    divEltsAI.appendChild(divShowAllAIs);

    const divInfoYouTubeAIs = mkElt("div", undefined, [
        mkEltYouTubeLogo("20px"),
        mkElt("div", undefined, "AIs: that can read YouTube")
    ]);
    divInfoYouTubeAIs.id = "div-youtube-info-ais";
    divInfoYouTubeAIs.classList.add("youtube-show");
    divEltsAI.appendChild(divInfoYouTubeAIs);


    // Add Hugging Face first - no, I can not get it to work here???
    // await addHuggingFace();
    // async function addHuggingFace() {
    //     const imgAI = mkElt("span", { class: "elt-ai-img" });
    //     const urlImg = "https://huggingface.co/front/assets/huggingface_logo-noborder.svg";
    //     imgAI.style.backgroundImage = `url(${urlImg})`;
    //     imgAI.style.display = "none";
    //     const nameIcon = "smart_toy";
    //     const iconWay = modMdc.mkMDCicon(nameIcon);
    //     const wayIndicator = mkElt("i", undefined, [iconWay]);
    //     wayIndicator.style.color = "lightseagreen";
    //     const radAI = mkElt("input", { type: "radio", name: "ai", value: "HuggingFace" });

    //     const longNameModel = /** @type {string} */ (settingPuterAImodel.value);
    //     const tofLongNM = typeof longNameModel;
    //     if (tofLongNM != "string") throw Error(`typeof longNameModel = "${tofLongNM}"`);
    //     const nameModel = longNameModel.slice(11);
    //     const [provider, model] = nameModel.split("/");
    //     const niceProvider = makeNiceProviderName(provider);
    //     const divModel = mkElt("div", undefined, [
    //         mkElt("b", undefined, `${niceProvider}: `), model]);
    //     wayIndicator.style.color = "lightskyblue";
    //     divModel.style.fontSize = "0.8rem";
    //     const divHeader = mkElt("div", undefined, [wayIndicator, "Hugging Face "]);
    //     divHeader.style.display = "flex";
    //     divHeader.style.gap = "10px";
    //     divHeader.style.marginBottom = "-10px";

    //     const divHuggingFace = mkElt("div", undefined, [
    //         divHeader,
    //         divModel,
    //     ]);

    //     const eltAIlabel = mkElt("label", undefined, [radAI, imgAI, divHuggingFace]);
    //     eltAIlabel.classList.add("elt-ai-label");

    //     // "details"
    //     const sumAI = mkElt("summary", undefined, "");
    //     sumAI.classList.add("elt-ai-summary");
    //     sumAI.style.top = "20px";

    //     // "Automated"
    //     const iconAutomated = modMdc.mkMDCicon("smart_toy");
    //     iconAutomated.style.color = "goldenrod";
    //     iconAutomated.style.fontSize = "1.4rem";
    //     const eltInfoAutomated = mkElt("div", undefined, [
    //         mkElt("p", undefined, [
    //             iconAutomated,
    //             ` The AI:s below are automated here. 
    //         This means that when they are ready the mindmap will be created automatically.
    //     `]),
    //         mkElt("p", undefined, [
    //             `These AI:s are handled by `,
    //             mkElt("a", { href: "https://huggingface.co/", target: "_blank" }, "https://huggingface.co/"),
    //             ` - a service that helps me automate.
    //         (I am not in any way involved in payments. And I do not get anything.)
    //     `]),
    //         mkElt("p", undefined, [
    //             `TODO: describe Hugging Face
    //         `
    //         ])
    //     ]);



    //     /** @type {HTMLDivElement} */
    //     const divHuggingFaceModels = mkElt("div", undefined, [
    //         mkElt("h3", undefined, "AI models")
    //     ]);

    //     const modPutinModels = await importFc4i("puter-ai-models");
    //     const arrModels = modPutinModels.getModels();
    //     const oldModel = settingPuterAImodel.value;
    //     let providerGroup = "";
    //     /** @type {HTMLDivElement} */
    //     let divProvider;
    //     arrModels.sort().forEach( /** @param {string} fullNameModel */(fullNameModel) => {
    //         const radModel = mkElt("input", { type: "radio", name: "puter-model", value: fullNameModel });
    //         const longName = fullNameModel.slice(11);
    //         const [provider, nameModel] = longName.split("/");
    //         if (provider != providerGroup) {
    //             providerGroup = provider;
    //             // divPuterModels.appendChild( mkElt("div", { style: "font-size:1.3rem; font-weight:bold;" }, `${provider}:`));
    //             divProvider = /** @type {HTMLDivElement} */ mkElt("div");
    //             const detailsProvider = mkElt("details", undefined, [
    //                 mkElt("summary", undefined, makeNiceProviderName(provider)),
    //                 divProvider
    //             ]);
    //             divHuggingFaceModels.appendChild(detailsProvider)
    //         }
    //         const lblModel = mkElt("label", undefined, [radModel, " ", nameModel]);
    //         // divPuterModels.appendChild(mkElt("div", undefined, lblModel));
    //         divProvider.appendChild(mkElt("div", undefined, lblModel));
    //         if (oldModel == fullNameModel) {
    //             radModel.checked = true;
    //             const eltDetails = lblModel.closest("details");
    //             if (!eltDetails) throw Error("Did not find <details>");
    //             eltDetails.open = true;
    //         }
    //     });

    //     /** * @param {MouseEvent} evt - The mouse event triggered by the click.  */
    //     divHuggingFaceModels.addEventListener("click", evt => {
    //         evt.stopPropagation();
    //         evt.stopImmediatePropagation();
    //         if (!(evt.target instanceof HTMLElement)) { return; }
    //         const trg = evt.target;
    //         const tn = trg.tagName;
    //         if (tn != "INPUT") return;
    //         // const nameModel = trg.value;
    //         const nameModel = (/** @type {HTMLInputElement} */ (trg)).value;
    //         console.log({ nameModel });
    //         settingPuterAImodel.value = nameModel;
    //     });


    //     const detInfoAutomated = mkElt("details", { style: "color:lightskyblue; margin-top:20px;" }, [
    //         mkElt("summary", { style: "color:lightskyblue" }, "Info about these AI models"),
    //         eltInfoAutomated,
    //     ]);

    //     const divDetAIcontent = mkElt("div", undefined, [
    //         "Much more to come here!",
    //         detInfoAutomated,
    //         divHuggingFaceModels,
    //     ]);
    //     divDetAIcontent.classList.add("elt-ai-det-content");

    //     const detAI = mkElt("details", undefined, [
    //         sumAI,
    //         // mkElt("div", undefined, [ "More to come!", ]),
    //         divDetAIcontent
    //     ]);


    //     const eltAI = mkElt("div", undefined, [eltAIlabel, detAI]);
    //     eltAI.classList.add("elt-ai");
    //     eltAI.id = "elt-ai-puter";
    //     divEltsAI.appendChild(eltAI);
    // }

    // Add puter alternative - unfortunately to slow to be usable here 
    // await _addPuter();
    // async function _addPuter() {
    //     const imgAI = mkElt("span", { class: "elt-ai-img" });
    //     const urlImg = "./ext/puter/puter.svg";
    //     imgAI.style.backgroundImage = `url(${urlImg})`;
    //     imgAI.style.display = "none";
    //     const nameIcon = "smart_toy";
    //     const iconWay = modMdc.mkMDCicon(nameIcon);
    //     const wayIndicator = mkElt("i", undefined, [iconWay]);
    //     wayIndicator.style.color = "lightseagreen";
    //     const radAI = mkElt("input", { type: "radio", name: "ai", value: "PuterJs" });

    //     const longNameModel = /** @type {string} */ (settingPuterAImodel.value);
    //     const tofLongNM = typeof longNameModel;
    //     if (tofLongNM != "string") throw Error(`typeof longNameModel = "${tofLongNM}"`);
    //     const nameModel = longNameModel.slice(11);
    //     const [provider, model] = nameModel.split("/");
    //     const niceProvider = makeNiceProviderName(provider);
    //     const divModel = mkElt("div", undefined, [
    //         mkElt("b", undefined, `${niceProvider}: `), model]);
    //     wayIndicator.style.color = "cyan";
    //     wayIndicator.style.color = "lightseagreen";
    //     wayIndicator.style.color = "lightskyblue";
    //     // divModel.marginLeft = "10px";
    //     divModel.style.fontSize = "0.8rem";
    //     const divHeader = mkElt("div", undefined, [wayIndicator, "Automated "]);
    //     divHeader.style.display = "flex";
    //     // divHeader.style.justifyContent = "space-between";
    //     divHeader.style.gap = "10px";
    //     divHeader.style.marginBottom = "-10px";

    //     const divPuter = mkElt("div", undefined, [
    //         divHeader,
    //         divModel,
    //     ]);

    //     const eltAIlabel = mkElt("label", undefined, [radAI, imgAI, divPuter]);
    //     eltAIlabel.classList.add("elt-ai-label");

    //     // "details"
    //     const sumAI = mkElt("summary", undefined, "");
    //     sumAI.classList.add("elt-ai-summary");
    //     sumAI.style.top = "20px";

    //     // "Automated"
    //     const iconAutomated = modMdc.mkMDCicon("smart_toy");
    //     iconAutomated.style.color = "goldenrod";
    //     iconAutomated.style.fontSize = "1.4rem";
    //     const eltInfoAutomated = mkElt("div", undefined, [
    //         mkElt("p", undefined, [
    //             iconAutomated,
    //             ` The AI:s below are automated here. 
    //         This means that when they are ready the mindmap will be created automatically.
    //     `]),
    //         mkElt("p", undefined, [
    //             `These AI:s are handled by `,
    //             mkElt("a", { href: "https://puter.com/settings", target: "_blank" }, "https://puter.com"),
    //             ` - a service that helps me automate.
    //         (I am not in any way involved in payments. And I do not get anything.)
    //     `]),
    //         mkElt("p", undefined, [
    //             `Puter takes care of paying for these AI:s.
    //         You will have to pay through Puter.
    //         I am not involved in any way in that.
    //         Click the link above to find out more.
    //         `
    //         ]),
    //         mkElt("p", undefined, [
    //             `You can probably create a few mindmaps each day for free.
    //         I am not sure about that.
    //         `
    //         ]),
    //     ]);



    //     /** @type {HTMLDivElement} */
    //     const divPuterModels = mkElt("div", undefined, [
    //         mkElt("h3", undefined, "AI models")
    //     ]);

    //     const modPutinModels = await importFc4i("puter-ai-models");
    //     const arrModels = modPutinModels.getModels();
    //     const oldModel = settingPuterAImodel.value;
    //     let providerGroup = "";
    //     /** @type {HTMLDivElement} */
    //     let divProvider;
    //     arrModels.sort().forEach( /** @param {string} fullNameModel */(fullNameModel) => {
    //         const radModel = mkElt("input", { type: "radio", name: "puter-model", value: fullNameModel });
    //         const longName = fullNameModel.slice(11);
    //         const [provider, nameModel] = longName.split("/");
    //         if (provider != providerGroup) {
    //             providerGroup = provider;
    //             // divPuterModels.appendChild( mkElt("div", { style: "font-size:1.3rem; font-weight:bold;" }, `${provider}:`));
    //             divProvider = /** @type {HTMLDivElement} */ mkElt("div");
    //             const detailsProvider = mkElt("details", undefined, [
    //                 mkElt("summary", undefined, makeNiceProviderName(provider)),
    //                 divProvider
    //             ]);
    //             divPuterModels.appendChild(detailsProvider)
    //         }
    //         const lblModel = mkElt("label", undefined, [radModel, " ", nameModel]);
    //         // divPuterModels.appendChild(mkElt("div", undefined, lblModel));
    //         divProvider.appendChild(mkElt("div", undefined, lblModel));
    //         if (oldModel == fullNameModel) {
    //             radModel.checked = true;
    //             const eltDetails = lblModel.closest("details");
    //             if (!eltDetails) throw Error("Did not find <details>");
    //             eltDetails.open = true;
    //         }
    //     });

    //     /** * @param {MouseEvent} evt - The mouse event triggered by the click.  */
    //     divPuterModels.addEventListener("click", evt => {
    //         evt.stopPropagation();
    //         evt.stopImmediatePropagation();
    //         if (!(evt.target instanceof HTMLElement)) { return; }
    //         const trg = evt.target;
    //         const tn = trg.tagName;
    //         if (tn != "INPUT") return;
    //         // const nameModel = trg.value;
    //         const nameModel = (/** @type {HTMLInputElement} */ (trg)).value;
    //         console.log({ nameModel });
    //         settingPuterAImodel.value = nameModel;
    //     });


    //     const detInfoAutomated = mkElt("details", { style: "color:lightskyblue; margin-top:20px;" }, [
    //         mkElt("summary", { style: "color:lightskyblue" }, "Info about these AI models"),
    //         eltInfoAutomated,
    //     ]);

    //     const divDetAIcontent = mkElt("div", undefined, [
    //         "Much more to come here!",
    //         detInfoAutomated,
    //         divPuterModels,
    //     ]);
    //     divDetAIcontent.classList.add("elt-ai-det-content");

    //     const detAI = mkElt("details", undefined, [
    //         sumAI,
    //         // mkElt("div", undefined, [ "More to come!", ]),
    //         divDetAIcontent
    //     ]);


    //     const eltAI = mkElt("div", undefined, [eltAIlabel, detAI]);
    //     eltAI.classList.add("elt-ai");
    //     eltAI.id = "elt-ai-puter";
    //     divEltsAI.appendChild(eltAI);
    // }



    Object.entries(infoAIs).forEach(e => { // "elt-ai"
        const [k, v] = e;
        const nameAI = k;
        // @ts-ignore
        const { company, urlDescription, qW, qA, android, urlImg, urlChat, isPWA, fun, urlAPIkey } = v;
        const canReadYouTube = v.canReadYouTube;
        // const { qA, qW, android, urlImg, isPWA } = v; // "Gemini"
        const radAI = mkElt("input", { type: "radio", name: "ai", value: k });
        const imgAI = mkElt("span", { class: "elt-ai-img" });
        if (nameAI == "Le Chat") {
            imgAI.style.backgroundSize = "contain";
        }
        imgAI.style.backgroundImage = `url(${urlImg})`;
        const eltAIname = mkElt("span", { class: "elt-ai-name" }, nameAI);
        let { way, hasWebAPI } = getWayToCallAI(nameAI);
        let q = "";
        let nameIcon = "help";
        let iconQ = mkElt("span");
        switch (way) {
            case "API":
                nameIcon = "smart_toy";
                break;
            case "web":
                nameIcon = "open_in_browser";
                if (isPWA) {
                    way = "PWA";
                    nameIcon = "install_desktop";
                }
                if (qW) q = "/q";
                iconQ = modMdc.mkMDCicon("attach_file");
                break;
            case "android-app":
                nameIcon = "android";
                if (qA) q = "/q";
                iconQ = modMdc.mkMDCicon("attach_file");
                break;
            default:
                throw Error(`Did not handle way "${way}"`);
        }
        iconQ.style.zoom = "0.7";
        const iconWay = modMdc.mkMDCicon(nameIcon);
        let iconHintAPI = mkElt("span");
        if (way !== "API") {
            if (hasWebAPI) {
                iconHintAPI = modMdc.mkMDCicon("smart_toy");
                if (!(iconHintAPI instanceof HTMLSpanElement)) throw Error(`iconHintAPI is not HTMLSpanElement`);
                iconHintAPI.inert = true;
                iconHintAPI.style.opacity = "0.5";
                iconHintAPI.style.zoom = "0.7";
            }
        }
        // const wayIndicator = mkElt("i", undefined, [iconWay, iconQ, iconHintAPI, ` ${way}${q}`]);
        const wayIndicator = mkElt("i", undefined, [iconWay, iconQ, iconHintAPI]);
        wayIndicator.style.color = "blue";
        wayIndicator.style.display = "inline-flex";
        wayIndicator.style.alignItems = "center";
        const lblAI = mkElt("label", undefined, [radAI, imgAI, eltAIname, wayIndicator]);
        lblAI.classList.add("elt-ai-label");
        const sumAI = mkElt("summary", undefined, "");
        sumAI.classList.add("elt-ai-summary");
        const showCompany = company ? company : "unknown";

        // const eltLabelCurrentWay = mkElt("b", undefined, `What you must do (${way}${q}): `);
        const eltLabelCurrentWay = mkElt("b", undefined, `${way}${q}, what to do: `);
        const eltCurrentWay = mkElt("div", undefined, eltLabelCurrentWay);
        eltCurrentWay.style = `
            background: lightskyblue;
            padding: 5px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            gap: 5px;
            `;

        getWhatToDoForUser(nameAI, eltCurrentWay);
        switch (way) {
            case "API":
                break;
            case "web":
                {
                    // const eltWeb = mkElt("span", undefined, `${nameAI} will be opened in a new tab.`);
                    if (isAndroid) {
                    } else {
                    }
                }
                break;
            case "PWA":
                {
                    const eltPWA = mkElt("span", undefined, `${nameAI} will be opened in a new tab.`);
                    const needPaste = (isAndroid && !qA) || ((!isAndroid) && !qW);
                    if (needPaste) {
                        eltPWA.append(" You have to paste the AI prompt.");
                    }
                    if (isAndroid) {
                    } else {
                    }
                }
                break;
            default:
                eltCurrentWay.append(`ERROR: no instructions yet for "${way}"`);

        }

        const eltCompany = urlDescription ?
            // mkElt("span", undefined, "HAVE urlDescription")
            mkElt("span", { style: "opacity:0.5; display:flex; justify-content:flex-end;" }, [
                mkElt("span", undefined, [
                    `Read about ${nameAI} at `,
                    mkElt("a", { href: urlDescription, target: "_blank" }, showCompany)
                ])
            ])
            :
            mkElt("span", undefined, `${nameAI} (from ${showCompany})`);
        const divDetAIcontent = mkElt("div", undefined, [
            eltCompany,
            eltCurrentWay,
        ]);
        divDetAIcontent.classList.add("elt-ai-det-content");
        if (nameAI == "HuggingFace") {
            divDetAIcontent.appendChild(mkElt("span", undefined, nameAI));
            // https://huggingface.co/settings/billing
        }

        if (fun) {
            // const listAPI = mkElt("div");
            // ulAIdetails.appendChild(listAPI);
            const inpAPIkey = mkElt("input", { type: "text" });
            const key = getUserAPIkeyForAI(nameAI);
            // @ts-ignore
            if (key) inpAPIkey.value = key;
            // @ts-ignore
            const saveAPIkeyInput = modTools.throttleTO(() => { setAPIkeyForAI(nameAI, inpAPIkey.value); }, 500);
            inpAPIkey.addEventListener("input", () => {
                // @ts-ignore
                console.log("input inpAPIkey", inpAPIkey.value);
                saveAPIkeyInput();
            });
            // @ts-ignore
            const lblYourAPIkey = mkElt("label", undefined, [`Your API key for ${nameAI}: `, inpAPIkey]);
            inpAPIkey.style.width = "100%";

            const divAPIinfo = mkElt("div", undefined, [
                // mkElt("div", undefined, "Automation needs an API key.")
                "Automation needs an API key. "
            ]);
            if (urlAPIkey) {
                const aAPIkey = mkElt("a", {
                    href: urlAPIkey,
                    target: "_blank"
                }, `here`);
                if (nameAI == "groq") {
                    const commonKey = getCommonAPIkey("groq");
                    const free = commonKey != "";
                    const divGroqExtra = mkElt("div", undefined, [
                        mkElt("p", undefined, [
                            `groq is our default AI because it is much faster than the others.
                            For groq we try to provide free use. `,
                            mkElt("i", { style: (free ? "color:green" : "color:red") },
                                (!free) ?
                                    `However at the moment you must get your own API key for croq.`
                                    :
                                    "Right now you do not need your own API key for croq."
                            )
                        ]),
                    ]);
                    divGroqExtra.id = "div-groq-extra";
                    divAPIinfo.insertBefore(divGroqExtra, divAPIinfo.firstChild);
                    /*
UTC Time Window,Likelihood of Rate Limits / Slowdowns on Free Tier,Notes
16:00 – 00:00 UTC,Very High,Peak period
00:00 – 04:00 UTC,High,US evening + early Asia overlap
04:00 – 12:00 UTC,Medium,Asia/Japan daytime traffic
12:00 – 16:00 UTC,Low → Medium,Generally quieter
05:00 – 14:00 UTC,Lowest congestion,Best window for free-tier users (especially weekends)



Free-Tier Limits for llama-3.1-8b-instant
These are enforced per organization/account and reset periodically (RPM/TPM every minute; RPD/TPD every 24 hours from your first request). Exceeding any can cause immediate throttling, regardless of overall traffic.

Limit Type,Value,What It Means,Common Pitfall
RPM (Requests Per Minute),30,Max API calls per minute,"Rapid loops or chat streams (e.g., multiple messages in a session) hit this quick"
TPM (Tokens Per Minute),"6,000",Max input + output tokens processed per minute,"A single prompt/output combo over ~6K tokens (e.g., long context or verbose responses) exceeds it—most frequent cause for 429s"
RPD (Requests Per Day),"14,400",Max API calls per 24 hours,"Fine for light dev, but batch jobs add up"
TPD (Tokens Per Day),"500,000",Max input + output tokens per 24 hours,Equivalent to ~80–100 medium-length chats; resets daily
                    */
                }
                const spanAPIkeyInfo = mkElt("span", undefined, [" You can get your own API key ", aAPIkey, "."]);
                divAPIinfo.appendChild(spanAPIkeyInfo);

            } else {
                divAPIinfo.appendChild(mkElt("span", undefined, ` (Where to get it for ${nameAI}?)`));
            }
            divDetAIcontent.appendChild(divAPIinfo);
            divDetAIcontent.appendChild(lblYourAPIkey);
            if (nameAI == "groq") {
                const divTemperature = mkElt("p", undefined, "AI working style:");
                divTemperature.id = "div-llm-temperature";
                divDetAIcontent.appendChild(divTemperature);

                const tempType = settingTemperatureType.valueS;
                // check tempType
                tempType2temperature(tempType);

                arrTemperatureTypes.forEach(tt => {
                    const rad = mkElt("input", { type: "radio", name: "llm-temperature", value: tt });
                    if (tt == tempType) rad.checked = true;
                    const lbl = mkElt("label", undefined, [rad, tt]);
                    const div = mkElt("div", undefined, lbl);
                    divTemperature.appendChild(div);
                });
                divTemperature.addEventListener("change", evt => {
                    const newTemp = evt.target.value;
                    console.log({ newTemp });
                    settingTemperatureType.value = newTemp;
                });
            }
        }
        if (isAndroid) {
            if (android) {
                let strCan = "Can start Android app";
                if (qA) strCan = `${strCan} with prompt`;
                divDetAIcontent.appendChild(mkElt("span", undefined, strCan));
            }
        }
        if (urlChat) {
            const tofIsPWA = typeof isPWA;
            if (tofIsPWA != "boolean") throw Error(`typeof isPWA == "${tofIsPWA}"`);
            if (qW) {
                const strCan = `Web chat adds the prompt for you`;
                divDetAIcontent.appendChild(mkElt("span", undefined, strCan));
            }
        }


        const detAI = mkElt("details", undefined, [
            sumAI,
            divDetAIcontent
        ]);
        const eltAI = mkElt("div", undefined, [lblAI, detAI]);
        eltAI.classList.add("elt-ai");
        if (canReadYouTube) { eltAI.classList.add("ai-can-read-youtube"); }
        if (nameAI == settingUsedAIname.defaultValue()) {
            eltAI.classList.add("ai-default");
            // lblAI.style.fontSize = "2rem";
        }
        divEltsAI.appendChild(eltAI);
    });
    // @ts-ignore
    divEltsAI.addEventListener("change", evt => {
        const t = /** @type {HTMLInputElement} */ (evt.target);
        if (t.tagName != "INPUT") return;
        if (t.type != "radio") return;
        if (t.name != "ai") return;

        const nameAI = t.value;
        if (nameAI.trim() == "") throw Error(`nameAI == "${nameAI}"`);
        settingUsedAIname.value = nameAI;
        divGoStatus.textContent = "";
        setAIchoosen(nameAI);
    });
    /** @param {string} nameAI */
    function setAIchoosen(nameAI) {
        // btnGo.inert = false;
        btnGo.inert = !modTools.isValidUrlFormat(inpLink.value.trim());
        const isAuto = isAutomatedAI(nameAI);
        setCSSforAIautomated(isAuto);
        setCSSforAIonClipboard(!isAuto);
        setCliboardInert(true);
        checkIsAIchoosen();
        divUserSteps.textContent = "";
        divUserSteps.appendChild(mkElt("div", undefined, "Steps:"));
        getWhatToDoForUser(nameAI, divUserSteps);
        divEltsAI.classList.add("show-only-selected-ai");
    }
    {
        const currentAIname = /** @type {string} */ (settingUsedAIname.value);
        // const currentAIname = "BAD";
        if (currentAIname.length == 0) { throw Error("currentAIname.length == 0"); }
        const radCurrentAI = divEltsAI.querySelector(`input[type=radio][value="${currentAIname}"]`);
        if (!radCurrentAI) {
            settingUsedAIname.reset();
            const currentAIname = /** @type {string} */ (settingUsedAIname.value);
            const radCurrentAI = divEltsAI.querySelector(`input[type=radio][value="${currentAIname}"]`);
            radCurrentAI.checked = true;
        } else {
            radCurrentAI.checked = true;
        }
        // isAutomatedAI(currentAIname);
        // FIX-ME: try
        setTimeout(() => setAIchoosen(currentAIname), 1000);
        // }
    }

    const divGoStatus = mkElt("div");
    divGoStatus.id = "div-go-status";
    // divGoStatus.style.outline = "1px dotted red";
    divGoStatus.style.overflow = "auto";
    divGoStatus.style.overflowWrap = "anywhere";

    const divUserSteps = mkElt("div");
    divUserSteps.id = "div-user-steps";

    // const btnGo = modMdc.mkMDCbutton("Go", "raised", "play_circle");
    const btnGo = modMdc.mkMDCiconButton("play_arrow", "Get mindmap", 40);
    btnGo.id = "btn-ai-go";
    btnGo.classList.add("mdc-button--raised");
    btnGo.style.textTransform = "none";
    btnGo.inert = true;

    /** @type {string} */ let nameUsedAI = "Not known";

    // @ts-ignore
    btnGo.addEventListener("click", async (evt) => {
        evt.stopPropagation();

        const userPrompt = await getAIprompt();
        if (userPrompt == null) {
            modMdc.mkMDCdialogAlert("Sorry, can't read this article");
            return;
        }

        document.documentElement.classList.remove("ai-response-error");
        document.documentElement.classList.remove("has-ai-response");
        divGoStatus.textContent = "";

        const divHardWay = document.getElementById("div-for-go");
        if (!divHardWay) throw Error('Could not find "#div-for-go"');
        divHardWay.querySelector("input[type=radio][name=ai]:checked");
        const inpAI = divHardWay.querySelector("input[type=radio][name=ai]:checked");
        if (!inpAI) {
            divGoStatus.textContent = "Please select an AI alternative";
            return;
        }

        // @ts-ignore
        const nameAI = inpAI.value;

        // Need this if copy prompt have been used:
        if (!isCliboardInert()) {
            divUserSteps.textContent = "";
            getWhatToDoForUser(nameAI, divUserSteps);
        }

        setCliboardInert(true);

        const { way } = getWayToCallAI(nameAI);
        if (way != "API") {
            await modTools.copyTextToClipboard(userPrompt);
            divGoStatus.textContent = "Copied prompt. ";
            // document.documentElement.classList.add("have-ai-on-clipboard");
            // mayHaveAIonClipboard();
        }

        const isAPI = way == "API";
        // setCSSforAIautomated(isAPI);
        // setCSSforAIonClipboard(!isAPI);
        // setCSSforAIonClipboard(true);

        nameUsedAI = nameAI
        if (nameAI == "none") {
            divGoStatus.append(", no AI selected. Go to the AI you want and paste the prompt there.");
            return;
        }

        // if (nameAI != "PuterJs" && nameAI != "HuggingFace") {
        if (nameAI != "PuterJs") {
            const infoThisAI = infoAIs[nameAI];
            if (!infoThisAI) { throw Error(`Did not find info for AI "${nameAI}"`); }
        }

        // getWhatToDoForUser(nameAI, divUserSteps);


        const callingAPI = wayToCallAIisAPI(nameAI);
        if (callingAPI) {
            document.documentElement.classList.add("ai-in-progress");
            modMdc.replaceMDCicon("stop", btnGo);
        }
        // await callNamedAI(nameAI, promptAI, handleAIres);
        await callNamedAI(nameAI, userPrompt, handleAIres);

        if (callingAPI) {
            document.documentElement.classList.remove("ai-in-progress");
            modMdc.replaceMDCicon("play_arrow", btnGo);
        } else {
            setTimeout(() => setCliboardInert(false), 10 * 1000);
        }
    });



    // https://chatgpt.com/share/68c20d3b-e168-8004-8cea-c80d30949054



    const cardPrompt = mkElt("p", { class: "mdc-card display-flex" }, [
        divPrompt,
    ]);
    cardPrompt.style.padding = `10px`;


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
            background - color: #fff6;
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
    // @ts-ignore
    btnEasyWay.addEventListener("click", async _evt => {
        // btnEasyWay.style.display = "none";
        // divWhyNotEasy.style.display = "unset";

        // @ts-ignore
        const inpAI = divEasyWay.querySelector("input[type=radio][name=ai]:checked");
        if (!inpAI) { throw Error("no selection of AI") }
        // @ts-ignore
        const nameAI = inpAI.value;

        let keyAPI = getAPIkeyForAI(nameAI);
        if (!keyAPI) {
            // debugger;
            const inpKey = mkElt("input", { type: "text" });
            const aGetKey = mkElt("a", {
                href: "",
                target: "_blank"
            }, `Get API key for ${nameAI}`);
            const divGetKey = mkElt("p", undefined, [
                // @ts-ignore
                "You must get an API key for this. ",
                aGetKey
            ]);
            // @ts-ignore
            const lbl = mkElt("label", undefined, [`API key for ${nameAI}: `, inpKey]);
            const body = mkElt("div", undefined, [
                divGetKey,
                lbl
            ]);
            const ans = await modMdc.mkMDCdialogConfirm(body);
            if (!ans) return;
            // @ts-ignore
            keyAPI = inpKey.value.trim();
        }
        const infoThisAI = infoAIs[nameAI];
        // debugger;
        const fun = infoThisAI["fun"];
        if (!fun) throw Error("!fun");

        const tofFun = typeof fun;
        if (tofFun != "function") throw Error(`tofFun == "${tofFun}"`);
        const res = await fun(promptAI, keyAPI);
        console.log({ res });
        if (res instanceof Error) {
            console.error(res);
            throw res;
            // @ts-ignore
            return;
        }
        const tofRes = typeof res;
        if (tofRes != "string") {
            throw Error(`tofRes == "${tofRes}"`)
        }
        console.log(res);
        // debugger;
    });

    const styleWays = " background-color: #80800036; padding: 10px; ";

    const divListAIhardWay = mkElt("div");
    divListAIhardWay.style = `
            display: flex;
            flex - direction: row;
            gap: 10px;
            flex - wrap: wrap;
            `;
    const divGo = mkElt("div", undefined, [btnGo, divGoStatus]);
    divGo.id = "div-go";
    divGo.style = "display:grid; grid-template-columns: auto 1fr; gap:10px;"



    const divTabForGo = mkElt("div", undefined, [
        mkElt("div", undefined, cardPrompt),
        divEltsAI,
        divGo,
        divError,
        divUserSteps,
        eltDivAIclipboard,
        // eltDivAIautomated,
    ]);
    divTabForGo.id = "div-for-go";
    divTabForGo.style = styleWays;

    {
        /** @typedef {Object} objIntent
         * @property {boolean} [noPackage]
        */

        /**
         * @param {objIntent} opt 
         * @returns {string}
         */
        // @ts-ignore
        const _mkChatIntent = (opt) => {
            let u = "intent://";
            u = u.concat("chat");
            u = u.concat("#Intent;");
            u = u.concat("scheme=gemini;");
            if (!opt.noPackage) u = u.concat("package=com.google.android.apps.bard;");
            u = u.concat("end;");
            return u;
        }

    }
    const divSettingsNotPuter = mkElt("div", undefined, [
        mkElt("p", undefined, `
            All AI:s here has a web chat. Some of them adds the prompt for you.
            (Updated 2025-09-29.)
            `),
    ]);
    divSettingsNotPuter.id = "div-settings-not-puter";
    const modPutinModels = await importFc4i("puter-ai-models");
    const arrModels = modPutinModels.getModels();

    /** @type {HTMLDivElement} */
    const divPuterModels = mkElt("div", undefined, [
        mkElt("h3", undefined, "AI models")
    ]);
    const oldModel = settingPuterAImodel.value;
    let providerGroup = "";
    /** @type {HTMLDivElement} */
    let divProvider;
    arrModels.sort().forEach( /** @param {string} fullNameModel */(fullNameModel) => {
        const radModel = mkElt("input", { type: "radio", name: "puter-model", value: fullNameModel });
        const longName = fullNameModel.slice(11);
        const [provider, nameModel] = longName.split("/");
        if (provider != providerGroup) {
            providerGroup = provider;
            // divPuterModels.appendChild( mkElt("div", { style: "font-size:1.3rem; font-weight:bold;" }, `${provider}:`));
            divProvider = /** @type {HTMLDivElement} */ mkElt("div");
            const detailsProvider = mkElt("details", undefined, [
                mkElt("summary", undefined, makeNiceProviderName(provider)),
                divProvider
            ]);
            divPuterModels.appendChild(detailsProvider)
        }
        const lblModel = mkElt("label", undefined, [radModel, " ", nameModel]);
        // divPuterModels.appendChild(mkElt("div", undefined, lblModel));
        divProvider.appendChild(mkElt("div", undefined, lblModel));
        if (oldModel == fullNameModel) {
            radModel.checked = true;
            const eltDetails = lblModel.closest("details");
            if (!eltDetails) throw Error("Did not find <details>");
            eltDetails.open = true;
        }
    });

    /** * @param {MouseEvent} evt - The mouse event triggered by the click.  */
    divPuterModels.addEventListener("click", evt => {
        evt.stopPropagation();
        if (!(evt.target instanceof HTMLElement)) { return; }
        const trg = evt.target;
        const tn = trg.tagName;
        if (tn != "INPUT") return;
        // const nameModel = trg.value;
        const nameModel = (/** @type {HTMLInputElement} */ (trg)).value;
        console.log({ nameModel });
        settingPuterAImodel.value = nameModel;
    });

    const divSettingsAutomated = mkElt("div", undefined, [
        // detInfoAutomated,
        divPuterModels,
    ]);
    // divSettingsAutomated.id = "div-settings-puter";



    const divTabSettings = mkElt("div", undefined, [
        divSettingsAutomated,
        divSettingsNotPuter,
    ]);
    divTabSettings.id = "div-ai-settings";
    // tabBar
    const tabAIrecs = ["Automated", "Direct"];
    const contentAIelts = mkElt("div", undefined, [divSettingsAutomated, divSettingsNotPuter]);
    if (tabAIrecs.length != contentAIelts.childElementCount) throw Error("Tab bar setup number mismatch");
    const eltAIsettingsTabs = modMdc.mkMdcTabBarSimple(tabAIrecs, contentAIelts, undefined);
    eltAIsettingsTabs.style.zoom = "0.9";
    const divEltsAIsettingsTabs = mkElt("div", { class: "mdc-card" }, [eltAIsettingsTabs, contentAIelts]);
    divEltsAIsettingsTabs.style.padding = "10px";


    Object.entries(infoAIs).forEach(e => { // details
        const [k, v] = e;
        const { qW, qA, android, urlImg, urlChat, fun, urlAPIkey } = v;
        const imgAI = mkElt("span", { class: "elt-ai-img" });
        imgAI.style.backgroundImage = `url(${urlImg})`;
        const imgAIsummary = mkElt("span", { class: "elt-ai-img" });
        imgAIsummary.style.backgroundImage = `url(${urlImg})`;
        const nameAI = k;

        const ulAIdetails = mkElt("ul");
        if (fun) {
            const listAPI = mkElt("list");
            ulAIdetails.appendChild(listAPI);
            const inpAPIkey = mkElt("input", { type: "text" });
            const key = getAPIkeyForAI(nameAI);
            // @ts-ignore
            if (key) inpAPIkey.value = key;
            // @ts-ignore
            const saveAPIkeyInput = modTools.throttleTO(() => { setAPIkeyForAI(nameAI, inpAPIkey.value); }, 500);
            inpAPIkey.addEventListener("input", () => {
                // @ts-ignore
                console.log("input inpAPIkey", inpAPIkey.value);
                saveAPIkeyInput();
            });
            // @ts-ignore
            const lbl = mkElt("label", undefined, ["API key: ", inpAPIkey]);
            lbl.style = "display:grid; grid-template-columns: auto 1fr; gap: 10px;";

            const divAPIinfo = mkElt("div", undefined, [
                "Can show the mindmap automatically, but it requires an API key.",
            ]);
            if (urlAPIkey) {
                const aAPIkey = mkElt("a", {
                    href: urlAPIkey,
                    target: "_blank"
                }, `Get an API key for ${nameAI}`);
                // @ts-ignore
                const spanAPIkeyInfo = mkElt("span", undefined, [" (", aAPIkey, ".)"]);
                divAPIinfo.appendChild(spanAPIkeyInfo);
            }
            listAPI.appendChild(divAPIinfo);
            listAPI.appendChild(lbl);
        }
        if (isAndroid) {
            if (android) {
                const listAndroid = mkElt("list");
                ulAIdetails.appendChild(listAndroid);
                let strCan = "Can start Android app";
                if (qA) strCan = `${strCan} with prompt`;
                listAndroid.appendChild(mkElt("span", undefined, strCan));
            }
        }
        if (urlChat) {
            if (qW) {
                const listWeb = mkElt("list");
                ulAIdetails.appendChild(listWeb);
                const strCan = `Web chat adds the prompt for you`;
                listWeb.appendChild(mkElt("span", undefined, strCan));
            }
        }

        const numDetails = ulAIdetails.childElementCount;
        // console.log(nameAI, { numDetails });
        if (numDetails > 0) {
            // ulAIdetails.style = "display:flex; flex-direction:column; gap:20px;";
        } else {
            ulAIdetails.appendChild(mkElt("list", undefined, "(Nothing special.)"))
        }
        [...ulAIdetails.children].forEach((list) => {
            if (!(list instanceof HTMLElement)) throw Error("Not HTMLElement");
            const tn = list.tagName;
            if (tn != "LIST") throw Error(`list.tagName == "${tn}"`);
            list.style.display = "list-item";
            list.style.marginBottom = "15px";
        });

        // @ts-ignore
        const spanSummary = mkElt("span", undefined, [imgAIsummary, nameAI]);
        imgAIsummary.style.height = "30px";
        imgAIsummary.style.width = "30px";
        spanSummary.style.display = "inline-flex";
        spanSummary.style.gap = "10px";
        spanSummary.style.padding = "5px";
        const eltSummary = mkElt("summary", undefined, spanSummary);
        const divDetailsInner = mkElt("div", undefined, [
            // imgAI,
            ulAIdetails
        ]);
        const eltDetails = mkElt("details", undefined, [eltSummary, divDetailsInner]);
        eltDetails.style.borderBottom = "1px solid lightgray";
        divSettingsNotPuter.appendChild(eltDetails);
    });

    // const tabRecs = ["Call AI", "AIs Settings"];
    const tabRecs = ["Call AI"];
    // const contentElts = mkElt("div", undefined, [divTabForGo, divEltsAIsettingsTabs]);
    const contentElts = mkElt("div", undefined, [divTabForGo]);

    if (tabRecs.length != contentElts.childElementCount) throw Error("Tab bar setup number mismatch");
    // const eltAItabs = modMdc.mkMdcTabBarSimple(tabRecs, contentElts, undefined);


    const btnPuterUser = modMdc.mkMDCbutton("Puter user");
    btnPuterUser.addEventListener("click", () => {
        window.open("https://puter.com/settings");
    });

    // const divAItabs = mkElt("p", undefined, [eltAItabs, contentElts]);
    const divWays = mkElt("div", undefined, [
        // divAItabs
        divTabForGo
    ]);
    divWays.id = "div-ways";
    divWays.style.display = "none";





    const body = mkElt("div", undefined, [
        // eltNotReady,
        mkElt("h2", undefined, "Make mindmap from link"),
        mkElt("div", undefined, cardInput),
        divWays,
    ]);
    modMdc.mkMDCdialogAlert(body, "Close");

    checkInpLink(); // Necessary elements are connected to the DOM here


    /**
     * 
     * @param {string} strSourceLink 
     * @param {Object[]} nodeArray
     * @param {any} rootNode
     * 
     */
    async function doMakeGeneratedMindmap(strSourceLink, nodeArray, rootNode) {
        // const nodeArray = nodeArrayFromAI2jsmindFormat(theValidJsonNodeArray);
        // const rootNode = theValidRoot;
        // console.log(rootNode);
        nodeArray.forEach(n => {
            if (n.isRoot) {
                console.log("n.isRoot", n);
                return;
            }
            const nNotes = n.shapeEtc?.notes;
            if (typeof nNotes == "string") {
                const notes = `## AI Notes:\n${nNotes}`;
                n.shapeEtc.notes = notes;
            }
        });
        rootNode.topic = `${rootNode.topic} (w/ ${nameUsedAI})`;
        const rootNotes = rootNode.shapeEtc?.notes;
        // Insert source data
        let arrMdRootNotes = [
            "## Source etc\n",
            `*Article/video:* [${strSourceLink}](${strSourceLink})`,
            `*AI name:* ${nameUsedAI}`,
        ]
        if (typeof rootNotes == "string") {
            arrMdRootNotes.push(`\n## AI Notes\n\n${rootNotes}`);
        } else {
            arrMdRootNotes.push(`\n## AI Notes\n\nNo AI notes found for this node`);
        }
        const mdRootNotes = arrMdRootNotes.join("\n");
        if (typeof rootNotes == "string") {
            rootNode.shapeEtc.notes = mdRootNotes;
        } else {
            const notes = mdRootNotes;
            rootNode.shapeEtc = { notes };
        }


        // debugger;
        const mindInStoreFormat = {
            data: nodeArray,
            format: "node_array",
            key: "key-generate",
            meta: { name: "key-generate" }
        }
        const modJsEditCommon = await importFc4i("jsmind-edit-common");
        const jm = await modJsEditCommon.displayOurMindmap(mindInStoreFormat);
        modJsEditCommon.addScrollIntoViewOnSelect();
        jm.select_node(jm.get_root());
        setTimeout(() => modJsEditCommon.scrollSelectedNodeIntoView(), 500);
        jm.NOT_SAVEABLE = "This mindmap is made by an AI";
        // jm.MIND_STORE_FORMAT = mindInStoreFormat;
        document.getElementById("mm4i-btn-history")?.remove();
        // addShareMarker
        const addAIgeneratedMarker = () => {
            // const btnReplay = modMdc.mkMDCiconButton("replay", "Try again");
            // btnReplay.addEventListener("click", () => { alert("not implemented yet"); });
            const divInfo = mkElt("div", undefined,
                mkElt("span", undefined, [
                    "AI generated mindmap",
                    // btnReplay
                ]),
            );
            const eltTellGenerated = mkElt("div", undefined, [
                divInfo,
            ]);
            eltTellGenerated.id = "generated-marker";
            eltTellGenerated.classList.add("generated-marker");
            eltTellGenerated.classList.add("marker-at-bottom");
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
        // @ts-ignore
        function cleanJsonString(jsonString) {
            // Remove common problematic Unicode characters
            return jsonString
                .replace(/\u200B/g, '') // Zero-width space
                .replace(/\u200C/g, '') // Zero-width non-joiner
                .replace(/\u200D/g, '') // Zero-width joiner
                .replace(/\uFEFF/g, '') // Byte order mark
                .replace(/\u00A0/g, ' ') // Non-breaking space to regular space
                // oxlint-disable-next-line no-control-regex
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control characters
                .trim(); // Remove leading/trailing whitespace
        }

        // You may get more from the AI than the JSON:
        let strOnlyJson = cleanJsonString(strAI);
        const cleaned = [];

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

    const currentAIname = /** @type {string} */ (settingUsedAIname.value);
    checkIsAIchoosen();
    // if (currentAIname == "") { return; }

    if (isAutomatedAI(currentAIname)) {
        if (settingProceedAPI.value) {
            const doIitNow = confirm(`AI ${currentAIname} is automated. Make mindmap directly?`);
            if (!doIitNow) return;
            // "go"
            callNamedAI(currentAIname, promptAI);
        }
    }


    /**
     * @param {boolean} b 
     * @param {string} nameAI 
     * @returns 
     */
    function tellIfAIisChoosen(b, nameAI) {
        // console.log("tellIfAIisChoosen", { b, nameAI });
        // btnGo.inert = !b;
        if (b) {
            document.documentElement.classList.add("ai-is-choosen");
        } else {
            document.documentElement.classList.remove("ai-is-choosen");
        }
        return b;
    }

    function checkIsAIchoosen() {
        // console.warn("checkIsAIchoosen: typeof btnGo", typeof btnGo);
        /** @param {boolean} b * @param {string} [nameAI] * @returns {boolean} */
        const eltAI = divEltsAI.querySelector("input[type=radio][name=ai]:checked");
        if (!eltAI) return tellIfAIisChoosen(false, "");
        const nameAI = eltAI.value;
        if (nameAI == "") return tellIfAIisChoosen(false, nameAI);
        if (nameAI != "PuterJs") return tellIfAIisChoosen(true, nameAI);
        const model = settingPuterAImodel.value;
        if (model == "") return tellIfAIisChoosen(false, nameAI);
        return tellIfAIisChoosen(true, `${nameAI}, ${model}`);
    }
}

// infoAI =

/**
 * 
 * @param {string} nameAI
 * @returns {Promise<string|null>}
 */
async function dialogEditIntentUrl(nameAI) {
    const arrIntentUrl = testIntentsAI[nameAI];
    if (!arrIntentUrl) throw Error(`Could not find testIntentsAI["${nameAI}"]`);
    if (arrIntentUrl.length == 0) {
        // @ts-ignore
        return `https://${infoAIs[nameAI].url}`;
    }


    const keyIntentChoice = "mm4i-indentUrl-choice";
    const keyLastIntent = "mm4i-indentUrl-last";

    const divIntents = mkElt("div");
    const strOldIdx = localStorage.getItem(keyIntentChoice);
    const oldIdx = strOldIdx == null ? 0 : parseInt(strOldIdx);
    /** @param {string} strIntent @param {number} idx */
    // @ts-ignore
    const addIntentAlt = (strIntent, comment, idx) => {
        // @ts-ignore
        const rad = mkElt("input", { type: "radio", name: "rad-intent", value: idx });
        // @ts-ignore
        if (idx == oldIdx) { rad.checked = true; }
        const spanIntent = mkElt("span", undefined, strIntent);
        spanIntent.style = `
            overflow-wrap: anywhere;
            `;
        const spanComment = mkElt("span", undefined, comment);
        spanComment.style = `color:red;`;
        const spanEntry = mkElt("span", undefined, [spanIntent, spanComment])
        spanEntry.style = `
            display: flex;
            flex-direction: column;
            `;
        const lbl = mkElt("label", undefined, [rad, spanEntry]);
        lbl.style = `
            display: flex;
            gap: 5px;
            `;
        const div = mkElt("div", { class: "mdc-card" }, lbl);
        div.style = `
            margin-bottom: 10px;
            padding: 8px 12px 8px 4px;
            `;
        divIntents.appendChild(div);
        return div;
    }
    const len = arrIntentUrl.length;
    for (let idx = 0; idx < len; idx++) {
        const int = arrIntentUrl[idx];
        const int0 = int[0];
        const int1 = int[1];
        addIntentAlt(int0, int1, idx);
    }
    const lastIntentUrl = localStorage.getItem(keyLastIntent);
    if (lastIntentUrl) {
        const div = addIntentAlt(lastIntentUrl, "Last used edited", -1);
        div.style = `
            color: darkcyan;
            `;
    }


    const eltTA = mkElt("textarea");
    eltTA.style = `
        width: 100%;
        height: 8rem;
        `;

    let origIndentUrl = null;

    // @ts-ignore
    const updateEltTA = (idx) => {
        const useIdx = Math.min(idx, arrIntentUrl.length - 1); // FIX-ME: Temp fix
        const origIndentUrlEntry = arrIntentUrl[useIdx];
        const origIndentUrl = idx == -1 ? localStorage.getItem(keyLastIntent) : origIndentUrlEntry[0];
        if (origIndentUrl == null) throw Error(`origIndentUrl==null, ${idx}`);
        const arrIntent = origIndentUrl
            .split(";")
            .filter(l => l.trim() != "")
            .map(l => {
                return l.trim() + ";\n";
            });

        // @ts-ignore
        eltTA.value = arrIntent.join("");
    }
    updateEltTA(oldIdx);
    divIntents.addEventListener("input", () => {
        const currRad = divIntents.querySelector("input:checked");
        // @ts-ignore
        const currIdx = currRad.value;
        updateEltTA(currIdx);
    });

    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Edit intent url"),
        divIntents,
        eltTA
    ]);
    body.style = `
        width: calc(100vw - 80px);
        `;
    const modMdc = await importFc4i("util-mdc");
    const ans = await modMdc.mkMDCdialogConfirm(body, "Continue", "Cancel");
    if (ans) {
        const inp = divIntents.querySelector("input:checked") || divIntents.querySelector("input");
        // @ts-ignore
        const idx = inp.value;
        console.log({ idx });
        if (idx != -1) { localStorage.setItem(keyIntentChoice, idx); }
        // @ts-ignore
        const val = eltTA.value;
        // @ts-ignore
        const arr = val.split("\n").map(l => l.trim());
        const newIntentUrl = arr.join("");
        const same = newIntentUrl == origIndentUrl;
        console.log({ same, newIntentUrl, origIndentUrl });
        localStorage.removeItem(keyLastIntent);
        if (!same || idx == -1) { localStorage.setItem(keyLastIntent, newIntentUrl); }
        return newIntentUrl;
    }
    return null;
}

/**
 * 
 * @param {string} intentUrl 
 * @param {string} nameAI 
 * @param {string} promptAI 
 * @returns 
 */
async function launchIntentWithIframe(intentUrl, nameAI, promptAI) {
    let appLaunched = false;
    // const infoThisAI = infoAI[nameAI];
    // if (!infoThisAI) throw Error(`Could not find info for AI "${nameAI}"`);
    const urlFallBack = mkUrlChat(nameAI, promptAI);

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    // Append the iframe to the body
    document.body.appendChild(iframe);

    // Set the iframe's src to the intent URL
    const src = intentUrl;
    if (src == null) return;


    // Listen for visibility changes with the 'once' option
    document.addEventListener('visibilitychange', checkVisibility);
    function checkVisibility() {
        document.removeEventListener('visibilitychange', checkVisibility);
        console.log("checkVisibility, document.hidden", document.hidden);
        appLaunched = true;
        if (document.hidden) {
            appLaunched = true;
        }
    }

    // Set a timer to check for the fallback
    console.log("starting setTimeout");
    setTimeout(function () {
        // alert(`in setTimeout check appLaunched, ${appLaunched}`);
        // Clean up
        iframe.remove();
        document.removeEventListener('visibilitychange', checkVisibility);

        // If the app was not launched, open the fallback in a new tab
        if (!appLaunched) {
            window.open(urlFallBack, 'AIWINDOW', "noopener,noreferrer");
        }
    }, 4 * 1000);

    console.log(">>>>>> Before iframe.src = src");
    iframe.src = src;
    console.log(">>>>>> After iframe.src = src");
}

/**
 * @param {string} nameAI - AI name
 * @returns {{way: string, copyQ: boolean, hasWebAPI: boolean}} 
 */
function getWayToCallAI(nameAI) {
    if (typeof nameAI != "string") throw Error("nameAI was not string");
    if (nameAI == "groq") {
        return { way: "API", copyQ: false, hasWebAPI: false }
    }
    if (nameAI == "PuterJs") {
        return { way: "API", copyQ: false, hasWebAPI: true };
    }
    const infoThisAI = infoAIs[nameAI];
    if (!infoThisAI) {
        // FIX-ME:
        // debugger;
        return { way: "API", copyQ: false, hasWebAPI: true };
    }
    // First try API
    const funAPI = infoThisAI.fun;
    const hasWebAPI = !!funAPI;
    if (funAPI) {
        const keyAPI = getAPIkeyForAI(nameAI);
        // console.warn(nameAI, { keyAPI });
        if (keyAPI) {
            return { way: "API", copyQ: false, hasWebAPI };
        }
    }
    if (!isAndroid) {
        return { way: "web", copyQ: false, hasWebAPI };
    }
    if (!infoThisAI.android) {
        return { way: "web", copyQ: false, hasWebAPI };
    }
    return { way: "android-app", copyQ: false, hasWebAPI };
}

/**
 * 
 * @param {string} nameAI 
 * @returns {boolean}
 */
export function wayToCallAIisAPI(nameAI) {
    const { way } = getWayToCallAI(nameAI);
    return way == "API";
}

/**
 * 
 * @param {string} nameAI 
 * @param {string} promptAI 
 */
async function callNamedAI(nameAI, promptAI, handleRes) {
    // const modTools = await importFc4i("toolsJs");

    const divGoStatus = document.getElementById("div-go-status");
    if (!divGoStatus) throw Error(`Did not find element "div-go-status"`);
    // divGoStatus.style.color = "unset";

    document.documentElement.classList.remove("no-internet");
    if (!await promHasInternet()) {
        divGoStatus.textContent = `No Internet.`;
        document.documentElement.classList.add("no-internet");
        // divGoStatus.style.color = "blue";
        setCSSforAIautomated(false);
        setCSSforAIonClipboard(false);
        return;
    }

    const divUserSteps = document.getElementById("div-user-steps");
    if (!divUserSteps) throw Error(`Did not find element "div-user-steps"`);


    const { way: wayToCallAI } = getWayToCallAI(nameAI);
    switch (wayToCallAI) {
        case "API":
            callAIapi(nameAI);
            break;
        case "web":
            callAIweb(nameAI);
            break;
        case "android-app":
            callAIandroidApp(nameAI);
            break;
        default:
            throw Error(`Did not handle AI way "${wayToCallAI}"`);
    }


    //// Ways to call AI
    /** @param {string} nameAI */
    async function callAIweb(nameAI) {
        if (divGoStatus == null) throw Error(`divGoStatus == null`);
        const infoThisAI = infoAIs[nameAI];
        // const thisAIisPWA = infoThisAI.isPWA;
        const thisAIisPWA = getAIinfoValue(infoThisAI, "isPWA");
        const tofIsPWA = typeof thisAIisPWA;
        if (tofIsPWA != "boolean") throw Error(`typeof isPWA == "${tofIsPWA}"`);
        const pwaIndicator = thisAIisPWA ? " (PWA)" : "";
        divGoStatus.append(`Opening ${nameAI} web${pwaIndicator} chat.`);
        // if (thisAIisPWA) divGoStatus.append(`, PWA`);
        await modTools.waitSeconds(2);

        const webUrl = mkUrlChat(nameAI, promptAI);
        if (thisAIisPWA) {
            const winHandle = window.open(`${webUrl}`, "AIWINDOW", "noopener,noreferrer");
            // winHandle will be null when using noopener or noreferrer
            if (winHandle != null) throw Error(`winHandle is not null, but isPWA`);
        } else {
            const winHandle = window.open(`${webUrl}`);
            if (winHandle == null) {
                divGoStatus.textContent = "Could not open new window";
            } else {
                divGoStatus.textContent = `Opened ${nameAI} in new window`;
            }
        }
    }

    /** @param {string} nameAI */
    async function callAIapi(nameAI) {
        if (divGoStatus == null) throw Error("divGoStatus == null");
        // divGoStatus.style.color = "unset";
        divGoStatus.textContent = `Waiting for ${nameAI} . . .`;
        let s10 = 0;
        let msStart = Date.now();
        const tmrAlive = setInterval(() => {
            const s10new = Math.floor((Date.now() - msStart) / (10 * 1000));
            if (s10new > s10) {
                s10 = s10new;
                divGoStatus.append(` ${s10 * 10}s`);
            } else {
                divGoStatus.append(" .");
            }
        }, 1500);
        const infoThisAI = infoAIs[nameAI];
        const keyAPI = getAPIkeyForAI(nameAI);
        const funAPI = infoThisAI.fun;
        if (typeof funAPI != "function") throw Error(`typeof funAPI == "${typeof funAPI}"`);


        // const msStart = Date.now();
        //
        const res = await funAPI(promptAI, keyAPI);
        //
        const msStop = Date.now();
        const msElapsed = msStop - msStart;
        const secElapsed = msElapsed / 1000;
        const minutesElapsed = Math.floor(secElapsed / 60);
        const secondsElapsed = Math.floor(secElapsed % 60);
        const strElapsed = `${minutesElapsed}:${String(secondsElapsed).padStart(2, "0")}`;


        clearInterval(tmrAlive);
        console.log({ res });
        if (res instanceof Error) {
            console.error(res);
            document.documentElement.classList.add("ai-response-error");
            divGoStatus.textContent = `${nameAI}: ${res.message}`;
            // @ts-ignore
            divUserSteps.textContent = "";
        } else {
            if (secElapsed > settingNotifyReadySec.valueN) {
                modTools.showNotification(`${nameAI} is ready`, `Elapsed time: ${strElapsed}`);
            }
            // divGoStatus.style.color = "green";
            document.documentElement.classList.add("has-ai-response");
            divGoStatus.textContent = `${nameAI} answered (${parseFloat(secElapsed).toFixed(0)}s)`;
            logEstimateAItokens(res, "callNamedAI");
            handleRes(res);
        }
    }

    // @ts-ignore
    async function callAIandroidApp(nameAI) {
        if (divGoStatus == null) throw Error(`divGoStatus == null`);
        const infoThisAI = infoAIs[nameAI];
        const androidIntent = infoThisAI.android;
        const rawIntentUrl = androidIntent ? androidIntent : await dialogEditIntentUrl(nameAI);
        if (rawIntentUrl == null) {
            const modMdc = await importFc4i("util-mdc");
            modMdc.mkMDCsnackbar("Canceled");
            return;
        }
        if (!rawIntentUrl) throw Error(`intentUrl=="${rawIntentUrl}"`);

        divGoStatus.append(`, opening ${nameAI} Android app`);
        await modTools.waitSeconds(2);
        const intentUrl = rawIntentUrl.replaceAll(/PLACEHOLDER/g, promptAI);
        const promptEncoded = encodeURIComponent(promptAI);
        launchIntentWithIframe(intentUrl, nameAI, promptEncoded);
        divGoStatus.textContent = `Launched ${nameAI} android app`;
    }
}

/**
 * @param {string} nameAI 
 * @param {string} promptAI 
 * @returns {string}
 */
function mkUrlChat(nameAI, promptAI) {
    const infoThisAI = infoAIs[nameAI];
    const url = infoThisAI.urlChat;
    /*
    if (nameAI == "Grok") {
        const urlChat = `https://${url}`;
        console.log("removing prompt for Grok");
        return urlChat;
    }
    if (nameAI == "Grok") {
        const urlChat = `https://${url}?q=hello`;
        console.log("setting prompt to hello for Grok");
        return urlChat;
    }
    */
    const promptEncoded = encodeURIComponent(promptAI);
    const urlChat = `https://${url}?q=${promptEncoded}`;
    console.log(`mkWebUrl for ${nameAI}`, urlChat);
    return urlChat;
}


/**
 * Make node array in jsmind format from AI json.
 *  
 * @param {Object[]} aiJson 
 * @returns {Object[]}
 */
function nodeArrayFromAI2jsmindFormat(aiJson) {
    // https://chatgpt.com/share/68ab0c5c-abe8-8004-8a37-616c5a28c8ce

    // parentId: Grok AI
    // parent: Claude AI

    ////// .parentId, .parent => .parentid, .text, .name => .topic
    ////// .notes
    let aiNodeArray = aiJson;
    // if (!Array.isArray(aiNodeArray)) throw Error("Expected JSON to be an array");
    if (!Array.isArray(aiNodeArray)) {
        aiNodeArray = modMMhelpers.flattenMindmapClean(aiJson);
    }
    const nodeArray = aiNodeArray.map(n => {
        // @ts-ignore
        n.expanded = false;
        // @ts-ignore
        if (!n.topic) {
            let topic;
            // @ts-ignore
            if (n.text) topic = n.text;
            // @ts-ignore
            if (n.name) topic = n.name;
            if (!topic) throw Error(`!n.text || !n.name: ${JSON.stringify(n)}`);
            // @ts-ignore
            n.topic = topic;
            // @ts-ignore
            delete n.text;
            // @ts-ignore
            delete n.name;
        }

        // @ts-ignore
        const parentid = n.parentId || n.parent || n.parentid;
        // @ts-ignore
        delete n.parentId;
        // @ts-ignore
        delete n.parentid; // chatGPT
        // @ts-ignore
        delete n.parent;

        // @ts-ignore
        if (parentid && parentid != "") n.parentid = parentid;

        // @ts-ignore
        const notes = n.notes;
        if (notes) {
            const tofNotes = typeof notes;
            if (tofNotes != "string") { throw Error(`typeof notes == "${tofNotes}`); }
            const shapeEtc = { notes }
            // @ts-ignore
            n.shapeEtc = shapeEtc;
            // @ts-ignore
            delete n.notes;
        }

        return n;
    });


    /*
    /////// find root
    // @ts-ignore
    let root_node;

    ////// find root children
    // @ts-ignore
    root_node.isroot = true;
    // @ts-ignore
    const rootId = root_node.id;
    // @ts-ignore
    const rootChildren = [];
    // @ts-ignore
    nodeArray.forEach(n => { if (n.parentid == rootId) rootChildren.push(n); });
    // @ts-ignore
    rootChildren.forEach(n => n.direction = 1);
    */

    return nodeArray;
}


////// AI API keys etc
// AI to call

// btnEasyWay.addEventListener("click", _evt => {

/**
 * @param {string} nameAI 
 * @returns {string}
 */
function keyNameAI(nameAI) {
    const key = `mm4i-ai-api-key-${nameAI}`;
    return key;
}

/**
 * 
 * @param {string} nameAI 
 * @returns {string}
 */
function getCommonAPIkey(nameAI) {
    switch (nameAI) {
        case "groq": return "grook-door";
    }
    return "";
}

/**
 * 
 * @param {string} nameAI 
 * @returns {string}
 */
function getUserAPIkeyForAI(nameAI) {
    const key = keyNameAI(nameAI);
    const userAPIkey = localStorage.getItem(key);
    return userAPIkey || "";
}

/**
 * @param {string} nameAI 
 * @return {string}
 */
function getAPIkeyForAI(nameAI) {
    // const key = keyNameAI(nameAI);
    // const userAPIkey = localStorage.getItem(key);
    const userAPIkey = getUserAPIkeyForAI(nameAI);
    const APIkey = userAPIkey || getCommonAPIkey(nameAI);
    return APIkey;
}

/**
 * 
 * @param {string} nameAI 
 * @param {string} apiKey 
 */
function setAPIkeyForAI(nameAI, apiKey) {
    const key = keyNameAI(nameAI);
    return localStorage.setItem(key, apiKey);
}




/**
 * @callback CallAIapi
 * @param {string} userPrompt The text prompt to send to the AI model.
 * @param {string} [apiKey] Your API Key.
 * @returns {Promise<string|Error>} The text response from the AI model.
 */



/** @type {CallAIapi} */
async function callOpenAIapi(userPrompt, apiKey) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            // "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, // set your API key
            "Authorization": `Bearer ${apiKey}`, // set your API key
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4.1-mini", // fast + cheaper model; use gpt-4.1 for more reasoning
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: userPrompt }
            ]
        })
    });

    const data = await response.json();
    // debugger;
    /*
    {
        const example = {
            message: 'Incorrect API key provided: xai-99FV**************… at https://platform.openai.com/account/api-keys.',
            type: 'invalid_request_error',
            param: null,
            code: 'invalid_api_key'
        }
    }
    */
    if (data.error) {
        // debugger;
        console.error(data);
        const errObj = Error(data.error.message);
        return errObj;
    }
    return data.choices[0].message.content;
}


// Variable to store the initialized AI client so we don't reload or re-initialize.
/** @type {Object|null} */ let aiClient = null;



/** @type {CallAIapi} */
async function callGeminiAPI(userPrompt, apiKey) {
    // --- Dynamic Loading and Initialization (Happens only once) ---
    if (!aiClient) {
        try {
            // askError("callGeminiAPI in !aiClient");
            // Dynamically import the Google Gen AI SDK from the CDN URL
            // const module = await import('https://unpkg.com/@google/genai/dist/index.js');
            // @ts-ignore
            const module = await import("https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm");

            // The module export contains the GoogleGenAI class
            const { GoogleGenAI } = module;

            // Initialize the client
            aiClient = new GoogleGenAI({ apiKey: apiKey });

        } catch (error) {
            const errorMsg = String(error);
            const msg = `in Gemini !aiClient: ${errorMsg}`;
            console.error(msg, error);
            return Error(`${msg}`);
        }
        if (aiClient == null) {
            return Error("aiClient is null");
        }
    }
    // ----------------------------------------------------------------

    // --- API Call (Happens every time) ---
    try {
        // askError("callGeminiAPI in response");
        // @ts-ignore
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
        });
        return response.text;
    } catch (error) {
        const errorMsg = String(error);
        const msg = `in Gemini response part: ${errorMsg}`;
        console.error(msg, error);
        return Error(`${msg}`);
    }
}



// From Grok:
// https://console.anthropic.com/login?returnTo=%2F%3F


/**
 * @callback CallAIapiWithOptions
 * @param {string} userPrompt The text prompt to send to the Claude model.
 * @param {string} apiKey Your Anthropic API Key.
 * @param {Object} [options] Optional parameters for the API call.
 * @returns {Promise<string|Object|Error>} The text response from the model or an Error object.
 */
/** @type {CallAIapiWithOptions} */
export async function callClaudeAPI(userPrompt, apiKey, options = {}) {
    try {
        // Dynamically import the Anthropic SDK ES6 module
        // @ts-ignore
        const Anthropic = (await import('https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.26.0/+esm')).default;

        // Initialize the Anthropic client
        const anthropic = new Anthropic({ apiKey });

        // Extract options with defaults
        // @ts-ignore
        const { model = 'claude-3-5-sonnet-20240620', maxTokens = 1024 } = options;

        // Call the messages endpoint
        const response = await anthropic.messages.create({
            model,
            max_tokens: maxTokens,
            messages: [{ role: 'user', content: userPrompt }],
        });

        // Return the response text
        return response.content[0].text;
    } catch (error) {
        const errorMsg = String(error);
        console.error('Error calling Claude API:', error);
        return new Error(`Failed to call Claude API: ${errorMsg}`);
    }
}

// Example usage (for testing in the browser console)
async function _testClaude() {
    try {
        const response = await callClaudeAPI(
            'Hello, Claude! Tell me a fun fact about the ocean.',
            'YOUR_API_KEY', // Replace with your secure method of providing the key
            { model: 'claude-3-5-sonnet-20240620', maxTokens: 50 }
        );
        if (response instanceof Error) {
            console.error(response);
        } else {
            console.log('Claude\'s response:', response);
        }
    } catch (error) {
        const errorMsg = String(error);
        console.error(errorMsg, error);
    }
}





/** @type {CallAIapiWithOptions} */
export async function callPerplexityAPIthroughProxy(userPrompt, apiKey, options = {}) {
    try {
        // Validate inputs
        if (!userPrompt || typeof userPrompt !== 'string') {
            throw new Error('userPrompt must be a non-empty string');
        }
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('apiKey must be a non-empty string');
        }

        // Extract options with defaults
        const {
            model = 'llama-3.1-sonar-small-128k-online',
            maxTokens = 1024,
        } = options;

        // Make direct HTTP request to Perplexity API
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: userPrompt }],
                max_tokens: maxTokens,
                stream: false,
            }),
        });

        // Check for HTTP errors
        if (!response.ok) {
            let errorText;
            try {
                const errorData = await response.json();
                errorText = errorData.error?.message || (await response.text()) || 'Unknown error';
            } catch (error) {
                const errorMsg = String(error);
                errorText = `Failed to parse error response: ${errorMsg}`;
            }
            throw new Error(`Perplexity API error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Parse response
        const data = await response.json();

        // Ensure response contains text content
        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error('No text content in response');
        }

        // Return the response text
        return data.choices[0].message.content;
    } catch (error) {
        const errorMsg = String(error);
        console.error('Error calling Perplexity AI API:', {
            message: errorMsg,
            // @ts-ignore
            name: error.name, stack: error.stack,
            userPrompt,
            options,
            timestamp: new Date().toISOString(),
        });
        return new Error(`Failed to call Perplexity AI API: ${errorMsg}`);
    }
}




/* @type {CallAIapi} */
/*
async function _callPuterJs(userPrompt) {
    const res = await puter.ai.chat(userPrompt, {
        model: settingPuterAImodel.value
    });
    console.log(res)
    return res;
}
*/

/** @param {string} provider @returns {string} */
function makeNiceProviderName(provider) {
    switch (provider) {
        case "google":
            return "Google";
        case "openai":
            return "OpenAI";
    }
    return provider;
}

export function showAIclipboardDiv() {
    const div = document.getElementById("div-ai-clipboard");
    if (div == null) throw Error("Did not get #div-ai-clipboard");
    div.style.display = "unset";
}

/** @param {string} nameAI @returns {boolean} */
function isAutomatedAI(nameAI) {
    const { way } = getWayToCallAI(nameAI);
    return way == "API";
}

/**
 * Count tokens for a value (string, number, boolean, null, object, array)
 * (Originally From Grok.)
 * 
 * @param {any} value 
 * @returns {number}
 */
export function estimateAItokens(value) {
    // Base heuristic: ~4.5 chars per token for strings/numbers
    const charsPerToken = 4.5;
    if (value === null || value === undefined) {
        return 1; // null is ~1 token
    }
    if (typeof value === 'boolean') {
        return 1; // true/false is ~1 token
    }
    if (typeof value === 'number') {
        // Numbers: ~1 token for small integers, more for decimals/longer numbers
        return Math.ceil(String(value).length / charsPerToken) || 1;
    }
    if (typeof value === 'string') {
        // Strings: chars / 4.5 + 2 for quotes
        return Math.ceil(value.length / charsPerToken) + 2;
    }
    if (Array.isArray(value)) {
        // Arrays: 2 for [] + tokens for elements + commas
        let tokens = 2; // []
        for (let i = 0; i < value.length; i++) {
            tokens += estimateAItokens(value[i]);
            if (i < value.length - 1) tokens += 1; // Comma
        }
        return tokens;
    }
    if (typeof value === 'object') {
        // Objects: 2 for {} + tokens for keys/values + commas + colons
        let tokens = 2; // {}
        const entries = Object.entries(value);
        for (let i = 0; i < entries.length; i++) {
            const [key, val] = entries[i];
            tokens += estimateAItokens(key) + estimateAItokens(val) + 1; // Key + value + colon
            if (i < entries.length - 1) tokens += 1; // Comma
        }
        return tokens;
    }
    return 0; // Fallback for unexpected types
}


/**
 * 
 * @param {Object|null} objJson 
 * @param {string} where;
 * @returns 
 */
function logEstimateAItokens(objJson, where) {
    try {
        const numTokens = estimateAItokens(objJson);
        console.log(`%cEstimated num AI tokens (${where}): ${numTokens}`,
            "background:blue;color:yellowgreen;font-size:24px;");
        return numTokens;
    } catch (error) {
        const errorMsg = String(error);
        console.error('Error estimating tokens:', errorMsg, error);
        return 0;
    }
}

// Example usage
function _testEstimateTokens() {
    const testCases = [
        { name: "Alice", age: 30 },
        { items: [1, 2, 3], config: { enabled: true, id: "xyz123" } },
        { data: "Hello, world!" },
        { nested: { a: 1, b: { c: "test" } } },
        [], // Empty array
        {}, // Empty object
        null
    ];

    testCases.forEach((input, index) => {
        const tokens = logEstimateAItokens(input);
        console.log(`Test ${index + 1}:`,
            JSON.stringify(input, null, 2),
            `→ ~${tokens} tokens`);
    });
}

// Run tests
// _testEstimateTokens();

/** @param {boolean} inert */
/** @param {boolean} canBeThere */
function setCSSforAIonClipboard(canBeThere) {
    if (canBeThere) {
        document.documentElement.classList.add("have-ai-on-clipboard");
    } else {
        document.documentElement.classList.remove("have-ai-on-clipboard");
    }
}
/** @param {boolean} inert */
function setCliboardInert(inert) {
    const divCliboard = document.getElementById("div-ai-clipboard");
    // if (divCliboard == null) throw Error("Did not get #div-ai-clipboard");
    if (divCliboard == null) return;
    divCliboard.inert = inert
}
function isCliboardInert() {
    const divCliboard = document.getElementById("div-ai-clipboard");
    if (divCliboard == null) return;
    return divCliboard.inert;
}


/** @param {boolean} canBeThere */
function setCSSforAIautomated(automated) {
    if (automated) {
        document.documentElement.classList.add("ai-is-automated");
    } else {
        document.documentElement.classList.remove("ai-is-automated");
    }
}
/** * * @param {boolean} isAutomated */
function OLDsetCSSforIsAutomatedAI(isAutomated) {
    if (isAutomated) {
        document.documentElement.classList.add("ai-is-automated");
    } else {
        document.documentElement.classList.remove("ai-is-automated");
    }
}

/**
 * 
 * @param {string} nameAI 
 * @param {HTMLDivElement} eltWhere 
 */
function getWhatToDoForUser(nameAI, eltWhere) {
    let { way, copyQ } = getWayToCallAI(nameAI);
    const infoThisAI = infoAIs[nameAI];
    // const { qW, qA, android, urlImg, urlChat, isPWA, fun, urlAPIkey } = infoThisAI;

    let numDo = 0;
    /** @type {HTMLSpanElement[]} */
    const arrToDo = [];
    /** @param {string|HTMLElement} eltDo */
    const addDo = (eltDo) => {
        numDo++;
        const bNum = mkElt("b", undefined, `${numDo}.`);
        bNum.style.marginRight = "10px";
        const spanDo = mkElt("div", undefined, [bNum, eltDo]);
        arrToDo.push(spanDo);
    }
    if (way == "API") {
        addDo("Just wait, it is automated.");
        arrToDo.forEach(td => { eltWhere.appendChild(td); });
        return;
    }
    const { qW, qA } = infoThisAI;
    const qValue = isAndroid ? qA : qW;
    const needPaste = (qValue == false);
    // if (needPaste != copyQ) { console.warn(`needPaste (${needPaste} != copyQ (${copyQ}))`); }
    const needStart = needPaste || (qValue != "auto");

    if (needPaste) { addDo("In AI: Paste the prompt."); }
    if (needStart) { addDo("In AI: Click send button."); }
    addDo("In AI: Copy AI answer");
    addDo(mkElt("span", undefined, [
        "Here: ",
        "Click ", mkElt("i", undefined, txtBtnCopyCliboard),
    ]));
    // return arrToDo;
    arrToDo.forEach(td => { eltWhere.appendChild(td); });
}



/** @type {CallAIapi} */
async function callMistralAPI(userPrompt, apiKey) {
    const endpoint = "https://api.mistral.ai/v1/chat/completions"; // Verify endpoint in Mistral's docs

    const mistralModels = [
        "mistral-small-3.1",
        "mistral-medium-3",
        "mistral-large-latest",
        "magistral-small",
        "pixtral-latest",    // for multimodal tasks
        "codestral-latest"  // for code generation
    ];

    const requestBody = {
        // model: "mistral-large-latest", // or your preferred model
        model: mistralModels[0], // default for free users in the android app
        messages: [
            {
                role: "user",
                content: userPrompt
            }
        ],
        temperature: 0.7,
        max_tokens: 2000,
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        // Return the raw text response (assuming it's in choices[0].message.content)
        return data.choices[0].message.content;
    } catch (error) {
        console.error("API call failed:", error);
        return error;
    }
}

/*
// Example usage:
const prompt = `
1. If this prompt does not end with ----, consider it incomplete and notify the user that the prompt appears to be cut off.
2. Summarize the article "https://en.wikipedia.org/wiki/Th%C3%ADch_Nh%E1%BA%A5t_H%E1%BA%A1nh" into one mind map and output a strict, parse-ready JSON node array (flat; fields: id, name, parentid, and notes).
3. Optional field "notes": For details, markdown format.
4. Give as much detail as in a text summary.
5. Limit the hierarchy to max depth 4 levels.
6. Return only valid JSON (no text before or after).
7. Preserve escaped newlines (\n) inside string values for JSON validity; they should represent Markdown line breaks when rendered.
8. ----
`;

callMistralAPI(prompt, "YOUR_API_KEY")
    .then(response => {
        if (response instanceof Error) {
            console.error("Error:", response.message);
        } else {
            console.log("AI Response:", response);
            // Parse the JSON if needed
            try {
                const mindmap = JSON.parse(response);
                console.log("Parsed Mindmap:", mindmap);
            } catch (e) {
                console.error("Failed to parse JSON:", e);
            }
        }
    });

*/


// https://huggingface.co/
// "HuggingFace"
/** @type {CallAIapi} */
async function callHuggingFaceInference(userPrompt, apiKey) {
    debugger;
    const modHuggingFace = await importFc4i("huggingface-inference");
    const InferenceClient = modHuggingFace.InferenceClient;
    // const InferenceClient = modHuggingFace.chatCompletion;
    const client = new InferenceClient(apiKey);
    // const model = "mistralai/Mistral-7B-Instruct-v0.2"; // Change to any Hugging Face model
    // const model = "HuggingFaceH4/zephyr-7b-beta"; // (fast, conversational, great for structured outputs).
    // const model = "microsoft/DialoGPT-large"; //  (reliable for text gen, smaller footprint).
    // const model = "gpt2"; // (ultra-light fallback for testing).

    // Grok: Use a model confirmed to work with chatCompletion on the free Inference API. Recommended:
    // const model = "HuggingFaceH4/zephyr-7b-beta"; // (optimized for conversational tasks, reliable on free tier).
    // const model = "mistralai/Mixtral-8x7B-Instruct-v0.1"; // (if available, great for JSON tasks; check for cold starts).
    // const model = "meta-llama/Llama-3.2-3B-Instruct"; // (newer, may require gated access approval).

    // const model = "facebook/bart-large";
    const model = "gpt2"; // (ultra-light fallback for testing).
    try {
        const strJson = await client.chatCompletion({
            model,
            inputs: userPrompt,
        });
        console.log({ strJson });
        return strJson;
    } catch (err) {
        if (err instanceof modHuggingFace.InferenceClientProviderApiError) {
            debugger;
        }
        const msg = String(err);
        return Error(msg);
    }
}

/** @type {CallAIapi} */
async function callHuggingFaceAPI(userPrompt, apiKey) {
    const model = "mistralai/Mistral-7B-Instruct-v0.2"; // Change to any Hugging Face model
    const API_URL = `https://api-inference.huggingface.co/models/${model}`;

    const requestBody = {
        inputs: userPrompt,
        parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false // Set to true if you want the full prompt + response
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Hugging Face API error: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (!data || !data[0]?.generated_text) {
            throw new Error("No valid response from the model.");
        }

        return data[0].generated_text;
    } catch (error) {
        console.error("Hugging Face API call failed:", error);
        return error;
    }
}

/*
// Example usage:
const prompt = "Summarize the key points of Thích Nhất Hạnh's teachings in 3 bullet points.";
const hfToken = "YOUR_HUGGING_FACE_TOKEN"; // Replace with your token

callHuggingFaceAPI(prompt, hfToken)
    .then(response => {
        if (response instanceof Error) {
            console.error("Error:", response.message);
        } else {
            console.log("AI Response:", response);
        }
    });
*/

/**
 * @param {string} where 
 */
function askError(where) {
    const doIt = confirm(`Throw error at "${where}"?`);
    if (doIt) throw Error(`[askError at "${where}"]`);
}

/**
 * 
 * @returns {Promise<boolean>}
 */
async function promHasInternet() {
    // @ts-ignore
    // const funHasInternet = window["PWAhasInternet"];
    const modPWA = await importFc4i("pwa");
    const funHasInternet = modPWA.PWAhasInternet;
    // FIX-ME:
    if (!funHasInternet) {
        throw Error("Could not find window[PWAhasInternet]");
    }
    const tofFun = typeof funHasInternet;
    if (tofFun != "function") throw Error(`typeof funHasInternet == "${tofFun}"`);
    const internet = await funHasInternet();
    // const pretendNo = confirm(`internet==${internet}, pretend no internet?`);
    // if (pretendNo) return false;
    return internet;
}


/** @type {CallAIapiWithOptions} */
async function callHuggingFaceAIapi(userPrompt, apiKey, options = {}) {
    // const endpoint = 'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';
    const model = options.model || 'HuggingFaceH4/zephyr-7b-beta';
    const endpoint = `https://api-inference.huggingface.co/models/${model}`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: userPrompt,
                parameters: {
                    return_full_text: false,
                    max_new_tokens: 1000
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        // Handle streaming or direct response
        const generatedText = Array.isArray(data) ? data[0].generated_text : data.generated_text;

        return generatedText;
    } catch (error) {
        throw new Error(`API call failed: ${error.message}`);
    }
}


/** @type {CallAIapiWithOptions} */
async function callGroqAPI(userPrompt, apiKey, options = {}) {
    /////////// For tests
    const badFailedGenerate =
        "{\"error\":\"{\\\"error\\\":{\\\"message\\\":\\\"Failed to generate JSON. Please adjust your prompt. See 'failed_generation' for more details.\\\",\\\"type\\\":\\\"invalid_request_error\\\",\\\"code\\\":\\\"json_validate_failed\\\",\\\"failed_generation\\\":\\\"{\\\\n  \\\\\\\"id\\\\\\\":1,\\\\n   \\\\\\\"name\\\\\\\":\\\\\\\"Self-compassion\\\\\\\",\\\\n   \\\\\\\"notes\\\\\\\":\\\\\\\"\\\\\\\\n**Definition**\\\\\\\\nSelf-compassion is the practice of treating oneself with kindness, understanding, and acceptance when experiencing suffering or personal failure.\\\\\\\"\\\\n   },\\\\n   \\\\\\\"id\\\\\\\":2,\\\\n   \\\\\\\"name\\\\\\\":\\\\\\\"Components\\\\\\\",\\\\n   \\\\\\\"parentid\\\\\\\":1,\\\\n   \\\\\\\"notes\\\\\\\":\\\\\\\"\\\\\\\\n**Three Main Components**\\\\\\\\n1. **Self-kindness**: treating oneself with kindness and care.\\\\\\\\n2. **Common humanity**: recognizing that all humans experience suffering and imperfection.\\\\\\\\n3. **Mindfulness**: being present and aware of one's experiences without judgment.\\\\\\\"\\\\n   },\\\\n   \\\\\\\"id\\\\\\\":3,\\\\n   \\\\\\\"name\\\\\\\":\\\\\\\"Benefits\\\\\\\",\\\\n   \\\\\\\"parentid\\\\\\\":1,\\\\n   \\\\\\\"notes\\\\\\\":\\\\\\\"\\\\\\\\n**Positive Effects**\\\\\\\\n1. **Reduced stress and anxiety**\\\\\\\\n2. **Improved emotional regulation**\\\\\\\\n3. **Increased resilience**\\\\\\\\n4. **Better relationships**\\\\\\\"\\\\n   },\\\\n   \\\\\\\"id\\\\\\\":4,\\\\n   \\\\\\\"name\\\\\\\":\\\\\\\"Techniques\\\\\\\",\\\\n   \\\\\\\"parentid\\\\\\\":1,\\\\n   \\\\\\\"notes\\\\\\\":\\\\\\\"\\\\\\\\n**Practical Strategies**\\\\\\\\n1. **Mindful breathing**\\\\\\\\n2. **Self-compassion meditation**\\\\\\\\n3. **Journaling**\\\\\\\\n4. **Physical self-care\\\\\\\"\\\\n   },\\\\n   \\\\\\\"id\\\\\\\":5,\\\\n   \\\\\\\"name\\\\\\\":\\\\\\\"Challenges\\\\\\\",\\\\n   \\\\\\\"parentid\\\\\\\":1,\\\\n   \\\\\\\"notes\\\\\\\":\\\\\\\"\\\\\\\\n**Common Obstacles**\\\\\\\\n1. **Self-criticism**\\\\\\\\n2. **Perfectionism**\\\\\\\\n3. **Difficulty with self-acceptance\\\\\\\"\\\\n   },\\\\n   \\\\\\\"id\\\\\\\":6,\\\\n   \\\\\\\"name\\\\\\\":\\\\\\\"Research\\\\\\\",\\\\n   \\\\\\\"parentid\\\\\\\":1,\\\\n   \\\\\\\"notes\\\\\\\":\\\\\\\"\\\\\\\\n**Scientific Studies**\\\\\\\\n1. **Increased self-compassion leads to improved mental health\\\\\\\"\\\\n2. **Self-compassion is linked to increased life satisfaction\\\\\\\"\\\\\\\\n3. **Mindfulness-based interventions increase self-compassion\\\\\\\"\\\\n   }\\\"}}\\n\"}";
    // debugger; return handleErrorText(400, badFailedGenerate);



    /**
     * 
     * @param {Object} json 
     * @returns {Object}
     */
    function cleanOfNodes(json) {
        if (json.nodes) {
            // debugger;
            return json.nodes;
        }
        return json;
    }
    if (modTools.isVercelDev()) {
        // const returnFixed =  (confirm("vercel dev. Return fixed json?");
        const returnFixed = false;
        if (returnFixed) {
            // debugger;
            const temp = '{"nodes":[{"id":1,"name":"Self-Compassion","parentid":null,"notes":""},{"id":2,"name":"Definition","parentid":1,"notes":"Self-compassion is the practice of treating oneself with kindness, understanding, and acceptance, especially during difficult times."},{"id":3,"name":"Key Components","parentid":1,"notes":""},{"id":4,"name":"Self-kindness","parentid":3,"notes":"Being gentle and understanding towards oneself, rather than judgmental or critical."},{"id":5,"name":"Common humanity","parentid":3,"notes":"Recognizing that everyone makes mistakes and experiences difficulties, and that this is a shared human experience."},{"id":6,"name":"Mindfulness","parentid":3,"notes":"Paying attention to the present moment, without judgment or attachment."},{"id":7,"name":"Benefits","parentid":1,"notes":""},{"id":8,"name":"Reduced stress and anxiety","parentid":7,"notes":"Practicing self-compassion has been shown to reduce symptoms of stress and anxiety."},{"id":9,"name":"Improved mental health","parentid":7,"notes":"Self-compassion has been linked to improved mental health outcomes, including reduced depression and anxiety."},{"id":10,"name":"Increased resilience","parentid":7,"notes":"Practicing self-compassion can help individuals develop greater resilience in the face of adversity."},{"id":11,"name":"Practicing Self-Compassion","parentid":1,"notes":""},{"id":12,"name":"Mindfulness meditation","parentid":11,"notes":"A mindfulness meditation practice can help individuals cultivate self-compassion and reduce stress and anxiety."},{"id":13,"name":"Self-compassion exercises","parentid":11,"notes":"Engaging in self-compassion exercises, such as writing oneself a kind letter or practicing self-kindness, can help individuals develop greater self-compassion."},{"id":14,"name":"Self-care","parentid":11,"notes":"Engaging in self-care activities, such as getting enough sleep, exercising regularly, and eating a healthy diet, can help individuals cultivate self-compassion."}]}'
            const tempJson = JSON.parse(temp);
            let modMdc = await importFc4i("util-mdc");
            modMdc.mkMDCsnackbar(mkElt("span", { style: "color:red;" }, "TEMP TEST ANSER from Groq"));
            return cleanOfNodes(tempJson);
        }
    }
    /*
    */

    const endpointVercel = "https://mm4i.vercel.app/api/call-groq";
    const endpointGroq = 'https://api.groq.com/openai/v1/chat/completions';
    const endpointLocalhostVercel = "http://localhost:8090/api/call-groq";
    let endpoint = endpointVercel;
    async function _dialogChooseEndpoint() {
        const choices = [];
        if (modTools.isVercelDev()) choices.push(endpointLocalhostVercel);
        choices.push(endpointVercel);
        choices.push(endpointGroq);
        // return MDCdialogQuickChoices("Choose endpoint", choices, "Test endpoints:");
        return MDCdialogQuickChoices("Choose croq endpoint", choices, "Endpoints:");
    }
    // endpoint = await _dialogChooseEndpoint(); console.log({ endpoint });

    let response;
    try {
        // const useKey = apiKey ? apiKey : "";
        const useKey = apiKey ? apiKey : "BADKEY";
        const message0 = {
            role: 'user',
            content: userPrompt,
        };
        const temperature = tempType2temperature(settingTemperatureType.valueS);
        const postBody =
        {
            model: 'llama-3.1-8b-instant',
            messages: [message0],
            max_tokens: 3000,
            temperature: temperature
        }
        console.log({ postBody, endpoint });
        response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${useKey.trim()}`,
                'Content-Type': 'application/json',
                // 'Cache-Control': 'no-cache, no-store, must-revalidate',
                // 'Pragma': 'no-cache',
                // 'Expires': '0',
            },
            body: JSON.stringify(postBody),
        });
    } catch (err) {
        console.log(err);
        debugger;
    }
    if (!response) return Error("response is undefined");

    if (!response.ok) {
        const errorText = await response.text();
        const errorJson = JSON.parse(errorText);
        console.log({ errorJson });
        debugger;
        return handleErrorText(response.status, errorText);
    }
    /**
     * 
     * @param {number} responseStatus 
     * @param {string} errorText 
     * @returns 
     */
    function handleErrorText(responseStatus, errorText) {
        if (errorText.includes('invalid_api_key')) {
            // return Error('Invalid API key. Regenerate in Groq Console and ensure no spaces.');
            return Error('Invalid API key.');
        }
        if (errorText.includes('rate_limit_exceeded')) {
            return Error('Rate limit exceeded. Wait and retry.');
        }
        if (errorText.includes("failed_generation")) {
            debugger;
            // I do not know exactly how this looks.
            // Make some tests:
            const j = JSON.parse(errorText);
            const _j2 = JSON.parse(j.error);
            return Error('Failed to make a JSON mindmap.');
        }
        return Error(`HTTP ${responseStatus}: ${errorText}`);
    }

    const data = await response.json();

    let resJson;
    let total_tokens;
    // if (useLocalhostVercel) {
    if (data.json) {
        resJson = cleanOfNodes(data.json);
        total_tokens = data.tokens.total_tokens;
    } else {
        resJson = data.choices[0].message.content;
        total_tokens = data.usage.total_tokens;
    }
    console.log("callGroqAPI", { total_tokens });
    return resJson;
}

/*
// Usage
const apiKey = 'gsk_your_actual_key_here';
callGroqAPI('Generate a valid JSON mindmap (no extra text) for an article about AI in healthcare:\n{\n  "root": {\n    "title": "AI in Healthcare",\n    "children": []\n  }\n}', apiKey)
  .then(json => console.log(JSON.stringify(json, null, 2)))
  .catch(error => console.error('Error:', error));
*/

/**
 * 
 * @param {string} nameAI 
 * @returns {boolean}
 */
function getNeedPaste(nameAI) {
    const { way } = getWayToCallAI(nameAI);
    const isAPI = (way == "API");
    if (isAPI) return false;
    const infoThisAI = infoAIs[nameAI];
    const { qA, qW } = infoThisAI;
    // const needPaste = (isAndroid && !qA) || ((!isAndroid) && !qW);
    const qValue = isAndroid ? qA : qW;
    const needPaste = (qValue == false);
    // const needStart = needPaste || (qValue != "auto");
    return needPaste;
}


/**
 * 
 * @param {string} title 
 * @param {string[]} choices 
 * @param {undefined|string|HTMLElement} info 
 * @returns 
 */
async function MDCdialogQuickChoices(title, choices, info) {
    const nameChoice = "name-choice";
    const divChoices = mkElt("div");
    divChoices.style.display = "flex";
    divChoices.style.flexDirection = "column";
    divChoices.style.gap = "15px";

    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, title)
    ]);
    if (typeof info == "string") {
        body.appendChild(mkElt("p", undefined, info));
    } else if (info instanceof HTMLElement) {
        body.appendChild(info);
    } else {
        const badInfo = mkElt("p", undefined, `Bad parameter info: "${String(info)}"`);
        badInfo.style.color = "red";
        body.appendChild(badInfo);
    }
    body.appendChild(divChoices);
    let checked = false;
    choices.forEach(c => {
        const rad = mkElt("input", { type: "radio", name: nameChoice, value: c }, c);
        if (!checked) {
            checked = true;
            rad.checked = true;
        }
        const lbl = mkElt("label", undefined, [
            rad, " ", c
        ]);

        lbl.style.width = "100%";
        lbl.style.overflowWrap = "anywhere";
        lbl.style.display = "grid";
        lbl.style.gridTemplateColumns = "auto 1fr";
        lbl.style.gap = "10px";
        lbl.style.lineHeight = "normal";

        divChoices.appendChild(lbl);
    });
    const modMdc = await importFc4i("util-mdc");
    await modMdc.mkMDCdialogConfirm(body, "Continue");
    // debugger;
    const checkedRad = body.querySelector(":checked");
    return checkedRad.value;
}



/**
 * From claude.ai
 * 
 * Some AI:s totally misses how to include a markdown string as a "notes" value.
 * This function tries to fix this error.
 * 
 * @param {string} str 
 * @returns {string}
 */
function fixMalformedJSON1(str) {
    // Remove any leading/trailing whitespace
    str = str.trim();

    // Track if we're inside a string value
    let result = '';
    let i = 0;
    let inValue = false;
    let valueStart = -1;
    let keyName = '';

    while (i < str.length) {
        const char = str[i];
        const nextChar = str[i + 1];

        // Check if we're at a property name/key
        if (char === '"' && !inValue) {
            // Find the closing quote of the key
            let keyEnd = i + 1;
            while (keyEnd < str.length && str[keyEnd] !== '"') {
                if (str[keyEnd] === '\\') keyEnd++; // Skip escaped characters
                keyEnd++;
            }

            // Extract key name
            keyName = str.substring(i + 1, keyEnd);
            result += str.substring(i, keyEnd + 1);
            i = keyEnd + 1;

            // Skip whitespace and colon
            while (i < str.length && (str[i] === ' ' || str[i] === '\t' || str[i] === '\n' || str[i] === '\r')) {
                result += str[i];
                i++;
            }

            if (str[i] === ':') {
                result += ':';
                i++;

                // Skip whitespace after colon
                while (i < str.length && (str[i] === ' ' || str[i] === '\t' || str[i] === '\n' || str[i] === '\r')) {
                    result += str[i];
                    i++;
                }

                // Check what type of value follows
                const valueChar = str[i];

                if (valueChar === '"') {
                    // Properly quoted string - just copy it
                    result += '"';
                    i++;
                    while (i < str.length) {
                        if (str[i] === '\\' && i + 1 < str.length) {
                            result += str[i] + str[i + 1];
                            i += 2;
                        } else if (str[i] === '"') {
                            result += '"';
                            i++;
                            break;
                        } else {
                            result += str[i];
                            i++;
                        }
                    }
                } else if (valueChar === '{' || valueChar === '[') {
                    // Object or array - copy as is
                    result += valueChar;
                    i++;
                } else if (valueChar >= '0' && valueChar <= '9' || valueChar === '-' || valueChar === 'n' || valueChar === 't' || valueChar === 'f') {
                    // Number, null, true, false - copy until delimiter
                    while (i < str.length && str[i] !== ',' && str[i] !== '}' && str[i] !== ']' && str[i] !== '\n') {
                        result += str[i];
                        i++;
                    }
                } else {
                    // Unquoted string value - need to fix it
                    valueStart = i;
                    let valueEnd = i;
                    let braceDepth = 0;

                    // Find the end of the value (next comma or closing brace at same level)
                    while (valueEnd < str.length) {
                        const c = str[valueEnd];

                        if (c === '{' || c === '[') {
                            braceDepth++;
                        } else if (c === '}' || c === ']') {
                            if (braceDepth === 0) {
                                break;
                            }
                            braceDepth--;
                        } else if (c === ',' && braceDepth === 0) {
                            break;
                        }

                        valueEnd++;
                    }

                    // Extract and clean the value
                    let value = str.substring(valueStart, valueEnd).trim();

                    // Remove trailing quotes and newlines that might be part of malformed structure
                    value = value.replace(/["'\n\r]*$/, '');

                    // Escape special characters in the value
                    value = value
                        .replace(/\\/g, '\\\\')
                        .replace(/"/g, '\\"')
                        .replace(/\n/g, '\\n')
                        .replace(/\r/g, '\\r')
                        .replace(/\t/g, '\\t');

                    // Add properly quoted value
                    result += '"' + value + '"';
                    i = valueEnd;
                }
            }
        } else {
            result += char;
            i++;
        }
    }

    return result;
}

// _testFixMalformedJSON1();
function _testFixMalformedJSON1() {
    debugger; // eslint-disable-line no-debugger
    const malformedJSON = `{
    "id": 3,
    "name": "Mindfulness",
    "parentid": 1,
    "notes":**
**Present-Moment Awareness**
- Focusing on the body and breath
- Observing thoughts and emotions
- Practicing non-judgment
## Mindfulness Techniques
- Mindfulness meditation
- Body scan
- Walking meditation
"
}`;

    const fixedJSON = fixMalformedJSON1(malformedJSON);
    console.log('Fixed JSON 1:', fixedJSON);

    try {
        const parsed = JSON.parse(fixedJSON);
        console.log('Successfully parsed:', parsed);
    } catch (e) {
        console.error('Parse error:', e.message);
    }
}


function fixMalformedJSON2(str) {
    // Use regex to find "notes": followed by unquoted content
    return str.replace(/"notes"\s*:\s*([^"{[\d\-nft][^}]*?)(\n\s*[},])/gs, (match, value, ending) => {
        // Clean up the value - remove trailing quotes and whitespace
        let cleanValue = value.trim().replace(/["'\n\r]*$/, '').trim();

        // Escape special characters
        cleanValue = cleanValue
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');

        // Return properly formatted
        return `"notes": "${cleanValue}"${ending}`;
    });
}

// _testFixMalformedJSON2();
function _testFixMalformedJSON2() {
    // Example usage
    const malformedJSON = `{
    "id": 3,
    "name": "Mindfulness",
    "parentid": 1,
    "notes":**
**Present-Moment Awareness**
- Focusing on the body and breath
- Observing thoughts and emotions
- Practicing non-judgment
## Mindfulness Techniques
- Mindfulness meditation
- Body scan
- Walking meditation
"
}`;

    const fixedJSON = fixMalformedJSON2(malformedJSON);
    console.log('Fixed JSON 2:', fixedJSON);

    try {
        const parsed = JSON.parse(fixedJSON);
        console.log('Successfully parsed:', parsed);
    } catch (e) {
        console.error('Parse error:', e.message);
    }
}


function fixMalformedJSON3(str) {
    // First, fix unquoted "notes" values
    str = str.replace(/"notes"\s*:\s*([^"{[\d\-nft][^}]*?)(\n\s*[},])/gs, (match, value, ending) => {
        // Clean up the value - remove trailing quotes and whitespace
        let cleanValue = value.trim().replace(/["'\n\r]*$/, '').trim();

        // Escape special characters
        cleanValue = cleanValue
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t');

        // Return properly formatted
        return `"notes": "${cleanValue}"${ending}`;
    });

    // Second, fix "notes" arrays - convert them to a single string
    str = str.replace(/"notes"\s*:\s*\[([\s\S]*?)\]/g, (match, arrayContent) => {
        // Extract all string values from the array
        const stringMatches = arrayContent.match(/"([^"\\]*(\\.[^"\\]*)*)"/g) || [];

        // Join all strings with newline separators
        const combinedValue = stringMatches
            .map(s => s.slice(1, -1)) // Remove quotes
            .map(s => s.replace(/\\"/g, '"').replace(/\\\\/g, '\\')) // Unescape
            .join('\\n');

        return `"notes": "${combinedValue}"`;
    });

    return str;
}

// _testFixMalformedJSON3();
function _testFixMalformedJSON3() {
    // Example usage - Test 1: Unquoted notes value
    const malformedJSON1 = `{
    "id": 3,
    "name": "Mindfulness",
    "parentid": 1,
    "notes":**
**Present-Moment Awareness**
- Focusing on the body and breath
- Observing thoughts and emotions
- Practicing non-judgment
## Mindfulness Techniques
- Mindfulness meditation
- Body scan
- Walking meditation
"
}`;

    console.log('Test 1(3): Unquoted notes value');
    const fixedJSON1 = fixMalformedJSON3(malformedJSON1);
    console.log('Fixed JSON 1(3):', fixedJSON1);

    try {
        const parsed1 = JSON.parse(fixedJSON1);
        console.log('Successfully parsed:', parsed1);
    } catch (e) {
        console.error('Parse error:', e.message);
    }

    // Test 2: Array notes value
    const malformedJSON2 = `{
    "id": 4,
    "name": "Acceptance",
    "parentid": 1,
    "notes": ["First paragraph with text", "Second paragraph with more text", "Third paragraph"]
}`;

    console.log('\nTest 2(3): Array notes value');
    const fixedJSON2 = fixMalformedJSON3(malformedJSON2);
    console.log('Fixed JSON 2(3):', fixedJSON2);

    try {
        const parsed2 = JSON.parse(fixedJSON2);
        console.log('Successfully parsed:', parsed2);
        console.log('Notes content:', parsed2.notes);
    } catch (e) {
        console.error('Parse error:', e.message);
    }
}

/**
 * 
 * @param {string} strHtml 
 * @returns {string}
 */
export function extractText(strHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(strHtml, 'text/html');
    // FIX-ME: <meta>
    // const eltMetaDesc = /** @type {HTMLMetaElement} */ (doc.querySelector("meta[name=description]"));
    // const metaDescription = eltMetaDesc?.content || "";

    const articleText = (() => {
        // 1. Primary: <article> (precise for content)
        let el = doc.querySelector('article');
        if (!el) {
            // 2. Fallback: <main> (broad coverage)
            el = doc.querySelector('main, [role="main"]');
        }
        if (!el) {
            // 3. Science/news hybrids
            el = doc.querySelector('.article-body, .article-content, .body');
        }

        if (el) {
            // const clone = el.cloneNode(true);
            const clone = el;
            // Clean up (tailored for science: refs, figs)
            clone.querySelectorAll(
                'meta, script, style, nav, header, footer, aside, .ad, .references, figure, .fig, .supplementary'
            ).forEach(x => x.remove());
            // let text = (clone.innerText || clone.textContent).trim();
            let text = clone.textContent.trim();

            // Not sure how to use this!
            /*
            // Science bonus: Grab abstract if separate
            const abs = doc.querySelector('.abstract, [id*="abstract"]');
            if (abs && text.length > 500 && !text.includes(abs.innerText.trim().substring(0, 100))) {
                text = abs.innerText.trim() + '\n\nMain Body:\n' + text;
            }
            */

            return text.length > 1000 ? text.slice(0, 18000) : null;
        }

        // Last resort
        return doc.body.innerText.trim().slice(0, 18000);
    })();
    if (!articleText) {
        // throw Error(`articleText == "${articleText}"`);
        console.error(`articleText == "${articleText}"`);
        // debugger;
    }
    return articleText;
    // return `${metaDescription}\n\n${articleText}`;
}
