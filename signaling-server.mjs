
// https://www.videosdk.live/developer-hub/webrtc/webrtc-signaling-server
// Partly from Grok

// @ts-check
console.log("signaling-server.mjs loaded");

import { WebSocketServer } from 'ws';
import chalk from 'chalk';
const PORT = 3000;

function logInfo(message) { console.log(chalk.bgBlue.white(` ${message} `)); }
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

try {
  const wss = new WebSocketServer({ port: PORT });

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

  logInfo(`Signaling server running on ws://localhost:${PORT}`);
} catch (error) {
  console.error(error);
  logError("Server startup error:", error.message);
}
