@rem Run this before every commit after updating version number
@echo =================================
@findstr "SW_VERSION" .\sw-input-esm.js | findstr const
call npx workbox-cli injectManifest workbox-config.cjs
@echo ------ check precache against .gitignore
node check-precaching.js