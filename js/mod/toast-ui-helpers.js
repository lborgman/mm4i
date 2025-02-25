// @ts-check
// https://www.npmjs.com/package/@toast-ui/editor

const logConsoleHereIs = window["logConsoleHereIs"];
const importFc4i = window["importFc4i"];


const mkElt = window["mkElt"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
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

async function dialogInsertSearch(editor) {
    const searchLinkAtCursor = getWWsearchLinkAtCursor(editor) || getMDsearchLinkAtCursor(editor);
    const es = editor.getSelection();
    const esText = editor.getSelectedText();
    console.log({ searchLinkAtCursor, es, esText });
    const titleInit = esText || searchLinkAtCursor?.searchTitle || "";
    const searchInit = searchLinkAtCursor?.searchString || "";


    const inpTitle = modMdc.mkMDCtextFieldInput();
    inpTitle.value = titleInit;
    const taTitle = modMdc.mkMDCtextField("Title", inpTitle);
    inpTitle.addEventListener("input", evt => {
        updateButtonsEtc();
    });

    const inpSearch = modMdc.mkMDCtextFieldInput();
    inpSearch.value = searchInit;
    const taSearch = modMdc.mkMDCtextField("Search", inpSearch);

    // const spanSearched = mkElt("span", undefined, searchNodeParams.inpSearch.value);
    const divInputs = mkElt("div", undefined, [
        taTitle,
        taSearch,
        // spanSearched,
    ]);
    // @ts-ignore
    divInputs.style = `
            display: flex;
            gap: 20px;
            display: flex;
            flex-direction: column;
        `;

    const hasSearchlinkAtCursor = searchLinkAtCursor != undefined;
    const titleH2 = hasSearchlinkAtCursor ? "Update search link" : "Insert search link";
    // const titleSave = hasSearchlinkAtCursor ? "Update" : "Insert";
    const titleSave = "Save";

    const aTest = mkElt("a");
    aTest.href = `mm4i-search:dummy`;
    aTest.style.padding = "4px";

    const fakedWrapper = mkElt("div", undefined, aTest);
    fakedWrapper.style.display = "inline-block";
    fakedWrapper.classList.add("faked-viewer");
    const spanTest = mkElt("span", undefined, fakedWrapper);
    const eltTest = mkElt("p", undefined, [
        "Click to test: ", spanTest
    ]);
    inpSearch.addEventListener("input", _evt => {
        updateButtonsEtc();
    });
    inpTitle.addEventListener("input", _evt => {
        updateButtonsEtc();
    });

    spanTest.addEventListener("click", evt => {
        doSearchPreview(inpSearch.value);
    });
    function updateButtonsEtc() {
        const valTitle = inpTitle.value.trim();
        const valSearch = inpSearch.value.trim();
        aTest.textContent = valTitle;
        let inert = false;
        if (valTitle == "") { inert = true; }
        if (valSearch == "") { inert = true; }
        eltTest.inert = inert;
        inert = inert || (titleInit == valTitle && searchInit == valSearch);
        btnSave.inert = inert;
    }


    const divInfo = mkElt("div", undefined, [
        mkElt("p", undefined, "Search links search for nodes in your mindmap. Title and node notes are searched."),
    ]);
    divInfo.style = `
        display: none;
        transition: opacity 2s;
        opacity: 0;
    `;
    // btnEdit
    const btnInfo = modMdc.mkMDCiconButton("info", "What are search links?");
    btnInfo.style = `
        color: blue;
    `;
    btnInfo.addEventListener("click", evt => {
        evt.stopImmediatePropagation();
        divInfo.style.display = "flex";
        setTimeout(() => divInfo.style.opacity = "1", 10);
    });
    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, [titleH2, " ", btnInfo]),
        divInfo,
        divInputs,
        eltTest
    ]);

    const btnSave = modMdc.mkMDCdialogButton(titleSave, "confirm", true);
    const btnCancel = modMdc.mkMDCdialogButton("Cancel", "close");
    const arrBtns = [btnSave, btnCancel];
    const eltActions = modMdc.mkMDCdialogActions(arrBtns);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    updateButtonsEtc();
    const answer = await new Promise((resolve) => {
        dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async evt => {
            const action = evt.detail.action;
            switch (action) {
                case "confirm":
                    resolve(true);
                    break;
                case "close":
                    resolve(false);
                    break;
                default:
                    throw Error(`error in MDC dialog, action is "${action}"`)
            }
        }));
    });


    if (!answer) {
        return;
    }
    const title = inpTitle.value.trim();
    if (title == "") return;
    const search = inpSearch.value.trim();
    if (search == "") return;

    if (editor.mode == "wysiwyg") {
        // Avoid blocking browser:
        const lbMD = editor.getMarkdown().length;
        const lbWW = editor.getHTML().length;
        let node, eltMut;
        const sel = editor.getSelection();
        if (searchLinkAtCursor) {
            node = searchLinkAtCursor.eltAnchor;
            eltMut = node.parentElement;
            node.remove();
            await modTools.wait4mutations(eltMut);
        }
        (async function () {
            if (searchLinkAtCursor) {
                const laMD = editor.getMarkdown().length;
                const laWW = editor.getHTML().length;
                if (lbMD == laMD || lbWW == laWW) {
                    const msgLen = `MD:${lbMD}=>${laMD}, WW:${lbWW}=>${laWW}`;
                    console.error(msgLen);
                    debugger; // eslint-disable-line no-debugger
                    throw Error(`Editor was not ready: ${msgLen}`);
                }
            }
            editor.exec("addLink", { linkUrl: searchString2marker(search), linkText: title });
            if (searchLinkAtCursor) { await modTools.wait4mutations(eltMut); }
            const htmlContent = editor.getHTML();
            editor.setHTML(htmlContent);
            if (searchLinkAtCursor) { await modTools.wait4mutations(eltMut); }
            editor.setSelection(sel[0], sel[1]);
        })();
    } else if (editor.mode == "markdown") {
        if (!searchLinkAtCursor) throw Error(`searchLinkAtCursor is null`);
        const sel = searchLinkAtCursor.selection;
        const start = sel[0];
        const end = sel[1];
        editor.setSelection(start, end);
        const mdSearchLink = `[${title}](${searchString2marker(search)})`;
        editor.replaceSelection(mdSearchLink);
        return;
    } else {
        debugger; // eslint-disable-line no-debugger
    }
}

/** 
 * @callback saveFun
 * 
 */
/**
 * @callback FunctionOnChange
 * @param {string} newValue
 * @returns
*/

// let lastMDgetCursorPosition; // debugging

function doSearchPreview(valSearchstring) {
    searchNodeParams.eltJsMindContainer.classList.add("display-jsmind-search");

    searchNodeParams.inpSearch.value = valSearchstring;
    const resSearch = searchNodeParams.searchNodeFun(valSearchstring);
    const nHits = resSearch.length;
    console.log({ resSearch, nHits });

    // const dialogContainer = divEditor.closest(".mdc-dialog__container");
    const arrDialogContainer = [...document.querySelectorAll(".mdc-dialog__container")];

    // @ts-ignore
    // const dcs = dialogContainer.style;
    // dcs.transitionProperty = "opacity";
    // dcs.transitionDuration = "1s";
    const arrDcs = arrDialogContainer.map(elt => elt.style);
    arrDcs.forEach(dcs => {
        dcs.transitionProperty = "opacity";
        dcs.transitionDuration = "1s";
    });
    // arrDcs.forEach(dcs => { dcs.opacity = 0; });

    const spanPreviewCounter = mkElt("span");

    const eltPreviewNotice = mkElt("span", undefined, ["Close preview ", spanPreviewCounter]);
    eltPreviewNotice.addEventListener("click", evt => {
        evt.stopImmediatePropagation();
        stopSearchPreview();
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
    function startSearchPreview() {
        // dcs.opacity = 0;
        arrDcs.forEach(dcs => { dcs.opacity = 0; });
        updatePreviewCounter();
        document.body.appendChild(eltPreviewShield);
        intervalPreview = setInterval(() => {
            countPreview--;
            updatePreviewCounter();
        }, 1000);
        timeoutPreview = setTimeout(() => { stopSearchPreview(); }, secPreview * 1000);
    }
    const stopSearchPreview = () => {
        // dcs.opacity = 1;
        arrDcs.forEach(dcs => { dcs.opacity = 1; });
        eltPreviewShield.remove();
        clearInterval(intervalPreview);
        clearTimeout(timeoutPreview);
    }
    eltPreviewShield.addEventListener("click", evt => {
        console.log("clicked preview, objInit", objInit);
        stopSearchPreview();

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

    startSearchPreview();

}

/**
 * 
 * @param {HTMLDivElement} divEditor 
 * @param {string} initialMD 
 * @param {string} valuePlaceholder 
 * @param {FunctionOnChange} onChange
 * @returns 
 */
async function setupToastUIview(divEditor, initialMD, valuePlaceholder, onChange) {
    let toastEditor;

    if (!divEditor.isConnected) {
        console.warn("The editor container is not connected to the DOM", divEditor);
        // debugger; // eslint-disable-line no-debugger
    }
    divEditor.innerHTML = "";
    // divEditor.dataset.latestSaved = encodeURIComponent(initialMD);


    function check4searchLink(eltSearchLink) {
        if (eltSearchLink.tagName != "A") return;
        if (!eltSearchLink.closest(".faked-viewer")) { return; }
        const href = eltSearchLink.href;
        if (!isSearchMarker(href)) {
            // FIX-ME: Add popup
            const aHelper = document.createElement("a");
            aHelper.href = href;
            aHelper.target = "_blank";
            aHelper.click();
            return;
        }

        // FIX-ME:
        const valSearchstring = searchMarker2string(decodeURIComponent(eltSearchLink.getAttribute("href")));

        console.log("clicked search-link:", { valSearchstring }, eltSearchLink);
        doSearchPreview(valSearchstring);
    }

    divEditor.addEventListener("click", async evt => {
        if (!evt.target) return;
        // return; // FIX-ME: this is the one that works...
        // toastEditor
        check4searchLink(evt.target);
    });



    const objToolbarItems = [
        [
            {
                name: 'searchButton',
                tooltip: 'Add/update search link',
                className: 'toastui-editor-toolbar-icons search-button',
                command: "searchCommand"
            },
            "link",
        ],
        [
            "bold", "italic",
            // "strike"
        ],
        ["heading", "hr", "quote"],
    ];
    function insertSearchCommand(dummy) {
        console.log("searchCommand clicked", dummy);
        dialogInsertSearch(toastEditor);
    }

    toastEditor = makeFakedViewer();


    // https://github.com/nhn/tui.editor/issues/3298
    function makeFakedViewer() {
        const editorViewer = new modToastUI.Editor({
            el: divEditor,
            toolbarItems: objToolbarItems,
            placeholder: valuePlaceholder,
            initialValue: initialMD,
            previewStyle: "tab",
            initialEditType: "wysiwyg",
            height: "auto",
            usageStatistics: false,
            // previewOptions: { container: { padding: '0px' } }
        });
        editorViewer.addCommand("markdown", "searchCommand", insertSearchCommand);
        editorViewer.addCommand("wysiwyg", "searchCommand", insertSearchCommand);
        editorViewer.options.el.classList.add("faked-viewer");
        editorViewer.on("change", () => {
            console.log("changed");
            const md = editorViewer.getMarkdown();
            onChange(md);
        });

        const modeSwiSelector = "div.toastui-editor-mode-switch";
        const eltModeSwitch = divEditor.querySelector(modeSwiSelector);
        if (!eltModeSwitch) throw Error(`Did not find "${modeSwiSelector}"`);
        // @ts-ignore
        eltModeSwitch.style.display = null;

        /*
        const arrC = [...divEditor.querySelectorAll(".toastui-editor-ww-container div[contenteditable=true]")];
        if (arrC.length != 1) throw Error(`Expected to match 1 contenteditable, got ${arrC.length}`);
        const arrC0 = arrC[0];
        arrC0.setAttribute("tabindex", "-1");
        // @ts-ignore
        arrC0.style = `
            padding: 0;
        `;
        const eltDialogContent = arrC0.closest(".mdc-dialog__content");
        // @ts-ignore
        eltDialogContent.style.paddingBottom = "0px";

        const selectorWWcont = "div.toastui-editor-ww-container";
        const previewWWcont = divEditor.querySelector(selectorWWcont);
        if (!previewWWcont) throw Error(`Could not find "${selectorWWcont}`);

        const arrCmContenteditable = [...previewWWcont.querySelectorAll("[contenteditable]")];
        const lenArrCm = arrCmContenteditable.length;
        if (lenArrCm != 1) {
            debugger;
        }
        let cmContenteditable;
        cmContenteditable = cmContenteditable || arrCmContenteditable[0];
        const stCmContenteditable = getComputedStyle(cmContenteditable);
        const pointerEvensCm = stCmContenteditable["pointer-events"];
        console.log({ cmContenteditable, pointerEvensCm });
        // debugger;
        */



        const shieldEdit = mkElt("div");
        const selectorWWmode = "div.toastui-editor-main.toastui-editor-ww-mode";
        const eltWWmode = divEditor.querySelector(selectorWWmode);
        if (!eltWWmode) throw Error(`Could not find "${selectorWWmode}"`);
        eltWWmode.appendChild(shieldEdit);

        shieldEdit.classList.add("faked-viewer-edit-shield");
        // FIX-ME: hover - maybe implement via "pointermove"?
        shieldEdit.addEventListener("NOpointerdown", evt => {
            evt.stopImmediatePropagation();
            // console.log({ evt });
            const x = evt.clientX;
            const y = evt.clientY;
            const elts = document.elementsFromPoint(x, y);
            // console.log(elts);
            const eltsA = elts.filter(elt => elt.tagName == "A");
            // console.log({ eltsA });
            if (eltsA.length > 1) debugger; // eslint-disable-line no-debugger
            if (eltsA.length == 1) {
                const eltA = /** @type {HTMLAnchorElement} */ (eltsA[0]);
                console.log({ eltA });
                eltA.click();
            }
        });
        shieldEdit.addEventListener("NOpointerup", evt => {
            evt.stopImmediatePropagation();
            // console.log({ evt });
            // check4searchLink(evt.target);
        });
        return editorViewer;
    }

    /*
    toastViewer = toastPreview || new modToastUI.Editor.factory({
        viewer: true,
        el: divEditor,
        initialValue: initialMD,
        // previewStyle: "none",
        // initialEditType: "wysiwyg",
        // customHTMLRenderer: mm4iRenderer,
        usageStatistics: false,
    });

    window["myToastViewer"] = toastViewer;
    console.log({ toastViewer });
    */




    const btnEdit = addEditMDbutton();
    btnEdit.focus();
    const eltActive = document.activeElement;
    if (btnEdit != eltActive) {
        console.warn("active element is not btnEdit", eltActive);
        // throw Error(`document.activeElement is not btnEdit`);
    }

    return { toastEditor, btnEdit };

    function addEditMDbutton() {
        divEditor.style.position = "relative";
        const btnEditMyNotes = modMdc.mkMDCiconButton("edit", "Edit my notes");
        divEditor.appendChild(btnEditMyNotes);

        btnEditMyNotes.id = "edit-my-notes";
        let eltFaked;
        btnEditMyNotes.addEventListener("click", async evt => {
            evt.preventDefault();
            evt.stopImmediatePropagation();
            evt.stopPropagation();
            eltFaked = eltFaked || btnEditMyNotes.closest(".faked-viewer");
            eltFaked.classList.toggle("faked-viewer");
            if (eltFaked.classList.contains("faked-viewer")) {
                btnEditMyNotes.textContent = "edit";
                if (toastEditor.mode != "wysiwyg") { toastEditor.changeMode("wysiwyg"); }
            } else {
                btnEditMyNotes.textContent = "edit_off";
            }
            return;


            btnEditMyNotes.remove();
            const ourElt = toastViewer.options.el;
            const valueInitial = toastViewer.options.initialValue;
            // console.log({ ourElt });
            toastViewer.destroy();
            ourElt.innerHTML = "";


            toastEditor = new modToastUI.Editor({
                el: ourElt,
                toolbarItems: objToolbarItems,
                initialValue: valueInitial,
                // customHTMLRenderer: mm4iRenderer,
                // previewStyle: "vertical",
                previewStyle: "tab",
                initialEditType: "markdown",
                usageStatistics: false,
            });
            console.log({ toastEditor });
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



/**
 * 
 * @param {HTMLDivElement} taOrDiv 
 * @param {string} valueInitial 
 * @param {string} valuePlaceholder
 * @param {function} onChange
 * @returns {Promise<{btnEdit:HTMLButtonElement}>}
 */
export async function setupToastUIpreview(taOrDiv, valueInitial, valuePlaceholder, onChange) {
    const tofOnChange = typeof onChange;
    if (tofOnChange != "function") throw Error(`onChange should be function, is ${tofOnChange}`);
    const lenOnChange = onChange.length;
    if (lenOnChange != 1) throw Error(`Function param onChange should take 1 param, not ${lenOnChange}`);

    return await setupToastUIview(taOrDiv, valueInitial, valuePlaceholder, onChange);
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
    if (Array.isArray(pos)) return false;
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
 * @param {number} wysiwygPos 
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
                cacheLineWWtotLen[prop] = len;
            }
            return cacheLineWWtotLen[prop];
        }
    });
    const res = modTools.binarySearch(lineWWtotLen, wysiwygPos, (a, b) => a - b);
    console.log({ res });

    let pos = 0;
    let iLine = 0;
    let lineNo, chPos = 0;
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
        debugger; // eslint-disable-line no-debugger
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
/*
*/


/*
function convertMarkdownToHtml2(markdownString) {
    const viewer = modToastUI.Editor.factory({
        el: document.createElement('div'),
        initialValue: markdownString,
        initialEditType: 'markdown',
        viewer: true
    });
    return viewer.getHTML();
}
*/

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


/** @param {string} str @returns {string} */
function searchString2marker(str) { return `mm4i-search:${str.trim()}`; }

/** @param {string} marker @returns {string} */
function searchMarker2string(marker) { return marker.slice(12).trim(); }

/** @param {string} str @returns {boolean} */
function isSearchMarker(str) { return str.startsWith("mm4i-search:"); }

function getWWsearchLinkAtCursor(editor) {
    if (editor.mode != "wysiwyg") return;
    const ws = window.getSelection();
    if (!ws) {
        // FIX-ME: Can this happen??
        debugger; // eslint-disable-line no-debugger
        return;
    }
    const { anchorNode } = ws;
    if (!anchorNode) {
        // FIX-ME: Can this happen??
        debugger; // eslint-disable-line no-debugger
        return;
    }
    console.log({ anchorNode });
    const nnAnchor = anchorNode.nodeName;
    if (nnAnchor != "#text") {
        // throw Error(`Expected text node (#text), got (${nnAnchor})`);
        console.log(`Expected text node (#text), got (${nnAnchor})`);
        return;
    }
    const eltAnchor = anchorNode.parentElement;
    if (!eltAnchor) {
        // FIX-ME: Can this happen??
        debugger; // eslint-disable-line no-debugger
        return;
    }
    const tnAnc = eltAnchor.tagName;
    if (tnAnc != "A") {
        console.log(`Expected tagName "A", got "${tnAnc}"`);
        return;
    }
    const searchLink = decodeURIComponent(eltAnchor.getAttribute("href") || "");
    const searchString = searchMarker2string(searchLink);
    const searchTitle = eltAnchor.textContent;
    console.log({ searchLink, searchString, searchTitle })
    return { searchString, searchTitle, eltAnchor };
}
function getMDsearchLinkAtCursor(editor) {
    if (editor.mode == "wysiwyg") return;
    const es = editor.getSelection();
    const lines = editor.getMarkdown().split("\n");
    // debugger; // eslint-disable-line no-debugger
    const es0 = es[0];
    const es00 = es0[0];
    const es01 = es0[1];
    const linePos = es00;
    const lineIdx = linePos - 1;
    const charPos = es01;
    // const charIdx = charPos - 1;
    const currentLine = lines[lineIdx];
    console.log({ currentLine });
    // const reLink = /\[(.+?)\]\((.+?)\)/;
    const reSearchLink = /\[(.+?)\]\(mm4i-search:(.+?)\)/;

    // FIX-ME: several on same line, see https://javascript.info/regexp-methods
    const m = currentLine.match(reSearchLink);
    // const e = reSearchLink.exec(currentLine);

    if (!m) return;
    const searchLink = m[0];
    const searchTitle = m[1];
    const searchString = m[2];

    const startPos = currentLine.indexOf(searchLink) + 1;
    if (charPos < startPos) return;
    const endPos = startPos + searchLink.length;
    if (charPos > endPos) return;

    const sl = currentLine.slice(startPos - 1, endPos - 1);
    if (searchLink != sl) {
        console.log(searchLink);
        console.log(sl);
        throw Error(`searchLink=="${searchLink}", but sl=="${sl}"`);
    }
    const start = [linePos, startPos];
    const end = [linePos, endPos];
    const selection = [start, end];
    return { searchString, searchTitle, selection };
}