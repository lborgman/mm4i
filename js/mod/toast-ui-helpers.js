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

const useEasyMDE = false;
// const modToastUI = await importFc4i("toast-ui");
const modToastUI = window["toastui"] || await importFc4i("toast-ui");

const reAlfaBefore = /\[@(.+?)\]\((.+?)\)/gm;
async function dialogInsertSearch(editor) {
    const selection = editor.getSelection();
    const start = selection[0];
    const contentMarkdown = editor.getMarkdown();
    const lines = contentMarkdown.split("\n");
    let charCount = 0;
    let lineNumber = 0;
    let charPosition = 0;
    for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= start) {
            lineNumber = i + 1;
            charPosition = start - charCount + 1;
            break;
        }
        charCount += lines[i].length + 1; // +1 for the newline character
    }
    const line = lines[lineNumber]
    console.log(`Line: ${lineNumber}, Character: ${charPosition}`, line);
    // debugger;
    const alfaAtCursor = getAlfaAtCursor(editor);
    console.log("dialogInsertSearch", alfaAtCursor);
    const inpTitle = modMdc.mkMDCtextFieldInput();
    const taTitle = modMdc.mkMDCtextField("Title", inpTitle);
    const inpSearch = modMdc.mkMDCtextFieldInput();
    const taSearch = modMdc.mkMDCtextField("Search", inpSearch);
    const spanSearched = mkElt("span", undefined, searchNodeParams.inpSearch.value);
    const divInputs = mkElt("div", undefined, [
        taTitle,
        taSearch,
        spanSearched,
    ]);
    if (alfaAtCursor) {
        const { title, search, startAlfa, endAlfa } = alfaAtCursor;
        inpTitle.value = title;
        inpSearch.value = search;
    }
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
            return title.length > 0 && search.length > 0;
        }
        const cm = editor.codemirror;
        const doc = cm.getDoc();
        const cursor = doc.getCursor();
        const txtInsert = `[@${title}](${search})`;
        if (!alfaAtCursor) {
            doc.replaceRange(txtInsert, cursor);
        } else {
            debugger;
            const { title, search, posAlfa, lenAlfa } = alfaAtCursor;
            const lineNo = cursor.line;
            const from = { line: lineNo, ch: posAlfa };
            const to = { line: lineNo, ch: posAlfa + lenAlfa };
            doc.replaceRange(txtInsert, from, to);
        }
    };
    await modMdc.mkMDCdialogConfirm(body, titleSave, "cancel", funCheckSave);
}

/**
 * 
 * @param {HTMLDivElement} taOrDiv 
 * @param {string} valueInitial 
 * @param {string} valuePlaceholder 
 * @param {Object|undefined} objInit;
 * @returns 
 */
export async function setupEasyMDEview(taOrDiv, valueInitial, valuePlaceholder, objInit) {
    let taEasyMde;
    let divEasyMdeInert;
    let divEasyMdeOuterWrapper;
    if (taOrDiv.tagName == "TEXTAREA") {
        throw Error(`taOrDiv should be DIV: ${taOrDiv.tagName}`);
    }
    taEasyMde = mkElt("textarea");
    if (valuePlaceholder) { taEasyMde.setAttribute("placeholder", valuePlaceholder); }
    divEasyMdeInert = mkElt("div", undefined, taEasyMde);
    divEasyMdeOuterWrapper = taOrDiv;
    divEasyMdeOuterWrapper.appendChild(divEasyMdeInert);
    await importFc4i("easymde");
    const EasyMDE = window["EasyMDE"];
    const defineEasyMdeToolbar = [
        "preview",
        "fullscreen",
        "|",
        /*
        {
            name: "letters",
            // className: "fa fa-circle-h",
            className: "fa fa-a",
        },
        */
        "bold",
        "italic",
        "heading",
        "strikethrough",
        "|",
        {
            name: "grouping",
            className: "fa fa-object-group",
            title: "Lists and dividers",
            children: [
                "horizontal-rule",
                "quote",
                "unordered-list",
                "ordered-list",
            ],
        },
        "|",
        "link",
        {
            name: "custom",
            action: (editorMDE) => {
                console.log("clicked search button", editorMDE);
                dialogInsertSearch(editorMDE);
            },
            className: "fa fa-search",
            title: "Insert search",
            attributes: { // for custom attributes
                id: "custom-id",
                "data-value": "custom value" // HTML5 data-* attributes need to be enclosed in quotation marks ("") because of the dash (-) in its name.
            }
        },
        "|",
        "undo",
        "redo",
        "|",
        "guide",
    ];

    // https://github.com/nhn/tui.editor/issues/3293

    // let toastEditor;
    if (useEasyMDE) {
        throw Error("don't use EasyMDE");
    }
    const ourElt = divEasyMdeOuterWrapper;
    ourElt.innerHTML = "";

    const toastEditor = new modToastUI.Editor.factory({
        viewer: true,
        el: ourElt,
        initialValue: valueInitial,
        previewStyle: "none",
        initialEditType: "WYSIWYG",
        usageStatistics: false,
    });
    // toastEditor.getInstance();
    // easyMDE.getMarkdown();
    window["MYtoastEditor"] = toastEditor;

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
        const lenFun = funInit.length;
        // if (lenFun != lenObj) { throw Error(`.funInit takes ${lenFun} parameters, should take ${lenObj}`); }
        if (dataObj) {
            await objInit.funInit(toastEditor, dataObj);
        } else {
            await objInit.funInit(toastEditor);
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



    if (toastEditor.codemirror) {
        toastEditor.codemirror.options.readOnly = "nocursor";
        toastEditor.value(valueInitial);
        if (toastEditor.isPreviewActive()) throw Error("easyMDE.isPreviewActive()");
        toastEditor.togglePreview();

        divEasyMdeInert.setAttribute("inert", "");

        const cud = toastEditor.codemirror.display.cursorDiv;
        const cont = cud.closest("div.EasyMDEContainer");

        // FIX-ME: the key return problem:
        const code = cont.querySelector("div.CodeMirror-code");
        code.addEventListener("keydown", evt => {
            evt.stopPropagation();
        });

        await modTools.wait4mutations(cont);

        const editable = cont.querySelector("div[contenteditable]")
        const ta = cont.querySelector("textarea");
        const editor = editable || ta;
        window["MYeditor"] = editor;
        toastEditor.codemirror.options.readOnly = "nocursor";

        const eltCursorDiv = toastEditor.codemirror.display.cursorDiv;
        const eltMDEContainer = eltCursorDiv.closest("div.EasyMDEContainer");

        const eltToolbar = eltMDEContainer.querySelector("div.editor-toolbar");
        eltToolbar.style.display = "none";

        const eltPreview = eltMDEContainer.querySelector("div.editor-preview");
        eltPreview.addEventListener("click", async evt => {
            console.log({ eltPreview });
            const target = evt.target;
            if (target.tagName != "SPAN") return;

            const dialogContainer = eltPreview.closest(".mdc-dialog__container");
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
            const updatePreviewCounter = () => { spanPreviewCounter.textContent = `${countPreview} sec`; }
            const startAlfaPreview = () => {
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
                let eltFromPoint = document.elementFromPoint(evt.clientX, evt.clientY);
                if (!eltFromPoint) throw Error(`eltFromPoint is null`);
                // console.log("eltFromPoint", eltFromPoint, eltFromPoint.click);
                if (eltFromPoint.classList.contains("mdc-dialog__scrim")) {
                    eltFromPoint.style.display = "none";
                    eltFromPoint = document.elementFromPoint(evt.clientX, evt.clientY);
                    if (!eltFromPoint) throw Error(`eltFromPoint is null`);
                    // console.log("eltFromPoint 2", eltFromPoint);
                }
                if (eltFromPoint.classList.contains("mdc-dialog")) {
                    eltFromPoint.style.display = "none";
                    eltFromPoint = document.elementFromPoint(evt.clientX, evt.clientY);
                    if (!eltFromPoint) throw Error(`eltFromPoint is null`);
                    // console.log("eltFromPoint 3", eltFromPoint);
                }

                setTimeout(() => {
                    eltFromPoint.click(); // Trigger click on the background element
                    target.style.pointerEvents = 'auto'; // Re-enable pointer events
                }, 1000);

            });

            const isAlfaLink =
                target.classList.contains("cm-alfa-before")
                ||
                target.classList.contains("cm-alfa-after");
            if (!isAlfaLink) return;
            const valAlfa = target.dataset.alfaLink;
            console.log("clicked alfa-link:", { valAlfa }, target);
            searchNodeParams.eltJsMindContainer.classList.add("display-jsmind-search");

            searchNodeParams.inpSearch.value = valAlfa;
            const resSearch = searchNodeParams.searchNodeFun(valAlfa);
            const nHits = resSearch.length;
            console.log({ resSearch, nHits });

            startAlfaPreview();
        });
    }

    // if (!newWay) { return { easyMDE }; }
    const btnEdit = addEditMDEbutton(divEasyMdeOuterWrapper, toastEditor);


    // To be able to click the links in the rendered document we must remove "inert".
    // However if we do that directly the virtual keyboard will popup on an Android mobile.
    // So we must first focus on an element outside of easyMDE.

    // setTimeout(async () => {
    // if (!btnEdit.isConnected) { throw Error("btnEdit is not yet connected to the document"); }
    (async function () {
        await modTools.wait4connected(btnEdit, 800);
        btnEdit.focus();
        const eltActive = document.activeElement;
        if (btnEdit != eltActive) {
            console.error("active element is not btnEdit", eltActive);
            throw Error(`document.activeElement is not btnEdit`);
        }
        divEasyMdeInert.removeAttribute("inert");
        // }, 600);
    })();

    return { easyMDE: toastEditor, btnEdit };
}

function addEditMDEbutton(container, toastViewer) {
    container.style.position = "relative";
    const btnEditMyNotes = modMdc.mkMDCiconButton("edit", "Edit my notes");
    container.appendChild(btnEditMyNotes);
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
    btnEditMyNotes.addEventListener("click", evt => {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        btnEditMyNotes.remove();
        if (useEasyMDE) {
            const eltToolbar = container.querySelector("div.editor-toolbar");
            eltToolbar.style.display = "";
            eltToolbar.scrollIntoView();
            toastViewer.codemirror.options.readOnly = false;
            const divInert = container.querySelector("div[inert]");
            // Might already be removed
            divInert?.removeAttribute("inert");
            toastViewer.togglePreview();
            // https://stackoverflow.com/questions/8349571/codemirror-editor-is-not-loading-content-until-clicked
            toastViewer.codemirror.refresh();
            const cud = toastViewer.codemirror.display.cursorDiv;
            const cont = cud.closest("div.EasyMDEContainer");
            // contenteditable on mobile, textarea on desktop
            const editable = cont.querySelector("div[contenteditable]")
            const ta = cont.querySelector("textarea");
            const eltFocus = editable || ta;
            window["MYeltFocusNotes"] = eltFocus;
            toastViewer.codemirror.options.readOnly = false;
            setTimeout(() => { eltFocus.focus(); }, 1000);
        } else {
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
                console.log("searchCommand clicked");
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
            });
            // toastEditor.getInstance();
            const sel = toastEditor.getSelection();
            toastEditor.addCommand("markdown", "searchCommand", insertSearchCommand);
            toastEditor.addCommand("wysiwyg", "searchCommand", insertSearchCommand);
            toastEditor.changeMode("wysiwyg");

        }
    });
    return btnEditMyNotes;
}


let origEasyMDEmarkdown;
async function saveOrigMarkdown() {
    if (origEasyMDEmarkdown) return;
    await importFc4i("easymde");
    const EasyMDE = window["EasyMDE"];
    origEasyMDEmarkdown = EasyMDE.prototype.markdown;
}

export async function setupEasyMDE4Notes(taOrDiv, valueInitial, valuePlaceholder, objClose) {
    const funInit = async (easyMDE) => addAlfa(easyMDE);
    const objInit4Notes = {
        funInit
    }
    if (objClose) objInit4Notes.data = objClose;
    const { easyMDE, btnEdit } = await setupEasyMDEview(taOrDiv, valueInitial, valuePlaceholder, objInit4Notes);
    // await addAlfa(easyMDE);
    return { easyMDE, btnEdit };
}

async function addAlfa(easyMDE) {
    // return;
    await saveOrigMarkdown();
    const EasyMDE = window["EasyMDE"];

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

export function getWhitespaceWordAtCursor(cm) {
    const cursor = cm.getCursor();
    const line = cm.getLine(cursor.line);
    let start = cursor.ch;
    let end = cursor.ch;

    // Find the start of the word
    while (start > 0 && /\w/.test(line.charAt(start - 1))) {
        start--;
    }

    // Find the end of the word
    while (end < line.length && /\w/.test(line.charAt(end))) {
        end++;
    }

    return line.slice(start, end);
}

/*
// Usage example
const cm = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: 'javascript'
});

cm.on('cursorActivity', function() {
    const word = getWordAtCursor(cm);
    console.log('Word at cursor:', word);
});
*/

// insert search link
function getAlfaAtCursor(editor) {
    // const cursorPosition = editor.getCursorPosition();
    // debugger;
    const selection = editor.getSelection();
    const posSel = selection[0];
    const contentMarkdown = editor.getMarkdown();

    // FIX-ME: Looks like a JavaScript bug here with iterators.
    //   Taking a closer look later!
    const m = reAlfaBefore.exec(contentMarkdown);
    if (!m) return;
    debugger;
    const matches = contentMarkdown.matchAll(reAlfaBefore);
    const temp = [...matches];

    // for (let match of matches) {
    for (let match of temp) {
        const lenAlfa = match[0].length;
        const startAlfa = match.index;
        const endAlfa = startAlfa + lenAlfa;
        if (startAlfa < posSel && posSel < endAlfa) {
            const title = match[1];
            const search = match[2];
            return { title, search, startAlfa, endAlfa }
        }
    }
    return;


    const posAlfa = contentMarkdown.search(reAlfaBefore);
    const lenAlfa = m[0].length;
    console.log(m, posCursor, posAlfa, lenAlfa);
    const endAlfa = posAlfa + lenAlfa
    const isInAlfa = posCursor >= posAlfa && posCursor <= endAlfa;
    // FIX-ME: check all alfa on line
    if (!isInAlfa) return;
    const title = m[1];
    const search = m[2];
    return { title, search, posAlfa, lenAlfa }
}