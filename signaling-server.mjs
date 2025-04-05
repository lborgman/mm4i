
// https://www.videosdk.live/developer-hub/webrtc/webrtc-signaling-server
// From Grok

// @ts-check
console.log("signaling-server.mjs loaded");

import { WebSocketServer } from 'ws';
import chalk from 'chalk';
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

const PORT = 3000;

try {
  const wss = new WebSocketServer({ port: PORT });

  wss.on('connection', (ws) => {
    // const ws = event.target;
    console.log('New client connected');

    ws.on('message', (event) => {
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

    ws.on('error', (event) => logError('Client error:', event.message));
    ws.on('close', () => console.log('Client disconnected'));
  });

  wss.on('error', (event) => console.error('Server error:', event.message));

  logInfo(`Signaling server running on ws://localhost:${PORT}`);
} catch (error) {
  console.error(error);
  logError("Server startup error:", error.message);
}
