// @ts-check

const logConsoleHereIs = window["logConsoleHereIs"];
const importFc4i = window["importFc4i"];
const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const modTools = await importFc4i("toolsJs");
const modMdc = await importFc4i("util-mdc");

const EASYMDE_HELPERS_VER = "0.0.1";
logConsoleHereIs(`here is easyMDE-helpers.js, module,${EASYMDE_HELPERS_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

let searchNodeParams;
export function setupSearchNodes(searchPar) {
    searchNodeParams = searchPar;
    console.log({ searchNodeParams });
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
    // divEasyMdeOuterWrapper = mkElt("div", undefined, divEasyMdeInert);
    divEasyMdeOuterWrapper = taOrDiv;
    divEasyMdeOuterWrapper.appendChild(divEasyMdeInert);
    // const modEasyMDE = await importFc4i("easymde");
    // console.log({ modEasyMDE }); // EasyMDE is defined in global scope!
    await importFc4i("easymde");
    const EasyMDE = window["EasyMDE"];
    const defineToolbar = [
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
    const easyMDE = new EasyMDE({
        element: taEasyMde,
        status: false,
        toolbar: defineToolbar,
    });
    window["MYeasyMDE"] = easyMDE;
    async function dialogInsertSearch(easyMDE) {
        const alfaAtCursor = getAlfaAtCursor(easyMDE.codemirror);
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
            const { title, search, posAlfa, lenAlfa } = alfaAtCursor;
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
            const cm = easyMDE.codemirror;
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
            await objInit.funInit(easyMDE, dataObj);
        } else {
            await objInit.funInit(easyMDE);
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



    easyMDE.codemirror.options.readOnly = "nocursor";
    easyMDE.value(valueInitial);
    if (easyMDE.isPreviewActive()) throw Error("easyMDE.isPreviewActive()");
    easyMDE.togglePreview();

    // if (newWay) {
    divEasyMdeInert.setAttribute("inert", "");
    // }

    const cud = easyMDE.codemirror.display.cursorDiv;
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
    easyMDE.codemirror.options.readOnly = "nocursor";

    const eltCursorDiv = easyMDE.codemirror.display.cursorDiv;
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

    // if (!newWay) { return { easyMDE }; }
    const btnEdit = addEditMDEbutton(divEasyMdeOuterWrapper, easyMDE);


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

    return { easyMDE, btnEdit };
}

function addEditMDEbutton(container, easyMDE) {
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
        const eltToolbar = container.querySelector("div.editor-toolbar");
        eltToolbar.style.display = "";
        eltToolbar.scrollIntoView();
        easyMDE.codemirror.options.readOnly = false;
        const divInert = container.querySelector("div[inert]");
        // Might already be removed
        divInert?.removeAttribute("inert");
        easyMDE.togglePreview();
        // https://stackoverflow.com/questions/8349571/codemirror-editor-is-not-loading-content-until-clicked
        easyMDE.codemirror.refresh();
        const cud = easyMDE.codemirror.display.cursorDiv;
        const cont = cud.closest("div.EasyMDEContainer");
        // contenteditable on mobile, textarea on desktop
        const editable = cont.querySelector("div[contenteditable]")
        const ta = cont.querySelector("textarea");
        const eltFocus = editable || ta;
        window["MYeltFocusNotes"] = eltFocus;
        easyMDE.codemirror.options.readOnly = false;
        setTimeout(() => { eltFocus.focus(); }, 1000);
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
function getAlfaAtCursor(cm) {
    const reAlfaBefore = /\[@(.+?)\]\((.+?)\)/g;
    const cursor = cm.getCursor();
    const lineCursor = cm.getLine(cursor.line);
    const posCursor = cursor.ch;
    const m = reAlfaBefore.exec(lineCursor);
    if (!m) return;
    const posAlfa = lineCursor.search(reAlfaBefore);
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