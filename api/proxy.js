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

    try {
        const target = new URL(url);
        const response = await fetch(target, {
            method: req.method,
            headers: req.headers,
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