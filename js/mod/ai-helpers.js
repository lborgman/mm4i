// @ts-check
const AI_HELPERS_VER = "0.0.1";
window["logConsoleHereIs"](`here is ai-helpers.js, module, ${AI_HELPERS_VER}`);
if (document.currentScript) { throw "ai-helpers.js is not loaded as module"; }

const mkElt = window["mkElt"];
// @ts-ignore
const importFc4i = window["importFc4i"];

// Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

// const modApp = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js");
// const modAiFirebase = await import("https://www.gstatic.com/firebasejs/12.1.0/firebase-ai.js");
// import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const userAgent = navigator.userAgent.toLowerCase();
const isAndroid = userAgent.indexOf("android") > -1;

const modLocalSettings = await importFc4i("local-settings");
class SettingsMm4iAI extends modLocalSettings.LocalSetting {
    constructor(key, defaultValue) { super("mm4i-settings-ai-", key, defaultValue); }
}
// const settingUsePuterJs = new SettingsMm4iAI("use-puter-js", false);
const settingPuterAImodel = new SettingsMm4iAI("puter-ai-model", "");
const settingUsedAIname = new SettingsMm4iAI("used-ai-name", "");

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
 * @typedef {function} funCallAI
 * @param {string} prompt 
 * @param {string} apiKey 
 * @returns {Promise<string|Error>}
 */

/**
 * @typedef {Object} aiInfo
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

// https://chatgpt.com/share/68c0514e-c81c-8004-a196-d4f7f60c3930
/**
 * @type {Object<string,aiInfo>}
 */
const infoAI = {
    "Gemini": mkAIinfo({
        fun: callGeminiAPI,
        pkg: "com.google.android.apps.bard",
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg",
        urlChat: "gemini.google.com/app",
        isPWA: false, // 2025-10-04
        urlAPIkey: "https://support.gemini.com/hc/en-us/articles/360031080191-How-do-I-create-an-API-key"
    }),
    "ChatGPT": mkAIinfo({
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
        pkg: "com.anthropic.claude",
        urlChat: "claude.ai",
        isPWA: true, // 2025-10-04
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg"
    }),
    "Grok": mkAIinfo({
        // fun: callGrokApi, // The other version seems better, but I can not test with a valid key
        fun: callOpenAIapi,
        pkg: "ai.x.grok",
        qW: true,
        urlChat: "grok.com/chat",
        isPWA: true, // 2025-10-04
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Grok-feb-2025-logo.svg"
    }),
    "Perplexity": mkAIinfo({
        android: "intent://perplexity.sng.link/A6awk/ppas?q=PLACEHOLDER#Intent;scheme=singular-perplexity;package=ai.perplexity.app.android;end;",
        qW: true,
        pkg: "ai.perplexity.app.android",
        urlChat: "perplexity.ai",
        isPWA: false, // 2025-10-04
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg"
    }),
    /*
    "Puterjs": mkAIinfo({
        fun: callPuterjs,
    }),
    */
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


// @ts-ignore
let initAItextarea;
/**
 * 
 * @param {string} fromLink 
 */
export async function generateMindMap(fromLink) {
    const modMdc = await importFc4i("util-mdc");
    const modTools = await importFc4i("toolsJs");
    const modMMhelpers = await importFc4i("mindmap-helpers");
    const inpLink = modMdc.mkMDCtextFieldInput(undefined, "text");
    const tfLink = modMdc.mkMDCtextField("Link to article/video", inpLink);
    // const eltNotReady = mkElt("p", undefined, "Please try, but it is no ready!");
    // eltNotReady.style = `color:red; font-size:1.2rem`;
    initAItextarea = onAItextareaInput;


    const eltStatus = mkElt("div", undefined, "(empty)");
    if (fromLink) {
        inpLink.value = fromLink;
        // setTimeout(() => { checkInpLink(); }, 1000);
    }
    inpLink.addEventListener("input", async () => {
        checkInpLink();
    });
    async function checkInpLink() {
        // @ts-ignore
        const funHasInternet = window["PWAhasInternet"];
        if (funHasInternet) {
            const tofFun = typeof funHasInternet;
            if (tofFun != "function") throw Error(`typeof funHasInternet == "${tofFun}"`);
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

        updatePromptAi();
        const divWays = document.getElementById("div-ways");
        if (!divWays) throw Error(`Could not find element "div-ways"`);
        divWays.style.display = "block";
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



    let promptAI = "";
    function updatePromptAi() {
        promptAI = makeAIprompt(inpLink.value.trim(), 4);
        const bPrompt = document.getElementById("prompt-ai");
        if (!bPrompt) throw Error(`Could not find "prompt-ai"`);
        bPrompt.textContent = promptAI;
    }
    // @ts-ignore
    function makeAIprompt(link, maxDepth = 4) {
        const endMark = "----";
        const rules = [
            `*If this prompt does not end with ${endMark}, consider it incomplete and notify the user
              that the prompt appears to be cut off.`,
            `*Summarize the article (or video)
                "${link}"
              into one mind map and
              output a strict, parse-ready JSON node array
              (flat; fields: id, name, parentid, and notes).`,
            `*Optional field "notes": For details, markdown format.`,
            `*Give as much details as in a text summary.`,
            `*Limit the hiearchy to max depth ${maxDepth} levels.`,
            `*Return only valid JSON (no text before or after).`,
            `*Validate that the JSON is parseable in Chromium browsers.`,
            `*${endMark}`
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
        // @ts-ignore
        console.log({ arr });
        debugger; // eslint-disable-line no-debugger
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
        const bPrompt = mkElt("div", undefined, promptAI);
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
                mkElt("summary", undefined, "AI prompt info"),
                mkElt("div", undefined, [
                    mkElt("p", undefined,
                        `I have created the AI prompt below.
                        It will be given to the AI you use if possible
                        and copied to the clipboard otherwise.`),
                    bPrompt
                ])
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
    eltAItextarea.id = "textarea-response";
    eltAItextarea.style = `
                width: 100%;
                min-height: 4rem;
                resize: vertical;
            `;

    const eltAItextareaStatus = mkElt("div");
    eltAItextareaStatus.style.lineHeight = "1";
    // @ts-ignore
    let toDoIt; let eltDialog;
    function onAItextareaInput() {
        eltAItextareaStatus.style.color = "unset";
        // valid
        // @ts-ignore
        const strAIraw = eltAItextarea.value.trim();
        if (strAIraw.length == 0) {
            eltAItextareaStatus.textContent = "";
            return;
        }
        // @ts-ignore
        const { strAIjson, cleaned } = getJsonFromAIstr(strAIraw);

        /** @param {string} txt */
        const tellError = (txt) => {
            const divTheError = mkElt("div", undefined, txt);
            divTheError.style.userSelect = "all";
            divTheError.style.color = "darkred";
            divTheError.style.userSelect = "all";
            divTheError.style.marginTop = "10px";
            // eltAItextareaStatus.appendChild(mkElt("div", undefined, `Tell your AI that the JSON had this error:`));

            const btnInfo = modMdc.mkMDCiconButton("help", "What are search links?");
            // btnInfo.style = `color: blue;`;
            btnInfo.addEventListener("click", () => {
                alert("not ready");
            });

            const divError = mkElt("div", undefined, [divTheError, btnInfo]);
            divError.style = ` display: flex; flex-direction: row; gap: 5px; `;
            eltAItextareaStatus.appendChild(divError);
        }
        try {
            const j = JSON.parse(strAIjson);
            // const nodeArray = modMMhelpers.nodeArrayFromAI2jsmindFormat(j);
            const nodeArray = nodeArrayFromAI2jsmindFormat(j);
            const res = modMMhelpers.isValidMindmapNodeArray(nodeArray);
            if (res.isValid) {
                const msgStatus = strAIjson == strAIraw ? "OK" : `OK (cleaned: ${cleaned.join(", ")})`;
                eltAItextareaStatus.textContent = msgStatus;
                eltAItextareaStatus.style.backgroundColor = "greenyellow";

                eltDialog = eltAItextareaStatus.closest("div.mdc-dialog");
                if (!eltDialog) throw Error('Could not find .closest("div.mdc-dialg")');

                // @ts-ignore
                eltDialog.style.opacity = "1";
                const secOpacity = 0.7;
                // @ts-ignore
                eltDialog.style.transition = `opacity ${secOpacity}s`;
                const secDelay = 1.6 + 2;
                // @ts-ignore
                eltDialog.style.transitionDelay = `${secDelay}s`;
                // @ts-ignore
                eltDialog.style.opacity = "0";
                toDoIt = setTimeout(() => {
                    // @ts-ignore
                    eltDialog.remove();
                    doMakeGeneratedMindmap();
                }, (secDelay + secOpacity) * 1000);
            } else {
                tellError(res.error);
            }
        } catch (err) {
            eltAItextareaStatus.textContent = "";
            // @ts-ignore
            const msg = err instanceof Error ? err.message : err.toString();
            tellError(msg);
            // @ts-ignore
            const objJsonErrorDetails = modTools.extractJSONparseError(err.message, strAIjson);
            const divErrorLocation = mkElt("div");
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
                eltAItextareaStatus.append(divErrorLocation);
            }
        }
    }

    eltAItextarea.addEventListener("input", _evt => {
        // @ts-ignore
        clearTimeout(toDoIt);
        // @ts-ignore
        if (eltDialog) { eltDialog.style.opacity = "1"; }
        onAItextareaInput();
    });
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

    const eltPasteAnswer = mkElt("div", undefined, "Paste AI´s answer here:");
    const divAIpaste = mkElt("div", undefined, [
        eltPasteAnswer,
        eltAItextarea,
    ]);
    divAIpaste.id = "div-ai-paste";

    const eltDivAI = mkElt("p", undefined, [
        divAIpaste,
        eltAItextareaStatus,
    ]);
    eltDivAI.classList.add("VK_FOCUS");

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

    const divAIhardWay = mkElt("div", { class: "elts-ai" });
    divAIhardWay.style.marginBottom = "10px";

    /*
    {
        // @ts-ignore
        const radAI = mkElt("input", { type: "radio", name: "ai", value: "none", checked: true });
        // @ts-ignore
        const eltAI = mkElt("label", undefined, [radAI, "none"]);
        eltAI.classList.add("elt-ai");
        eltAI.style.background = "lightgray";
        divAIhardWay.appendChild(eltAI);
    }
    */


    // Add puter alternative first
    {
        const imgAI = mkElt("span", { class: "elt-ai-img" });
        const urlImg = "./ext/puter/puter.svg";
        imgAI.style.backgroundImage = `url(${urlImg})`;
        const nameIcon = "smart_toy";
        const iconWay = modMdc.mkMDCicon(nameIcon);
        const wayIndicator = mkElt("i", undefined, [iconWay]);
        wayIndicator.style.color = "lightseagreen";
        const radAI = mkElt("input", { type: "radio", name: "ai", value: "PuterJs" });

        const longNameModel = settingPuterAImodel.value;
        const nameModel = longNameModel.slice(11);
        const [provider, model] = nameModel.split("/");
        const niceProvider = makeNiceProviderName(provider);
        const divModel = mkElt("div", undefined, [
            mkElt("b", undefined, `${niceProvider}: `), model]);
        wayIndicator.style.color = "cyan";
        wayIndicator.style.color = "lightseagreen";
        divModel.marginLeft = "10px";
        const divHeader = mkElt("div", undefined, ["Automated ", wayIndicator]);
        divHeader.style.display = "flex";
        divHeader.style.justifyContent = "space-between";

        const divPuter = mkElt("div", undefined, [
            divHeader,
            divModel,
        ]);
        const eltAI = mkElt("label", undefined, [radAI, imgAI, divPuter]);
        eltAI.classList.add("elt-ai");
        eltAI.id = "elt-ai-puter";
        divAIhardWay.appendChild(eltAI);
    }
    Object.entries(infoAI).forEach(e => { // "elt-ai"
        const [k, v] = e;
        const nameAI = k;
        // @ts-ignore
        const { qA, qW, android, urlImg, isPWA } = v; // "Gemini"
        const tofIsPWA = typeof isPWA;
        if (tofIsPWA != "boolean") throw Error(`typeof isPWA == "${tofIsPWA}"`);
        const radAI = mkElt("input", { type: "radio", name: "ai", value: k });
        const imgAI = mkElt("span", { class: "elt-ai-img" });
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
        const wayIndicator = mkElt("i", undefined, [iconWay, iconQ, iconHintAPI, ` ${way}${q}`]);
        wayIndicator.style.color = "blue";
        wayIndicator.style.display = "inline-flex";
        wayIndicator.style.alignItems = "center";
        const eltAI = mkElt("label", undefined, [radAI, imgAI, eltAIname, wayIndicator]);
        eltAI.classList.add("elt-ai");
        divAIhardWay.appendChild(eltAI);
    });
    divAIhardWay.addEventListener("change", evt => {
        const t = evt.target;
        if (!t) return;
        // @ts-ignore
        const nameAI = t.value;
        settingUsedAIname.value = nameAI;
        divGoStatus.textContent = "";
        checkIsAIautomated(nameAI);
        checkIsAIchoosen();
    });
    {
        const currentAIname = settingUsedAIname.value;
        if (currentAIname.length > 0) {
            const radCurrentAI = divAIhardWay.querySelector(`input[type=radio][value="${currentAIname}"]`);
            if (radCurrentAI) { radCurrentAI.checked = true; }
            checkIsAIautomated(currentAIname);
        }
    }

    const divGoStatus = mkElt("div");
    divGoStatus.id = "div-go-status";
    divGoStatus.style.outline = "1px dotted red";
    divGoStatus.style.overflow = "auto";
    divGoStatus.style.overflowWrap = "anywhere";

    // const btnGo = modMdc.mkMDCbutton("Go", "raised", "play_circle");
    const btnGo = modMdc.mkMDCiconButton("play_arrow", "Get mindmap", 40);
    btnGo.id = "btn-go";
    btnGo.classList.add("mdc-button--raised");
    btnGo.style.textTransform = "none";
    btnGo.inert = true;

    /** @type {string} */ let nameUsedAI = "Not known";

    // @ts-ignore
    btnGo.addEventListener("click", async (evt) => {
        evt.stopPropagation();

        const divHardWay = document.getElementById("hard-way");
        if (!divHardWay) throw Error('Could not find "#hard-way"');
        divHardWay.querySelector("input[type=radio][name=ai]:checked");
        const inpAI = divHardWay.querySelector("input[type=radio][name=ai]:checked");
        if (!inpAI) {
            divGoStatus.textContent = "Please select an AI alternative";
            return;
        }

        // @ts-ignore
        const nameAI = inpAI.value;
        const { way } = getWayToCallAI(nameAI);
        if (way != "API") {
            const modTools = await importFc4i("toolsJs");
            await modTools.copyTextToClipboard(promptAI);
            divGoStatus.textContent = "Copied prompt. ";
        }

        nameUsedAI = nameAI
        if (nameAI == "none") {
            divGoStatus.append(", no AI selected. Go to the AI you want and paste the prompt there.");
            return;
        }

        if (nameAI != "PuterJs") {
            const infoThisAI = infoAI[nameAI];
            if (!infoThisAI) { throw Error(`Did not find info for AI "${nameAI}"`); }
        }

        if (wayToCallAIisAPI(nameAI)) {
            document.documentElement.classList.add("ai-in-progress");
            modMdc.replaceMDCicon("stop", btnGo);
        }

        callTheAI(nameAI, promptAI);
    });



    // https://chatgpt.com/share/68c20d3b-e168-8004-8cea-c80d30949054



    const cardPrompt = mkElt("p", { class: "mdc-card display-flex" }, [
        divPrompt,
    ]);
    cardPrompt.style = `
            NOdisplay: flex;
            gap: 10px;
            flex - direction: column;
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
        // keyAPI = keyAPI || "just testing...";
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
        const infoThisAI = infoAI[nameAI];
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
    /*
    const divListAIeasyWay = mkElt("div");
    divListAIeasyWay.style = ` display: flex; flex-direction: row; gap: 10px; flex-flow: wrap; `;
    
    const selectHeader = mkElt("div", undefined, "Select AI to call:");
    selectHeader.style = ` font-weight: bold; margin-bottom: 20px; `;
    
    const divSelectAIeasyWay = mkElt("div", { class: "NOmdc-card" }, [
        selectHeader,
        divListAIeasyWay
    ]);
    Object.entries(infoAI).forEach(e => {
        const [k, v] = e;
        const { testedChat, q, fun } = v;
        const radAI = mkElt("input", { type: "radio", name: "ai", value: k });
        const eltAI = mkElt("label", undefined, [radAI, k]);
        eltAI.classList.add("elt-ai");
        if (testedChat) { eltAI.style.backgroundColor = "yellow"; }
        if (q) { eltAI.style.borderColor = "greenyellow"; }
        if (!fun) eltAI.inert = true;
        divListAIeasyWay.appendChild(eltAI);
    });
    
    const divEasyWay = mkElt("div", undefined, [
        divSelectAIeasyWay,
        mkElt("p", undefined, btnEasyWay),
        divWhyNotEasy
    ]);
    divEasyWay.id = "easy-way";
    divEasyWay.style = styleWays;
    */

    const styleWays = " background-color: #80800036; padding: 10px; ";

    const divListAIhardWay = mkElt("div");
    divListAIhardWay.style = `
            display: flex;
            flex - direction: row;
            gap: 10px;
            flex - wrap: wrap;
            `;
    const divBtnCopy = mkElt("div", undefined, [btnGo, divGoStatus]);
    divBtnCopy.style = "display:grid; grid-template-columns: auto 1fr; gap:10px;"


    const divTabForGo = mkElt("div", undefined, [
        mkElt("div", undefined, cardPrompt),
        // divListAIhardWay,
        divAIhardWay,
        divBtnCopy,
        // mkElt("div", { style: "margin:30px;" }, aTestG),
        mkElt("div", undefined, eltDivAI),
    ]);
    divTabForGo.id = "hard-way";
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
    divPuterModels.addEventListener("click", evt => {
        evt.stopPropagation();
        const trg = evt.target;
        const tn = trg.tagName;
        if (tn != "INPUT") return;
        const nameModel = trg.value;
        console.log({ nameModel });
        settingPuterAImodel.value = nameModel;
    });

    const iconAutomated = modMdc.mkMDCicon("smart_toy");
    iconAutomated.style.color = "goldenrod";
    iconAutomated.style.fontSize = "1.4rem";
    const eltInfoAutomated = mkElt("div", undefined, [
        mkElt("p", undefined, [
            iconAutomated,
            ` The AI:s below are automated here. 
            This means that when they are ready the mindmap will be created automatically.
        `]),
        mkElt("p", undefined, [
            `These AI:s are handled by `,
            mkElt("a", { href: "https://puter.com/settings", target: "_blank" }, "https://puter.com"),
            ` - a service that helps me automate.
            (I am not in any way involved in payments. And I do not get anything.)
        `]),
        mkElt("p", undefined, [
            `Puter takes care of paying for these AI:s.
            You will have to pay through Puter.
            I am not involved in any way in that.
            Click the link above to find out more.
            `
        ]),
        mkElt("p", undefined, [
            `You can probably create a few mindmaps each day for free.
            I am not sure about that.
            `
        ]),
    ]);
    const detInfoAutomated = mkElt("details", { style: "color:blue; margin-top:20px;" }, [
        mkElt("summary", { style: "color:blue" }, "Info about these AI models"),
        eltInfoAutomated,
    ]);
    const divSettingsAutomated = mkElt("div", undefined, [
        detInfoAutomated,
        divPuterModels
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


    Object.entries(infoAI).forEach(e => {
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
            // const inpAPIkey = mkElt("input", { type: "password" });
            const inpAPIkey = mkElt("input", { type: "text" }); // FIX-ME:
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

    const tabRecs = ["Call AI", "AIs Settings"];
    // const contentElts = mkElt("div", undefined, [divTabForGo, divTabSettings]);
    const contentElts = mkElt("div", undefined, [divTabForGo, divEltsAIsettingsTabs]);
    if (tabRecs.length != contentElts.childElementCount) throw Error("Tab bar setup number mismatch");
    const eltTabs = modMdc.mkMdcTabBarSimple(tabRecs, contentElts, undefined);

    /*
    puterDisplay();
    // const chkUsePuterJs = settingUsePuterJs.getInputElement();
    chkUsePuterJs.addEventListener("input", () => puterDisplay());
    function puterDisplay() {
        const usePuter = settingUsePuterJs.valueB;
        if (usePuter) {
            document.body.classList.add("use-puter");
        } else {
            document.body.classList.remove("use-puter");
        }
    }
    */

    const btnPuterUser = modMdc.mkMDCbutton("Puter user");
    btnPuterUser.addEventListener("click", () => {
        window.open("https://puter.com/settings");
    });

    const divTabs = mkElt("p", undefined, [eltTabs, contentElts]);
    const divWays = mkElt("div", undefined, [
        /*
        mkElt("p", undefined, [
            mkElt("label", undefined, ["Use Puter.js: ", chkUsePuterJs]),
            btnPuterUser
        ]),
        */
        divTabs
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
    async function doMakeGeneratedMindmap() {
        // @ts-ignore
        const strAIraw = eltAItextarea.value;


        // @ts-ignore
        const { strAIjson } = getJsonFromAIstr(strAIraw);
        jsonNodeArray = JSON.parse(strAIjson);
        console.log({ jsonNodeArray });

        // const nodeArray = modMMhelpers.nodeArrayFromAI2jsmindFormat(jsonNodeArray);
        const nodeArray = nodeArrayFromAI2jsmindFormat(jsonNodeArray);
        const arrRoots = nodeArray.reduce((arr, n) => {
            // @ts-ignore
            if (!n.parentid) { arr.push(n); }
            return arr;
        }, []);
        // @ts-ignore
        if (arrRoots.length != 1) throw Error(`Expected 1 root: ${arrRoots.length} `);
        // @ts-ignore
        const rootNode = arrRoots[0];
        console.log(rootNode);
        const rootNotes = rootNode.shapeEtc?.notes;
        // Insert source data
        if (typeof rootNotes == "string") {
            const rootNotesWithSource =
                `## Source etc\n\n*AI name:* ${nameUsedAI}\n\n## Notes\n\n${rootNotes}`;
            rootNode.shapeEtc.notes = rootNotesWithSource;
        } else {
            alert("no root notes, handling not implemented yet");
        }


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
            flex - direction: column;
            align - items: center;
            justify - content: center;
            `;
            const eltTellGenerated = mkElt("div", undefined, [
                divInfo,
                // btnInfoLinked
            ]);
            eltTellGenerated.style = `
            position: fixed; bottom: 0; left: 0;
            min - height: 50px; min - width: 100px;
            max - width: 270px;
            NOdisplay: flex;
            gap: 10px;
            padding: 10px;
            z - index: 99999;
            color: black;
            background - color: magenta;
            background - color: #f068f0;
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

    const currentAIname = settingUsedAIname.value;
    if (checkIsAIautomated(currentAIname)) {
        const doIitNow = confirm(`AI ${currentAIname} is automated. Make mindmap directly?`);
        if (!doIitNow) return;
        // "go"
        callTheAI(currentAIname, promptAI);
    }


    checkIsAIchoosen();
    function checkIsAIchoosen() {
        console.warn("checkIsAIchoosen: typeof btnGo", typeof btnGo);
        const tellChoosen = (b, nameAI) => {
            console.log("checkIsAIchoosen", { b, nameAI });
            btnGo.inert = !b;
            if (b) {
                document.documentElement.classList.add("ai-is-choosen");
            } else {
                document.documentElement.classList.remove("ai-is-choosen");
            }
            return b;
        }
        const eltAI = divAIhardWay.querySelector("input[type=radio][name=ai]:checked");
        if (!eltAI) return tellChoosen(false);
        const nameAI = eltAI.value;
        if (nameAI != "") return tellChoosen(true, nameAI);
        if (nameAI != "PuterJS") return tellChoosen(true, nameAI);
        const model = settingPuterAImodel.value;
        if (model == "") return tellChoosen(false, nameAI);
        return tellChoosen(true, `${nameAI}, ${model}`);
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
        return `https://${infoAI[nameAI].url}`;
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
export function getWayToCallAI(nameAI) {
    if (nameAI == "PuterJs") {
        return { way: "API", copyQ: false,  hasWebAPI: true};
    }
    const infoThisAI = infoAI[nameAI];
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
async function callTheAI(nameAI, promptAI) {
    const modTools = await importFc4i("toolsJs");

    const divGoStatus = document.getElementById("div-go-status");
    if (!divGoStatus) throw Error(`Did not find element "div-go-status"`);



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
        const infoThisAI = infoAI[nameAI];
        const thisAIisPWA = infoThisAI.isPWA;
        const tofIsPWA = typeof thisAIisPWA;
        if (tofIsPWA != "boolean") throw Error(`typeof isPWA == "${tofIsPWA}"`);
        const pwaIndicator = thisAIisPWA ? "/PWA" : "";
        divGoStatus.append(`Opening web${pwaIndicator} chat: ${nameAI}`);
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
        divGoStatus.style.color = "unset";
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
        const infoThisAI = infoAI[nameAI];
        const keyAPI = getAPIkeyForAI(nameAI);
        const funAPI = infoThisAI.fun;
        if (typeof funAPI != "function") throw Error(`typeof funAPI == "${typeof funAPI}"`);
        const res = await funAPI(promptAI, keyAPI);
        clearInterval(tmrAlive);
        console.log({ res });
        if (res instanceof Error) {
            console.error(res);
            divGoStatus.style.color = "red";
            divGoStatus.textContent = `Error from ${nameAI}: ${res.message}`;
        } else {
            divGoStatus.style.color = "green";
            divGoStatus.textContent = `Got response from ${nameAI}`;
            const eltAItextarea =
                /** @type {HTMLTextAreaElement|null} */
                (document.getElementById("textarea-response"));
            if (!eltAItextarea) throw Error(`Did not find "textarea-respones"`);
            eltAItextarea.value = res;
            // @ts-ignore
            if (typeof initAItextarea != "function") {
                throw Error(`tofInitAItextarea == "${typeof InitAItextarea}"`);
            }
            initAItextarea();
        }
    }

    // @ts-ignore
    async function callAIandroidApp(nameAI) {
        if (divGoStatus == null) throw Error(`divGoStatus == null`);
        const infoThisAI = infoAI[nameAI];
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
    const infoThisAI = infoAI[nameAI];
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
 * Convert node array from AI to jsmind format.
 *  
 * @param {Object[]} aiNodeArray 
 * @returns {Object[]}
 */
function nodeArrayFromAI2jsmindFormat(aiNodeArray) {
    // https://chatgpt.com/share/68ab0c5c-abe8-8004-8a37-616c5a28c8ce

    // parentId: Grok AI
    // parent: Claude AI

    ////// .parentId, .parent => .parentid, .text, .name => .topic
    ////// .notes
    if (!Array.isArray(aiNodeArray)) throw Error("Expected JSON to be an array");
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


    /////// find root
    // @ts-ignore
    let root_node;
    nodeArray.forEach(n => {
        // @ts-ignore
        if (!n.parentid) {
            // @ts-ignore
            if (root_node) { throw Error("Found second node with no parent"); }
            root_node = n;
        }
    });
    if (!root_node) { throw Error("Did not find mindmap root"); }

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
 * @param {string} nameAI 
 * @return {string|null}
 */
function getAPIkeyForAI(nameAI) {
    const key = keyNameAI(nameAI);
    return localStorage.getItem(key);
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
            // Dynamically import the Google Gen AI SDK from the CDN URL
            // const module = await import('https://unpkg.com/@google/genai/dist/index.js');
            // @ts-ignore
            const module = await import("https://cdn.jsdelivr.net/npm/@google/genai@latest/+esm");

            // The module export contains the GoogleGenAI class
            const { GoogleGenAI } = module;

            // Initialize the client
            aiClient = new GoogleGenAI({ apiKey: apiKey });

        } catch (error) {
            console.error("Failed to dynamically load or initialize Gemini SDK:", error);
            return Error("Could not load the required library.");
        }
        if (aiClient == null) {
            return Error("aiClient is null");
        }
    }
    // ----------------------------------------------------------------

    // --- API Call (Happens every time) ---
    try {
        // @ts-ignore
        const response = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling the Gemini API:", error);
        return Error(`An API error occurred: ${error}`);
    }
}



// From Grok:
// https://console.anthropic.com/login?returnTo=%2F%3F
/* @type {CallAIapi} */
/*
async function callClaude({ apiKey, message, model = 'claude-3-5-sonnet-20240620', maxTokens = 1024 }) {
  try {
    // Dynamically import the Anthropic SDK ES6 module
    const Anthropic = (await import('https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.26.0/+esm')).default;

    // Initialize the Anthropic client
    const anthropic = new Anthropic({ apiKey });

    // Call the messages endpoint
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: message }],
    });

    // Return the response text
    return response.content[0].text;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    throw new Error(`Failed to call Claude API: ${error.message}`);
  }
}
*/

/*
// Example usage (for testing in the browser console)
async function testClaude() {
  try {
    const response = await callClaude({
      apiKey: 'YOUR_API_KEY', // Replace with your secure method of providing the key
      message: 'Hello, Claude! Tell me a fun fact about the ocean.',
    });
    console.log('Claude\'s response:', response);
  } catch (error) {
    console.error(error);
  }
}
*/

/**
 * Calls the Claude API with a user prompt and returns the response.
 * @callback CallAIapi2
 * @param {string} userPrompt The text prompt to send to the Claude model.
 * @param {string} apiKey Your Anthropic API Key.
 * @param {Object} [options] Optional parameters for the API call.
 * @returns {Promise<string|Error>} The text response from the model or an Error object.
 */
/** @type {CallAIapi2} */
export async function callClaudeAPI(userPrompt, apiKey, options = {}) {
    try {
        // Dynamically import the Anthropic SDK ES6 module
        const Anthropic = (await import('https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@0.26.0/+esm')).default;

        // Initialize the Anthropic client
        const anthropic = new Anthropic({ apiKey });

        // Extract options with defaults
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
        console.error('Error calling Claude API:', error);
        return new Error(`Failed to call Claude API: ${error.message}`);
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
        console.error(error);
    }
}

// Uncomment to test in browser
// _testClaude();



/**
 * Calls the Claude API with a user prompt and returns the response.
 * @callback CallAIapi4
 * @param {string} userPrompt The text prompt to send to the Claude model.
 * @param {string} apiKey Your Anthropic API Key.
 * @param {Object} [options] Optional parameters for the API call.
 * @param {string} [options.model='claude-3-5-sonnet-20240620'] The Claude model to use.
 * @param {number} [options.maxTokens=1024] The maximum number of tokens in the response.
 * @returns {Promise<string|Error>} The text response from the model or an Error object.
 */
/** @type {CallAIapi4} */
export async function callClaudeAPI2(userPrompt, apiKey, options = {}) {
    try {
        // Extract options with defaults
        const { model = 'claude-3-5-sonnet-20240620', maxTokens = 1024 } = options;

        // Make direct HTTP request to Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01', // Required API version
            },
            body: JSON.stringify({
                model,
                max_tokens: maxTokens,
                messages: [{ role: 'user', content: userPrompt }],
            }),
        });

        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }

        // Parse response
        const data = await response.json();

        // Ensure response contains text content
        if (!data.content || !data.content[0]?.text) {
            throw new Error('No text content in response');
        }

        // Return the response text
        return data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        return new Error(`Failed to call Claude API: ${error.message}`);
    }
}

// Example usage (for testing in the browser console)
async function _testClaude2() {
    try {
        const response = await callClaudeAPI2(
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
        console.error(error);
    }
}

// Uncomment to test in browser
// _testClaude2();



/**
 * Calls the Claude API with a user prompt and returns the response.
 * @callback CallAIapi3
 * @param {string} userPrompt The text prompt to send to the Claude model.
 * @param {string} apiKey Your Anthropic API Key.
 * @param {Object} [options] Optional parameters for the API call.
 * @param {string} [options.model='claude-3-5-sonnet-20240620'] The Claude model to use.
 * @param {number} [options.maxTokens=1024] The maximum number of tokens in the response.
 * @returns {Promise<string|Error>} The text response from the model or an Error object.
 */
/** @type {CallAIapi3} */
export async function callClaudeAPI3(userPrompt, apiKey, options = {}) {
    try {
        // Validate inputs
        if (!userPrompt || typeof userPrompt !== 'string') {
            throw new Error('userPrompt must be a non-empty string');
        }
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('apiKey must be a non-empty string');
        }

        // Extract options with defaults
        const { model = 'claude-3-5-sonnet-20240620', maxTokens = 1024 } = options;

        // Make direct HTTP request to Anthropic API
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01', // Required API version
            },
            body: JSON.stringify({
                model,
                max_tokens: maxTokens,
                messages: [{ role: 'user', content: userPrompt }],
            }),
        });

        // Check for HTTP errors
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`HTTP error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Parse response
        const data = await response.json();

        // Ensure response contains text content
        if (!data.content || !data.content[0]?.text) {
            throw new Error('No text content in response');
        }

        // Return the response text
        return data.content[0].text;
    } catch (error) {
        // Enhanced error logging for debugging
        console.error('Error calling Claude API:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            userPrompt,
            options,
        });
        return new Error(`Failed to call Claude API: ${error.message}`);
    }
}

// Example usage (for testing in the browser console)
async function _testClaude3() {
    try {
        const response = await callClaudeAPI3(
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
        console.error(error);
    }
}

// Uncomment to test in browser
// _testClaude3();



/**
 * Calls the Claude API via a proxy with a user prompt and returns the response.
 * @callback CallAIapi5
 * @param {string} userPrompt The text prompt to send to the Claude model.
 * @param {string} apiKey Your Anthropic API Key.
 * @param {Object} [options] Optional parameters for the API call.
 * @param {string} [options.model='claude-3-5-sonnet-20240620'] The Claude model to use.
 * @param {number} [options.maxTokens=1024] The maximum number of tokens in the response.
 * @returns {Promise<string|Error>} The text response from the model or an Error object.
 */
/** @type {CallAIapi5} */
export async function callClaudeAPI4(userPrompt, apiKey, options = {}) {
    try {
        // Validate inputs
        if (!userPrompt || typeof userPrompt !== 'string') {
            throw new Error('userPrompt must be a non-empty string');
        }
        if (!apiKey || typeof apiKey !== 'string') {
            throw new Error('apiKey must be a non-empty string');
        }

        // Extract options with defaults
        const { model = 'claude-3-5-sonnet-20240620', maxTokens = 1024 } = options;

        // Call the backend proxy
        const response = await fetch('http://localhost:3000/api/claude', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userPrompt, apiKey, options }),
        });

        // Check for HTTP errors
        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Unknown error');
            throw new Error(`Proxy error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        // Parse response
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        // Ensure response contains text content
        if (!data.response) {
            throw new Error('No text content in proxy response');
        }

        // Return the response text
        return data.response;
    } catch (error) {
        console.error('Error calling Claude API via proxy:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            userPrompt,
            options,
        });
        return new Error(`Failed to call Claude API: ${error.message}`);
    }
}

// Example usage (for testing in the browser console)
async function _testClaude4() {
    try {
        const response = await callClaudeAPI4(
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
        console.error(error);
    }
}

// Uncomment to test in browser
// _testClaude4();



// This version needs a proxy.
/**
 * Calls the Perplexity AI API with a user prompt and returns the response.
 * @callback CallPerplexityAPI
 * @param {string} userPrompt The text prompt to send to the Perplexity model.
 * @param {string} apiKey Your Perplexity API Key.
 * @param {Object} [options] Optional parameters for the API call.
 * @param {string} [options.model='llama-3.1-sonar-small-128k-online'] The Perplexity model to use.
 * @param {number} [options.maxTokens=1024] The maximum number of tokens in the response.
 * @returns {Promise<string|Error>} The text response from the model or an Error object.
 */
/** @type {CallPerplexityAPI} */
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
            } catch {
                errorText = 'Failed to parse error response';
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
        console.error('Error calling Perplexity AI API:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            userPrompt,
            options,
            timestamp: new Date().toISOString(),
        });
        return new Error(`Failed to call Perplexity AI API: ${error.message}`);
    }
}

// Example usage (for testing in the browser console)
async function _testPerplexity() {
    try {
        const response = await callPerplexityAPIthroughProxy(
            'Hello, Perplexity! Tell me a fun fact about the ocean.',
            'YOUR_API_KEY', // Replace with your secure method
            { model: 'llama-3.1-sonar-small-128k-online', maxTokens: 50 }
        );
        if (response instanceof Error) {
            console.error(response);
        } else {
            console.log('Perplexity\'s response:', response);
        }
    } catch (error) {
        console.error(error);
    }
}

// Uncomment to test in browser
// _testPerplexity();



/** @type {CallAIapi} */
async function callPuterJs(userPrompt) {
    const res = await puter.ai.chat(userPrompt, {
        model: settingPuterAImodel.value
    });
    console.log(res)
    return res;
}

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

export function showAIpasteDiv() {
    const div = document.getElementById("div-ai-paste");
    if (div == null) throw Error("Did not get #div-ai-paste");
    // console.warn("showAIpasteDiv", { div });
    div.inert = false;
}
export function hideAIpasteDiv() {
    const div = document.getElementById("div-ai-paste");
    if (div == null) throw Error("Did not get #div-ai-paste");
    // console.warn("hideAIpasteDiv", { div });
    div.inert = true;
}
export function checkIsAIautomated(nameAI) {
    const { way } = getWayToCallAI(nameAI);
    if (way == "API") {
        document.body.classList.add("no-paste-ai");
        // hideAIpasteDiv();
    } else {
        document.body.classList.remove("no-paste-ai");
        // showAIpasteDiv();
    }
    return document.body.classList.contains("no-paste-ai");
}


// From Grok.
function estimateJsonObjectTokens(objJson) {
    // Base heuristic: ~4.5 chars per token for strings/numbers
    const charsPerToken = 4.5;

    // Helper to count tokens for a value (string, number, boolean, null, object, array)
    function countTokens(value) {
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
                tokens += countTokens(value[i]);
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
                tokens += countTokens(key) + countTokens(val) + 1; // Key + value + colon
                if (i < entries.length - 1) tokens += 1; // Comma
            }
            return tokens;
        }
        return 0; // Fallback for unexpected types
    }

    try {
        return countTokens(objJson);
    } catch (error) {
        console.error('Error estimating tokens:', error);
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
        const tokens = estimateJsonObjectTokens(input);
        console.log(`Test ${index + 1}:`,
            JSON.stringify(input, null, 2),
            `→ ~${tokens} tokens`);
    });
}

// Run tests
// _testEstimateTokens();