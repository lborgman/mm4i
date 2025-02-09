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
    const selection = editor.getSelection();
    const startSel = selection[0];
    const endSel = selection[1];
    const contentMarkdown = editor.getMarkdown();

    let initialTitle = contentMarkdown.slice(startSel, endSel);
    let initialSearch = "";

    const alfaAtCursor = getAlfaAtCursor(contentMarkdown, startSel, endSel);
    console.log("dialogInsertSearch", alfaAtCursor);
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
    await modMdc.mkMDCdialogConfirm(body, titleSave, "cancel", funCheckSave);
}

/** 
 * @callback saveFun
 * 
 */
/**
 * @callback onEditFun
 * @param {Object} toastEditor
 * @returns {saveFun}
*/
/**
 * 
 * @param {HTMLDivElement} divEditor 
 * @param {string} valueInitial 
 * @param {string} valuePlaceholder 
 * @param {onEditFun} onEdit
 * @param {Object|undefined} objInit;
 * @returns 
 */
async function setupToastUIview(divEditor, valueInitial, valuePlaceholder, onEdit, objInit) {
    // const ourElt = divEditor;
    // ourElt.innerHTML = "";
    divEditor.innerHTML = "";
    divEditor.dataset.latestSaved = encodeURIComponent(valueInitial);

    const toastViewer = new modToastUI.Editor.factory({
        viewer: true,
        // el: ourElt,
        el: divEditor,
        initialValue: valueInitial,
        previewStyle: "none",
        initialEditType: "WYSIWYG",
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
        `;
        document.head.append(eltStyle);
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
            console.log({ ourElt });
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
                // previewStyle: "vertical",
                previewStyle: "tab",
                initialEditType: "markdown",
                usageStatistics: false,
                /*
                events: {
                    stateChange: () => {
                        console.log("-------------------- stateChange");
                    },
                },
                */
            });
            toastEditor.on("change", (inWhatMode) => {
                // debugger;
                // get latest value
                // divEditor.dataset.latestSaved = encodeURIComponent(valueInitial);
                const divEditor = toastEditor.options.el;
                const latestSaved = decodeURIComponent(divEditor.dataset.latestSaved);
                const currentValue = toastEditor.getMarkdown();
                const needSave = latestSaved != currentValue;

                console.log("%ctoastEditor, change", "background-color:blue", inWhatMode, { needSave });
                if (needSave) {
                    // debugger;
                    // funSave, onEdit
                    callersSaveFun(currentValue);
                    divEditor.dataset.latestSaved = encodeURIComponent(currentValue);
                }
            });
            async function handleCursorChangeWW(evt) {
                console.log('WW handleCursorChange', evt);
                modTools.waitSeconds(1);
                const pos = getCursorPosition();
                console.log("WW", { pos });
            }
            async function handleCursorChangeMD(evt) {
                console.log('MD handleCursorChange', evt);
                modTools.waitSeconds(1);
                const pos = getCursorPosition();
                console.log("MD", { pos });
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

            let savedCursorPosition = 0;
            const callersSaveFun = await onEdit(toastEditor);
            const tofSaveFun = typeof callersSaveFun;
            if (tofSaveFun != "function") throw Error(`onEdit(...) returned type "${tofSaveFun}", expeced "function"`);
            const lenSaveFun = callersSaveFun.length;
            if (lenSaveFun != 1) throw Error(`Function return by onEdit(...) takes ${lenSaveFun} parameters, expected 1`);

            function saveCursorPosition(currentEditor, oldMode) {
                savedCursorPosition = getCursorPosition();
            }
            function getCursorPosition() {
                const st = "background:green;";
                const sel = toastEditor.getSelection(); // Get the selection from the WYSIWYG editor
                console.log("%cgetCursorPosition", st, { sel });
                if (!Array.isArray(sel)) throw Error("Expected array");
                const lenSel = sel.length;
                if (lenSel != 2) throw Error(`Expected length == 2, got ${lenSel}`);
                const sel0 = sel[0];
                let cursorPosition;
                if (Array.isArray(sel0)) {
                    const startLine = sel0[0];
                    const startCh = sel0[1];
                    const markdown = toastEditor.getMarkdown();
                    const lines = markdown.split("\n");
                    let pos = startCh;
                    for (let i = 0; i < startLine - 1; i++) {
                        pos += lines[i].length + 1;
                    }
                    cursorPosition = pos;
                } else {
                    cursorPosition = sel0;
                }
                console.log("%cGCP", st, { cursorPosition });
                if (isNaN(cursorPosition)) throw "savedCursorPosition is not number";
                return cursorPosition;
            }

            async function restoreCursorPosition() {
                const st = "background:red;";
                console.log("%crestoreCursorPosition", st, { savedCursorPosition });
                if (!savedCursorPosition) return;
                if (isNaN(savedCursorPosition)) throw "savedCursorPosition is not number";
                modTools.waitSeconds(1);
                ourSetSelection(savedCursorPosition);
                /**
                 * 
                 * @param {number} posStart 
                 */
                function ourSetSelection(posStart) {
                    if (toastEditor.mode != "markdown") {
                        toastEditor.setSelection(posStart, posStart);
                    } else {
                        const markdown = toastEditor.getMarkdown();
                        const lines = markdown.split("\n");
                        let linesLength = 0;
                        let lineNo = 1;
                        for (let i = 0, len = lines.length; i < len; i++) {
                            const line = lines[i];
                            if (line.length + linesLength > posStart) {
                                lineNo = i - 1;
                                break;
                            }
                            linesLength += line.length;
                        }
                        const chNo = posStart - linesLength;
                        const pos = [lineNo, chNo];
                        toastEditor.setSelection(pos, pos);
                    }
                }
            }

            toastEditor.on('changeMode', (newMode) => {
                console.log("changeMode", newMode);
                const oldMode = newMode == "markdown" ? "wysiwyg" : "markdown";
                const currentEditor = newMode == "markdown" ? toastEditor.wwEditor : toastEditor.mdEditor;
                saveCursorPosition(currentEditor, oldMode);

                console.log("changeMode", { savedCursorPosition });
                setTimeout(() => {
                    restoreCursorPosition();
                }, 1000);
            });


            // const sel = toastEditor.getSelection();
            toastEditor.addCommand("markdown", "searchCommand", insertSearchCommand);
            toastEditor.addCommand("wysiwyg", "searchCommand", insertSearchCommand);
            toastEditor.changeMode("wysiwyg");

        });
        return btnEditMyNotes;
    }
}


let origEasyMDEmarkdown;
async function saveOrigMarkdown() {
    if (origEasyMDEmarkdown) return;
    await importFc4i("easymde");
    const EasyMDE = window["EasyMDE"];
    origEasyMDEmarkdown = EasyMDE.prototype.markdown;
}

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