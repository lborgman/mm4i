// @ts-check
// debugger;
const WOFF2_MDC_SYMBOLS_VER = "0.0.1";
// @ts-ignore
window["logConsoleHereIs"](`here is woff2-mdc-symbols.js ${WOFF2_MDC_SYMBOLS_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

/**
 * 
 * @param {string} mdcIconStyle 
 * @returns {Promise<Object>}
 */
export async function fetchGoogleSymbolNameMap(mdcIconStyle) {
    console.warn("fetchGoogleSymbolNameMap", mdcIconStyle);
    const url = mkSymbol2codepointUrl(mdcIconStyle);
    let response;
    try {
        response = await fetch(url);
    } catch (err) {
        console.log(err);
        debugger; // eslint-disable-line no-debugger
        throw Error(err);
    }
    if (!response.ok) {
        if (response.status == 404 && response.type == "cors") {
            // Looks like Github has blocked access to raw files in may 2025
            debugger; // eslint-disable-line no-debugger
            throw "Can't fetch codepoint mapping file from Github";
        }
        debugger; // eslint-disable-line no-debugger
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
            // if (line.startsWith("edit ")) { console.log("EDIT: ", line, name, hex, int); }
        }
    });
    return codepointToName;
}

// const symbol2codepointUrl = "https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsOutlined%5BFILL,GRAD,opsz,wght%5D.codepoints";
/**
 * Make url to Google MDC codepoint to symbol map
 *  
 * @param {string} mdcIconStyle 
 * @returns {string}
 */
function mkSymbol2codepointUrl(mdcIconStyle) {
    // From perplexity.ai
    // https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsOutlined%5BFILL,GRAD,opsz,wght%5D.codepoints";
    // https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsRounded%5BFILL,GRAD,opsz,wght%5D.codepoints";
    // https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbolsSharp%5BFILL,GRAD,opsz,wght%5D.codepoints";

    //// Github CORS blocked raw files in may 2025
    // return `https://raw.githubusercontent.com/google/material-design-icons/master/variablefont/MaterialSymbols${mdcIconStyle}%5BFILL,GRAD,opsz,wght%5D.codepoints";`;
    return `./ext/mdc-fonts/MaterialSymbols${mdcIconStyle}Codepoints.txt`;
}
