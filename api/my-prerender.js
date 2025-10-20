// @ts-check

export const config = {
    runtime: "edge", // make it an Edge Function in Vercel for lower latency
};

export async function GET(request) {
    console.warn("starting prerende.js GET", request.url);
    const mkErrResponse = (msg) => {
        console.error(`prerender GET: ${msg}`);
        return new Response(`Error prerender GET: ${msg}`, { status: 500 });
    }
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (pathname != "/" && !pathname.endsWith("/mm4i.html")) {
        return new Response(`pathname == "${pathname}"`, { status: 403 });
    }

    const origin = url.origin;  // base URL like https://your-domain.vercel.app
    const templateResponse = await fetch(`${origin}/mm4i-template.html`);
    if (!templateResponse.ok) {
        return mkErrResponse('Failed to load static template');
    }


    ////// (Logic to optionally proxy bots or just return static HTML here)

    const htmlTemplate = await templateResponse.text();

    const sp = new URLSearchParams(url.href);
    const title = sp.get("title");
    const text = sp.get("text");
    let htmlResponse = htmlTemplate;
    if (title || text) {
        const escapeHtmlAttr = (str) => {
            return str
                .replace(/&/g, '&amp;')   // Must be first
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')    // Optional but safe
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');  // Use numeric for broader compatibility
        }

        const arrTemplate = htmlTemplate.split("<!-- OGDYN -->");
        if (arrTemplate.length != 3) {
            return mkErrResponse(`Expected 3 parts, but got ${arrTemplate.length}`);
        }
        let strDyn = "";
        if (title) {
            strDyn += "\n";
            strDyn += `<meta property="og:title" content="${escapeHtmlAttr(title)}">`;
            strDyn += "\n";
        }
        if (text) {
            strDyn += "\n";
            strDyn += `<meta property="og:description" content="${escapeHtmlAttr(text)}">`;
            strDyn += "\n";
        }
        arrTemplate[1] = strDyn;
        htmlResponse = arrTemplate.join("\n<!-- NEW OGDYN -->\n");
    }


    return new Response(htmlResponse, {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
    });

}

// Grok: Add this EXACT line at the BOTTOM:
export default { GET };