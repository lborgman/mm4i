module.exports = {
	globDirectory: '.',
	globPatterns: [
		// '**/*.{html,svg,js,json}',
		'**/*.{html,svg,js,json,woff2,mjs}',
	],
	globIgnores: [
		// Exclude rxdb
		'**/rxdb-setup-esbuild.js',
		'manifest-mm4i.json', 
		'node_modules/**/*',
		'woff-codepoints.js',
		'**/api/prerender.js',
		'**/api/call-groq.js',
		'package.json',
		'vercel.json',
		// temporary files:
		'curl_debug.txt',
		'response.json',
		'temp.html',
		'temp.js',
		'temp.json',
		'test.json',
		'my-prerender.js',
	],
	swSrc: 'sw-input.js',
	swDest: 'sw-workbox.js',
};