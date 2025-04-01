// @ts-check
const RXDB_SETUP_VER = "0.0.1";
window["logConsoleHereIs"](`here is rxdb-setup.js, module, ${RXDB_SETUP_VER}`);
const styleLog = "background:red; color:white; font-size:20px; padding:5px;";
console.log(`%chere is rxdb-setup.js`, styleLog);
if (document.currentScript) { throw "rxdb-setup.js is not loaded as module"; }

export function getVersion() { return `rxdb-setup.js ${RXDB_SETUP_VER}`; }

// const modCore = await import( 'rxdb/plugins/core');
// console.log({modCore});


import { addRxPlugin, createRxDatabase } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';

// create a database
const ourDB = await createRxDatabase({
    name: 'mm4i', // the name of the database
    storage: getRxStorageDexie()
});
console.log(`%cAfter createRxDatabase`, styleLog, ourDB);
// debugger;
export function getDB() { return ourDB; }

await ourDB.addCollections({
    mindmaps: {
        id: {
            type: 'string',
            maxLength: 100,
            primary: true,
        },
        version: 0,
        schema: {
            version: 0,
            type: 'object',
            primaryKey: 'id',
            properties: {
                id: { type: 'string', maxLength: 100 },
                content: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            },
            required: ['id', 'content', 'createdAt', 'updatedAt']
        },
    }
});

import {
    replicateWebRTC,
    getConnectionHandlerSimplePeer
} from 'rxdb/plugins/replication-webrtc';


/**
 * 
 * @param {string} room 
 * @param {string} secret 
 * @returns {Promise<ReplicationState>}
 */
export async function replicateMindmaps(room, secret) {
    const tofRoom = typeof room;
    if (tofRoom !== "string") {
        throw new Error(`room must be string, but has type "${tofRoom}"`);
    }
    const tofSecret = typeof secret;
    if (tofSecret !== "string") {
        throw new Error(`secret must be string, but has type "${tofSecret}"`);
    }

    try {
        const replication = await replicateWebRTC({
            collection: ourDB.mindmaps,
            topic: room, // <- set any app-specific room id here.
            secret: secret, // Removed as it is not a valid property
            connectionHandlerCreator: getConnectionHandlerSimplePeer({}),
            pull: {},
            push: {}
        });
        return replication
    } catch (err) {
        console.error("Replication error:", err);
        return null;
    }
}

/*
replicateWebRTC({
    collection: ourDB.mindmaps,
    connectionHandlerCreator: getConnectionHandlerSimplePeer({}),
    topic: '', // <- set any app-specific room id here.
    secret: 'mXs8ya', // Removed as it is not a valid property
    pull: {},
    push: {}
})
*/



// Skipped: Browser implementation of process.nextTick() -- from Claude

// From RxDB docs
// @ts-ignore
window.process = {
    nextTick: (fn, ...args) => setTimeout(() => fn(...args)),
};



// ICE servers
// https://www.metered.ca/blog/list-of-webrtc-ice-servers/
const iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.l.google.com:5349" },
    { urls: "stun:stun1.l.google.com:3478" },
    { urls: "stun:stun1.l.google.com:5349" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:5349" },
    { urls: "stun:stun3.l.google.com:3478" },
    { urls: "stun:stun3.l.google.com:5349" },
    { urls: "stun:stun4.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:5349" }
];
// FIX-ME: export for testing purposes now
export function getOurICEServer() {
    const n = 3; // just pick one from the list
    const rec = iceServers[n];
    return rec;
}