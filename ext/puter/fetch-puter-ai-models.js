// @ts-check

// const fetch = require('node-fetch');
const fs = require('fs').promises;

/**
 * Fetches JSON from a URL, filters it by specified keys, and writes an ES6 module.
 * @param {string} url - URL of the JSON file.
 * @param {string[]} patterns - Array of key patterns to include.
 * @param {string} outputPath - Path for the output ES6 module file.
 */
async function generateJsonModule(url, patterns, outputPath) {
    try {
        // Fetch JSON from URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fullData = await response.json();
        const models = fullData.models;
        // console.log({ models });

        // Convert string patterns to RegExp for exact matching
        // At the moment I believe using only those through openrouter will be enough:
        const regexPatterns = patterns.map(p => new RegExp(`^openrouter:${p}`));

        // Filter data to include only specified keys
        // const filteredData = {};
        const filteredModels = [];
        // const keysModels = Object.keys(models);
        // keysModels.forEach(key => {
        models.forEach(key => {
            if (regexPatterns.some(pattern => pattern.test(key))) {
                // filteredData[key] = models[key];
                filteredModels.push(key);
            }
        });

        // Generate ES6 module content
        const moduleContent = `
/*
  Written: ${new Date().toISOString()}
  Extracted from "${url}"
  Matches:
    ${JSON.stringify(patterns, 2)};
  Num matching models: ${filteredModels.length}
*/
const data = ${JSON.stringify(filteredModels, null, 2)};
export function getModels() { return data; }
`;

        // Write to output file
        await fs.writeFile(outputPath, moduleContent, 'utf8');
        console.log(`ES6 module written to ${outputPath}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// Configuration
// const url = 'https://example.com/data.json'; // Replace with your JSON URL
const url = "https://puter.com/puterai/chat/models";
const patterns = [
    "google/gemini-",
    'openai/gpt-5',
    'xai/grok-',
]; // Specify keys to include
// const outputPath = 'output.mjs'; // Output file for browser
const outputPath = 'puter-ai-models.js'; // Output file for browser

// Run the function
generateJsonModule(url, patterns, outputPath);