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
    const modEasyMDE = await importFc4i("easymde");
    // console.log({ modEasyMDE }); // EasyMDE is defined in global scope!
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
    // const code = cont.querySelector("div.CodeMirror-code");
    // console.log("cud", cud, "\ncont", cont, "\ncode", code, code.isConnected);
    await modTools.wait4mutations(cont);

    const code2 = cont.querySelector("div.CodeMirror-code");
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

    // if (!newWay) { return { easyMDE }; }
    const btnEdit = addEditMyNotesButton(divEasyMdeOuterWrapper, easyMDE);


    async function waitForConnected(elt, msMaxWait) {
        if (elt.isConnected) {
            console.log(`waitForConnected, was already connected`);
            return;
        }
        // .isConnected is cheap, so check in short intervals
        const msStartWait = Date.now();
        return new Promise((resolve, reject) => {
            const intervalId = setInterval(() => {
                const msElapsed = Date.now() - msStartWait;
                if (elt.isConnected) {
                    console.log(`waitForConnected, connected after ${msElapsed} ms`);
                    clearInterval(intervalId);
                    console.log
                    resolve(true);
                }
                if (msElapsed > msMaxWait) {
                    clearInterval(intervalId);
                    const msg = `waitForConnected: not connected after ${msMaxWait}ms`;
                    console.error(msg, elt);
                    throw Error(msg);
                }
            }, 100);
        });
    }
    // To be able to click the links in the rendered document we must remove "inert".
    // However if we do that directly the virtual keyboard will popup on an Android mobile.
    // So we must first focus on an element outside of easyMDE.

    // setTimeout(async () => {
    // if (!btnEdit.isConnected) { throw Error("btnEdit is not yet connected to the document"); }
    (async function () {
        await waitForConnected(btnEdit, 800);
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
    return;
    await saveOrigMarkdown();
    const EasyMDE = window["EasyMDE"];

    function markHejRed(txt) {
        const newTxt = txt.replaceAll(/hej/g, `<span style="color:red;">HEJ</span>`);
        return newTxt;
    }
    const reAlfa = /<a href="(.*?)"(.*?)>@(.*?)<\/a>/g;
    function markAlfa(txt) {
        const newTxt = txt.replaceAll(reAlfa, `<a href="$1" class="cm-alfa-link" $2>$3</a>`);
        return newTxt;
    }
    function markMore(txt) {
        let newTxt = markHejRed(txt);
        newTxt = markAlfa(newTxt);
        return newTxt;
    }
    // modifyEasyMDEmarkdown(markHejRed);
    modifyEasyMDEmarkdown(markMore);
    console.log("++++ added HEJ");
    function modifyEasyMDEmarkdown(funMore) {
        EasyMDE.prototype.markdown = function (txt) {
            // txt = origEasyMDEmarkdown(txt);
            txt = origEasyMDEmarkdown.call(easyMDE, txt);
            return funMore(txt);
        }
    }
}