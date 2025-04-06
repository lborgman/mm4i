
// https://www.videosdk.live/developer-hub/webrtc/webrtc-signaling-server
// Partly from Grok

// @ts-check
logInfo("signaling-server.mjs loaded");

const msStarting = Date.now();
// console.time("startup signaling server");

import { WebSocketServer } from 'ws';
import chalk from 'chalk';
import os from 'os';

const PORT = 3000;
// const HOSTNAME = process.env.HOSTNAME || os.hostname() || 'localhost';
// const HOSTNAME = process.env.HOSTNAME || 'localhost';
const HOSTNAME = 'localhost';

function logInfo(message) { console.log(chalk.bgBlue.white(` ${message} `)); }
function logWarning(message) { console.log(chalk.bgYellow.black(` ${message} `)); }
/**
 * @param {string} where 
 * @param {Error|string} error 
 */
function logError(where, error) {
  console.error(error);
  const message = error instanceof Error ? error.message : error;
  console.log(chalk.bgRed.yellow(` ${where}: ${message} `));
}


const wmapClientFirstMsg = new WeakMap();
const wmapClientRoom = new WeakMap();
const mapRoomClients = new Map(); // room -> Set of clients

let wss;
try {
  // const wss = new WebSocketServer({ port: PORT });
  wss = new WebSocketServer({ port: PORT });

  wss.on('connection', (ws) => {
    // const ws = event.target;
    logInfo('New client connected'); // , { ws });

    ws.on('message', (event) => {
      const txtMessage = event.toString("utf8");
      console.log('ws.on Received message:', txtMessage);
      if (!wmapClientFirstMsg.has(ws)) {
        wmapClientFirstMsg.set(ws, txtMessage);
        const jsonMessage = JSON.parse(txtMessage);
        const room = jsonMessage.room;
        wmapClientRoom.set(ws, room);
        if (!mapRoomClients.has(room)) {
          mapRoomClients.set(room, new Set());
        }
        const setRoom = mapRoomClients.get(room);
        const numClients = setRoom.size;
        console.log('Number of clients in room:', numClients);
        setRoom.forEach((client) => {
          const clientFirstMsg = wmapClientFirstMsg.get(client);
          console.log('Client in room:', clientFirstMsg, client.readyState);
        });
        setRoom.add(ws);
        /*
        wss.clients.forEach((client) => {
          const room = wmapClientRoom.get(client);
          console.log('room:', room);
        });
        */
        return;
      }
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          try {
            client.send(event.data);
          } catch (error) {
            logError("Send error: ", error);
          }
        }
      });
    });

    ws.on('message', (event) => {
    });
    ws.on('error', (event) => logError('Client error:', event.message));
    ws.on('close', () => {
      const room = wmapClientRoom.get(ws);
      logInfo(`Client disconnected, room: ${room}`);
      wmapClientFirstMsg.delete(ws);
      wmapClientRoom.delete(ws);
      mapRoomClients.get(room).delete(ws);
    });
  });

  wss.on('error', (event) => console.error('Server error:', event.message));

  const msEnding = Date.now();
  const msDiff = msEnding - msStarting;
  // console.timeEnd("startup signaling server");
  // logInfo(`Signaling server started (${msDiff}ms) on ws://localhost:${PORT}`);
  logInfo(`Signaling server started (${msDiff}ms) on ws://${HOSTNAME}:${PORT}`);
} catch (error) {
  console.error(error);
  logError("Server startup error:", error.message);
}

function closeServer() {
  logWarning('Initiating server shutdown');
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.close(1000, 'Server shutting down');
    }
  });
  wss.close((error) => {
    if (error) {
      logError("Server close error:", error.message);
    } else {
      logInfo("Server closed successfully.");
    }
  });
}
function _closeServerWithDelay(seconds) {
  logWarning(`Will close server after ${seconds} seconds)`);
  setTimeout(() => {
    logInfo(`Closing server now (already waited ${seconds} seconds)`);
    closeServer();
  }, 1000 * seconds);
}
_closeServerWithDelay(15);