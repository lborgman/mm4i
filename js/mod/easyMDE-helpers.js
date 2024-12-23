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

/**
 * 
 * @param {HTMLDivElement} taOrDiv 
 * @param {string} valueInitial 
 * @param {string} valuePlaceholder 
 * @returns 
 */
export async function setupEasyMDEview(taOrDiv, valueInitial, valuePlaceholder) {
    let newWay = false;
    let taEasyMde;
    let divEasyMdeInert;
    let divEasyMdeOuterWrapper;
    if (taOrDiv.tagName == "TEXTAREA") {
        throw Error(`taOrDiv should be DIV: ${taOrDiv.tagName}`);
        taEasyMde = taOrDiv;
        window["MYtaNotes"] = taOrDiv;
    } else {
        newWay = true;
        // debugger;
        taEasyMde = mkElt("textarea");
        if (valuePlaceholder) { taEasyMde.setAttribute("placeholder", valuePlaceholder); }
        divEasyMdeInert = mkElt("div", undefined, taEasyMde);
        // divEasyMdeOuterWrapper = mkElt("div", undefined, divEasyMdeInert);
        divEasyMdeOuterWrapper = taOrDiv;
        divEasyMdeOuterWrapper.appendChild(divEasyMdeInert);
        // throw Error("new way is not ready");
    }
    const modEasyMDE = await importFc4i("easymde");
    console.log({ modEasyMDE }); // EasyMDE is defined in global scope!
    const easyMDE = new EasyMDE({
        element: taEasyMde,
        status: false,
    });
    window["MYeasyMDE"] = easyMDE;

    easyMDE.codemirror.options.readOnly = "nocursor";
    easyMDE.value(valueInitial);
    if (easyMDE.isPreviewActive()) throw Error("easyMDE.isPreviewActive()");
    easyMDE.togglePreview();

    if (newWay) {
        divEasyMdeInert.setAttribute("inert", "");
    }

    const cud = easyMDE.codemirror.display.cursorDiv;
    const cont = cud.closest("div.EasyMDEContainer");
    const code = cont.querySelector("div.CodeMirror-code");
    console.log("cud", cud, "\ncont", cont, "\ncode", code, code.isConnected);
    await modTools.wait4mutations(cont);

    const code2 = cont.querySelector("div.CodeMirror-code");
    const editable = cont.querySelector("div[contenteditable]")
    const ta = cont.querySelector("textarea");
    const editor = editable || ta;
    window["MYeditor"] = editor;
    console.log(
        "\ncode2", code2, code2.isConnected,
        "\neditable", editable,
        "\nta", ta,
        "\neditor", editor,
        editor?.isConnected, document.activeElement);
    easyMDE.codemirror.options.readOnly = "nocursor";
    // debugger;

    // FIX-ME: move
    function setMDEpreviewColor() {
        const eltPreview = eltMDEContainer.querySelector("div.editor-preview");
        console.log({ eltPreview });
        const eltDialogSurface = taOrDiv.closest("div.mdc-dialog__surface");
        const styleSurface = getComputedStyle(eltDialogSurface);
        eltPreview.style.backgroundColor = styleSurface.backgroundColor;
    }

    // setTimeout(() => { setMDEpreviewColor(); }, 110);

    const eltCursorDiv = easyMDE.codemirror.display.cursorDiv;
    const eltMDEContainer = eltCursorDiv.closest("div.EasyMDEContainer");

    const eltToolbar = eltMDEContainer.querySelector("div.editor-toolbar");
    eltToolbar.style.display = "none";

    if (!newWay) { return { easyMDE }; }
    const btnEdit = addEditMyNotesButton(divEasyMdeOuterWrapper, easyMDE);
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
        // divInert.toggleAttribute("inert");
        divInert.removeAttribute("inert");
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
