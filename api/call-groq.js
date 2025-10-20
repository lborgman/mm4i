module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: `Method "${req.method}" not allowed` }));
    }

    const reqBody = req.body;
    console.log({ reqBody });
    const { max_tokens = 3000, temperature = 0.1 } = reqBody;

    const bodyMessages = reqBody.messages;
    console.log({ bodyMessages });
    const bodyMessages0 = bodyMessages[0];
    // console.log({ bodyMessages0 });
    const { userPrompt } = bodyMessages0;
    // const userPrompt = bodyMessages.userPrompt;
    // console.log({ userPrompt });
    if (!userPrompt) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        return res.end(JSON.stringify({ error: 'userPrompt is required' }));
    }

    const apiKey = process.env.GROQ_API_KEY || "BAD_KEY";
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
                model: 'llama-3.1-8b-instant',
                messages: [{ role: 'user', content: userPrompt }],
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