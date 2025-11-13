// @ts-check

/**
 * Handles proxy requests to the Groq API with authentication and CORS support.
 *
 * This serverless function acts as a secure proxy to the Groq chat completion endpoint.
 * It validates the request, authenticates via a shared secret or API key, forwards the
 * request to Groq, and returns structured JSON output.
 *
 * @param {import('http').IncomingMessage & { body?: any }} req - The incoming HTTP request.
 *   Must include `Authorization: Bearer <token>` header and a JSON body with `messages`.
 * @param {import('http').ServerResponse & {
 *   status: (code: number) => import('http').ServerResponse;
 *   json: (obj: any) => void;
 * }} res
 *   This allows for the old syntax res.status(xx) that Vercel adds
 * @returns {Promise<void>} Resolves when the response is sent.
 *
 * @example
 * // POST /api/call-groq
 * {
 *   "model": "llama-3.1-8b-instant",
 *   "messages": [{ "role": "user", "content": "Hello, world!" }],
 *   "max_tokens": 1000,
 *   "temperature": 0.7
 * }
 */
export default async function (req, res) {

    console.log('\n--------------- call-groq.js function invoked. req URL:', req.url, ' Method:', req.method);


    //////// CORS problem, fix suggesed by Grok:
    // 
    // Set CORS headers
    // 
    // Note: Any custom header (like Authorization, X-API-Key, etc.)
    // in a cross-origin fetch() must be explicitly allowed in Access-Control-Allow-Headers.
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (or specify 'http://localhost:3000' for dev)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }


    // Grok: Read the Authorization header
    const authHeader = req.headers.authorization;
    // console.log('Authorization Header:', authHeader); // e.g., "Bearer your_token_here"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }
    // Extract the token
    const token = authHeader.split(' ')[1]; // Gets the token after "Bearer "


    let apiGroqKey = token;
    const doorKey = process.env.GROQ_DOOR_KEY;
    console.log("env:", { token, doorKey });
    if (token == doorKey) {
        ///// Check our common key here:
        // https://console.groq.com/dashboard/metrics
        const apiMm4iGroqKey = process.env.GROQ_API_KEY;
        console.log("groq", { apiMm4iGroqKey });
        if (!apiMm4iGroqKey) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'API key not configured' }));
        }
        apiGroqKey = apiMm4iGroqKey;
    }
    console.log("used:", { apiGroqKey });



    const reqBody = req.body;
    console.log(">>>>>>>>>>>>>>> call-groq.js", { reqBody });


    // Validate required fields
    if (!reqBody || typeof reqBody !== 'object') {
        return res.status(400).json({ error: 'Invalid or missing request body' });
    }


    const { max_tokens = 3000, temperature = 0.1, model, messages } = reqBody;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: 'Missing or invalid messages array' });
    }



    console.log({ max_tokens, temperature, model });
    // console.log({ messages });



    const firstMessage = messages[0];
    const { content } = firstMessage;
    if (!content) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'content is required' }));
    }


    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiGroqKey.trim()}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // model: 'llama-3.1-8b-instant',
                model: model,
                messages: [{ role: 'user', content: content }],
                max_tokens: parseInt(max_tokens, 10), // Ensure integer
                temperature: parseFloat(temperature), // Ensure float
                response_format: { type: 'json_object' }, // Enforce JSON output
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: errorText }));
        }

        const data = await response.json();
        try {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
                json: JSON.parse(data.choices[0].message.content),
                tokens: data.usage, // { prompt_tokens, completion_tokens, total_tokens }
            }));
        } catch (parseError) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: `Invalid JSON output: ${parseError.message}` }));
        }
    } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: `Failed to call Groq API: ${error.message}` }));
    }
};