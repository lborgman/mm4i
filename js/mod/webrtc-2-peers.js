// @ts-check
const LOCAL_SETTINGS_VER = "0.0.00";
window["logConsoleHereIs"](`here is webrtc-2-peers.js, module, ${LOCAL_SETTINGS_VER}`);
console.log(`%chere is webrtc-2-peers.js ${LOCAL_SETTINGS_VER}`, "font-size:20px;");
if (document.currentScript) { throw "webrtc-2-peers.js is not loaded as module"; }


let signalingChannel;
let dataChannel;
let myId;
let clientNum;
let isInitiator = false;

/**
 * 
 * @param {function} funDoSync
 * @param {object} logFuns;
 
 * @returns 
 */
export async function openChannelToPeer(funDoSync, logFuns, btnTestSend) {
    // https://www.videosdk.live/developer-hub/webrtc/webrtc-signaling-server
    // https://webrtc.org/getting-started/peer-connections
    // Configuration for STUN servers (works in browser)
    const freeIceServers =
        (() => {
            const fis = {};
            // works on https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
            // 701 is in browser
            const arr = [
                { urls: "stun:stun.l.google.com:19302", known701: true }, // 701

                { urls: "stun:stun1.l.google.com:19302", known701: true }, // 701
                { urls: "stun:stun2.l.google.com:19302", known701: true }, // 701
                { urls: "stun:stun3.l.google.com:19302", known701: true }, // 701
                { urls: "stun:stun4.l.google.com:19302", known701: true }, // 701

                { urls: "stun:stun.l.google.com:3478", known701: true }, // 701
                { urls: "stun:stun1.l.google.com:3478", known701: true }, // 701
                { urls: "stun:stun2.l.google.com:3478", known701: true }, // 701
                { urls: "stun:stun3.l.google.com:3478", known701: true }, // 701
                { urls: "stun:stun4.l.google.com:3478", known701: true }, // 701

                /////// Did not work on trickle-ice
                // { urls: "stun:stun.l.google.com:5349" },
                // { urls: "stun:stun1.l.google.com:5349" },
                // { urls: "stun:stun3.l.google.com:5349" },
                // { urls: "stun:stun2.l.google.com:5349" },
                // { urls: "stun:stun4.l.google.com:5349" },
            ];
            return arr.map(stun => {
                const { urls } = stun;
                // console.log({ urls, known701 });
                return { urls };
            });
        })();
    console.log({ freeIceServers });

    const urlSignaling = "ws://localhost:3000";


    function connectSignalingWebSocket(urlSignaling) {
        return new Promise((resolve, reject) => {
            const signalingChannel = new WebSocket(urlSignaling);

            signalingChannel.addEventListener("open", function (evt) {
                btnTestSend.style.backgroundColor = "yellow";
                btnTestSend.style.color = "black";
                logFuns.logSignaling("open", evt);
                resolve(signalingChannel);  // Resolve the promise when the connection is successful
            });
            signalingChannel.addEventListener("init", function (msg) {
                logFuns.logSignaling("init", msg);
                throw Error("init event not expected");
            });

            signalingChannel.addEventListener("message", function (event) {
                const jsonData = event.data;
                const data = JSON.parse(jsonData);
                const dataType = data.type;
                logFuns.logSignaling(`message: type ${dataType}`, event);
            });

            signalingChannel.addEventListener("error", function (event) {
                logWSError("WebSocket error:", event);
                reject(new Error("WebSocket connection failed"));  // Reject the promise on error
            });

            signalingChannel.addEventListener("close", function (event) {
                if (!event.wasClean) {
                    logWSError("Connection closed unexpectedly", event);
                    reject(new Error("WebSocket connection closed unexpectedly"));  // Reject the promise if the connection closes unexpectedly
                }
            });
        });
    }

    // Usage example with async/await
    async function initiateSignalingConnection(urlSignaling) {
        try {
            const signalingServerChannel = await connectSignalingWebSocket(urlSignaling);  // Wait for the connection to be either opened or error out
            // logFuns.logWSdetail("WebSocket signaling server connection established:", signalingServerChannel);
            return signalingServerChannel;
        } catch (error) {
            logWSError("Failed to connect to signaling server:", error.message);
        }
    }

    logFuns.setSyncLogState("Initialize syncing", "yellowgreen");
    signalingChannel = await initiateSignalingConnection(urlSignaling);
    myId = new Date().toISOString().slice(-10);
    const spanMyId = document.getElementById("span-my-id");
    if (!spanMyId) throw Error(`Could not find span-my-id`);
    spanMyId.textContent = myId;
    let myOffer;
    sendFirstMessageToServer(myId);
    let peerConnection;
    if (!sendPeerOfferToSignaling()) { return; }




    // logFuns.logWSdetail("signaling Server:", { signalingChannel });
    if (!signalingChannel) {
        // alert("Could not connect to signaling server. Please check your connection.");
        modMdc.mkMDCdialogAlert(`Could not connect to signaling server at ${urlSignaling}.`);
        return;
    }



    // Handle WebSocket messages
    signalingChannel.addEventListener("message", async (message) => {
        const data = JSON.parse(message.data);

        const dataType = data.type;
        // logWebSocketImportantInfo("signalingServer:", { dataType, data });
        logFuns.logWSdetail(`signalingServer message: ${dataType}`, { data });
        switch (dataType) {
            case "init":
                throw Error("init event not expected");
                break;
            case "offer":
                await handleOffer(data);
                break;
            case "answer":
                await handleAnswer(data.answer);
                break;
            case "candidate":
                await handleCandidate(data.candidate, data);
                break;
            case "first-reply":
                // const clientNum = data.clientNum;
                clientNum = data.clientNum;
                const myIdS = data.myId;
                if (myIdS != myId) throw Error(`myIds:${myIdS} != myId:${myId}`);
                const spanNumId = document.getElementById("span-num-id");
                if (!spanNumId) throw Error(`Could not find span-num-id`);
                spanNumId.textContent = `clientNum:${clientNum}`;
                break;
            default:
                const msg = `server message, unrecognized type: "${dataType}"`;
                console.error(msg);
                throw Error(msg);
        }
    });

    // Function to start the connection
    async function sendPeerOfferToSignaling() {
        if (peerConnection) {
            logFuns.logWSinfo("Peer connection already exists, skipping start");
            return;
        }
        // logWebSocketInfo("start Peer Connection");
        // _logSyncLog("Start peer connection");

        await setupPeerConnection();
        if (!peerConnection) throw Error("peerConnection is undefined");

        logFuns.logWSimportant("await peerConnection.createOffer()");
        myOffer = await peerConnection.createOffer();
        // logFuns.logWSdetail("Offer created:", myOffer);
        // await peerConnection.setLocalDescription(myOffer);
        signalingChannel.send(JSON.stringify({
            type: "offer",
            offer: myOffer,
            myId,
            clientNum
        }));
        logFuns.logSignaling("send: Offer");
        logFuns.setSyncLogState("Wating for peer", "red");
    }


    async function setupPeerConnection() {
        const iceConfiguration = {
            // iceServers: [ ]
            // iceServers: freeIceServers
        };

        // chkOpenRelay
        /*
        function useOpenRelay() {
            const checked = localStorage.getItem(keyUseOpenRelay);
            return checked;
        }
        */
        function openRelayCred() {
            // return localStorage.getItem(keyOpenRelayCred);
            return settingOpenRelayCred.valueS;
        }

        const settingsUseOpenRelayValue = false;
        if (settingsUseOpenRelayValue) {
            const CREDENTIALS = openRelayCred();
            const APPNAME = "mm4i"
            const urlIce = `https://${APPNAME}.metered.live/api/v1/turn/credentials?apiKey=${CREDENTIALS}`;
            const response = await fetch(urlIce);
            const iceServers = await response.json();
            const error = iceServers.error;
            if (error) {
                const msg = `Open Relay credential not valid, ${error}`;
                alert(msg);
                return;
                // throw Error(msg);
            }
            iceConfiguration.iceServers = iceServers
            iceConfiguration.iceServers = iceServers;
        } else {
            iceConfiguration.iceServers = freeIceServers;
        }

        logFuns.logWSimportant("new RTCPeerConnection", { iceConfiguration });
        peerConnection = new RTCPeerConnection(iceConfiguration);

        initialCreateDatachannel();
        function initialCreateDatachannel() {
            logFuns.logWSimportant('peerConnection.createDataChannel("textChannel"');
            dataChannel = peerConnection.createDataChannel("textChannel");
            // setupDataChannel();
        }


        // Standard RTCPeerConnection events
        peerConnection.addEventListener("icecandidate", (event) => {
            const candidate = event.candidate;
            if (candidate) {
                logFuns.logWSimportant("PCmessage icecandidate");
                logFuns.logSignaling("send: icecandidate");
                signalingChannel.send(JSON.stringify({
                    type: "candidate",
                    candidate: candidate
                }));
            } else {
                logFuns.logWSinfo("PCmessage icecandidate:", candidate);
            }
        });

        peerConnection.addEventListener("icecandidateerror", (event) => {
            const errorCode = event.errorCode;
            const url = event.url;
            const msg = `Peer icecandidateerror code: ${errorCode}, ${url}`;
            // https://www.webrtc-developers.com/oups-i-got-an-ice-error-701/
            // https://webrtc.github.io/samples/src/content/peerconnection/trickle-ice/
            if (errorCode >= 300 && errorCode <= 699) {
                // Here this a standardized ICE error
                // Do something...
                console.log("standard ICE error", msg);
            } else if (errorCode >= 700 && errorCode <= 799) {
                // Here, the application perhaps didn't reach the server ?
                // Do something else...
                // console.log("%c> 700", "color:red;background:black", msg);
            }
        });

        peerConnection.addEventListener("negotiationneeded", () => {
            logFuns.logWSimportant("PCmessage negotiationneeded");
            // FIX-ME:
            // startPeerConnection(); // Trigger offer creation if needed
        });

        peerConnection.addEventListener("signalingstatechange", () => {
            const msg = `Peer signalingstatechange: ${peerConnection.signalingState}`;
            logFuns.logWSimportant(msg);
        });



        peerConnection.addEventListener("iceconnectionstatechange", () => {
            const newState = peerConnection.iceConnectionState;
            logFuns.logWSimportant(`Peer iceconnectionstatechange: ${newState}`);
        });

        peerConnection.addEventListener("icegatheringstatechange", () => {
            const msg = `Peer icegatheringstatechange: ${peerConnection.iceGatheringState}`;
            logFuns.logWSimportant(msg);
        });

        peerConnection.addEventListener("connectionstatechange", () => {
            const state = peerConnection.connectionState;
            const msg = `Peer connectionstatechange: ${state}`;
            if (state == "failed") {
                logWSError(msg);
            } else {
                logFuns.logWSimportant(msg);
            }
        });

        logFuns.logWSinfo("Adding listener for datachannel");
        peerConnection.addEventListener("datachannel", (event) => {
            const msg = `Peer datachannel ${dataChannel.id}: ${dataChannel.label}`;
            logFuns.logWSimportant(msg);
            if (!isInitiator) {
                const oldChannel = dataChannel;
                const newChannel = event.channel;
                const oldId = oldChannel.id;
                const newId = newChannel.id;
                if (oldId == newId) {
                    debugger;
                    logFuns.logWSimportant(`Something has changed in API: old: ${oldId} == new: ${newId}`);
                }
                logFuns.logWSimportant(`dataChannel = event.channel, old: ${oldId}, new: ${newId}`);
                const oldState = oldChannel.readyState;
                const newState = newChannel.readyState;
                logFuns.logWSimportant(`states - old: ${oldId}/${oldState}, new: ${newId}/${newState}`);
                // FIX-ME: to close or not to close???
                // Currently closing the old channel will also close the new (2025-04-21)
                // oldChannel.close();
                dataChannel = newChannel;
                setupDataChannel();
            } else {
                logFuns.logWSimportant("Ignoring received data channel as initiator");
            }
        });

        peerConnection.addEventListener("track", (event) => {
            logFuns.logWSimportant("PCmessage track:", event.track.kind);
            // Not used here (no media), but logged for completeness
        });

        peerConnection.addEventListener("close", () => {
            btnTestSend.style.backgroundColor = "red";
            btnTestSend.style.color = "black";
            const msg = `Peer close, close dataChannel:${dataChannel.id}`;
            logFuns.logWSimportant(msg);
            debugger;
            dataChannel.close();
            dataChannel = null;
            peerConnection = null;
            btnTestSend.inert = true;
        });
    }

    async function handleOffer(offerData) {
        window["pc"] = peerConnection;
        const isInitiator = offerData.isInitiator;
        const from = offerData.from;
        const offer = offerData.offer;


        logFuns.setSyncLogInitiator(isInitiator);
        const me = `${myId} / clientNum:${clientNum}`;
        logFuns.logWSimportant(`handle offer, isInitiator:${isInitiator}`, { offer, from, me });
        const re = /^(.*?) \/ (.*?)$/;
        const mFrom = re.exec(from);
        if (!mFrom) throw Error(`mFrom is ${mFrom}`);
        const fromMyId = mFrom[1];
        const fromClient = mFrom[2];
        const fromClientNum = parseInt(fromClient.slice(10));
        if (fromMyId == myId) debugger;
        if (fromClientNum == clientNum) debugger;
        if (isInitiator) {
            logFuns.logWSdetail("Is initiator, skipping offer");
            // FIX-ME: has not this already been done???
            logFuns.logWSimportant("peerConnection.setLocalDescription(myOffer)", myOffer);
            await peerConnection.setLocalDescription(myOffer);
            setupDataChannel();
            return;
        }
        setupDataChannel();
        try {
            logFuns.logWSimportant("peerConnection.setRemoteDescription");
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            logFuns.logWSimportant("await peerConnection.createAnswer()");
            const answer = await peerConnection.createAnswer();
            logFuns.logWSimportant("peerConnection.setLocalDescription(answer)");
            await peerConnection.setLocalDescription(answer); // Will send ICE Candidate to server

            signalingChannel.send(JSON.stringify({
                type: "answer",
                answer: answer
            }));
            logFuns.logWSimportant("Answer sent");
        } catch (error) {
            logWSError("Error handling offer", error);
        }
    }

    // Handle incoming answer
    async function handleAnswer(answer) {
        logFuns.logWSdetail("handleAnswer", { isTheInitiator: isInitiator });
        if (isInitiator) return;
        try {
            logFuns.logWSimportant("await peerConnection.setRemoteDescription", { answer });
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            logWSError("Error handling answer", error);
        }
    }

    // Handle ICE candidate
    async function handleCandidate(candidate, data) {
        // logFuns.logWSdetail("handleCandidate", candidate);
        console.log("%chandleCandidate", "background:yellow;color:black; font-size:20px;", { candidate, data });
        try {
            logFuns.logWSimportant("peerConnection.addIceCanditate", candidate);
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            logWSError("Error in handlingCandidate", error, candidate);
        }
    }

    function setupDataChannel() {
        // console.warn(`%c>>>>>>>>>>>> setupDataChannel ${dataChannel.id}`, "font-size:20px;");
        logFuns.logDataChannel(dataChannel.id, "setupDataChannel", dataChannel);
        // const dataChannelSetup = dataChannel;

        dataChannel.addEventListener("open", () => {
            const readyState = dataChannel.readyState;
            console.log({ readyState });
            btnTestSend.style.backgroundColor = "greenyellow";
            btnTestSend.style.color = "black";
            // FIX-ME: Why do we get this 2 times???
            logFuns.logDataChannel(dataChannel.id, "open");
            signalingChannel.close();
            logFuns.setSyncLogState("Connected to peer", "green");
            funDoSync(dataChannel);
        });
        dataChannel.addEventListener("message", (evt) => logFuns.logDataChannel(dataChannel.id, "message", evt.data));
        dataChannel.addEventListener("message", (evt) => console.log("message 2", dataChannel.id, evt.data));
        dataChannel.addEventListener("error", (evt) => {
            btnTestSend.style.backgroundColor = "black";
            btnTestSend.style.color = "red";
            logWSError("datachannel error", evt);
        });
        dataChannel.addEventListener("close", (evt) => {
            btnTestSend.style.backgroundColor = "red";
            btnTestSend.style.color = "black";
            logFuns.logDataChannel(dataChannel.id, "close", evt.data);
        });

        return dataChannel;
    }

    function sendFirstMessageToServer(myId) {
        logFuns.logSignaling(`send: FirstMessage, myId:${myId}`);
        const firstMsg = {
            type: "client-init",
            room: "test-room",
            myId
        }
        signalingChannel.send(JSON.stringify(firstMsg));
    }

    function _getSignalingServerReadyState() {
        switch (signalingChannel.readyState) {
            case WebSocket.CONNECTING:
                return "CONNECTING";
            case WebSocket.OPEN:
                return "OPEN";
            case WebSocket.CLOSING:
                return "CLOSING";
            case WebSocket.CLOSED:
                return "CLOSED";
            default:
                throw Error(`UNKNOWN signalingServer.readyState: ${signalingChannel.readyState}`);
        }
    }

}

