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

export async function generateMindMap() {
    const modMdc = await importFc4i("util-mdc");
    const modMMhelpers = await importFc4i("mindmap-helpers");
    const inpLink = modMdc.mkMDCtextFieldInput(undefined, "text");
    const tfLink = modMdc.mkMDCtextField("Link to article/video", inpLink);
    const eltNotReady = mkElt("p", undefined, "Not ready!");
    eltNotReady.style = `color:red; font-size:1.2rem`;

    // const modAiHelpers = await importFc4i("ai-helpers");
    // const apiGeminiError = apiGeminiError();
    // const apiGeminiOk = !apiGeminiError;
    // const eltNoAPI = mkElt("p", undefined, `Gemini API Error: ${apiError}`);
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

    const eltStatus = mkElt("div", undefined, "(empty)");
    inpLink.addEventListener("input", async _evt => {
        const i = await window["PWAhasInternet"]();
        if (!i) {
            eltStatus.textContent = "No internet connection";
            return;
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
    });
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
        promptAi = makeAIprompt(inpLink.value.trim(), 3);
        const bPrompt = document.getElementById("prompt-ai");
        if (!bPrompt) throw Error(`Could not find "prompt-ai"`);
        bPrompt.textContent = promptAi;
    }
    function makeAIprompt(link, maxDepth = 3) {
        return `
1. Summarize the article (or video)
   "${link}"
   into a mind map and
   output a strict, parse-ready JSON node array
   (flat; fields: id, name, parentid, and notes).
2. Optional field "notes": Details. Markdown format.
3. Limit the hiearchy to max depth ${maxDepth} levels.
4. Return only valid JSON (no extra text).
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
        const btnCopy = modMdc.mkMDCbutton("Copy AI prompt", "raised");
        btnCopy.style.textTransform = "none";
        btnCopy.addEventListener("click", async evt => {
            evt.stopPropagation();
            const modTools = await importFc4i("toolsJs");
            modTools.copyTextToClipboard(promptAi);
        });
        const bPrompt = mkElt("b", undefined, promptAi);
        bPrompt.id = "prompt-ai";
        bPrompt.style.whiteSpace = "pre-wrap";
        const divNewPrompt = mkElt("div", undefined, [
            mkElt("div", undefined, btnCopy),
            mkElt("details", undefined, [
                mkElt("summary", undefined, "Show AI prompt"),
                mkElt("blockquote", undefined, bPrompt)
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
    eltAItextarea.addEventListener("input", _evt => {
        eltAItextareaStatus.style.color = "unset";
        // valid
        const strAIraw = eltAItextarea.value.trim();
        if (strAIraw.length == 0) {
            eltAItextareaStatus.textContent = "";
            return;
        }
        const { strAIjson, cleaned } = getJsonFromAIstr(strAIraw);

        try {
            const j = JSON.parse(strAIjson);
            const nodeArray = modMMhelpers.nodeArrayFromAI2jsmindFormat(j);
            const res = modMMhelpers.isValidMindmapNodeArray(nodeArray);
            if (res.isValid) {
                const msgStatus = strAIjson == strAIraw ? "OK" : `OK (cleaned: ${cleaned.join(", ")})`;
                eltAItextareaStatus.textContent = msgStatus;
            } else {
                eltAItextareaStatus.textContent = res.error;
                eltAItextareaStatus.style.color = "darkred";
            }
        } catch (err) {
            eltAItextareaStatus.textContent = err;
            eltAItextareaStatus.style.color = "darkred";
        }
    });
    const eltDl = mkElt("dl");

    const addAiAlt = (nameAi, link, ok, notes) => {
        const eltA = mkElt("a", {
            href: link,
            target: "_blank"
        }, `Open ${nameAi}`);
        const eltNotes = mkElt("div", undefined, notes);
        eltNotes.style.color = ok ? "green" : "red";
        const eltDt = mkElt("dt", undefined, [
            nameAi,
            mkElt("dd", undefined, [
                eltA,
                eltNotes
            ])
        ]);
        eltDl.appendChild(eltDt)
    }
    addAiAlt("Gemini (Google)", "https://gemini.google.com", false, "Can't always access the web site (even if it is public)");
    addAiAlt("Claude (Anthropic)", "https://claude.ai", true, "Seems to work ok");
    addAiAlt("Grok (xAI)", "https://grok.com", true, "Seems to work ok");
    addAiAlt("ChatGPT (OpenAI)", "https://chatgpt.com", false, "Not tested yet");
    addAiAlt("Perplexity", "https://perplexity.ai", false, "Not tested yet (what is it?)");
    const eltWhichAI = mkElt("details", undefined, [
        mkElt("summary", undefined, "Which AI can I use?"),
        mkElt("div", undefined,
            eltDl
        )
    ]);

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
        eltWhichAI,
    ]);
    const eltWhyThisTrouble = mkElt("details", { class: "mdc-card" }, [
        mkElt("summary", { style: "color:darkred" }, "This should have been more easy!"),
        mkElt("div", undefined, [
            mkElt("p", undefined, `
                        Yes, it should be more easy.
                        After you have given me a link to an article or video
                        ideally I should just show you the mindmap.
                        Unfortunately there are currently two obstacles:
                        `),
            eltContentProviderTrouble,
            eltAIprovidersTrouble,
        ])
    ]);
    eltWhyThisTrouble.style = `
                padding: 10px;
                background-color: #fff6;
            `;

    const eltDivAI = mkElt("p", undefined, [
        mkElt("div", undefined, "Paste answer from your AI:"),
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

    const cardPrompt = mkElt("p", { class: "mdc-card display-flex" }, [
        `In the AI of your choice use this prompt:`,
        divPrompt,
        // eltWhichAI,
        eltWhyThisTrouble,
    ]);
    cardPrompt.style = `
                NOdisplay: flex;
                gap: 10px; 
                flex-direction: column;
                padding: 20px;
            `;
    const body = mkElt("div", undefined, [
        eltNotReady,
        eltOk,
        // mkElt("h2", undefined, "You must ask your AI yourself"),
        // mkElt("h2", undefined, "generate mindmap"),
        mkElt("h2", undefined, "Make mindmap from link"),
        mkElt("div", undefined, cardInput),
        mkElt("div", undefined, cardPrompt),
        mkElt("div", undefined, eltDivAI),
    ]);
    const ans = await modMdc.mkMDCdialogConfirm(body, "Make mindmap", "Cancel");
    if (!ans) {
        modMdc.mkMDCsnackbar("Canceled");
        return;
    }
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
        divInfo.classList.add("fixed-at-bottom");
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
                    position: fixed; bottom: 0px; left: 0px;
                    min-height: 50px; min-width: 100px;
                    max-width: 270px;
                    display: flex;
                    gap: 10px;
                    padding: 10px;
                    z-index: 99999;
                    color: black;
                    background-color: magenta;
                    background-color: #f068f0;
                `;
        eltTellGenerated.id = "generated-marker";
        document.body.appendChild(eltTellGenerated);
    }
    addAIgeneratedMarker();

    /**
     * 
     * @param {string} strAI 
     * @returns {Object}
     */
    function getJsonFromAIstr(strAI) {
        // You may get more from the AI than the JSON:
        let strOnlyJson = strAI;
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
