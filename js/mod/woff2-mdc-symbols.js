// @ts-check
// debugger;
const WOFF2_MDC_SYMBOLS_VER = "0.0.1";
window["logConsoleHereIs"](`here is woff2-mdc-symbols.js ${WOFF2_MDC_SYMBOLS_VER}`);
console.warn(`here is woff2-mdc-symbols.js ${WOFF2_MDC_SYMBOLS_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

export async function fetchGoogleSymbolNameMap(url) {
    // const url = await mkSymbol2codepointUrl();
    console.log("fetchGoogleSymbolNameMap", url);
    // const response = await fetch(symbol2codepointUrl);
    let response;
    try {
        response = await fetch(url);
    } catch (err) {
        console.log(err);
        debugger;
    }
    if (!response.ok) {
        if (response.status == 404 && response.type == "cors") {
            // Looks like Github has blocked access to raw files in may 2025
            debugger;
            throw "Can't fetch codepoint mapping file from Github";
        }
        debugger;
    }
    // return undefined;
    const text = await response.text();
    const codepointToName = {};
    text.split('\n').forEach(line => {
        const [name, hex] = line.trim().split(/\s+/);
        if (name && hex) {
            const int = parseInt(hex, 16);
            // codepointToName[parseInt(hex, 16)] = name;
            codepointToName[int] = name;
            if (line.startsWith("edit ")) { console.log("EDIT: ", line, name, hex, int); }
        }
    });
    return codepointToName;
}
