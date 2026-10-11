/**
 * Builds a portable copy of this page that loads everything from the original location.
 * @param {string} [baseUrl] Directory URL the page is hosted at. Defaults to this page's directory.
 * @returns {Promise<string>}
 */
export async function buildPortableHtml(baseUrl = new URL(".", location.href).href) {
    console.log({ baseUrl });
    const res = await fetch(location.href);
    if (!res.ok) throw new Error(`Failed to fetch page source: HTTP ${res.status}`);

    const doc = new DOMParser().parseFromString(await res.text(), "text/html");

    doc.querySelectorAll("base").forEach((b) => b.remove());
    const base = doc.createElement("base");
    base.href = baseUrl;
    doc.head.prepend(base);

    doc.querySelectorAll('link[rel="manifest"]').forEach((b) => {
        console.log("Removed manifest");
        b.remove();
    });
    // debugger;

    const head = doc.querySelector("head");
    if (!head) {
        debugger;
        throw Error("Did not find <head>");
    }
    const scriptTellPortable = mkElt("script", undefined, "var thisIsPortableHtml = true");
    head.prepend(scriptTellPortable);

    const nodes = jsMind.current.mind.nodes;
    console.log({ nodes });

    const modMMhelpers = await importFc4i("mindmap-helpers");
    const jmDisplayed = await modMMhelpers.getJmDisplayed();
    console.log({ jmDisplayed });

    const mindMapData = jmDisplayed.get_data("node_array");
    console.log({ mindMapData });

    debugger;
    const strMindmap = JSON.stringify(mindMapData, undefined, 4);
    // const j = JSON.parse(strMindmap);
    // j.key = "dummy key";
    // modMMhelpers.checkIsMMformatStored(j, "buildPortableHtml");
    // const modJsEditCommon = await importFc4i("jsmind-edit-common");
    // const jm = await modJsEditCommon.displayOurMindmap(j);
    // console.log({ jm });

    // function removeControlCharsForJson(str) { return str.replace(/[\u0000-\u001F\u007F]/g, ""); }

    // let nWait = 0;
    // displayIt();
    async function wait4jsMind() {
        if (!window.jsMind) {
            if (++nWait > 50) {
                alert("network problem");
                return;
            }
            requestAnimationFrame(wait4jsMind);
            return;
        }
        modMMhelpers.checkIsMMformatStored(j, 'portableHtml');
        const jm = await modJsEditCommon.displayOurMindmap(j);
    }
    debugger;

    // const modMMhelpers = importFc4i("mindmap-helpers");
    const js = [
        "debugger;\n",
        "const str = `",
        strMindmap,
        "`;\n",
        "console.log({str});\n",
        "const str4json = str.replace(/[\\u0000-\\u001F\u007F]/g, '');\n",
        "const j = JSON.parse(str4json);\n",
        "j.key = 'portable-map';\n",
        "await importFc4i('jsmind-mm4i');\n",
        "const modMMhelpers = await importFc4i('mindmap-helpers');\n",
        "const modJsEditCommon = await importFc4i('jsmind-edit-common');\n",
        "let nWait = 0;\n",
        "await wait4jsMind();\n",
        "modMMhelpers.checkIsMMformatStored(j, 'portableHtml');\n",
        "const jm = await modJsEditCommon.displayOurMindmap(j);\n",
        wait4jsMind.toString(),
    ].join("");

    const scriptMakeMap = mkElt("script", { id: "script-make-map", type: "module" }, js);
    doc.documentElement.append(scriptMakeMap);

    doc.documentElement.classList.add("portable-map");

    return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

/**
 * @param {string} [filename]
 */
export async function downloadPortableHtml(filename = "portable.html") {
    // debugger;
    const modMMhelpers = await importFc4i("mindmap-helpers");
    const ourHref = modMMhelpers.isLocalhost() ? "https://lborgman.github.io/mm4i/" : location.href;
    const ourBaseUrl = new URL(".", ourHref).href;
    const html = await buildPortableHtml(ourBaseUrl);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}