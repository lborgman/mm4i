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

async function dialogLinkURL(editor) {
    // debugger;
    dialogLink(editor, "URL");
}
async function dialogLinkSearch(editor) {
    dialogLink(editor, "Search");
}
async function dialogLink(editor, wantsLinkType) {
    if (!["Search", "URL"].includes(wantsLinkType)) throw Error(`Unknown link type: "${wantsLinkType}"`);
    const linkAtCursor = getLinkAtCursor(editor);
    const esText = editor.getSelectedText();
    console.log({ linkAtCursor, esText });
    // debugger;
    const titleInit = esText || linkAtCursor?.linkTitle || "";
    const hrefInit = linkAtCursor?.linkHref || "";

    const hrefType = !linkAtCursor ? undefined :
        (isSearchMarker(hrefInit) ? "Search" : "URL");
    const mismatch = (hrefType && (hrefType !== wantsLinkType));
    const msgMismatch = !mismatch ? undefined
        : `Notice: The existing link is of type "${hrefType}", using that`;
    console.log({ msgMismatch });

    const useLinkType = hrefType || wantsLinkType;
    const strTaHref = useLinkType;
    const h2LinkType = useLinkType == "URL" ? "URL" : "search link";
    // debugger;


    const inpTitle = modMdc.mkMDCtextFieldInput();
    inpTitle.value = titleInit;
    const taTitle = modMdc.mkMDCtextField("Title", inpTitle);
    inpTitle.addEventListener("input", () => {
        updateButtonsEtc();
    });

    const inpHrefSearch = modMdc.mkMDCtextFieldInput();
    inpHrefSearch.value = isSearchMarker(hrefInit) ? searchMarker2string(hrefInit) : hrefInit;
    const taHref = modMdc.mkMDCtextField(strTaHref, inpHrefSearch);

    const divInputs = mkElt("div", undefined, [
        taTitle,
        taHref,
    ]);
    // @ts-ignore
    divInputs.style = `
            display: flex;
            gap: 20px;
            display: flex;
            flex-direction: column;
        `;

    const hasLinkAtCursor = linkAtCursor != undefined;
    const titleH2 = hasLinkAtCursor ? `Update ${h2LinkType}` : `Insert ${h2LinkType}`;
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
    inpHrefSearch.addEventListener("input", _evt => {
        updateButtonsEtc();
    });
    inpTitle.addEventListener("input", () => {
        updateButtonsEtc();
    });

    spanTest.addEventListener("click", () => {
        doSearchPreview(inpHrefSearch.value);
    });
    function updateButtonsEtc() {
        const valTitle = inpTitle.value.trim();
        const valSearch = inpHrefSearch.value.trim();
        aTest.textContent = valTitle;
        let inert = false;
        if (valTitle == "") { inert = true; }
        if (valSearch == "") { inert = true; }
        eltTest.inert = inert;
        inert = inert || (titleInit == valTitle && hrefInit == valSearch);
        btnSave.inert = inert;
    }


    const divInfo = mkElt("div", undefined, [
        mkElt("p", undefined, "Search links looks for nodes in your mindmap. Node titles and notes are searched."),
    ]);
    divInfo.style = `
        display: none;
        transition: opacity 2s;
        opacity: 0;
    `;
    // btnEdit
    const btnSearchInfo = modMdc.mkMDCiconButton("info", "What are search links?");
    btnSearchInfo.style = `
        color: blue;
    `;
    btnSearchInfo.addEventListener("click", evt => {
        evt.stopImmediatePropagation();
        divInfo.style.display = "flex";
        setTimeout(() => divInfo.style.opacity = "1", 10);
    });
    const eltH2 = mkElt("h2", undefined, titleH2);
    if (useLinkType == "Search") { eltH2.appendChild(btnSearchInfo); }
    const body = mkElt("div", undefined, [
        eltH2,
        divInfo,
        divInputs,
    ]);
    if (useLinkType == "Search") { body.appendChild(eltTest); }
    if (mismatch) { body.appendChild(mkElt("p", undefined, `(${msgMismatch})`)); }

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
    const search = inpHrefSearch.value.trim();
    if (search == "") return;

    if (editor.mode == "wysiwyg") {
        // Avoid blocking browser:
        const lbMD = editor.getMarkdown().length;
        const lbWW = editor.getHTML().length;
        let node, eltMut;
        const sel = editor.getSelection();
        if (linkAtCursor) {
            node = linkAtCursor.eltAnchor;
            eltMut = node.parentElement;
            node.remove();
            await modTools.wait4mutations(eltMut);
        }
        (async function () {
            if (linkAtCursor) {
                const laMD = editor.getMarkdown().length;
                const laWW = editor.getHTML().length;
                if (lbMD == laMD || lbWW == laWW) {
                    const msgLen = `MD:${lbMD}=>${laMD}, WW:${lbWW}=>${laWW}`;
                    console.error(msgLen);
                    debugger; // eslint-disable-line no-debugger
                    throw Error(`Editor was not ready: ${msgLen}`);
                }
            }
            const linkUrl = useLinkType == "Search" ? searchString2marker(search) : search;

            //// It looks like Toast UI Editor does not support the title in GFM:
            // editor.addLink('Click here', 'https://example.com', { target: '_blank', rel: 'noopener', title: 'Go to example.com' });
            // const popupTitle = useLinkType == "Search" ? search : linkUrl;
            const popupTitle = "popup title test";

            editor.exec("addLink", { linkUrl, linkText: title, linkTitle: popupTitle });

            if (linkAtCursor) { await modTools.wait4mutations(eltMut); }
            const htmlContent = editor.getHTML();
            editor.setHTML(htmlContent);
            if (linkAtCursor) { await modTools.wait4mutations(eltMut); }
            editor.setSelection(sel[0], sel[1]);
        })();
    } else if (editor.mode == "markdown") {
        if (!linkAtCursor) throw Error(`searchLinkAtCursor is null`);
        const sel = linkAtCursor.selection;
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
        console.log("clicked eltPreviewShield");
        stopSearchPreview();

        // const funClose = objInit.data.funClose;
        // console.log("funClose", funClose);
        // if (funClose) funClose();
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
            // "link",
            {
                name: 'linkButton',
                tooltip: 'Add/update URL link',
                className: 'toastui-editor-toolbar-icons link',
                command: "myLinkCommand"
            },

        ],
        [
            "bold", "italic", "heading"
        ],
    ];
    function insertSearchCommand(dummy) {
        console.log("searchCommand clicked", dummy);
        dialogLinkSearch(toastEditor);
    }
    function insertLinkCommand(dummy) {
        console.log("searchCommand clicked", dummy);
        dialogLinkURL(toastEditor);
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

        // FIX-ME: move!
        editorViewer.addCommand("markdown", "searchCommand", insertSearchCommand);
        editorViewer.addCommand("wysiwyg", "searchCommand", insertSearchCommand);
        editorViewer.addCommand("markdown", "myLinkCommand", insertLinkCommand);
        editorViewer.addCommand("wysiwyg", "myLinkCommand", insertLinkCommand);


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
            /*


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


            // Looking for workaround for the cursor move bug in Toast UI. 

            // Suggested by Deep Seek.

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
            */

        });
        return btnEditMyNotes;
    }
}



/**
 * 
 * @param {HTMLDivElement} taOrDiv 
 * @param {string} valueInitial 
 * @param {string} valuePlaceholder
 * @param {FunctionOnChange} onChange
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

/** @typedef {number} wysiwygPosition */
/** @typedef {wysiwygPosition|markdownPosition} editorPosition */

/*
 * @typedef OLDmarkdownPosition
 * @type {Array}
 * @property {number} 0
 * @property {number} 1
 */
/**
 * @typedef {[number, number]} markdownPosition
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
 * @param {wysiwygPosition} wysiwygPos 
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
 * @param {editorPosition} pos 
 */
export function setCursorPos(toastEditor, pos) {
    const isWWpos = isWysiwygPos(pos);
    const isMDpos = isMarkdownPos(pos);
    if (!(isWWpos || isMDpos)) throw Error(`Not wysiwyg or markdown position: ${pos.toString()}`);
    if (toastEditor.mode == "wysiwyg") {
        const posWW = (() => {
            if (isWWpos) return pos;
            if (!Array.isArray(pos)) throw Error(`pos is not array: ${pos}`);
            const mdPos = /** @type {markdownPosition} */ pos;
            return toWysiwygPos(toastEditor, mdPos);
        })();
        console.warn("setCursorPos", toastEditor.mode, posWW.toString());
        toastEditor.wwEditor.view.dom.focus();
        toastEditor.wwEditor.setSelection(posWW, posWW);
    } else {
        if (typeof pos != "number") throw Error(`pos is not number: ${pos}`);
        if (!Number.isInteger(pos)) throw Error(`pos is not integer: ${pos}`);
        const wwPos = /** @type {wysiwygPosition} */ pos;
        const mdPos = toMarkdownPos(toastEditor, wwPos)
        console.warn("setCursorPos", toastEditor.mode, mdPos.toString());
        toastEditor.mdEditor.view.dom.focus();
        toastEditor.mdEditor.setSelection(mdPos, mdPos);
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
function searchMarker2string(marker) {
    return marker.slice(12).trim();
}

/** @param {string} str @returns {boolean} */
function isSearchMarker(str) { return str.startsWith("mm4i-search:"); }

function getWWlinkAtCursor(editor) {
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
    const linkHref = decodeURIComponent(eltAnchor.getAttribute("href") || "");
    const linkTitle = eltAnchor.textContent;
    console.log({ linkHref, linkTitle })
    return { linkHref, linkTitle, eltAnchor };
}
/*
function OLDgetWWsearchLinkAtCursor(editor) {
    const objLink = getWWlinkAtCursor(editor);
    if (!objLink) return;
    const linkHref = objLink.linkHref;
    if (!isSearchMarker(linkHref)) return;
    const searchString = searchMarker2string(linkHref);
    objLink.searchString = searchString;
    return objLink;
}
*/
// function getMDsearchLinkAtCursor(editor) { return getMDLinkAtCursor(editor); }
function getLinkAtCursor(editor) {
    return getMDLinkAtCursor(editor) || getWWlinkAtCursor(editor);
}
function getMDLinkAtCursor(editor) {
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
    const reLink = /\[(.+?)\]\((.+?)\)/;
    // const reSearchLink = /\[(.+?)\]\(mm4i-search:(.+?)\)/;

    // FIX-ME: several on same line, see https://javascript.info/regexp-methods
    // const m = currentLine.match(reSearchLink);
    const m = currentLine.match(reLink);
    // const e = reSearchLink.exec(currentLine);

    if (!m) return;
    const wholeLink = m[0];
    const linkTitle = m[1];
    const linkHref = m[2];
    // const searchString = m[2];

    const startPos = currentLine.indexOf(wholeLink) + 1;
    if (charPos < startPos) return;
    const endPos = startPos + wholeLink.length;
    if (charPos > endPos) return;

    const sl = currentLine.slice(startPos - 1, endPos - 1);
    if (wholeLink != sl) {
        console.log(wholeLink);
        console.log(sl);
        throw Error(`wholeLink=="${wholeLink}", but sl=="${sl}"`);
    }
    const start = [linePos, startPos];
    const end = [linePos, endPos];
    const selection = [start, end];
    return { linkHref, linkTitle, selection };
}



// This is for things JavaScript Coverage tool does not think is run
// Coverage does not understand execution (2025-0-31) so it does not see "return".
forCoverage();
function forCoverage() {
    // debugger;
    return;
    dialogLink();
}