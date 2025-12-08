// api/proxy.js - initially from Grok 2025-11-25
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