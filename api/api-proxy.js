const AI_API_KEYS = {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    // add more as needed
};

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

async function validateJWT(token) {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(SUPABASE_JWT_SECRET);
    const key = await crypto.subtle.importKey(
        "raw", keyData,
        { name: "HMAC", hash: header.alg === "HS256" ? "SHA-256" : "SHA-512" },
        false, ["verify"]
    );

    const data = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signature = Uint8Array.from(atob(parts[2].replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));

    const valid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!valid) return null;

    return payload;
}

export default async function handler(req) {
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    // Validate JWT
    const authHeader = req.headers.get("authorization") ?? "";
    const token = authHeader.replace("Bearer ", "");
    const payload = await validateJWT(token);
    if (!payload) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { ai, model, url, apiKeyHeader, headers, body } = await req.json();
    if (!ai || !model || !url || !apiKeyHeader || !headers || !body) {
        return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get API key for this provider
    const apiKey = AI_API_KEYS[ai];
    if (!apiKey) {
        return Response.json({ error: `Unknown AI provider: ${ai}` }, { status: 400 });
    }

    // Forward request to AI, injecting the API key
    const aiRes = await fetch(url, {
        method: "POST",
        headers: { ...headers, [apiKeyHeader]: apiKey },
        body: JSON.stringify(body),
    });

    const data = await aiRes.json();
    return Response.json(data);
}