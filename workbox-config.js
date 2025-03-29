module.exports = {
	globDirectory: '.',
	globPatterns: [
		// '**/*.{html,svg,js,json}',
		'**/*.{html,svg,js,json}',
		// Exclude rxdb
		// '!**/rxdb-setup.js',
		// '!manifest-mm4i.json', // Exclude manifest-mm4i.json
	],
	globIgnores: [
		// Exclude rxdb
		'**/rxdb-setup.js',
		'manifest-mm4i.json', 
	],
	swSrc: 'sw-input.js',
	swDest: 'sw-workbox.js',
};