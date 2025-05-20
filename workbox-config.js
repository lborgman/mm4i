module.exports = {
	globDirectory: '.',
	globPatterns: [
		// '**/*.{html,svg,js,json}',
		'**/*.{html,svg,js,json}',
	],
	globIgnores: [
		// Exclude rxdb
		'**/rxdb-setup-esbuild.js',
		'manifest-mm4i.json', 
		'node_modules/**/*',
		'temp.js',
	],
	swSrc: 'sw-input.js',
	swDest: 'sw-workbox.js',
};