// @ts-check
const STAIRS_VER = "0.0.1";
window["logConsoleHereIs"](`here is stairs.js, module, ${STAIRS_VER}`);
if (document.currentScript) { throw "stairs.js is not loaded as module"; }

const mkElt = window["mkElt"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];

const modMdc = await importFc4i("util-mdc");

export function startStairs() {
    debugger;
    const divNotReady = mkElt("p", undefined, "Not ready!");
    divNotReady.style = `
        background: red;
        padding: 10px;
        color: yellow;
    `;
    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Stairs"),
        divNotReady,
    ]);
    modMdc.mkMDCdialogAlert(body, "Close");
}