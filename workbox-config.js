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
		'woff-codepoints.js',
		'**/api/prerender.js',
		'package.json',
	],
	swSrc: 'sw-input.js',
	swDest: 'sw-workbox.js',
};