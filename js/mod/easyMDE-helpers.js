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
 * @returns 
 */
export async function setupEasyMDEview(taOrDiv, valueInitial, valuePlaceholder) {
    // let newWay = false;
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
    const easyMDE = new EasyMDE({
        element: taEasyMde,
        status: false,
    });
    window["MYeasyMDE"] = easyMDE;
    const modEasyMDEhelpers = await importFc4i("easyMDE-helpers");
    await modEasyMDEhelpers.addAlfa(easyMDE);



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
            .cm-alfa-link {
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
    /*
    const eltPreview = eltMDEContainer.querySelector("div.editor-preview");
    eltPreview.addEventListener("click", evt => {
        const target = evt.target;
        if (target.tagName != "SPAN") return;
        if (!target.classList.contains("cm-alfa-link-before")) return;
        console.log("clicked alfa-link", target);
    });
    */

    // console.log("cud", cud, "\ncont", cont, "\ncode", code, code.isConnected);
    await modTools.wait4mutations(cont);

    // const code2 = cont.querySelector("div.CodeMirror-code");
    const editable = cont.querySelector("div[contenteditable]")
    const ta = cont.querySelector("textarea");
    const editor = editable || ta;
    window["MYeditor"] = editor;
    /*
    console.log(
        "\ncode2", code2, code2.isConnected,
        "\neditable", editable,
        "\nta", ta,
        "\neditor", editor,
        editor?.isConnected, document.activeElement);
    */
    easyMDE.codemirror.options.readOnly = "nocursor";

    // FIX-ME: move
    /*
    function setMDEpreviewColor() {
        const eltPreview = eltMDEContainer.querySelector("div.editor-preview");
        console.log({ eltPreview });
        const eltDialogSurface = taOrDiv.closest("div.mdc-dialog__surface");
        const styleSurface = getComputedStyle(eltDialogSurface);
        eltPreview.style.backgroundColor = styleSurface.backgroundColor;
    }
    */

    // setTimeout(() => { setMDEpreviewColor(); }, 110);

    const eltCursorDiv = easyMDE.codemirror.display.cursorDiv;
    const eltMDEContainer = eltCursorDiv.closest("div.EasyMDEContainer");

    const eltToolbar = eltMDEContainer.querySelector("div.editor-toolbar");
    eltToolbar.style.display = "none";

    const eltPreview = eltMDEContainer.querySelector("div.editor-preview");
    eltPreview.addEventListener("click", async evt => {
        const target = evt.target;
        if (target.tagName != "SPAN") return;
        if (!target.classList.contains("cm-alfa-before")) return;
        const valAlfa = target.dataset.alfaLink;
        console.log("clicked alfa-link:", { valAlfa }, target);
        searchNodeParams.eltJsMindContainer.classList.add("display-jsmind-search");

        searchNodeParams.inpSearch.value = valAlfa;
        const resSearch = searchNodeParams.searchNodeFun(valAlfa);
        console.log({ resSearch });
        const nHits = resSearch.length;
        const msg = `matches: ${nHits}, see mindmap`;

        const divSearch = searchNodeParams.inpSearch.parentElement;
        const st = getComputedStyle(divSearch);

        const eltSnackbar = modMdc.mkMDCsnackbar(msg, 10 * 1000);
        const surfaceSnackbar = eltSnackbar.firstElementChild;
        surfaceSnackbar.style.backgroundColor = st.backgroundColor;
        surfaceSnackbar.style.color = st.color;
    });

    // if (!newWay) { return { easyMDE }; }
    const btnEdit = addEditMyNotesButton(divEasyMdeOuterWrapper, easyMDE);


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

function addEditMyNotesButton(container, easyMDE) {
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
export async function addAlfa(easyMDE) {
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
    const reAlfaBefore = /\[(@.+)\]\((.+)\)/g;
    function markAlfaBefore(txt) {
        // const newTxt = txt.replaceAll(reAlfaBefore, `<a href="$2" class="cm-alfa-before">$1</a>`);
        const newTxt = txt.replaceAll(reAlfaBefore, `<span data-alfa-link="$2" class="cm-alfa-before" title="Lookup '$2'">$1</a>`);
        return newTxt;
    }
    const reAlfaAfter = /<a href="(.*?)"(.*?)>@(.*?)<\/a>/g;
    function markAlfaAfter(txt) {
        // return txt;
        // const newTxt = txt.replaceAll(reAlfaAfter, `<a href="$1" class="cm-alfa-link" $2>$3</a>`);
        const newTxt = txt.replaceAll(reAlfaAfter, `<span data-alfa-link="$1" class="cm-alfa-link" $2>$3</span>`);
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