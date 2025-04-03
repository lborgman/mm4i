// @ts-check
const RXDB_SETUP_VER = "0.0.01";
window["logConsoleHereIs"](`here is rxdb-setup.js, module, ${RXDB_SETUP_VER}`);
const styleLog = "background:red; color:white; font-size:20px; padding:5px;";
console.log(`%chere is rxdb-setup.js`, styleLog);
if (document.currentScript) { throw "rxdb-setup.js is not loaded as module"; }

export function getVersion() { return `rxdb-setup.js ${RXDB_SETUP_VER}`; }

// const modCore = await import( 'rxdb/plugins/core');
// console.log({modCore});


import { createRxDatabase } from 'rxdb';
// import { createRxDatabase } from 'rxdb/plugins/core';

import { addRxPlugin } from 'rxdb/plugins/core';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
addRxPlugin(RxDBDevModePlugin); // FIX-ME: remove in production

import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
// import { getRxStorageLocalstorage } from 'rxdb/plugins/storage-localstorage';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';



// Create an AJV instance and add formats
debugger; // eslint-disable-line no-debugger
const ajv = new Ajv({
    strict: false,
    allErrors: true,
    formats: { 'date-time': true },
}); // Disable strict mode
addFormats(ajv); // Adds support for "date-time" and other formats

// create a database
// Wrap Dexie storage with AJV schema validation
const storage = wrappedValidateAjvStorage({
    storage: getRxStorageDexie(),
    // storage: getRxStorageLocalstorage(),
});
const ourDB = await createRxDatabase({
    name: 'mm4i', // the name of the database
    // storage: getRxStorageDexie()
    storage,
});
console.log(`%cAfter createRxDatabase`, styleLog, ourDB);

export function getDB() { return ourDB; }

const mm4iSchemaLiteral = {
    // title: 'mm4i schema',
    title: 'mm4i',
    description: 'mm4i schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        // id: { type: 'string', maxLength: 100 },
        id: { type: 'string', maxLength: 100 },
        text: { type: 'string' },
        // isCompleted: { type: 'boolean' },
        // createdAt: { type: 'string', format: 'date-time' },
        // updatedAt: { type: 'string', format: 'date-time' },
        // deletedAt: { type: ['string', 'null'], format: 'date-time' },
    },
    // required: ['id', 'text', 'isCompleted', 'createdAt', 'updatedAt']
    required: ['id', 'text'],
};
Object.freeze(mm4iSchemaLiteral); // Freeze the schema object to prevent modifications
// import { toTypedRxJsonSchema } from 'rxdb/plugins/validate-ajv';
import { toTypedRxJsonSchema } from 'rxdb';
debugger; // eslint-disable-line no-debugger
const mm4iSchema = toTypedRxJsonSchema(mm4iSchemaLiteral);

// Compile the schema
const validate = ajv.compile(mm4iSchema);
if (!validate) {
    console.log({ validate });
    debugger; // eslint-disable-line no-debugger
}

// Test validation
// const validData = { createdAt: new Date().toISOString() }; // ISO date string
const validData = {
    id: '123', // Required primary key
    text: 'Sample task',
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};
const invalidData = { createdAt: 'invalid-date' };

const boolValid = validate(validData); // true
console.log(boolValid, validate.errors); // true

console.log(validate(invalidData)); // false

await ourDB.addCollections({
    mindmaps: {
        /*
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
        */
        schema: mm4iSchema,
    }
});
// debugger; // eslint-disable-line no-debugger

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
            isPeerValid: async (peer) => {
                // Custom validation logic
                console.log("%cisPeerValid", "background:yellow; color:black; font-size:20px;", peer);
                return peer.id !== 'invalid-peer-id';
            },
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