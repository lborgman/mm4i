/**
 * Builds a portable copy of this page that loads everything from the original location.
 * @param {string} [baseUrl] Directory URL the page is hosted at. Defaults to this page's directory.
 * @returns {Promise<string>}
 */
export async function buildPortableHtml(baseUrl = new URL(".", location.href).href) {
    const res = await fetch(location.href);
    if (!res.ok) throw new Error(`Failed to fetch page source: HTTP ${res.status}`);

    const doc = new DOMParser().parseFromString(await res.text(), "text/html");

    doc.querySelectorAll("base").forEach((b) => b.remove());
    const base = doc.createElement("base");
    base.href = baseUrl;
    doc.head.prepend(base);

    doc.querySelectorAll('link[rel="manifest"]').forEach((b) =>{
        console.log("Removed manifest");
        b.remove();
    });
    debugger;

    const head = doc.querySelector("head");
    if (!head) {
        debugger;
        throw Error("Did not find <head>");
    }
    const scriptTellPortable = mkElt("script", undefined, "var thisIsPortableHtml = true");
    head.prepend(scriptTellPortable);

    return "<!doctype html>\n" + doc.documentElement.outerHTML;
}

/**
 * @param {string} [filename]
 */
export async function downloadPortableHtml(filename = "portable.html") {
    const html = await buildPortableHtml();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}