// @ts-check
const DONATE_VER = "0.0.1";

// @ts-ignore
window["logConsoleHereIs"](`here is donate.js, module, ${DONATE_VER}`);
if (document.currentScript) { throw "donate.js is not loaded as module"; }

export async function dialogDonate() {
    // debugger;
    const modDonate = await import('https://cdn.jsdelivr.net/gh/lborgman/responsiveGDoc@main/js/mod/support-us.js');
    modDonate.popupSupport();
}