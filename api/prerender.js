////// This is for Vercel, initial code is from perplexity.ai
// @ts-check

// /api/prerender.js — Vercel Edge Function to proxy requests to Prerender.io
export const config = {
    runtime: "edge", // make it an Edge Function for lower latency
};



export async function GET(request) {
    console.log("starting prerende.js GET");
    const PRERENDER_TOKEN = process.env.PRERENDER_TOKEN;
    if (!PRERENDER_TOKEN) {
        console.error("Prerender token not configured");
        return new Response("Prerender token not configured", { status: 500 });
    }

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
            status: 500,
            headers: { 'Content-Type': 'text/html' },
        });

        return new Response("Not a crawler", { status: 403 });
    }

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
}
