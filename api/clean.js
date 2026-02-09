export default async function handler(req, res) {
  let { url } = req.query;

  // 1. Basic check for the URL parameter
  if (!url) {
    // return res.status(400).send("Add ?url=YOUR_GOOGLE_PUB_LINK to the end of your address.");
    // Instead of crashing with prompt(), we send a simple instruction
    return res.status(200).send(`
      <script>
        const u = prompt("Please paste your Google Doc 'Published to Web' link:");
        if (u) {
          const U = new URL(window.location);
          U.searchParams.set("url", u);
          window.location.href = U.href;
        }
      </script>
      <p>Redirecting to prompt...</p>
    `);
  }

  /** @type {string|undefined} */
  let html;
  let response;
  try {
    // 2. Fetch the "ridiculous" HTML from Google
    response = await fetch(url);
  } catch (error) {
    return res.status(500).send(`Error fetching document. Make sure it is 'Published to the Web'.`);
  }
  try {
    html = await response.text();
  } catch (error) {
    return res.status(500).send(`Error getting document text.`);
  }

  html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, "");

  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (match, cssContent) => {
    const sanitizedCss = cssContent
      .replace(/([-+]?\d+(?:\.\d+)?)(pt|px)/gi, (m, value, unit) => {
        const numValue = parseFloat(value);

        // If the value is 0, no unit is needed
        if (numValue === 0) return '0';

        /* THE RATIO:
           Google Docs uses 12pt as the standard '100%' font size.
           In browsers, 1rem is the '100%' font size.
           Therefore: Value / 12 = rem
        */
        const remValue = (numValue / 12).toFixed(3);

        return `${remValue}rem`;
      });

    return `<style>${sanitizedCss}</style>`;
  });

  html = html.replace("<head>",
    `
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark light">

    `
  );
  html = html.replace("</head>",
    `
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
  
  
      /* Google docs fixes */
      html body #banners { display: none !important; }
      NOhtml body #contents { padding: unset !important; }
      :root * {
        padding: unset !important;
      }
      :root .doc-content {
        background-color: unset !important;
        color: unset !important;
      }

      /* Our banner */
      :root #our-banner {
        background-color: yellowgreen !important;
        color: darkgreen !important;
        padding:6px !important;
      }
    </style>
    </head>
    `
  );
  html = html.replace("<body>", 
    `
    <body>
    <div id="our-banner">
      clean.js Version: 0.23
    </div>
    `
  );

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(html);
}