// @ts-check
// https://www.npmjs.com/package/@toast-ui/editor

const logConsoleHereIs = window["logConsoleHereIs"];
const importFc4i = window["importFc4i"];


const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const modTools = await importFc4i("toolsJs");
const modMdc = await importFc4i("util-mdc");

const TOASTUI_HELPERS_VER = "0.0.0";
logConsoleHereIs(`here is toast-ui-helpers.js, module,${TOASTUI_HELPERS_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module



let searchNodeParams;
export function setupSearchNodes(searchPar) {
    searchNodeParams = searchPar;
    console.log({ searchNodeParams });
}

const modToastUI = window["toastui"] || await importFc4i("toast-ui");

const reAlfaBefore = /\[@(.+?)\]\((.+?)\)/gm;
async function dialogInsertSearch(editor) {
    /*
    // FIX-ME: use JavaScript/DOM native selection for this!
    // https://javascript.info/selection-range
    const ws = window.getSelection();
    let {anchorNode, anchorOffset, focusNode, focusOffset} = ws;
    console.log({anchorNode});
    console.log({focusNode});
    const ntAnchor = anchorNode.nodeType;
    if (ntAnchor != 3) throw Error(`Expected text node (3), got (${ntAnchor})`);
    const eltAnchor = anchorNode.parentElement;
    const tnAnc = eltAnchor.tagName;
    console.log({tnAnc});
    debugger;
    return;
    */


    // const selection = editor.getSelection();
    // const startSel = selection[0];
    // const endSel = selection[1];
    // const contentMarkdown = editor.getMarkdown();

    let initialTitle = editor.getSelectedText();
    let initialSearch = "";

    // const alfaAtCursor = getAlfaAtCursor(contentMarkdown, startSel, endSel);
    // console.log("dialogInsertSearch", alfaAtCursor);
    let alfaAtCursor;
    if (alfaAtCursor) {
        initialTitle = alfaAtCursor.title;
        initialSearch = alfaAtCursor.search;
    }

    const inpTitle = modMdc.mkMDCtextFieldInput();
    inpTitle.value = initialTitle;
    const taTitle = modMdc.mkMDCtextField("Title", inpTitle);

    const inpSearch = modMdc.mkMDCtextFieldInput();
    inpSearch.value = initialSearch;
    const taSearch = modMdc.mkMDCtextField("Search", inpSearch);

    const spanSearched = mkElt("span", undefined, searchNodeParams.inpSearch.value);
    const divInputs = mkElt("div", undefined, [
        taTitle,
        taSearch,
        spanSearched,
    ]);
    /*
    if (alfaAtCursor) {
        const { title, search, startAlfa, endAlfa } = alfaAtCursor;
        inpTitle.value = title;
        inpSearch.value = search;
    }
    */
    // @ts-ignore
    divInputs.style = `
            display: grid;
            gap: 10px;
            grid-template-columns: 80px 1fr 1fr;
        `;
    const titleH2 = alfaAtCursor ? "Update search link" : "Insert search link";
    const titleSave = alfaAtCursor ? "Update" : "Insert";
    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, titleH2),
        // taTitle, taSearch,
        divInputs
    ]);
    const funCheckSave = (wantSave) => {
        console.log({ wantSave });
        const tofWantSave = typeof wantSave;
        if (tofWantSave != "boolean") throw Error(`Expected type "boolean", got "${tofWantSave}"`);

        const title = inpTitle.value.trim();
        const search = inpSearch.value.trim();
        if (wantSave == false) {
            // return title.length > 0 && search.length > 0;
            return title != initialTitle || search != initialSearch;
        }
        /*
        // const cm = editor.codemirror;
        // const doc = cm.getDoc();
        // const cursor = doc.getCursor();
        const txtInsert = `[@${title}](${search})`;
        if (!alfaAtCursor) {
            doc.replaceRange(txtInsert, cursor);
        } else {
            debugger; // eslint-disable-line no-debugger
            const { title, search, posAlfa, lenAlfa } = alfaAtCursor;
            const lineNo = cursor.line;
            const from = { line: lineNo, ch: posAlfa };
            const to = { line: lineNo, ch: posAlfa + lenAlfa };
            doc.replaceRange(txtInsert, from, to);
        }
        */
    };
    // FIX-ME: save button
    // FIX-ME: preview search
    const answer = await modMdc.mkMDCdialogConfirm(body, titleSave, "cancel", funCheckSave);
    if (!answer) {
        return;
    }
    const title = inpTitle.value.trim();
    if (title == "") return;
    const search = inpSearch.value.trim();
    if (search == "") return;
    // console.log({ editor });
    editor.exec("addLink", { linkUrl: `mm4i-search: ${search}`, linkText: title });
    return;
    // debugger;
    const [start, end] = editor.getSelection();
    const marker = `[${title}](mm4i-search:${search})`;
    editor.replaceSelection(marker, start, end);
}

/** 
 * @callback saveFun
 * 
 */
/**
 * @callback FunctionOnEdit
 * @param {Object} toastEditor
 * @returns {saveFun}
*/

let lastMDgetCursorPosition; // debugging

/**
 * 
 * @param {HTMLDivElement} divEditor 
 * @param {string} valueInitial 
 * @param {string} valuePlaceholder 
 * @param {FunctionOnEdit} onEdit
 * @param {Object|undefined} objInit;
 * @returns 
 */
async function setupToastUIview(divEditor, valueInitial, valuePlaceholder, onEdit, objInit) {
    // const ourElt = divEditor;
    // ourElt.innerHTML = "";
    divEditor.innerHTML = "";
    divEditor.dataset.latestSaved = encodeURIComponent(valueInitial);

    // FIX-ME: move to mm4i file:
    const mm4iRenderer = {
        link(node, context) {
            const { origin, entering } = context;
            const url = node.destination;
            const isAlfa = url.startsWith("mm4i-search:");
            // console.warn("mm4iRenderer link", url, isAlfa, context, node);
            console.warn("mm4iRenderer link", url, isAlfa, entering);

            const result = origin();
            if (!isAlfa) { return result; }
            result.tagName = "span";
            if (!entering) { return result; }
            result.classNames = ["toastui-alfa-link"];
            // result.attributes.style = "color:red;";
            // result.attributes.href = null;
            // delete result.attributes.href;
            console.log("mm4iRenderer", result)
            return result;
        }
    }

    divEditor.addEventListener("click", async evt => {
        if (!evt.target) return;
        const target =/** @type {HTMLSpanElement} */ (evt.target);
        if (target.tagName != "SPAN") return;
        const isAlfaLink = target.classList.contains("toastui-alfa-link");
        if (!isAlfaLink) return;

        // FIX-ME:
        // const valAlfa = target.dataset.alfaLink;
        const valAlfa = target.getAttribute("href")?.slice(12);

        console.log("clicked alfa-link:", { valAlfa }, target);
        searchNodeParams.eltJsMindContainer.classList.add("display-jsmind-search");

        searchNodeParams.inpSearch.value = valAlfa;
        const resSearch = searchNodeParams.searchNodeFun(valAlfa);
        const nHits = resSearch.length;
        console.log({ resSearch, nHits });

        const dialogContainer = divEditor.closest(".mdc-dialog__container");
        // @ts-ignore
        const dcs = dialogContainer.style;
        const spanPreviewCounter = mkElt("span");

        const eltPreviewNotice = mkElt("span", undefined, ["Close preview ", spanPreviewCounter]);
        eltPreviewNotice.addEventListener("click", evt => {
            evt.stopImmediatePropagation();
            stopAlfaPreview();
        });
        eltPreviewNotice.title = "Close preview";
        // @ts-ignore
        eltPreviewNotice.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: yellow;
            padding: 4px;
            color: black;
            border: 1px solid black;
            border-radius: 4px;
            box-shadow: 3px 2px 8px 2px #000000;
            cursor: pointer;
        `;
        const eltPreviewShield = mkElt("div", undefined, eltPreviewNotice);
        // @ts-ignore
        eltPreviewShield.style = `
            position: fixed;
            top: 0px;
            left: 0px;
            bottom: 0px;
            right: 0px;
            z-index: 9999;
            background-color: rgba(255,255,0,0.2);
            pointer-events: auto;
        `;
        const secPreview = 8;
        let countPreview = secPreview;
        let intervalPreview;
        let timeoutPreview;
        function updatePreviewCounter() { spanPreviewCounter.textContent = `${countPreview} sec`; }
        function startAlfaPreview() {
            dcs.transitionProperty = "opacity";
            dcs.transitionDuration = "1s";
            dcs.opacity = 0;
            updatePreviewCounter();
            document.body.appendChild(eltPreviewShield);
            intervalPreview = setInterval(() => {
                countPreview--;
                updatePreviewCounter();
            }, 1000);
            timeoutPreview = setTimeout(() => { stopAlfaPreview(); }, secPreview * 1000);
        }
        const stopAlfaPreview = () => {
            dcs.opacity = 1;
            eltPreviewShield.remove();
            clearInterval(intervalPreview);
            clearTimeout(timeoutPreview);
        }
        eltPreviewShield.addEventListener("click", evt => {
            console.log("clicked preview, objInit", objInit);
            stopAlfaPreview();

            const funClose = objInit.data.funClose;
            console.log("funClose", funClose);
            if (funClose) funClose();
            const target = evt.target;
            console.log("shield target", target);
            if (!target) throw Error("target is null");
            target.style.pointerEvents = 'none'; // Temporarily disable pointer events
            let eltFromPoint = /** @type {HTMLElement|null} */ (document.elementFromPoint(evt.clientX, evt.clientY));
            if (!eltFromPoint) throw Error(`eltFromPoint is null`);
            // console.log("eltFromPoint", eltFromPoint, eltFromPoint.click);
            if (eltFromPoint.classList.contains("mdc-dialog__scrim")) {
                // x@ts-ignor
                eltFromPoint.style.display = "none";
                eltFromPoint = /** @type {HTMLElement|null} */ (document.elementFromPoint(evt.clientX, evt.clientY));
                if (!eltFromPoint) throw Error(`eltFromPoint is null`);
                // console.log("eltFromPoint 2", eltFromPoint);
            }
            if (eltFromPoint.classList.contains("mdc-dialog")) {
                eltFromPoint.style.display = "none";
                eltFromPoint = /** @type {HTMLElement|null} */ (document.elementFromPoint(evt.clientX, evt.clientY));
                if (!eltFromPoint) throw Error(`eltFromPoint is null`);
                // console.log("eltFromPoint 3", eltFromPoint);
            }

            setTimeout(() => {
                eltFromPoint.click(); // Trigger click on the background element
                target.style.pointerEvents = 'auto'; // Re-enable pointer events
            }, 1000);

        });

        startAlfaPreview();
    });


    const toastViewer = new modToastUI.Editor.factory({
        viewer: true,
        el: divEditor,
        initialValue: valueInitial,
        previewStyle: "none",
        initialEditType: "WYSIWYG",
        customHTMLRenderer: mm4iRenderer,
        usageStatistics: false,
    });

    if (objInit) {
        const tofObjInit = typeof objInit;
        if (tofObjInit != "object") throw Error(`objInit is "${tofObjInit}", should be "object"`);
        const keysObj = Object.keys(objInit);
        const lenObj = keysObj.length;
        const funInit = objInit.funInit;
        let dataObj;
        if (!funInit) { throw Error(`objInit is missing key "funInit"`); }
        const tofFunInit = typeof funInit;
        if (tofFunInit != "function") { throw Error(`.funInit is "${tofFunInit}", should be "function"`); }
        if (lenObj > 2) {
            throw Error(`objInit should have key "funInit" and optional key "data", but number of keys is ${lenObj}`);
        }
        if (lenObj == 2) {
            if (!keysObj.includes("data")) {
                throw Error(`objInit is missing optional key "data"`);
            }
            dataObj = objInit.data;
        }
        // const lenFun = funInit.length;
        // if (lenFun != lenObj) { throw Error(`.funInit takes ${lenFun} parameters, should take ${lenObj}`); }
        if (dataObj) {
            await objInit.funInit(toastViewer, dataObj);
        } else {
            await objInit.funInit(toastViewer);
        }
    }



    // Add custom styling for special syntax
    const idStyle = "cm-special-style-for-easyMDE";
    if (!document.getElementById(idStyle)) {
        const eltStyle = document.createElement("style");
        eltStyle.id = idStyle;
        eltStyle.textContent = `
            .cm-alfa-before {
                color: red;
                text-decoration: underline;
                cursor: pointer;
            }
            .cm-alfa-after {
                color: green;
                text-decoration: underline;
            }
            .toastui-alfa-link {
                color: green;
                text-decoration: underline;
                cursor: pointer;
            }
            .toastui-alfa-link::before {
                content: "X";
                color: red;
                padding-right: 2px;
                text-decoration: none !important;
                text-decoration-color: transparent !important;
            }
        `;
        // document.head.append(eltStyle);
    }




    const btnEdit = addEditMDEbutton();
    // const objReturn = {};

    (async function () {
        await modTools.wait4connected(btnEdit, 800);
        btnEdit.focus();
        const eltActive = document.activeElement;
        if (btnEdit != eltActive) {
            console.error("active element is not btnEdit", eltActive);
            throw Error(`document.activeElement is not btnEdit`);
        }
        // divEasyMdeInert.removeAttribute("inert");
        // }, 600);
    })();

    return { toastViewer, btnEdit };
    // objReturn.btnEdit = btnEdit;
    // return objReturn;

    function addEditMDEbutton() {
        divEditor.style.position = "relative";
        const btnEditMyNotes = modMdc.mkMDCiconButton("edit", "Edit my notes");
        divEditor.appendChild(btnEditMyNotes);
        // eltMDEContainer.parentElement.parentElement.appendChild(btnEditMyNotes);

        btnEditMyNotes.id = "edit-my-notes";
        btnEditMyNotes.style = `
        position: absolute;
        right: -20px;
        top: -15px;
        border-radius: 50%;
        color: green;
        background: color-mix(in srgb, var(--mdc-theme-primary) 30%, transparent);
        `;
        btnEditMyNotes.addEventListener("click", async evt => {
            evt.preventDefault();
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            btnEditMyNotes.remove();
            const ourElt = toastViewer.options.el;
            const valueInitial = toastViewer.options.initialValue;
            // console.log({ ourElt });
            toastViewer.destroy();
            ourElt.innerHTML = "";

            const objToolbarItems = [
                ["bold", "italic", "strike"],
                ["heading", "hr", "quote"],
                [
                    "link",
                    {
                        name: 'searchButton',
                        tooltip: 'Insert search',
                        className: 'toastui-editor-toolbar-icons search-button',
                        command: "searchCommand"
                    }
                ],
            ];
            function insertSearchCommand(editor) {
                // dialog
                // FIX-ME: what is editor here???
                console.log("searchCommand clicked", editor);
                dialogInsertSearch(toastEditor);
            }
            const toastEditor = new modToastUI.Editor({
                el: ourElt,
                toolbarItems: objToolbarItems,
                initialValue: valueInitial,
                customHTMLRenderer: mm4iRenderer,
                // previewStyle: "vertical",
                previewStyle: "tab",
                initialEditType: "markdown",
                usageStatistics: false,
            });
            toastEditor.on("change", () => {
                const divEditor = toastEditor.options.el;
                const latestSaved = decodeURIComponent(divEditor.dataset.latestSaved);
                const currentValue = toastEditor.getMarkdown();
                const needSave = latestSaved != currentValue;

                if (needSave) {
                    callersSaveFun(currentValue);
                    divEditor.dataset.latestSaved = encodeURIComponent(currentValue);
                }
            });
            async function handleCursorChangeWW(_evt) {
                savedCursorPosition = toastEditor.getSelection();
            }
            async function handleCursorChangeMD(_evt) {
                savedCursorPosition = toastEditor.getSelection();
            }
            const elts = toastEditor.getEditorElements();
            const eltMD = elts.mdEditor;
            eltMD.addEventListener("keyup", handleCursorChangeMD);
            eltMD.addEventListener("pointerup", handleCursorChangeMD);
            const eltWW = elts.wwEditor;
            eltWW.addEventListener("keyup", handleCursorChangeWW);
            eltWW.addEventListener("pointerup", handleCursorChangeWW);

            window["MYtoastEditor"] = toastEditor;


            /**** Looking for workaround for the cursor move bug in Toast UI.  */

            /***
             * Suggested by Deep Seek.
            */

            let savedCursorPosition = [1, 1];
            const callersSaveFun = await onEdit(toastEditor);
            const tofSaveFun = typeof callersSaveFun;
            if (tofSaveFun != "function") throw Error(`onEdit(...) returned type "${tofSaveFun}", expeced "function"`);
            const lenSaveFun = callersSaveFun.length;
            if (lenSaveFun != 1) throw Error(`Function return by onEdit(...) takes ${lenSaveFun} parameters, expected 1`);

            // function saveCursorPosition() { savedCursorPosition = getCursorPosition(); }

            async function restoreCursorPosition() {
                // const st = "background:red;";
                // console.log("%crestoreCursorPosition", st, savedCursorPosition.toString());
                if (savedCursorPosition == undefined) return;
                const saved0 = savedCursorPosition[0];
                const pos = saved0;
                await modTools.wait4mutations(toastEditor.options.el);
                setCursorPos(toastEditor, pos);
            }

            toastEditor.on('changeMode', (_newMode) => {
                // await modTools.wait4mutations(toastEditor.options.el);
                // await modTools.waitSeconds(1);
                // setTimeout(() => {
                restoreCursorPosition();
                // }, 1);
            });


            // const sel = toastEditor.getSelection();
            toastEditor.addCommand("markdown", "searchCommand", insertSearchCommand);
            toastEditor.addCommand("wysiwyg", "searchCommand", insertSearchCommand);
            toastEditor.changeMode("wysiwyg");

        });
        return btnEditMyNotes;
    }
}


/*
let origEasyMDEmarkdown;
async function saveOrigMarkdown() {
    if (origEasyMDEmarkdown) return;
    await importFc4i("easymde");
    const EasyMDE = window["EasyMDE"];
    origEasyMDEmarkdown = EasyMDE.prototype.markdown;
}
*/

/**
 * 
 * @param {HTMLDivElement} taOrDiv 
 * @param {string} valueInitial 
 * @param {string} valuePlaceholder
 * @param {function} onEdit
 * @param {Object} objClose 
 * @returns {Promise<{btnEdit:HTMLButtonElement}>}
 */
export async function setupToastUIpreview(taOrDiv, valueInitial, valuePlaceholder, onEdit, objClose) {
    const tofOnEdit = typeof onEdit;
    if (tofOnEdit != "function") throw Error(`onEdit should be function, is ${tofOnEdit}`);
    const lenOnEdit = onEdit.length;
    if (lenOnEdit != 1) throw Error(`Function param onEdit should take 1 param, not ${lenOnEdit}`);

    const funInit = async (editor) => console.log("funInit", editor);
    const objInit4Notes = {
        funInit
    }
    if (objClose) objInit4Notes.data = objClose;
    return await setupToastUIview(taOrDiv, valueInitial, valuePlaceholder, onEdit, objInit4Notes);
}

/*
async function addAlfa(easyMDE) {
    console.error("This addAlfa is for easyMDE");
    debugger;
    return;
    await saveOrigMarkdown();
    // const EasyMDE = window["EasyMDE"];

    function markHejGreen(txt) {
        const newTxt = txt.replaceAll(/hej/g, `<span style="color:green;">HEJ</span>`);
        return newTxt;
    }
    function markHejRed(txt) {
        const newTxt = txt.replaceAll(/hej/g, `<span style="color:red;">HEJ</span>`);
        return newTxt;
    }
    const reAlfaBefore = /\[@(.+?)\]\((.+?)\)/g;
    function markAlfaBefore(txt) {
        const newTxt = txt.replaceAll(reAlfaBefore, `<span data-alfa-link="$2" class="cm-alfa-before" title="Lookup '$2'">🔍$1</a>`);
        return newTxt;
    }
    const reAlfaAfter = /<a href="(.*?)"(.*?)>@(.*?)<\/a>/g;
    function markAlfaAfter(txt) {
        const newTxt = txt.replaceAll(reAlfaAfter, `<span data-alfa-link="$1" class="cm-alfa-after" $2>🔍$3</span>`);
        return newTxt;
    }
    function markMoreBefore(txt) {
        let newTxt = txt;
        newTxt = markHejGreen(txt);
        newTxt = markAlfaBefore(newTxt);
        return newTxt;
    }
    function markMoreAfter(txt) {
        let newTxt = txt;
        newTxt = markHejRed(txt);
        newTxt = markAlfaAfter(newTxt);
        return newTxt;
    }
    modifyEasyMDEmarkdown(markMoreBefore, markMoreAfter);
    // console.log("++++ added HEJ");
    function modifyEasyMDEmarkdown(funMoreBefore, funMoreAfter) {
        EasyMDE.prototype.markdown = function (txt) {
            if (funMoreBefore) txt = funMoreBefore(txt);
            txt = origEasyMDEmarkdown.call(easyMDE, txt);
            if (funMoreAfter) txt = funMoreAfter(txt);
            return txt;
        }
    }
}
*/


// insert search link
function getAlfaAtCursor(contentMarkdown, startSel, endSel) {

    /*
    // FIX-ME: Looks like a JavaScript bug here with iterators.
    //   Taking a closer look later!
    const m = reAlfaBefore.exec(contentMarkdown);
    if (!m) return;
    debugger;
    const matches = contentMarkdown.matchAll(reAlfaBefore);
    const temp = [...matches];
    */

    const matches = contentMarkdown.matchAll(reAlfaBefore);
    const arrMatches = [...matches];
    if (arrMatches.length == 0) return;

    for (let match of arrMatches) {
        const lenAlfa = match[0].length;
        const startAlfa = match.index;
        const endAlfa = startAlfa + lenAlfa;
        if (startSel == endSel) {
            if (startAlfa < startSel && startSel < endAlfa) {
                const title = match[1];
                const search = match[2];
                return { title, search, startAlfa, endAlfa }
            }
        } else {
            debugger; // eslint-disable-line no-debugger
        }
    }
    return;
}


/**
 * 
 * @param {number|Array} pos 
 * @returns {boolean}
 */
function isMarkdownPos(pos) {
    if (!Array.isArray(pos)) return false;
    if (pos.length != 2) return false;
    const pos0 = pos[0];
    const pos1 = pos[1];
    if (!Number.isInteger(pos0)) return false;
    if (!Number.isInteger(pos1)) return false;
    if (pos0 < 0) return false;
    if (pos1 < 0) return false;
    return true;
}
/**
 * 
 * @param {number|Array} pos 
 * @returns {boolean}
 */
function isWysiwygPos(pos) {
    if (!Number.isInteger(pos)) return false;
    if (pos < 0) return false;
    return true;
}

/**
 * @typedef markdownPosition
 * @type {Array}
 * @property {number} 0
 * @property {number} 1
 */

/**
 * 
 * @param {Object} editor 
 * @param {markdownPosition} markdownPos 
 * @returns 
 */
export function toWysiwygPos(editor, markdownPos) {
    if (!isMarkdownPos(markdownPos)) {
        //// This happens when just switching back and forth between markdown <-> wysiwyg
        if (isWysiwygPos(markdownPos)) return markdownPos;
        throw Error(`Not a markdown or wysiwyg pos: ${markdownPos.toString()}`);
    }
    const markdown = editor.getMarkdown();
    const lineNo = markdownPos[0];
    const chLinePos = markdownPos[1];
    const lines = markdown.split("\n");
    let lineChars = 0;
    for (let i = 0; i < lineNo - 1; i++) {
        lineChars += lines[i].length + 1;
    }
    return lineChars + chLinePos;
}
/**
 * 
 * @param {Object} editor 
 * @param {number|Array} wysiwygPos 
 * @returns 
 */
export function toMarkdownPos(editor, wysiwygPos) {
    if (!isWysiwygPos(wysiwygPos)) {
        //// This happens when just switching back and forth between markdown <-> wysiwyg
        if (isMarkdownPos(wysiwygPos)) return wysiwygPos;
        throw Error(`Not a wysiwyg or markdown pos: ${wysiwygPos.toString()}`);
    }
    const markdown = editor.getMarkdown();
    const lines = markdown.split("\n");
    const cacheLineWWtotLen = [];
    const lineWWtotLen = new Proxy(lines, {
        get(arr, prop) {
            if (prop == "length") return arr.length;
            if (cacheLineWWtotLen[prop] == undefined) {
                const md = lines.slice(0, prop).join("\n"); // FIX-ME: non-breaking space
                const len = getWysiwygLength(md);
                const html = convertMarkdownToHtml(md);
                const elt = document.createElement("selection");
                elt.innerHTML = html;
                const txt = elt.textContent;
                const len2 = txt?.length;
                // console.log({ len, md, len2, txt });
                cacheLineWWtotLen[prop] = len;
            }
            return cacheLineWWtotLen[prop];
        }
    });
    const res = modTools.binarySearch(lineWWtotLen, wysiwygPos, (a, b) => a - b);
    console.log({ res });
    // debugger;

    let pos = 0;
    let iLine = 0;
    let lineNo, chPos;
    const len = lines.length;
    for (; iLine < len; iLine++) {
        const nextPos = pos + lines[iLine].length + 1;
        if (nextPos >= wysiwygPos) {
            lineNo = iLine + 1;
            chPos = wysiwygPos - pos;
            break;
        }
        pos = nextPos;
    }
    if (lineNo == undefined) {
        debugger;
        throw Error(`lineNo is undefined`);
    }
    chPos = chPos - lineNo + 1;
    return [lineNo, chPos];
}


/**
 * 
 * @param {any} toastEditor 
 * @returns {number}
 */
// FIX-ME: This causes bad behavior of the editor!
function getCursorPosition(toastEditor) {
    throw Error("don't use getCursorPosition");
    // const st = "background:green;";
    const sel = toastEditor.getSelection(); // Get the selection from the WYSIWYG editor
    // console.log("%cgetCursorPosition", st, { sel });
    if (!Array.isArray(sel)) throw Error("Expected array");
    const lenSel = sel.length;
    if (lenSel != 2) throw Error(`Expected length == 2, got ${lenSel}`);
    const sel0 = sel[0];
    let cursorPosition;
    if (Array.isArray(sel0)) {
        lastMDgetCursorPosition = sel0;
        const startLine = sel0[0];
        const startCh = sel0[1];
        const markdown = toastEditor.getMarkdown();
        const lines = markdown.split("\n");
        let mdString = "";
        let pos = startCh;
        let i = 0;
        for (; i < startLine - 1; i++) {
            pos += lines[i].length + 1;
            mdString += lines[i];
        }
        // cursorPosition = pos;
        mdString += lines[i].slice(0, startCh);
        const wysiwygLenght = getWysiwygLength(mdString);
        cursorPosition = wysiwygLenght;
    } else {
        cursorPosition = sel0;
    }
    // console.log("%cGCP", st, { cursorPosition });
    if (isNaN(cursorPosition)) throw "savedCursorPosition is not number";
    return cursorPosition;
}

/**
 * 
 * @param {any} toastEditor 
 * @param {number|Array} pos 
 */
export function setCursorPos(toastEditor, pos) {
    const isWWpos = isWysiwygPos(pos);
    const isMDpos = isMarkdownPos(pos);
    if (!(isWWpos || isMDpos)) throw Error(`Not wysiwyg or markdown position: ${pos.toString()}`);
    if (toastEditor.mode == "wysiwyg") {
        const posWW = isWWpos ? pos : toWysiwygPos(toastEditor, pos);
        console.warn("setCursorPos", toastEditor.mode, posWW.toString());
        toastEditor.wwEditor.view.dom.focus();
        toastEditor.wwEditor.setSelection(posWW, posWW);
    } else {
        const posMarkdown = toMarkdownPos(toastEditor, pos)
        console.warn("setCursorPos", toastEditor.mode, posMarkdown.toString());
        const posMD = isMDpos ? pos : toMarkdownPos(toastEditor, pos);
        toastEditor.mdEditor.view.dom.focus();
        toastEditor.mdEditor.setSelection(posMD, posMD);
    }
}


// temp test

export function mySetCursorPos(posWysiwyg) {
    if (!isWysiwygPos(posWysiwyg)) debugger; // eslint-disable-line no-debugger
    const editor = window["MYtoastEditor"];
    setTimeout(() => setCursorPos(editor, posWysiwyg), 5 * 1000);
}



function convertMarkdownToHtml(markdownString) {
    return modToastUI.Editor.factory({
        el: document.createElement('div'),
        initialValue: markdownString,
        initialEditType: 'markdown'
    }).getHTML();
}
function convertMarkdownToHtml2(markdownString) {
    const viewer = modToastUI.Editor.factory({
        el: document.createElement('div'),
        initialValue: markdownString,
        initialEditType: 'markdown',
        viewer: true
    });
    return viewer.getHTML();
}

/**
 * 
 * @param {string} markdownString 
 * @returns {number}
 */
function getWysiwygLength(markdownString) {
    const html = convertMarkdownToHtml(markdownString);
    const elt = document.createElement("selection");
    elt.innerHTML = html;
    const txt = elt.textContent;
    if (txt == null) return 0;
    return txt.length;
}