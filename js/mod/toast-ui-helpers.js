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


    // editor.exec("addLink", { linkUrl: `mm4i-search: search`, linkText: "title" });
    // const h = editor.getHTML();
    // console.log(h);
    // return;

    const alfaAtCursor = getWWalfaAtCursor(editor) || getMDalfaAtCursor(editor);
    // const ws = window.getSelection();
    const es = editor.getSelection();
    const esText = editor.getSelectedText();
    console.log({ windowAlfaAtCursor: alfaAtCursor, es, esText });
    const titleInit = esText || alfaAtCursor?.searchTitle || "";
    // const urlSel = eltAnchor.nodeName != "A" ? "" : eltAnchor.href; // FIX-ME:
    const searchInit = alfaAtCursor?.searchString;
    // debugger;

    const insertAlfaLink = (title, search) => {
        debugger;
        editor.replaceSelection("");
        // editor.exec("addLink", { linkUrl: `mm4i-search: ${search}`, linkText: title });
        editor.exec("addLink", { linkUrl: searchString2marker(search), linkText: title });
    }
    // return;


    const inpTitle = modMdc.mkMDCtextFieldInput();
    inpTitle.value = titleInit;
    const taTitle = modMdc.mkMDCtextField("Title", inpTitle);

    const inpSearch = modMdc.mkMDCtextFieldInput();
    inpSearch.value = searchInit;
    const taSearch = modMdc.mkMDCtextField("Search", inpSearch);

    const spanSearched = mkElt("span", undefined, searchNodeParams.inpSearch.value);
    const divInputs = mkElt("div", undefined, [
        taTitle,
        taSearch,
        spanSearched,
    ]);
    // @ts-ignore
    divInputs.style = `
            display: grid;
            gap: 10px;
            grid-template-columns: 80px 1fr 1fr;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        `;
    const hasAlfaAtCursor = alfaAtCursor != undefined;
    const titleH2 = hasAlfaAtCursor ? "Update search link" : "Insert search link";
    const titleSave = hasAlfaAtCursor ? "Update" : "Insert";
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
            return title != titleInit || search != searchInit;
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
    // const answer = await modMdc.mkMDCdialogConfirm(body, titleSave, "cancel", funCheckSave);
    const answer = await modMdc.mkMDCdialogConfirm(body, titleSave, "cancel");
    if (!answer) {
        return;
    }
    const title = inpTitle.value.trim();
    if (title == "") return;
    const search = inpSearch.value.trim();
    if (search == "") return;
    // console.log({ editor });
    // editor.exec("addLink", { linkUrl: `mm4i-search: ${search}`, linkText: title });
    // debugger;

    // Avoid blocking browser:
    const lbMD = editor.getMarkdown().length;
    const lbWW = editor.getHTML().length;
    let node, eltMut;
    const sel = editor.getSelection();
    if (alfaAtCursor) {
        node = alfaAtCursor.eltAnchor;
        // console.log("before remove", lbMD, lbWW, node.isConnected, node)
        eltMut = node.parentElement;
        node.remove();
        await modTools.wait4mutations(eltMut);
    }
    (async function () {
        if (alfaAtCursor) {
            // modTools.waitSeconds(1);
            // const node = alfaAtCursor.eltAnchor;
            const laMD = editor.getMarkdown().length;
            const laWW = editor.getHTML().length;
            // console.log("after remove", laMD, laWW, node.isConnected, node);
            if (lbMD == laMD || lbWW == laWW) {
                const msgLen = `MD:${lbMD}=>${laMD}, WW:${lbWW}=>${laWW}`;
                console.error(msgLen);
                debugger;
                throw Error(`Editor was not read: ${msgLen}`);
            }
        }
        editor.exec("addLink", { linkUrl: searchString2marker(search), linkText: title });
        if (alfaAtCursor) { await modTools.wait4mutations(eltMut); }
        const htmlContent = editor.getHTML();
        editor.setHTML(htmlContent);
        if (alfaAtCursor) { await modTools.wait4mutations(eltMut); }
        editor.setSelection(sel[0], sel[1]);
    })();
    return;
    // debugger;
    const [start, end] = editor.getSelection();
    // const marker = `[${title}](mm4i-search:${search})`;
    const mdMarker = `[${title}](${searchString2marker(search)})`;
    editor.replaceSelection(mdMarker, start, end);
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
 * @param {string} initialMD 
 * @param {string} valuePlaceholder 
 * @param {FunctionOnEdit} onEdit
 * @param {Object|undefined} objInit;
 * @returns 
 */
async function setupToastUIview(divEditor, initialMD, valuePlaceholder, onEdit, objInit) {
    if (!divEditor.isConnected) {
        console.error("The editor container is not connected to the DOM", divEditor);
        debugger;
    }
    // const ourElt = divEditor;
    // ourElt.innerHTML = "";
    divEditor.innerHTML = "";
    divEditor.dataset.latestSaved = encodeURIComponent(initialMD);

    // FIX-ME: move to mm4i file:
    /*
    const mm4iRenderer = {
        link(node, context) {
            console.log({ node });
            const { origin } = context;
            const url = node.destination;
            // const isAlfa = url.startsWith("mm4i-search:");
            const isAlfa = isSearchMarker(url);
            console.warn("mm4iRenderer link", url, isAlfa);
            if (isAlfa) {
                const attributes = { href: url };
                // attributes.style = "cursor:pointer;";
                const search = searchMarker2string(decodeURIComponent(url));
                attributes.title = `Search nodes for "${search}"`;
                console.log("after red", attributes);
                return [
                    {
                        type: 'openTag', tagName: 'a',
                        attributes: attributes,
                        classNames: ["toastui-alfa-link"],
                    },
                    { type: 'closeTag', tagName: 'a' }
                ];
            }
            return origin();

        }
    }
    */


    function check4searchLink(eltAlfaLink) {
        if (eltAlfaLink.tagName != "A") return;
        const href = eltAlfaLink.href;
        if (!isSearchMarker(href)) {
            // FIX-ME: Add popup
            const aHelper = document.createElement("a");
            aHelper.href = href;
            aHelper.target = "_blank";
            aHelper.click();
            return;
        }
        if (!eltAlfaLink.closest(".faked-viewer")) {
            // dialogInsertSearch(editor); // FIX-ME: 
            // toastEditor =
            // eltAlfaLink.click();
            return;
        }

        // FIX-ME:
        const valAlfa = searchMarker2string(decodeURIComponent(eltAlfaLink.getAttribute("href")));

        console.log("clicked alfa-link:", { valAlfa }, eltAlfaLink);
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
    }

    divEditor.addEventListener("click", async evt => {
        if (!evt.target) return;
        // toastEditor
        check4searchLink(evt.target);
    });


    // await modTools.waitSeconds(1);
    const useToastPreview = true;
    const toastPreview = !useToastPreview ? undefined : makeFakeViewer();

    // https://github.com/nhn/tui.editor/issues/3298
    function makeFakeViewer() {
        const editorViewer = new modToastUI.Editor({
            el: divEditor,
            toolbarItems: [],
            initialValue: initialMD,
            // customHTMLRenderer: mm4iRenderer,
            previewStyle: "tab",
            initialEditType: "wysiwyg",
            height: "auto",
            usageStatistics: false,
            previewOptions: {
                container: {
                    padding: '0px'
                }
            }
        });
        // const eltEditorMain = divEditor.querySelector(".toastui-editor-main");
        // eltEditorMain?.classList.add("faked-viewer");
        const eltEditorDefaultUI = divEditor.querySelector(".toastui-editor-defaultUI");
        eltEditorDefaultUI?.classList.add("faked-viewer");
        const hideElement = (selector) => {
            const element = divEditor.querySelector(selector);
            if (!element) throw Error(`Could not find "${selector}`);
            element.style.display = "none";
        }
        const selectorToolBar = "div.toastui-editor-toolbar";
        hideElement(selectorToolBar);
        const selectorSwitch = "div.toastui-editor-mode-switch";
        hideElement(selectorSwitch);

        const arrC = [...divEditor.querySelectorAll(".toastui-editor-ww-container div[contenteditable=true]")];
        if (arrC.length != 1) throw Error(`Expected to match 1 contenteditable, got ${arrC.length}`);
        const arrC0 = arrC[0];
        // @ts-ignore
        arrC0.style = `
            padding: 0;
        `;
        const eltDialogContent = arrC0.closest(".mdc-dialog__content");
        eltDialogContent.style.paddingBottom = "0px";

        const selectorWWcont = "div.toastui-editor-ww-container";
        const previewWWcont = divEditor.querySelector(selectorWWcont);
        if (!previewWWcont) throw Error(`Could not find "${selectorWWcont}`);
        const bcr = previewWWcont.getBoundingClientRect();
        console.log({ bcr });
        const shield = mkElt("div");
        shield.style = `
          background: red;
          opacity: 0.1;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          position: absolute;
          z-index: 30;
          pointer-events: none;
          border: none;
        `;
        const selectorWWmode = "div.toastui-editor-main.toastui-editor-ww-mode";
        const eltWWmode = divEditor.querySelector(selectorWWmode);
        if (!eltWWmode) throw Error(`Could not find "${selectorWWmode}"`);
        eltWWmode.appendChild(shield);
        shield.addEventListener("pointerdown", evt => {
            evt.stopImmediatePropagation();
            console.log({ evt });
            const x = evt.clientX;
            const y = evt.clientY;
            const elts = document.elementsFromPoint(x, y);
            console.log(elts);
            const eltsA = elts.filter(elt => elt.tagName == "A");
            console.log({ eltsA });
            if (eltsA.length > 1) debugger;
            if (eltsA.length == 1) {
                const eltA = /** type {DOMElement} */ eltsA[0];
                console.log({ eltA });
                eltA.click();
            }
        });
        shield.addEventListener("pointerup", evt => {
            console.log({ evt });
            // startAlfaPreview();
            check4searchLink(evt.target);
        });
        console.log(shield);
        const eltsA = [...eltWWmode.querySelectorAll("a")];
        eltsA.forEach(eltA => console.log(eltA.outerHTML));
        eltsA.forEach(eltA => {
            if (eltA.textContent.length > 0) {
                eltA.addEventListener("NOclick", _evt => {
                    console.log("clicked .click()", eltA.outerHTML);
                    // eltA.click();
                });
            }
        });
        /*
        debugger;
        setTimeout(() => {
            console.log("--- in timeout");
            const eltsA = [...eltWWmode.querySelectorAll("a")];
            eltsA.forEach(eltA => console.log(eltA.outerHTML));
        }, 3000);
        */
        return editorViewer;
    }
    // return; // FIX-ME:
    // await modTools.waitSeconds(1);
    // toastPreview.destroy();
    // await modTools.waitSeconds(1);

    const toastViewer = toastPreview || new modToastUI.Editor.factory({
        viewer: true,
        el: divEditor,
        initialValue: initialMD,
        // previewStyle: "none",
        // initialEditType: "wysiwyg",
        // customHTMLRenderer: mm4iRenderer,
        usageStatistics: false,
    });
    /*
    */
    /*
    */

    window["myToastViewer"] = toastViewer;
    // await modTools.waitSeconds(1);
    // toastViewer.setMarkdown("");
    // await modTools.waitSeconds(1);
    // toastViewer.setMarkdown(initialMD);
    console.log({ toastViewer });
    // toastViewer.setMarkdown("");
    // await modTools.waitSeconds(1);
    //  toastViewer.setMarkdown(valueInitial);

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




    const btnEdit = addEditMDbutton();
    // const objReturn = {};

    // (async function () {
    // await modTools.wait4connected(btnEdit, 800);
    btnEdit.focus();
    const eltActive = document.activeElement;
    if (btnEdit != eltActive) {
        console.error("active element is not btnEdit", eltActive);
        throw Error(`document.activeElement is not btnEdit`);
    }
    // divEasyMdeInert.removeAttribute("inert");
    // }, 600);
    // })();

    return { toastViewer, btnEdit };
    // objReturn.btnEdit = btnEdit;
    // return objReturn;

    function addEditMDbutton() {
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
        z-index: 999;
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
                [
                    {
                        name: 'searchButton',
                        tooltip: 'Insert search',
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
            function insertSearchCommand(editor) {
                // dialog
                // FIX-ME: what is editor here???
                console.log("searchCommand clicked", editor);
                dialogInsertSearch(editor);
            }
            const toastEditor = new modToastUI.Editor({
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


/** @param {string} str @returns {string} */
function searchString2marker(str) { return `mm4i-search:${str.trim()}`; }

/** @param {string} marker @returns {string} */
function searchMarker2string(marker) { return marker.slice(12).trim(); }

/** @param {string} str @returns {boolean} */
function isSearchMarker(str) { return str.startsWith("mm4i-search:"); }

function getWWalfaAtCursor(editor) {
    // debugger;
    if (editor.mode != "wysiwyg") return;
    const ws = window.getSelection();
    if (!ws) {
        debugger; // FIX-ME: Can this happen??
        return;
    }
    const { anchorNode } = ws;
    if (!anchorNode) {
        debugger; // FIX-ME: Can this happen??
        return;
    }
    console.log({ anchorNode });
    const nnAnchor = anchorNode.nodeName;
    if (nnAnchor != "#text") throw Error(`Expected text node (#text), got (${nnAnchor})`);
    const eltAnchor = anchorNode.parentElement;
    if (!eltAnchor) {
        debugger; // FIX-ME: Can this happen??
        return;
    }
    if (!eltAnchor.classList.contains("toastui-alfa-link")) return;
    const tnAnc = eltAnchor.tagName;
    if (tnAnc != "A") throw Error(`Expected tagName "A", got "${tnAnc}"`);
    console.log({ tnAnc });
    const searchLink = decodeURIComponent(eltAnchor.href);
    const searchString = searchMarker2string(searchLink);
    const searchTitle = eltAnchor.textContent;
    console.log({ searchLink, searchString, searchTitle })
    // debugger;
    return { searchString, searchTitle, eltAnchor };
}
function getMDalfaAtCursor(editor) {
    const es = editor.getSelection();
    const lines = editor.getMarkdown().split("\n");
    debugger;

}