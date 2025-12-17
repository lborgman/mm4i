// api/proxy.js

/*
export default async function handler(req, res) {
    try {
        // Preflight
        if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "*");
            res.setHeader("Access-Control-Allow-Headers", "*");
            return res.status(204).end();
        }
    } catch (err) {
        console.error(`Preflight, OPTIONS: ${err.message}`);
        res.status(502).json({ error: "Preflight, OPTIONS", details: err.message });
    }

    const url = req.query.url ?? req.url.split("?url=")[1];
    if (!url) return res.status(400).json({ error: "Missing ?url= parameter" });

    const requestHeaders = new Headers(req.headers);

    //// Problem with
    // https://mm4i.vercel.app/api/proxy?url=https%3A%2F%2Fwww.cell.com%2Fheliyon%2Ffulltext%2FS2405-8440(23)10711-0
    // Grok did not fix it, Gemini suggested this fix:

    // Remove headers that might cause the target server to block the request.
    // **Origin is the most critical one to strip for proxying.**
    requestHeaders.delete('origin');
    requestHeaders.delete('referer');
    requestHeaders.delete('host'); // Should be implicitly set by fetch, removing it prevents issues.
    // Optional: Set a common User-Agent to look less like a generic script.
    requestHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

    try {
        const target = new URL(url);
        const response = await fetch(target, {
            method: req.method,
            // headers: req.headers,
            headers: requestHeaders,
            body: ["GET", "HEAD"].includes(req.method) ? null : req.body,
            redirect: "follow",
        });

        // Copy all headers from target (except hop-by-hop)
        for (const [key, value] of response.headers.entries()) {
            if (!["transfer-encoding", "connection", "content-encoding"].includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Expose-Headers", "*");

        res.status(response.status);
        return res.send(response.body ? Buffer.from(await response.arrayBuffer()) : null);
    } catch (err) {
        console.error(`502: Bad gateway: ${err.message}`);
        res.status(502).json({ error: "Bad gateway", details: err.message });
    }
}
*/

/*
// New version from Gemini 2025-12-08 22:29
// api/proxy.js - V3: Aggressive Header Cleanup
export default async function handler(req, res) {
    // ... (CORS Preflight remains the same)
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "*");
            res.setHeader("Access-Control-Allow-Headers", "*");
            return res.status(204).end();
        }
    } catch (err) {
        console.error(`Preflight, OPTIONS: ${err.message}`);
        res.status(502).json({ error: "Preflight, OPTIONS", details: err.message });
    }
    // ---------------------------------

    const url = req.query.url ?? req.url.split("?url=")[1];
    if (!url) return res.status(400).json({ error: "Missing ?url= parameter" });

    try {
        const target = new URL(url);

        // --- NEW: Aggressive Header Sanitization ---
        const requestHeaders = new Headers();
        
        // 1. Define Whitelisted Headers: Only include essential or non-identifying headers
        const allowedHeaders = [
            'accept', 
            'accept-encoding', 
            'accept-language',
            'content-type', // Needed for POST/PUT requests
            'authorization', // Needed if the client is passing a token
        ];

        // 2. Populate the new Headers object
        for (const [key, value] of Object.entries(req.headers)) {
            if (allowedHeaders.includes(key.toLowerCase())) {
                requestHeaders.set(key, value);
            }
        }
        
        // 3. Explicitly Set/Override Key Headers
        // Critical: Set a standard User-Agent to mimic a browser/crawler
        requestHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

        // Critical: Ensure no Origin, Referer, or Host headers are passed
        requestHeaders.delete('origin'); 
        requestHeaders.delete('referer');
        requestHeaders.delete('host');
        requestHeaders.delete('x-forwarded-for');
        // Vercel/Node.js sometimes adds 'sec-fetch-...' headers, strip those too
        requestHeaders.delete('sec-fetch-site');
        requestHeaders.delete('sec-fetch-mode');
        requestHeaders.delete('sec-fetch-user');
        requestHeaders.delete('sec-fetch-dest');

        // Handle Body and Content-Length for GET/HEAD
        let requestBody = null;
        if (!["GET", "HEAD"].includes(req.method)) {
            requestBody = req.body;
        } else {
            // Ensure no Content-Length is sent on GET/HEAD requests
            requestHeaders.delete('content-length');
        }
        // -----------------------------------------------------------------

        const response = await fetch(target, {
            method: req.method,
            headers: requestHeaders,
            body: requestBody,
            redirect: "follow",
        });

        // Copy all headers from target (except hop-by-hop)
        for (const [key, value] of response.headers.entries()) {
            if (!["transfer-encoding", "connection", "content-encoding"].includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Expose-Headers", "*");

        res.status(response.status);
        return res.send(response.body ? Buffer.from(await response.arrayBuffer()) : null);
    } catch (err) {
        console.error(`502: Bad gateway: ${err.message}`);
        res.status(502).json({ error: "Bad gateway", details: err.message });
    }
}
*/

// New version from Gemini 2025-12-08 22:38
// api/proxy.js - V4: Targeted Header Deletion
export default async function handler(req, res) {
    // ... (CORS Preflight remains the same)
    try {
        if (req.method === "OPTIONS") {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Methods", "*");
            res.setHeader("Access-Control-Allow-Headers", "*");
            return res.status(204).end();
        }
    } catch (err) {
        console.error(`Preflight, OPTIONS: ${err.message}`);
        res.status(502).json({ error: "Preflight, OPTIONS", details: err.message });
    }
    // ---------------------------------

    const url = req.query.url ?? req.url.split("?url=")[1];
    console.log("---url", url);
    if (!url) return res.status(400).json({ error: "Missing ?url= parameter" });

    try {
        const target = new URL(url);

        // --- Clean Headers: Use incoming headers, then delete problematic ones ---
        const requestHeaders = new Headers(req.headers);

        // 1. Critical: Remove headers that identify the proxy origin
        requestHeaders.delete('origin');
        requestHeaders.delete('referer');
        requestHeaders.delete('host');
        requestHeaders.delete('x-forwarded-for');

        // 2. Set/Override a standard User-Agent
        requestHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

        // 3. Remove Content-Length for GET/HEAD
        let requestBody = null;
        if (["GET", "HEAD"].includes(req.method)) {
            requestHeaders.delete('content-length');
        } else {
            requestBody = req.body;
        }
        // -----------------------------------------------------------------

        const response = await fetch(target, {
            method: req.method,
            headers: requestHeaders,
            body: requestBody,
            // Keep "follow" to handle redirects seamlessly
            redirect: "follow",
        });

        // ... (Header copying and response logic remains the same)

        // Copy all headers from target (except hop-by-hop)
        for (const [key, value] of response.headers.entries()) {
            if (!["transfer-encoding", "connection", "content-encoding"].includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Expose-Headers", "*");

        console.log("response.status", response.status);
        res.status(response.status);
        // Important: Log the final status and URL to debug the 404
        if (response.status === 404) {
            console.error(`404: Final URL after redirects: ${response.url}`);
        }

        return res.send(response.body ? Buffer.from(await response.arrayBuffer()) : null);
    } catch (err) {
        console.error(`502: Bad gateway: ${err.message}`);
        res.status(502).json({ error: "Bad gateway", details: err.message });
    }
}