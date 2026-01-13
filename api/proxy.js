export default async function handler(req, res) {
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

    let url = req.query.url ?? req.url.split("?url=")[1];
    const serpKey = req.query.serpKey; // Check for serpKey parameter

    console.log("---url", url);
    console.log("---serpKey present:", !!serpKey);

    if (!url) return res.status(400).json({ error: "Missing ?url= parameter" });

    try {
        let target;
        const requestHeaders = new Headers(req.headers);

        // *** IF serpKey IS PROVIDED, ROUTE THROUGH SCRAPEUNBLOCKER ***
        if (serpKey) {
            console.log("🔄 Routing through ScrapeUnblocker");

            // Build ScrapeUnblocker URL with original URL as parameter
            const serpParams = new URLSearchParams({ url: url });
            target = new URL(`https://api.scrapeunblocker.com/getPageSource?${serpParams.toString()}`);

            // Add ScrapeUnblocker headers
            requestHeaders.set('x-scrapeunblocker-key', serpKey);
            requestHeaders.set('Accept-Encoding', 'gzip, deflate');
            console.log("✅ Added ScrapeUnblocker API key");
        } else {
            // Normal proxy behavior - fetch URL directly
            target = new URL(url);
        }

        // Remove problematic headers
        requestHeaders.delete('origin');
        requestHeaders.delete('referer');
        requestHeaders.delete('host');
        requestHeaders.delete('x-forwarded-for');

        requestHeaders.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36');

        let requestBody = null;
        if (["GET", "HEAD"].includes(req.method)) {
            requestHeaders.delete('content-length');
        } else {
            requestBody = req.body;
        }

        console.log("=== OUTGOING HEADERS ===");
        for (const [key, value] of requestHeaders.entries()) {
            if (key === 'x-scrapeunblocker-key') {
                console.log(`  ${key}: ${value.slice(0, 4)}***`);
            } else {
                console.log(`  ${key}: ${value}`);
            }
        }
        console.log("========================");

        const response = await fetch(target, {
            method: serpKey ? 'POST' : req.method, // ScrapeUnblocker requires POST
            headers: requestHeaders,
            body: requestBody,
            redirect: "follow",
        });

        for (const [key, value] of response.headers.entries()) {
            if (!["transfer-encoding", "connection", "content-encoding"].includes(key.toLowerCase())) {
                res.setHeader(key, value);
            }
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Expose-Headers", "*");

        console.log("response.status", response.status);
        res.status(response.status);

        return res.send(response.body ? Buffer.from(await response.arrayBuffer()) : null);
    } catch (err) {
        console.error(`502: Bad gateway: ${err.message}`);
        res.status(502).json({ error: "Bad gateway", details: err.message });
    }
}