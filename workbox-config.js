module.exports = {
	globDirectory: '.',
	globPatterns: [
		// '**/*.{html,svg,js,json}',
		'**/*.{html,svg,js,json,woff2}',
	],
	globIgnores: [
		// Exclude rxdb
		'**/rxdb-setup-esbuild.js',
		'manifest-mm4i.json', 
		'node_modules/**/*',
		'temp.js',
		'woff-codepoints.js',
	],
	swSrc: 'sw-input.js',
	swDest: 'sw-workbox.js',
};