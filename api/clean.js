export default async function handler(req, res) {
  const { url } = req.query;

  // 1. Basic check for the URL parameter
  if (!url) {
    return res.status(400).send("Add ?url=YOUR_GOOGLE_PUB_LINK to the end of your address.");
  }

  try {
    // 2. Fetch the "ridiculous" HTML from Google
    const response = await fetch(url);
    const html = await response.text();

    // 3. Extract ONLY the content inside <body>...</body> to avoid nested <html> tags
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : html;

    // 4. Remove Google's <style> blocks from inside the content
    bodyContent = bodyContent.replace(/<style[\s\S]*?<\/style>/gi, "");

    // 5. Wrap in a clean HTML5 shell with your base styles
    const finalPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clean View</title>
  <style>
    /* BASIC FOUNDATION - Adjust these details yourself! */
    body { 
      /* No font-size defined: respects user/browser choice */
      max-width: 42rem; 
      margin: 0 auto; 
      padding: 1.5rem; 
      NOline-height: 1.6; 
      NOfont-family: system-ui, -apple-system, sans-serif; 
      color: #1a1a1a;
      NOword-wrap: break-word;
    }
    
    /* Responsive Images & Tables */
    img { max-width: 100%; height: auto; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; display: block; overflow-x: auto; }
    th, td { border: 1px solid #ddd; padding: 8px; }

    /* Dark Mode Support */
    @media (prefers-color-scheme: dark) {
      body { background-color: #121212; color: #efefef; }
      th, td { border-color: #444; }
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(finalPage);

  } catch (error) {
    return res.status(500).send("Error fetching document. Make sure it is 'Published to the Web'.");
  }
}