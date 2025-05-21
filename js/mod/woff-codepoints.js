// @ts-check
debugger;
const MM4I_IMPORTMAPS_VER = "0.2.6";
window["logConsoleHereIs"](`here is mm4i-importmaps ${MM4I_IMPORTMAPS_VER}`);
console.warn(`here is mm4i-importmaps ${MM4I_IMPORTMAPS_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

export function getCodepoints(woffUrl) {
    return fontkitGetCodepoints(woffUrl);
}

async function fontkitGetCodepoints(woffUrl) {
    // if (!navigator.onLine) { return; }
    let response;
    try {
        response = await fetch(woffUrl);
    } catch (err) {
        console.error(woffUrl, err);
        debugger;
    }
    if (!response.ok) {
        if (response.status == 404) return;
        debugger;
    }
    const arrayBuffer = await response.arrayBuffer();

    const fontkitUrl = "https://esm.sh/fontkit";
    const modFontkit = await (async () => {
        try {
            return await import(fontkitUrl);
        } catch (err) {
            console.error(err);
            throw Error(`Could not get fontkit: ${fontkitUrl}`);
        }
    })();

    const font = modFontkit.create(new Uint8Array(arrayBuffer));
    // console.log({ font });
    const codepoints = font.characterSet; // Array of codepoints (numbers)
    // console.log({ codepoints });
    return codepoints;
}
