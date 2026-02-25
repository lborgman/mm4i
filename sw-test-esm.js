// sw.js – minimal test version

console.log('[SW] Top of script – module evaluation started');

import {
    clientsClaim,
    precacheAndRoute
} from "./ext/esm-4-workbox/workbox-bundle.js";

console.log('[SW] Imports succeeded');

clientsClaim();
self.skipWaiting();

console.log('[SW] Claimed & skipped waiting');

self.addEventListener('install', event => {
    console.log('[SW] Install event fired');
    event.waitUntil(
        Promise.resolve().then(() => {
            console.log('[SW] Install complete');
        })
    );
});

self.addEventListener('activate', event => {
    console.log('[SW] Activate event');
    event.waitUntil(self.clients.claim());
});