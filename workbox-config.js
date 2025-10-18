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
		'temp.js',
		'temp.json',
		'woff-codepoints.js',
		'**/api/prerender.js',
		'**/api/call-groq.js',
		'package.json',
		'vercel.json',
	],
	swSrc: 'sw-input.js',
	swDest: 'sw-workbox.js',
};