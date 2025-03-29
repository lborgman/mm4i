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
export function replicateMindmaps() {
    return replicateWebRTC({
        collection: ourDB.mindmaps,
        connectionHandlerCreator: getConnectionHandlerSimplePeer({}),
        topic: 'Mindmaps 4 Internet', // <- set any app-specific room id here.
        secret: 'mXs8ya', // Removed as it is not a valid property
        pull: {},
        push: {}
    });
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



// Browser implementation of process.nextTick() -- from Claude
(function (global) {
    // Create a process object if it doesn't exist
    if (!global.process) {
        global.process = {};
    }

    // Implementation using queueMicrotask (modern browsers)
    global.process.nextTick = function (callback, ...args) {
        if (typeof callback !== 'function') {
            throw new TypeError('Callback must be a function');
        }

        // Try to use queueMicrotask if available (closest to Node.js behavior)
        queueMicrotask(() => {
            callback(...args);
        });

        return this; // For chaining
    };

    // Optional: Add a nextTickList property similar to Node.js
    const nextTickQueue = [];
    let nextTickScheduled = false;

    // Expose the queue for debugging purposes
    Object.defineProperty(global.process, '_nextTickQueue', {
        get: function () {
            return [...nextTickQueue];
        }
    });

    // More advanced implementation if needed
    /* 
    global.process._nextTick = function(callback, ...args) {
      nextTickQueue.push({ callback, args });
      
      if (!nextTickScheduled) {
        nextTickScheduled = true;
        
        queueMicrotask(() => {
          const queue = nextTickQueue.slice();
          nextTickQueue.length = 0;
          nextTickScheduled = false;
          
          for (const item of queue) {
            try {
              item.callback(...item.args);
            } catch (err) {
              console.error('Unhandled error in process.nextTick callback:', err);
            }
          }
        });
      }
      
      return this;
    };
    */

})(typeof window !== 'undefined' ? window : global);

// Usage example:
/*
process.nextTick(function(a, b) {
  console.log('This runs in the next tick of the event loop');
  console.log('Arguments:', a, b);
}, 'hello', 'world');
 
console.log('This runs first');
*/

