// @ts-check

// module.exports = async (req, res) => {
export default async function (req, res) {

    console.log('Function invoked. Raw req:', req ? 'exists' : 'undefined');
    console.log('Method:', req.method || 'unknown');


    //////// CORS problem, fix suggesed by Grok:
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins (or specify 'http://localhost:3000' for dev)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }



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
    console.log({ messages });



    // const bodyMessages = reqBody.messages;
    // console.log({ bodyMessages });
    const firstMessage = messages[0];
    // console.log({ bodyMessages0 });
    const { content } = firstMessage;
    if (!content) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'content is required' }));
    }

    const apiKey = process.env.GROQ_API_KEY || "NO_BAD_KEY";
    // const apiKey = "TEST_BAD_KEY";
    console.log("Groq", { apiKey });
    if (!apiKey) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'API key not configured' }));
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey.trim()}`,
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