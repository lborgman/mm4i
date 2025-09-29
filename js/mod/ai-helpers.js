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

/**
 * @typedef {function} funCallAI
 * @param {string} prompt 
 * @param {string} apiKey 
 * @returns {Promise<string|Error>}
 */

/**
 * @typedef {Object} aiInfo
 * @property {boolean} testedChat
 * @property {boolean} q
 * @property {string|undefined} comment
 * @property {string} url
 * @property {string} [android]
 * @property {string} pkg
 * @property {string} urlImg
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
        testedChat: true,
        q: false,
        comment: undefined,
        url: "gemini.google.com/app",
        // urlAndroidApp: true,
        pkg: "com.google.android.apps.bard",
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Google-gemini-icon.svg",
        fun: callGeminiAPI,
        urlAPIkey: "https://support.gemini.com/hc/en-us/articles/360031080191-How-do-I-create-an-API-key"
    }),
    "ChatGPT": mkAIinfo({
        testedChat: true,
        q: true,
        comment: undefined,
        url: "chatgpt.com",
        android: "intent://chat.openai.com/?q=PLACEHOLDER#Intent;scheme=https;package=com.openai.chatgpt;end;",
        // urlAndroidApp: "intent://chat.openai.com/#Intent;scheme=https;package=com.openai.chatgpt;end",
        pkg: "com.openai.chatgpt",
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/b/b5/ChatGPT_logo_Square.svg",
        fun: callOpenAIapi

    }),
    "Claude": mkAIinfo({
        testedChat: true,
        q: false,
        comment: undefined,
        url: "claude.ai",
        // urlAndroidApp: true,
        pkg: "com.anthropic.claude",
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/b/b0/Claude_AI_symbol.svg"
    }),
    "Grok": mkAIinfo({
        testedChat: true,
        q: false,
        comment: "I have asked xAI about OAuth",
        url: "grok.com/chat",

        // urlAndroidApp: true,
        // window.location.href = "intent://grok.com/chat?q=" + promptEncoded + "#Intent;scheme=https;package=ai.x.grok;end
        /*
        urlAndroidApp: "intent://grok.com/chat?q=PROMPT-ENCODED#Intent;"
            + "scheme=https;package=ai.x.grok;"
            + "end",
        */
        pkg: "ai.x.grok",
        urlImg: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Grok-feb-2025-logo.svg",
        fun: callGrokApi
    }),
    "Perplexity": mkAIinfo({
        testedChat: true,
        q: false,
        comment: undefined,
        url: "perplexity.ai",
        android: "intent://perplexity.sng.link/A6awk/ppas?q=PLACEHOLDER#Intent;scheme=singular-perplexity;package=ai.perplexity.app.android;end;",
        pkg: "ai.perplexity.app.android",
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


const keyLsAIhard = "mm4i-ai-hardway";

let initAItextarea;
export async function generateMindMap(fromLink) {
    const modMdc = await importFc4i("util-mdc");
    const modTools = await importFc4i("toolsJs");
    const modMMhelpers = await importFc4i("mindmap-helpers");
    const inpLink = modMdc.mkMDCtextFieldInput(undefined, "text");
    const tfLink = modMdc.mkMDCtextField("Link to article/video", inpLink);
    const eltNotReady = mkElt("p", undefined, "Please try, but it is no ready!");
    eltNotReady.style = `color:red; font-size:1.2rem`;
    initAItextarea = onAItextareaInput;


    const eltStatus = mkElt("div", undefined, "(empty)");
    if (fromLink) {
        inpLink.value = fromLink;
        // setTimeout(() => { checkInpLink(); }, 1000);
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
            // eltStatus.textContent = "Can't see if link exists";
            eltStatus.textContent = " ";
        } else {
            eltStatus.textContent = "Link seems to exist";
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



    let promptAI = "";
    function updatePromptAi() {
        promptAI = makeAIprompt(inpLink.value.trim(), 4);
        const bPrompt = document.getElementById("prompt-ai");
        if (!bPrompt) throw Error(`Could not find "prompt-ai"`);
        bPrompt.textContent = promptAI;
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
            // `*Check that the JSON is parseable in Chromium browsers.`
            `*Validate that the JSON is parseable in Chromium browsers.`

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
    eltAItextarea.id = "textarea-response";
    eltAItextarea.style = `
                width: 100%;
                min-height: 4rem;
                resize: vertical;
            `;

    const eltAItextareaStatus = mkElt("div");
    eltAItextareaStatus.style.lineHeight = "1";
    let toDoIt; let eltDialog;
    function onAItextareaInput() {
        eltAItextareaStatus.style.color = "unset";
        // valid
        const strAIraw = eltAItextarea.value.trim();
        if (strAIraw.length == 0) {
            eltAItextareaStatus.textContent = "";
            return;
        }
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

                eltDialog.style.opacity = "1";
                const secOpacity = 0.7;
                eltDialog.style.transition = `opacity ${secOpacity}s`;
                const secDelay = 1.6 + 2;
                eltDialog.style.transitionDelay = `${secDelay}s`;
                eltDialog.style.opacity = "0";
                toDoIt = setTimeout(() => {
                    eltDialog.remove();
                    doMakeGeneratedMindmap();
                }, (secDelay + secOpacity) * 1000);
            } else {
                tellError(res.error);
            }
        } catch (err) {
            eltAItextareaStatus.textContent = "";
            const msg = err instanceof Error ? err.message : err.toString();
            tellError(msg);
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
        clearTimeout(toDoIt);
        if (eltDialog) { eltDialog.style.opacity = "1"; }
        onAItextareaInput();
    });
    eltAItextarea.addEventListener("change", _evt => {
        clearTimeout(toDoIt);
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
        mkElt("div", undefined, "Paste the answer you got from AI here:"),
        eltAItextarea,
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

    let valLsAIhard = localStorage.getItem(keyLsAIhard) || "none";
    {
        const radAI = mkElt("input", { type: "radio", name: "ai", value: "none", checked: true });
        const eltAI = mkElt("label", undefined, [radAI, "none"]);
        eltAI.classList.add("elt-ai");
        eltAI.style.background = "lightgray";
        divAIhardWay.appendChild(eltAI);
    }
    Object.entries(infoAI).forEach(e => {
        const [k, v] = e;
        const nameAI = k;
        const { testedChat, q, android, urlImg, fun } = v;
        const radAI = mkElt("input", { type: "radio", name: "ai", value: k });
        const imgAI = mkElt("span", { class: "elt-ai-img" });
        imgAI.style.backgroundImage = `url(${urlImg})`;
        const eltAIname = mkElt("span", { class: "elt-ai-name" }, nameAI);
        const eltAI = mkElt("label", undefined, [radAI, imgAI, eltAIname]);
        eltAI.classList.add("elt-ai");
        if (testedChat) { eltAI.style.backgroundColor = "yellowgreen"; }
        if (q) { eltAI.style.borderColor = "greenyellow"; }
        if (android) { imgAI.style.outline = "solid greenyellow 3px"; }
        if (fun) {
            eltAI.style.outline = "solid orange 3px";
            const apiKey = getAPIkeyForAI(nameAI);
            if (apiKey) {
                eltAI.style.outlineColor = "red";
            }
        }
        divAIhardWay.appendChild(eltAI);
    });
    divAIhardWay.addEventListener("change", evt => {
        const t = evt.target;
        if (!t) return;
        // @ts-ignore
        const nameAI = t.value;
        localStorage.setItem(keyLsAIhard, nameAI);
        divGoStatus.textContent = "";
    });
    const radCurrentAI = divAIhardWay.querySelector(`input[type = radio][value = ${valLsAIhard} `);
    // @ts-ignore
    radCurrentAI.checked = true;

    const divGoStatus = mkElt("div");
    divGoStatus.id = "div-go-status";
    divGoStatus.style.outline = "1px dotted red";

    const btnGo = modMdc.mkMDCbutton("Go", "raised");
    btnGo.style.textTransform = "none";

    /** @type {string} */ let nameUsedAI = "Not known";

    btnGo.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const modTools = await importFc4i("toolsJs");
        await modTools.copyTextToClipboard(promptAI);

        const divHardWay = document.getElementById("hard-way");
        if (!divHardWay) throw Error('Could not find "#hard-way"');
        divHardWay.querySelector("input[type=radio][name=ai]:checked");
        const inpAI = divHardWay.querySelector("input[type=radio][name=ai]:checked");
        if (!inpAI) {
            divGoStatus.textContent = "Please select an AI alternative";
            return;
        }


        divGoStatus.textContent = "Copied prompt";

        // @ts-ignore
        const nameAI = inpAI.value;
        nameUsedAI = nameAI
        if (nameAI == "none") {
            divGoStatus.append(", no AI selected. Go to the AI you want and paste the prompt there.");
            return;
        }


        const infoThisAI = infoAI[nameAI];
        if (!infoThisAI) { throw Error(`Did not find info for AI "${nameAI}"`); }


        // setTimeout(() => {
        callTheAI(nameAI, promptAI);
        // }, 2000);
    });



    // https://chatgpt.com/share/68c20d3b-e168-8004-8cea-c80d30949054



    const cardPrompt = mkElt("p", { class: "mdc-card display-flex" }, [
        `I have created an AI prompt that you should use.`,
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
    btnEasyWay.addEventListener("click", async _evt => {
        // btnEasyWay.style.display = "none";
        // divWhyNotEasy.style.display = "unset";

        const inpAI = divEasyWay.querySelector("input[type=radio][name=ai]:checked");
        if (!inpAI) { throw Error("no selection of AI") }
        // @ts-ignore
        const nameAI = inpAI.value;

        let keyAPI = getAPIkeyForAI(nameAI);
        // keyAPI = keyAPI || "just testing...";
        if (!keyAPI) {
            debugger;
            const inpKey = mkElt("input", { type: "text" });
            const aGetKey = mkElt("a", {
                href: "",
                target: "_blank"
            }, `Get API key for ${nameAI}`);
            const divGetKey = mkElt("p", undefined, [
                "You must get an API key for this. ",
                aGetKey
            ]);
            const lbl = mkElt("label", undefined, [`API key for ${nameAI}: `, inpKey]);
            const body = mkElt("div", undefined, [
                divGetKey,
                lbl
            ]);
            const ans = await modMdc.mkMDCdialogConfirm(body);
            if (!ans) return;
            keyAPI = inpKey.value.trim();
        }
        const infoThisAI = infoAI[nameAI];
        debugger;
        const fun = infoThisAI["fun"];
        if (!fun) throw Error("!fun");

        const tofFun = typeof fun;
        if (tofFun != "function") throw Error(`tofFun == "${tofFun}"`);
        const res = await fun(promptAI, keyAPI);
        console.log({ res });
        if (res instanceof Error) {
            console.error(res);
            throw res;
            return;
        }
        const tofRes = typeof res;
        if (tofRes != "string") {
            throw Error(`tofRes == "${tofRes}"`)
        }
        console.log(res);
        debugger;
    });
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
            flex - direction: row;
            gap: 10px;
            flex - wrap: wrap;
            `;
    const divBtnCopy = mkElt("div", undefined, [btnGo, divGoStatus]);
    divBtnCopy.style = "display:grid; grid-template-columns: auto 1fr; gap:10px;"


    const divHardWay = mkElt("div", undefined, [
        mkElt("div", undefined, cardPrompt),
        // divListAIhardWay,
        divAIhardWay,
        divBtnCopy,
        // mkElt("div", { style: "margin:30px;" }, aTestG),
        mkElt("div", undefined, eltDivAI),
    ]);
    divHardWay.id = "hard-way";
    divHardWay.style = styleWays;

    {
        /** @typedef {Object} objIntent
         * @property {boolean} [noPackage]
        */

        /**
         * @param {objIntent} opt 
         * @returns {string}
         */
        const _mkChatIntent = (opt) => {
            // const intentGeminiUrl = 'intent://chat?source=button_click#Intent;scheme=gemini;package=com.google.android.apps.bard;end;';
            let u = "intent://";
            u = u.concat("chat");
            // u = u.concat("?source=button_click"); // Optional
            u = u.concat("#Intent;");
            u = u.concat("scheme=gemini;");
            if (!opt.noPackage) u = u.concat("package=com.google.android.apps.bard;");
            u = u.concat("end;");
            return u;
        }

    }

    const divAIsettings = mkElt("div", undefined, [
        // infoAI
    ]);
    Object.entries(infoAI).forEach(e => {
        const [k, v] = e;
        const { q, android, urlImg, fun, urlAPIkey } = v;
        const imgAI = mkElt("span", { class: "elt-ai-img" });
        imgAI.style.backgroundImage = `url(${urlImg})`;
        const nameAI = k;

        const divAIdetails = mkElt("div");
        if (android) {
            const divAndroid = mkElt("div");
            divAIdetails.appendChild(divAndroid);
            divAndroid.appendChild(mkElt("span", undefined, "Can start Android app"));
        }
        if (fun) {
            const divAPI = mkElt("div");
            divAIdetails.appendChild(divAPI);
            const inpAPIkey = mkElt("input", { type: "password" });
            const key = getAPIkeyForAI(nameAI);
            if (key) inpAPIkey.value = key;
            const saveAPIkeyInput = modTools.throttleTO(() => { setAPIkeyForAI(nameAI, inpAPIkey.value); }, 500);
            inpAPIkey.addEventListener("input", () => {
                console.log("input inpAPIkey", inpAPIkey.value);
                saveAPIkeyInput();
            });
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
                const spanAPIkeyInfo = mkElt("span", undefined, [" (", aAPIkey, ".)"]);
                divAPIinfo.appendChild(spanAPIkeyInfo);
            }
            divAPI.appendChild(divAPIinfo);
            divAPI.appendChild(lbl);
        }
        const numDetails = divAIdetails.childElementCount;
        console.log(nameAI, { numDetails });
        if (numDetails > 0) {
            divAIdetails.style = "display:flex; flex-direction:column; gap:20px;";
        } else {
            divAIdetails.appendChild(mkElt("span", undefined, "(Nothing special.)"))
        }

        const eltSummary = mkElt("summary", undefined, nameAI);
        const divDetailsInner = mkElt("div", undefined, [
            imgAI, divAIdetails
        ]);
        divDetailsInner.style = "display:grid; grid-template-columns:20px auto; gap:10px; margin-left:10px;";
        const eltDetails = mkElt("details", undefined, [eltSummary, divDetailsInner]);
        divAIsettings.appendChild(eltDetails);
    });

    // const tabRecs = ["Hard way", "Easy way", "AI Settings"];
    const tabRecs = ["Call AI", "AIs Settings"];
    // const contentElts = mkElt("div", undefined, [divHardWay, divEasyWay, divAIsettings]);
    const contentElts = mkElt("div", undefined, [divHardWay, divAIsettings]);
    if (tabRecs.length != contentElts.childElementCount) throw Error("Tab bar setup number mismatch");
    const eltTabs = modMdc.mkMdcTabBarSimple(tabRecs, contentElts, undefined);

    const divTabs = mkElt("p", undefined, [eltTabs, contentElts]);
    const divWays = mkElt("div", undefined, [
        // mkElt("p", undefined, "Choose how to proceed:"),
        divTabs
    ]);
    divWays.id = "div-ways";
    divWays.style.display = "none";



    const body = mkElt("div", undefined, [
        eltNotReady,
        // eltOk,
        mkElt("h2", undefined, "Make mindmap from link"),
        mkElt("div", undefined, cardInput),
        divWays,
    ]);
    modMdc.mkMDCdialogAlert(body, "Close");
    // debugger;
    checkInpLink(); // Necessary elements are connected to the DOM here
    async function doMakeGeneratedMindmap() {
        const strAIraw = eltAItextarea.value;


        const { strAIjson } = getJsonFromAIstr(strAIraw);
        jsonNodeArray = JSON.parse(strAIjson);
        console.log({ jsonNodeArray });

        // const nodeArray = modMMhelpers.nodeArrayFromAI2jsmindFormat(jsonNodeArray);
        const nodeArray = nodeArrayFromAI2jsmindFormat(jsonNodeArray);
        const arrRoots = nodeArray.reduce((arr, n) => {
            if (!n.parentid) { arr.push(n); }
            return arr;
        }, []);
        if (arrRoots.length != 1) throw Error(`Expected 1 root: ${arrRoots.length} `);
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
        return `https://${infoAI[nameAI].url}`;
    }


    const keyIntentChoice = "mm4i-indentUrl-choice";
    const keyLastIntent = "mm4i-indentUrl-last";

    const divIntents = mkElt("div");
    const strOldIdx = localStorage.getItem(keyIntentChoice);
    const oldIdx = strOldIdx == null ? 0 : parseInt(strOldIdx);
    /** @param {string} strIntent @param {number} idx */
    const addIntentAlt = (strIntent, comment, idx) => {
        const rad = mkElt("input", { type: "radio", name: "rad-intent", value: idx });
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

    let origIndentUrl;
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

        eltTA.value = arrIntent.join("");
    }
    updateEltTA(oldIdx);
    divIntents.addEventListener("input", () => {
        const currRad = divIntents.querySelector("input:checked");
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
        const idx = inp.value;
        console.log({ idx });
        if (idx != -1) { localStorage.setItem(keyIntentChoice, idx); }
        const val = eltTA.value;
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
    const urlFallBack = mkWebUrl(nameAI, promptAI);

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
            window.open(urlFallBack, 'AIWINDOW');
        }
    }, 4 * 1000);

    console.log(">>>>>> Before iframe.src = src");
    iframe.src = src;
    console.log(">>>>>> After iframe.src = src");
}

/**
 * 
 * @param {string} nameAI 
 * @returns {string}
 */
export function getWayToCallAI(nameAI) {
    const infoThisAI = infoAI[nameAI];
    // First try API
    const funAPI = infoThisAI.fun;
    if (funAPI) {
        const keyAPI = getAPIkeyForAI(nameAI);
        if (keyAPI) {
            return "API";
        }
    }
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.indexOf("android") > -1;
    if (!isAndroid) {
        return "web";
    }
    return "android-app";
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



    let wayToCallAI = getWayToCallAI(nameAI);

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
    async function callAIweb(nameAI) {
        divGoStatus.append(`, calling web ${nameAI}`);
        await modTools.waitSeconds(2);
        const webUrl = mkWebUrl(nameAI, promptAI);
        window.open(`${webUrl}`, "AIWINDOW");
        divGoStatus.textContent = "";
    }

    async function callAIapi(nameAI) {
        divGoStatus.textContent = `Waiting for ${nameAI} . . .`;
        const tmrAlive = setInterval(() => { divGoStatus.append(" ."); }, 1500);
        const infoThisAI = infoAI[nameAI];
        const funAPI = infoThisAI.fun;
        const keyAPI = getAPIkeyForAI(nameAI);
        const res = await funAPI(promptAI, keyAPI);
        clearInterval(tmrAlive);
        console.log({ res });
        if (res instanceof Error) {
            console.error(res);
            divGoStatus.textContent = `Error from ${nameAI}: ${res.message}`;
        } else {
            divGoStatus.textContent = `Got response from ${nameAI}`;
            const eltAItextarea =
                /** @type {HTMLTextAreaElement|null} */
                (document.getElementById("textarea-response"));
            if (!eltAItextarea) throw Error(`Did not find "textarea-respones"`);
            eltAItextarea.value = res;
            const tofInitAItextarea = typeof initAItextarea;
            if (tofInitAItextarea == "function") {
                initAItextarea();
            } else {
                throw Error(`tofInitAItextarea == "${tofInitAItextarea}"`);
            }
        }
    }

    async function callAIandroidApp(nameAI) {
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
        divGoStatus.textContent = "";
    }
}

/**
 * @param {string} nameAI 
 * @param {string} promptAI 
 * @returns {string}
 */
function mkWebUrl(nameAI, promptAI) {
    const infoThisAI = infoAI[nameAI];
    const url = infoThisAI.url;
    const promptEncoded = encodeURIComponent(promptAI);
    let urlWeb = `https://${url}?q=${promptEncoded}`;
    console.log(`mkWebUrl for ${nameAI}`, urlWeb);
    return urlWeb;
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
        n.expanded = false;
        if (!n.topic) {
            let topic;
            if (n.text) topic = n.text;
            if (n.name) topic = n.name;
            if (!topic) throw Error(`!n.text || !n.name: ${JSON.stringify(n)}`);
            n.topic = topic;
            delete n.text;
            delete n.name;
        }
        // if (n.parentid) return n;
        const parentid = n.parentId || n.parent;
        delete n.parentId;
        delete n.parent;
        if (parentid && parentid != "") n.parentid = parentid;

        const notes = n.notes;
        if (notes) {
            const tofNotes = typeof notes;
            if (tofNotes != "string") { throw Error(`typeof notes == "${tofNotes}`); }
            const shapeEtc = { notes }
            n.shapeEtc = shapeEtc;
            delete n.notes;
        }

        return n;
    });


    /////// find root
    let root_node;
    nodeArray.forEach(n => {
        if (!n.parentid) {
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
    const rootChildren = [];
    nodeArray.forEach(n => { if (n.parentid == rootId) rootChildren.push(n); });
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

// infoAI
/**
 * 
 * @param {string} prompt 
 * @param {string} apiKey 
 * @returns {Promise<string>}
 */
async function callGrokApi(prompt, apiKey) {
    // const apiKey = 'YOUR_API_KEY'; // Replace with secure method (e.g., backend proxy)
    const url = 'https://api.x.ai/v1/chat/completions';

    const requestBody = {
        model: 'grok-beta', // Or 'grok-4' for the latest model
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response';
    } catch (error) {
        console.error('Error calling Grok API:', error);
        return 'Error: Could not fetch response';
    }
}

// Example usage
// callGrokApi('What is the meaning of life?').then(response => console.log(response));


async function callOpenAIapi(userMessage, apiKey) {
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
                { role: "user", content: userMessage }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

// Example usage:
// callChatGPT("Write a haiku about autumn")
// .then(reply => console.log("ChatGPT:", reply))
// .catch(err => console.error("Error:", err));


// Variable to store the initialized AI client so we don't reload or re-initialize.
/** @type {Object|null} */ let aiClient = null;


/**
 * Dynamically loads the Gemini SDK from a CDN and calls the API.
 * ⚠️ NOTE: This script must be run as an ES Module (e.g., <script type="module">)
 * @param {string} userPrompt The text prompt to send to the Gemini model.
 * @param {string} apiKey Your Gemini API Key.
 * @returns {Promise<string|Error>} The text response from the model.
 */
async function callGeminiAPI(userPrompt, apiKey) {
    // if (!userPrompt || !userPrompt.trim()) { return "Please provide a prompt."; }

    // --- Dynamic Loading and Initialization (Happens only once) ---
    if (!aiClient) {
        try {
            // Dynamically import the Google Gen AI SDK from the CDN URL
            // const module = await import('https://unpkg.com/@google/genai/dist/index.js');
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

// Example of how you would call it:
/*
// ⚠️ IMPORTANT: Replace with your actual key
const MY_GEMINI_KEY = "YOUR_API_KEY_HERE";

(async () => {
    const prompt = "Explain why dynamic import() is useful in two sentences.";
    const result = await generateGeminiContentWithImport(prompt, MY_GEMINI_KEY);
    console.log(result);
})();
*/