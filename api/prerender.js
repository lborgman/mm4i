////// This is for Vercel, initial code is from perplexity.ai
// @ts-check

/*
    /api/prerender.js — Vercel Edge Function,
    initially to proxy requests to Prerender.io
    However prerender.io is not used any more!
*/
export const config = {
    runtime: "edge", // make it an Edge Function for lower latency
};



export async function GET(request) {
    console.log("starting prerende.js GET", request.url);
    const mkErrResponse = (msg) => {
        console.error(`prerender GET: ${msg}`);
        return new Response(`Error prerender GET: ${msg}`, { status: 500 });
    }
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (!pathname.endsWith("/mm4i.html")) {
        return new Response("Not mm4i.html", { status: 403 });
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

    // Get user-agent and requested URL
    const userAgent = request.headers.get("user-agent") || "";
    console.log("userAgent", userAgent);
    const urlRequest = new URL(request.url);

    // Detect if user agent is a bot / crawler (basic check)
    const isBot = /bot|crawler|facebook|spider|robot|crawling/i.test(userAgent);
    // const isBot = true;
    if (!isBot) {
        const tempUaErr = `TEMP error ua detection: "${userAgent}"`;
        console.error(tempUaErr);
        // return new Response(tempUaErr, { status: 500 });
        // Return error response for the user:
        return new Response(`<h1>temp error for ua detection</h1><p>ua: "${userAgent}"</p>`, {
            status: 200,
            headers: { 'Content-Type': 'text/html' },
        });

        return new Response("Not a crawler", { status: 403 });
    }

    /*
    // Extract the target URL to prerender: expect ?url=original-site-url
    // If not provided, fallback to homepage (adjust as needed)
    const targetUrl = urlRequest.searchParams.get("url");
    console.log("targetUrl", targetUrl);
    if (!targetUrl) {
        return new Response("Missing url parameter", { status: 400 });
    }

    const urlTarget = new URL(targetUrl);
    if (urlTarget.pathname.endsWith("mm4i.html")) {
        urlTarget.pathname = urlTarget.pathname.slice(0, -5) + "-prerender.html";
    }

    // Construct prerender.io service request URL
    const prerenderUrl = `https://service.prerender.io/${urlTarget.href}&uacf=${encodeURI(userAgent)}`;
    console.log("prerenderUrl", prerenderUrl);


    try {
        // Call prerender.io API with the token header
        const prerenderRes = await fetch(prerenderUrl, {
            headers: {
                // @ts-ignore
                "X-Prerender-Token": PRERENDER_TOKEN,
            },
        });

        // Return prerendered content back with status and headers from prerender.io
        const body = await prerenderRes.arrayBuffer();
        const responseHeaders = new Headers(prerenderRes.headers);

        // Optionally override cache-control
        responseHeaders.set("Cache-Control", "no-cache");

        return new Response(body, {
            status: prerenderRes.status,
            statusText: prerenderRes.statusText,
            headers: responseHeaders,
        });
    } catch (err) {
        console.error("Error fetching prerender page", err);
        return new Response("Error fetching prerendered page", { status: 500 });
    }
    */
}
