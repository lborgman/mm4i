// @ts-check

export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  console.warn("starting prerender.js GET", req.url);
  const mkErrResponse = (msg) => {
    console.error(`prerender GET: ${msg}`);
    res.status(500).send(`Error prerender GET: ${msg}`);
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  if (pathname != "/" && !pathname.endsWith("/mm4i.html")) {
    return res.status(403).send(`pathname == "${pathname}"`);
  }



  /*
  const origin = url.origin;
  const templateResponse = await fetch(`${origin}/mm4i-template.html`);
  if (!templateResponse.ok) {
      return mkErrResponse('Failed to load static template');
  }
  const htmlTemplate = await templateResponse.text();
  */

  // Grok SMART: Works LOCAL + PRODUCTION!
  let htmlTemplate;
  const origin = url.origin;
  console.warn({ origin }, req.headers.host);
  if (!req.headers.host.startsWith("127.0.0.1")) {
    // PRODUCTION: Use fetch
    const templateResponse = await fetch(`${origin}/mm4i-template.html`);
    if (!templateResponse.ok) {
      return mkErrResponse('Failed to load static template');
    }
    htmlTemplate = await templateResponse.text();
  } else {
    // LOCAL: Dynamic ES6 import!
    const { readFileSync } = await import('fs');
    htmlTemplate = readFileSync('./mm4i-template.html', 'utf8');
  }





  const sp = new URLSearchParams(url.href);
  const title = sp.get("title");
  const text = sp.get("text");
  let htmlResponse = htmlTemplate;
  if (title || text) {
    const escapeHtmlAttr = (str) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    const arrTemplate = htmlTemplate.split("<!-- OGDYN -->");
    if (arrTemplate.length != 3) {
      return mkErrResponse(`Expected 3 parts, but got ${arrTemplate.length}`);
    }
    let strDyn = "";
    if (title) {
      strDyn += "\n";
      strDyn += `<meta property="og:title" content="${escapeHtmlAttr(title)}">`;
      strDyn += "\n";
    }
    if (text) {
      strDyn += "\n";
      strDyn += `<meta property="og:description" content="${escapeHtmlAttr(text)}">`;
      strDyn += "\n";
    }
    arrTemplate[1] = strDyn;
    htmlResponse = arrTemplate.join("\n<!-- NEW OGDYN -->\n");
  }

  res.status(200);
  res.setHeader('Content-Type', 'text/html');
  res.send(htmlResponse);
}