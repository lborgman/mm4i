// @ts-check
const RXDB_MM4I_VER = "0.0.1";
window["logConsoleHereIs"](`here is rxdb-mm4i.js, module, ${RXDB_MM4I_VER}`);
console.log(`%chere is mm4i-replication.js`, "font-size:30px;");
if (document.currentScript) { throw "rxdb-mm4i.js is not loaded as module"; }

const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];




const modTools = await importFc4i("toolsJs");
const modMdc = await importFc4i("util-mdc");


////////////////
// Part of dialog, but must be accessed from outside the dialog
const divSyncLogState = mkElt("div");
divSyncLogState.style = `
        font-size: 1.2rem;
        font-weight: 500; 
    `;
const divSyncLogLog = mkElt("div");
divSyncLogLog.style = `
        color: gray;
        max-height: 100px;
        overflow-y: auto;
    `;
const divSyncLog = mkElt("div", undefined, [
    divSyncLogState,
    divSyncLogLog,
]);
setSyncLogInactive();
function logSyncLog(msg) {
    const line = mkElt("div", undefined, msg);
    divSyncLogLog.appendChild(line);
    line.scrollIntoView({ behavior: "smooth", block: "end" });
}
function setSyncLogState(state, color) {
    divSyncLogState.textContent = state;
    divSyncLogState.style.color = color;
}
function setSyncLogInactive() {
    // divSyncLogState.textContent = "Not syncing";
    // divSyncLogState.style.color = "gray";
    setSyncLogState("Not syncing", "gray");
    divSyncLogLog.textContent = "";
}
/////////////////



export async function replicationDialog() {
    let modRxdbSetup;
    async function loadRxdbSetup() {
        if (modRxdbSetup) return;
        modRxdbSetup = await importFc4i("rxdb-setup-esbuild");
        const ver = modRxdbSetup.getVersion();
        console.log({ m: modRxdbSetup, ver });
    }

    const secretKeyMinLength = 8;
    const keySecretKey = "mm4i-webrct-secret-key";
    const keyRoomKey = "mm4i-webrct-room-key";
    // debugger;
    const notReady = mkElt("p", undefined, "Not ready yet");
    notReady.style = `color: red; font-size: 1.5rem; background: yellow; padding: 10px;`;


    const sumTechnical = mkElt("summary", undefined, "How is sync done?");
    const detTechnical = mkElt("details", undefined, [
        sumTechnical,
        mkElt("p", undefined, `
            Mindmap sync is done using the WebRTC protocol. 
            This means that you can share your mindmaps with other devices using the same browser.
            The sync keys are used to identify your devices. 
            You can use the same key on multiple devices or different keys on different devices.`
        ),
    ]);
    detTechnical.style = `
        background-color: skyblue;
        color: blue;
        padding: 10px;
        border-radius: 5px;
        NOmargin: 0px 0px 0px 20px;
`;


    const divInfo = mkElt("div", { class: "mdc-card" }, [
        mkElt("p", undefined, `
        Here you can sync your mindmaps between your devices.
    `),
        mkElt("p", undefined, [
            mkElt("b", undefined, "Note: "),
            `Your mindmaps is only stored on your devices. 
        (No server is handling your mindmaps data.)`,
        ]),
        detTechnical,
    ]);
    divInfo.style = `
    background-color: blue;
    color: white;
    padding: 10px;
`;
    const divInfoCollapsible = modTools.mkHeightExpander(divInfo);
    const btnInfo = modMdc.mkMDCiconButton("info_i", "What does mindmap sync mean?");

    const eltTitle = mkElt("h2", undefined, "Mindmap sync");
    eltTitle.style.position = "relative";
    eltTitle.appendChild(btnInfo);
    btnInfo.style = `
    position: absolute;
    bottom: -14px;
    right: 14px;
    color: blue;
`;
    btnInfo.addEventListener("click", evt => {
        evt.stopPropagation();
        modTools.toggleHeightExpander(divInfoCollapsible);
    });



    const inpRoom = mkElt("input", { type: "text" });
    inpRoom.style = `
    margin-left: 10px;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 4px;
`;
    inpRoom.addEventListener("input", (evt) => {
        evt.stopPropagation();
        saveRoomKey();
        checkSyncKeys();
    });
    const lblRoom = mkElt("label", undefined, ["Room: ", inpRoom]);
    lblRoom.style = `
    display: grid;
    grid-template-columns: auto 1fr;
    NOgap: 10px;
    margin-top: 10px;
    font-weight: 500;
    font-style: italic;
`;
    const divRoom = mkElt("p", undefined, [
        `Room name is used to announce syncing.
    It should ideally be unique.`,
        mkElt("br"),
        // tfRoom
        lblRoom
    ]);


    const inpSecret = mkElt("input", { type: "text" });
    inpSecret.style = `
    min-width: 20px;
    margin-left: 10px;
    border: 1px solid red;
    border-radius: 5px;
    padding: 4px;
    background-color: black;
    color: red;
`;

    inpSecret.addEventListener("input", (evt) => {
        evt.stopPropagation();
        checkSyncKeys();
    });
    function checkSyncKeys() {
        let valid = true;
        const passkey = inpSecret.value.trim();
        const { strength } = getPasskeyStrength(passkey);
        if (strength < 3) {
            // document.body.classList.remove("sync-keys-valid");
            // return;
            valid = false;
        }
        const room = inpRoom.value.trim();
        if (room.length == 0) {
            // document.body.classList.remove("sync-keys-valid");
            // return;
            valid = false;
        }
        if (valid) {
            document.body.classList.add("sync-keys-valid");
            btnReplicate.inert = false;
        } else {
            document.body.classList.remove("sync-keys-valid");
            btnReplicate.inert = true;
        }
    }

    // const btnGenerate = modMdc.mkMDCiconButton("vpn_key", "Generate random passkey", 40);
    const btnGenerate = modMdc.mkMDCiconButton("enhanced_encryption", "Generate random passkey", 40);
    btnGenerate.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const body = mkElt("div", undefined, [
            mkElt("p", undefined, `This will generate a strong random secret key. `),
            mkElt("p", undefined, `It will replace your current secret key. Do you want to continue?`),
        ]);
        const answer = await modMdc.mkMDCdialogConfirm(body, "Continue", "Cancel");
        if (!answer) return;
        // const newKey = generateRobustRandomAsciiString(secretKeyMinLength);
        const newKey = generateRobustRandomAsciiString(16);
        inpSecret.value = newKey;
        getAndShowStrength(newKey);
        saveSecretKey();
        modMdc.mkMDCsnackbar("Updated secret key", 6000);
    });
    const lblSecret = mkElt("label", undefined, ["Secret: ", inpSecret, btnGenerate]);
    lblSecret.style = `
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    NOgap: 5px;
    font-weight: 500;
    font-style: italic;
`;
    inpSecret.addEventListener("input", (evt) => {
        evt.stopPropagation();
        const passkey = inpSecret.value.trim();
        const strength = getAndShowStrength(passkey);
        if (strength < 3) {
            clearSecretKey();
            return;
        }
        // debugger; // eslint-disable-line no-debugger
        saveSecretKey();
        checkSyncKeys();
    });

    // let inpRoom;
    // let keyRoomKey;
    function saveRoomKey() {
        const room = inpRoom.value.trim();
        localStorage.setItem(keyRoomKey, room);
    }
    function getRoomKey() {
        const room = localStorage.getItem(keyRoomKey);
        if (room == null) return;
        inpRoom.value = room;
    }
    // function clearRoomKey() { localStorage.removeItem(keyRoomKey); }

    function saveSecretKey() {
        const passkey = inpSecret.value.trim();
        localStorage.setItem(keySecretKey, passkey);
    }
    function getSecretKey() {
        const passkey = localStorage.getItem(keySecretKey);
        if (passkey == null) return;
        inpSecret.value = passkey;
    }
    function clearSecretKey() {
        localStorage.removeItem(keySecretKey);
    }


    function getAndShowStrength(passkey) {
        const eltProgress = prgStrength;
        const { strength, tips } = getPasskeyStrength(passkey);
        showStrength(strength, eltProgress);
        spanStrengthText.textContent = tips || "Good!";
        return strength;
    }
    function showStrength(strength, eltProgress) {
        // const percent = Math.round(strength * 100 / 3); // 3 = max strength
        const percent = Math.round((strength + 1) * 100 / 4); // 3 = max strength
        eltProgress.value = percent;
        let color = "red";
        switch (strength) {
            case 0:
                color = "red";
                break;
            case 1:
                color = "orange";
                break;
            case 2:
                color = "yellow";
                break;
            case 3:
                color = "green";
                break;
        }
        eltProgress.style.accentColor = color;
    }
    function getPasskeyStrength(passkey, minLength = secretKeyMinLength) {
        let strength = 0;
        let tips;
        if (passkey.length == 0) {
            strength = -1;
            tips = "Empty passkey";
            return { strength, tips };
        }
        if (passkey.length < minLength) {
            tips = "Too short";
            strength = 0;
            return { strength, tips };
        }
        if (passkey.match(/[a-z]/) && passkey.match(/[A-Z]/)) {
            strength += 1;
        } else {
            tips = tips || "Use lowercase/uppercase";
        }
        // Check for numbers
        if (passkey.match(/\d/)) {
            strength += 1;
        } else {
            tips = tips || "Include a number. ";
        }
        // Check for special characters
        if (passkey.match(/[^a-zA-Z\d]/)) {
            strength += 1;
        } else {
            tips = tips || "Include a special character. ";
        }
        return { strength, tips };
    }
    function generateRobustRandomAsciiString(length) {
        const values = new Uint32Array(length); // Use Uint32Array for better distribution
        window.crypto.getRandomValues(values);
        let asciiString = '';
        const validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
        const validCharsLength = validChars.length;

        for (let i = 0; i < length; i++) {
            asciiString += validChars[values[i] % validCharsLength];
        }
        return asciiString;
    }

    // const robustRandomAscii = generateRobustRandomAsciiString(32);
    // console.log(robustRandomAscii);

    const spanStrengthText = mkElt("span");
    const prgStrength = mkElt("progress", { value: 0, max: 100 });
    prgStrength.style = `
    width: 100%;
`;
    const divStrength = mkElt("div", undefined, [prgStrength, spanStrengthText]);
    divStrength.style = `
    width: 100%;
    NOmargin-top: 0px;
`;

    const divSecret = mkElt("p", undefined, [
        `The secret key is used to encrypt the transfer. `,
        mkElt("br"),
        mkElt("span", { style: "color:red;" }, "Keep it secret!"),
        mkElt("br"),
        // tfSecret
        lblSecret,
        divStrength,
    ]);

    const spanSumKeysValid = mkElt("span", undefined, "Sync keys");
    spanSumKeysValid.id = "mm4i-sumkeys-valid";
    const spanSumKeysInvalid = mkElt("span", undefined, "Sync keys are invalid");
    spanSumKeysInvalid.id = "mm4i-sumkeys-invalid";
    const spanSumKeys = mkElt("span", undefined, [spanSumKeysInvalid, spanSumKeysValid]);
    // const sumKeys = mkElt("summary", undefined, "Sync keys");
    const sumKeys = mkElt("summary", undefined, spanSumKeys);
    sumKeys.id = "sum-sync-keys";
    sumKeys.style.minHeight = "unset";
    const bodyKeys = mkElt("div", undefined, [
        mkElt("p", undefined,
            mkElt("b", undefined, `These keys must be the same on all devices you want to sync with.`)),
        divRoom,
        divSecret,
    ]);
    // const divKeysCollapsible = modTools.mkHeightExpander(bodyKeys);
    const detKeys = mkElt("details", { class: "mdc-card" }, [
        sumKeys,
        bodyKeys,
        // divKeysCollapsible,
    ]);
    detKeys.style = `
    background-color: orange;
    padding: 10px;
`;

    let replicationPool;
    const iconReplicate = modMdc.mkMDCicon("sync_alt");
    const btnReplicate = modMdc.mkMDCbutton("Sync devices", "raised", iconReplicate);
    btnReplicate.title = "Sync your mindmaps between your devices";
    btnReplicate.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        debugger; // eslint-disable-line no-debugger
        const room = `mm4i: ${inpRoom.value.trim()}`;
        const passkey = inpSecret.value.trim();
        replicationPool = await modRxdbSetup.replicateMindmaps(room, passkey);
        replicationPool.error$.subscribe(err => { console.error('WebRTC Error:', err); });
        btnStopReplicate.inert = false;
        btnTestRxdbSync.inert = true;
        btnReplicate.inert = true;
    });
    const iconStop = modMdc.mkMDCicon("stop");
    const btnStopReplicate = modMdc.mkMDCbutton("Stop", "raised", iconStop);
    btnStopReplicate.title = "Stop sync";
    btnStopReplicate.inert = true;
    btnStopReplicate.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        if (replicationPool) {
            await replicationPool.cancel();
            replicationPool = undefined;
            modMdc.mkMDCsnackbar("Stopped sync", 6000);
        } else {
            modMdc.mkMDCsnackbar("No sync to stop", 6000);
        }
        btnStopReplicate.inert = true;
        btnTestRxdbSync.inert = false;
        btnReplicate.inert = false;
    });

    const divReplicate = mkElt("p", undefined, [
        btnReplicate,
        // btnStopReplicate,
    ]);
    divReplicate.style = `
    display: flex;
    display: none;
    gap: 10px;
`;

    const btnTestRxdbSync = modMdc.mkMDCbutton("Test RxDB sync", "raised");
    btnTestRxdbSync.title = "Test sync";
    btnTestRxdbSync.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const body = mkElt("div", undefined, [
            mkElt("p", undefined, `This is a test of the RxDB sync functionality. `),
            mkElt("p", undefined, `It will not affect your mindmap.`),
        ]);
        const answer = await modMdc.mkMDCdialogConfirm(body, "Continue", "Cancel");
        if (answer) {
            await loadRxdbSetup();
            const room = "mm4i: test sync";
            const passkey = "test sync passkey";
            replicationPool = await modRxdbSetup.replicateMindmaps(room, passkey);
            replicationPool.error$.subscribe(err => console.error('WebRTC Error:', err));
            btnTestRxdbSync.inert = true;
            btnReplicate.inert = true;
            btnStopReplicate.inert = false;
            modMdc.mkMDCsnackbar("Started sync", 6000);
        } else {
            modMdc.mkMDCsnackbar("Canceled sync", 6000);
        }
    });
    const divTestRxdbSync = mkElt("p", undefined, [
        mkElt("div", undefined, "Debugging sync"),
        btnTestRxdbSync,
    ]);
    divTestRxdbSync.style = `
    background-color: black;
    color: white;
    padding: 10px;
    `;


    const btnTestIdbReplicator = modMdc.mkMDCbutton("Test idb-replicator", "raised");
    btnTestIdbReplicator.title = "just a test";
    btnTestIdbReplicator.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const body = mkElt("div", undefined, [
            mkElt("p", undefined, `This is a test of the sync functionality. `),
            mkElt("p", undefined, `It will not affect your mindmap.`),
        ]);
        const answer = await modMdc.mkMDCdialogConfirm(body, "Continue", "Cancel");
        if (answer) {
            const room = "mm4i: test sync";
            const passkey = "test sync passkey";
            // replicationPool = await modRxdbSetup.replicateMindmaps(room, passkey);
            // replicationPool.error$.subscribe(err => console.error('WebRTC Error:', err));
            // btnTestSync.inert = true;
            // btnReplicate.inert = true;
            // btnStopReplicate.inert = false;
            const modIdbReplicator = await importFc4i("idb-replicator");
            console.log({ modIdbReplicator });
            debugger;
            modIdbReplicator.establishConnection("test-client-id");
            modMdc.mkMDCsnackbar("Started sync", 6000);
        } else {
            modMdc.mkMDCsnackbar("Canceled sync", 6000);
        }
    });

    const divIdbReplicator = mkElt("div", undefined, [
        mkElt("p", undefined, `This is a test. Nothing is done here yet.`),
        btnTestIdbReplicator,
    ]);


    // const btnGrok = mkElt("button", { class: "mdc-button mdc-button--raised" }, "Grok variant");
    const iconGrok = modMdc.mkMDCicon("sync_alt");
    const btnGrok = modMdc.mkMDCbutton("Sync devices", "raised", iconGrok);
    btnGrok.title = "Sync your mindmaps between your devices";
    btnGrok.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        fromGrok();
    });
    const divGrok = mkElt("p", undefined, [
        btnGrok,
        btnStopReplicate,
    ]);
    divGrok.style = `
      display: flex;
      gap: 10px;
    `;



    const body = mkElt("div", undefined, [
        notReady,
        eltTitle,
        divInfoCollapsible,
        detKeys,
        // mkElt("hr"),
        divGrok,
        divSyncLog,
    ]);

    getSecretKey();
    getRoomKey();
    checkSyncKeys();

    await modMdc.mkMDCdialogAlert(body);

}

async function fromGrok() {
    // https://www.videosdk.live/developer-hub/webrtc/webrtc-signaling-server
    // https://webrtc.org/getting-started/peer-connections
    // Configuration for STUN servers (works in browser)
    const configuration = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' }
        ]
    };

    // Establish WebSocket connection (browser-compatible)

    // const urlSignaling= "https:stun.l.google.com:5349" ;
    // const urlSignaling = "wss://signaling.rxdb.info/";
    // const urlSignaling = "wss://tracker.openwebtorrent.com";
    const urlSignaling = "ws://localhost:3000";

    // FIX-ME: Why is not this error handled??
    // const signalingServer = new WebSocket(urlSignaling);
    // let signalingServer;


    // debugger;
    /*
    try {
        signalingServer = new WebSocket(urlSignaling);
        console.log("signalingServer.on:", signalingServer.on);
    } catch (error) {
        const msg = `Error at new WebSocket(${ urlSignaling }`;
        console.error(msg, error);
        throw Error(msg);
    }
    */

    function connectWebSocket(urlSignaling) {
        function logConnectWebSocket(...args) {
            logSyncLog(args[0]);
            console.log("%c Connect WebSocket: ", "background:darkgreen; color:white;", ...args);
        }
        return new Promise((resolve, reject) => {
            const signalingServer = new WebSocket(urlSignaling);

            // signalingServer.onopen = function () {
            signalingServer.addEventListener("open", function (evt) {
                logConnectWebSocket('open: ', evt);
                resolve(signalingServer);  // Resolve the promise when the connection is successful
            });
            signalingServer.addEventListener("init", function (msg) {
                logConnectWebSocket('init: ', msg);
                throw Error("init event not expected");
            });

            signalingServer.addEventListener("message", function (event) {
                logConnectWebSocket('message: ', event.data, event);
            });

            // signalingServer.onerror = function (event) {
            signalingServer.addEventListener("error", function (event) {
                console.error('WebSocket error:', event);
                reject(new Error('WebSocket connection failed'));  // Reject the promise on error
            });

            // signalingServer.onclose = function (event) {
            signalingServer.addEventListener("close", function (event) {
                if (!event.wasClean) {
                    console.error('Connection closed unexpectedly', event);
                    reject(new Error('WebSocket connection closed unexpectedly'));  // Reject the promise if the connection closes unexpectedly
                }
            });
        });
    }

    // Usage example with async/await
    async function initiateConnection(urlSignaling) {
        try {
            // const urlSignaling = 'ws://your-server-url'; // replace with your WebSocket server URL
            const signalingServer = await connectWebSocket(urlSignaling);  // Wait for the connection to be either opened or error out
            console.log('WebSocket connection established:', signalingServer);
            // Do something with the signalingServer if needed
            return signalingServer;
        } catch (error) {
            console.error('Failed to connect:', error.message);
        }
    }

    setSyncLogState("Syncing", "green");
    const signalingServer = await initiateConnection(urlSignaling);
    const myId = new Date().toISOString().slice(-10);
    sendFirstMessageToServer(myId);
    // logSyncLog("signalingServer:", { signalingServer });
    let peerConnection;
    let dataChannel;
    if (!startPeerConnection()) { return; }
    setupDataChannel();
    // "offer"




    console.log("signalingServer:", { signalingServer });
    if (!signalingServer) {
        // alert("Could not connect to signaling server. Please check your connection.");
        modMdc.mkMDCdialogAlert(`Could not connect to signaling server at ${urlSignaling}.`);
        return;
    }



    // Handle WebSocket messages
    signalingServer.addEventListener("message", async (message) => {
        // console.log("%csignalingServer:", "background:blue; color:white;", { message });
        logWebSocketInfo("signalingServer:", { message });
        const data = JSON.parse(message.data);

        const dataType = data.type;
        console.log("signalingServer:", { dataType, data });
        switch (dataType) {
            case 'init':
                throw Error("init event not expected");
                break;
            case 'offer':
                await handleOffer(data.offer);
                break;
            case 'answer':
                await handleAnswer(data.answer);
                break;
            case 'candidate':
                await handleCandidate(data.candidate);
                break;
        }
    });

    // Function to start the connection
    async function startPeerConnection() {
        logWebSocketInfo("start Peer Connection", { configuration });
        logSyncLog("Start peer connection");
        try {
            peerConnection = new RTCPeerConnection(configuration);
            // dataChannel = peerConnection.createDataChannel('textChannel');
            dataChannel = setupDataChannel();

            // Handle ICE candidates
            peerConnection.addEventListener("icecandidate", (event) => {
                if (event.candidate) {
                    signalingServer.send(JSON.stringify({
                        type: 'candidate',
                        candidate: event.candidate
                    }));
                }
            });

            // Handle connection state changes (optional logging)
            peerConnection.addEventListener("connectionstatechange", () => {
                logWebSocketInfo('%cPeer connection state:', peerConnection.connectionState);
            });

            function checkConnectionStateIsOpen() {
                const state = peerConnection.connectionState;
                console.log("Peer connection state:", state);
                if (state === "disconnected" || state === "failed") {
                    const msg = `Peer connection is "${state}"`;
                    logWebSocketWarn(msg);
                    throw Error(msg);
                    return false;
                }
                const strReadyState = getSignalingServerReadyState();
                console.log({ strReadyState });
                if (strReadyState !== "OPEN") {
                    const msg = `signaling server state is "${strReadyState}", should be OPEN"`;
                    logWebSocketWarn(msg);
                    throw Error(msg);
                }
            }

            // Create and send offer
            logWebSocketInfo("Create and send offer");
            logSyncLog("Create and send offer");
            try {
                checkConnectionStateIsOpen();
                const offer = await peerConnection.createOffer();
                checkConnectionStateIsOpen();
                await peerConnection.setLocalDescription(offer);
                checkConnectionStateIsOpen();
                logWebSocketInfo("created offer");
                logSyncLog("Created offer");

                signalingServer.send(JSON.stringify({
                    type: 'offer',
                    offer: offer
                }));
                logWebSocketInfo("offer sent");
                logSyncLog("Offer sent");
                return true;
            } catch (error) {
                logWebSocketError('Error creating and sending offer:', error);
                const eltH2 = mkElt("h2", undefined, `Error creating and sending offer`);
                eltH2.style.color = "red";
                const body = mkElt("div", undefined, [
                    eltH2,
                    mkElt("p", undefined, error.message),
                    mkElt("p", undefined, `Please check your connection.`),
                ]);
                modMdc.mkMDCdialogAlert(body);
                return false;
            }

        } catch (error) {
            console.error('Error starting connection:', error);
            return false;
        }
    }

    // Handle incoming offer
    async function handleOffer(offer) {
        logWebSocketInfo("handle offer", { offer });
        logSyncLog("Handle offer");
        try {
            peerConnection = new RTCPeerConnection(configuration);

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    signalingServer.send(JSON.stringify({
                        type: 'candidate',
                        candidate: event.candidate
                    }));
                }
            };

            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            signalingServer.send(JSON.stringify({
                type: 'answer',
                answer: answer
            }));
            logWebSocketInfo("answer sent");
            logSyncLog("Answer sent");
        } catch (error) {
            // console.error('Error handling offer:', error);
            logWebSocketError('Error handling offer:', error);
        }
    }

    // Handle incoming answer
    async function handleAnswer(answer) {
        try {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            // console.error('Error handling answer:', error);
            logWebSocketError('Error handling answer:', error);
        }
    }

    // Handle ICE candidate
    async function handleCandidate(candidate) {
        try {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            // console.error('Error handling candidate:', error);
            logWebSocketError('Error handling candidate:', error);
        }
    }

    // Optional: Add data channel
    function setupDataChannel() {
        const dataChannel = peerConnection.createDataChannel('textChannel');

        dataChannel.addEventListener("open", () => console.log('Data channel open'));
        dataChannel.addEventListener("message", (evt) => console.log('Message:', evt.data));
        dataChannel.addEventListener("error", (evt) => { logWebSocketError('Data channel error:', evt); });

        return dataChannel;
    }

    function sendFirstMessageToServer(myId) {
        logWebSocketInfo("send FirstMessageToServer");
        logSyncLog("First Message To Server");
        const firstMsg = {
            type: "client-init",
            room: "test-room",
            myId
        }
        signalingServer.send(JSON.stringify(firstMsg));
    }
    // Start when WebSocket connects
    signalingServer.addEventListener("open", () => {
        throw Error("open event not expected, should already have been handled");
        debugger;  // eslint-disable-line no-debugger
        const strReadyState = getSignalingServerReadyState();
        console.log(`Open: signaling server, readyState: ${strReadyState}`);
        // startPeerConnection();
        // Optional: createDataChannel();
    });
    signalingServer.addEventListener("close", (why) => {
        const strReadyState = getSignalingServerReadyState();
        logWebSocketInfo(`Close: signaling server, readyState: ${strReadyState}`, { why });
    });

    // signalingServer.onerror = (error) => {
    signalingServer.addEventListener("error", (error) => {
        const strReadyState = getSignalingServerReadyState();
        const msg = `Error: signaling server, readyState: ${strReadyState}`;
        // console.error(msg, error);
        logWebSocketError(msg, error);
        throw Error(msg);
    });

    function getSignalingServerReadyState() {
        switch (signalingServer.readyState) {
            // case 0:
            case WebSocket.CONNECTING:
                return "CONNECTING";
            // case 1:
            case WebSocket.OPEN:
                return "OPEN";
            // case 2:
            case WebSocket.CLOSING:
                return "CLOSING";
            // case 3:
            case WebSocket.CLOSED:
                return "CLOSED";
            default:
                throw Error(`UNKNOWN signalingServer.readyState: ${signalingServer.readyState}`);
        }
        signalingServer;
    }

    function logWebSocketInfo(...args) {
        console.log("%c WebSocket info: ", "background:blue; color:white;", ...args);
    }
    function logWebSocketError(...args) {
        console.error("%c WebSocket error: ", "background:red; color:white;", ...args);
    }
    function logWebSocketWarn(...args) {
        console.warn("%c WebSocket warn: ", "background:darkorange; color:black;", ...args);
    }
}