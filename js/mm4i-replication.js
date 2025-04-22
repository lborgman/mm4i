// @ts-check
const MM4I_REPL_VER = "0.0.01";
window["logConsoleHereIs"](`here is mm4i-replication.js, module, ${MM4I_REPL_VER}`);
console.log(`%chere is mm4i-replication.js ${MM4I_REPL_VER}`, "font-size:20px;");
if (document.currentScript) { throw "mm4i-replication.js is not loaded as module"; }


const btnTestSend = document.createElement("button");
btnTestSend.textContent = "send";
btnTestSend.title = "Send test message to peer";
btnTestSend.style = `
    background-color: violet;
    border-radius: 50%;
    box-shadow: 7px 7px 5px 0px rgba(0,0,0,0.5);
`;
btnTestSend.inert = true;



const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];

const mod2peers = await importFc4i("webrtc-2-peers");
console.log({ mod2peers });

// const keyRoomKey = "mm4i-webrct-room-key";
const secretKeyMinLength = 8;
// const keySecretKey = "mm4i-webrct-secret-key";
// const keyOpenRelayCred = "mm4i-openrelay-key";
// const keyUseOpenRelay = "mm4i-openrelay-checked";



const modTools = await importFc4i("toolsJs");
const modMdc = await importFc4i("util-mdc");

// @ts-ignore
/** @type { import('../js/mod/local-settings.js') } */
const modLocalSettings = await importFc4i("local-settings");

/** @extends modLocalSettings.LocalSetting */
class SettingsRepl extends modLocalSettings.LocalSetting {
    constructor(key, defaultValue) { super("mm4i-repl-", key, defaultValue); }
}
const settingUseOpenRelay = new SettingsRepl("use-open-relay", false);
const settingOpenRelayCred = new SettingsRepl("open-relay-cred", "");
const settingRoom = new SettingsRepl("room", "");
const settingSecret = new SettingsRepl("secret", "");


/*
function getOpenRelayChecked() {
    const checked = localStorage.getItem(keyUseOpenRelay);
    console.log({ checked })
    chkOpenRelay.checked = checked != null;
    return checked;
}
*/
/*
function saveOpenRelayChecked() {
    const checked = chkOpenRelay.checked;
    if (checked) {
        localStorage.setItem(keyUseOpenRelay, "checked");
    } else {
        localStorage.removeItem(keyUseOpenRelay);
    }
}
*/



////////////////
// Part of dialog, but must be accessed from outside the dialog
const divSyncLogState = mkElt("div");
divSyncLogState.style = `
        font-size: 1.2rem;
        font-weight: 500; 
    `;
const btnSyncLogLog = mkElt("button", undefined, "Details");
btnSyncLogLog.style = `
    border: none;
    background: none;
    text-decoration: underline;
`;
btnSyncLogLog.title = "Show/hide details";

const divSyncLogHeader = mkElt("div", undefined, [
    mkElt("div", { style: "display:flex; gap:10px;" }, ["Sync:", divSyncLogState]),
    btnSyncLogLog,
]);
divSyncLogHeader.style = `
    display: flex;
    justify-content: space-between;
`;

const divSyncLogLog = mkElt("div");
divSyncLogLog.style = `
        color: gray;
        max-height: 100px;
        overflow-y: auto;
    `;

const divSyncLog = mkElt("div", undefined, [
    divSyncLogHeader,
    divSyncLogLog,
]);

btnSyncLogLog.addEventListener("click", evt => {
    evt.stopPropagation();
    divSyncLogLog.style.display = "none";
});
setSyncLogInactive();


function _logWSsyncLog(msg) {
    const line = mkElt("div", undefined, msg);
    divSyncLogLog.appendChild(line);
    line.scrollIntoView({ behavior: "smooth", block: "end" });
}
function setSyncLogState(state, color) {
    divSyncLogState.textContent = state;
    divSyncLogState.style.color = color;
    divSyncLogHeader.inert = false;
}
function setSyncLogInitiator(isInitiator) {
    divSyncLogState.style.textDecoration = isInitiator ? "overline" : "underline";
}

function setSyncLogInactive() {
    setSyncLogState("Not started", "gray");
    divSyncLogLog.textContent = "";
    divSyncLogHeader.inert = true;
}
/////////////////



let dataChannel;
export async function replicationDialog() {
    const notReady = mkElt("p", undefined, `Not ready yet (${MM4I_REPL_VER})`);
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



    // const inpRoom = mkElt("input", { type: "text" });
    const inpRoom = settingRoom.getInputElement();
    inpRoom.style = `
    margin-left: 10px;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 4px;
`;
    inpRoom.addEventListener("input", (evt) => {
        // evt.stopPropagation();
        // saveRoomKey();
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
        // `Name announced.`,
        // mkElt("br"),
        lblRoom
    ]);


    // const inpSecret = mkElt("input", { type: "text" });
    const inpSecret = settingSecret.getInputElement();
    inpSecret.style = `
    min-width: 20px;
    margin-left: 10px;
    border: 1px solid red;
    border-radius: 5px;
    padding: 4px;
    background-color: black;
    color: red;
`;

    // inpSecret.addEventListener("input", (evt) => { // evt.stopPropagation(); checkSyncKeys(); });
    function checkSyncKeys() {
        let valid = true;
        // const passkey = inpSecret.value.trim();
        const passkey = settingSecret.valueS.trim();
        const { strength } = getPasskeyStrength(passkey);
        if (strength < 3) {
            valid = false;
        }
        // const room = inpRoom.value.trim();
        const room = settingRoom.valueS.trim();
        if (room.length == 0) {
            valid = false;
        }
        if (valid) {
            document.body.classList.add("sync-keys-valid");
            btnStartReplication.inert = false;
        } else {
            document.body.classList.remove("sync-keys-valid");
            btnStartReplication.inert = true;
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
        // inpSecret.value = newKey; // This would lead to inpSecret out of sync with settingSecret
        settingSecret.value = newKey;
        getAndShowStrength(newKey);
        // saveSecretKey();
        modMdc.mkMDCsnackbar("Updated secret key", 6000);
    });
    // const lblSecret = mkElt("label", undefined, ["Secret: ", inpSecret, btnGenerate]);
    const lblSecret = mkElt("label", undefined, ["Key: ", inpSecret, btnGenerate]);
    lblSecret.style = `
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    NOgap: 5px;
    font-weight: 500;
    font-style: italic;
`;
    inpSecret.addEventListener("input", (evt) => {
        // evt.stopPropagation();
        const passkey = inpSecret.value.trim();
        const strength = getAndShowStrength(passkey);
        if (strength < 3) {
            // clearSecretKey();
            // return;
        }
        checkSyncKeys();
    });




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
        let asciiString = "";
        const validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!\"#$%&'() * +,-./: ;<=>? @[\\] ^ _`{|}~";
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
    width: 100 %;
        `;
    const divStrength = mkElt("div", undefined, [prgStrength, spanStrengthText]);
    divStrength.style = `
        width: 100 %;
        `;

    const divSecret = mkElt("p", undefined, [
        // `Sync start: `,
        // mkElt("br"),
        lblSecret,
        divStrength,
    ]);



    const _inpOpenRelayCredential = settingOpenRelayCred.getInputElement();
    _inpOpenRelayCredential.addEventListener("change", _evt => {
        checkCanUseOpenRelay();
    });
    _inpOpenRelayCredential.addEventListener("input", _evt => {
        // saveOpenRelayCredential();
        checkCanUseOpenRelay();
    });
    _inpOpenRelayCredential.style = `
    min-width: 20px;
    NOmargin-left: 10px;
    border: 1px solid red;
    border-radius: 5px;
    padding: 4px;
    background-color: black;
    color: red;
`;
    // const chkOpenRelay = mkElt("input", { type: "checkbox" });
    // console.log({ settingUseOpenRelay });
    // settingUseOpenRelay.bindToInput(chkOpenRelay, true);
    const chkOpenRelay = settingUseOpenRelay.getInputElement();
    const _lblChkOpenRelay = mkElt("label", undefined, [
        "Use Open Relay STUN: ",
        chkOpenRelay
    ]);
    _lblChkOpenRelay.style = `
        display: flex;
        gap: 10px;
    `;
    /*
    chkOpenRelay.addEventListener("change", _evt => {
        console.log("chkOpenrelay, change", chkOpenRelay.checked);
    });
    chkOpenRelay.addEventListener("input", _evt => {
        console.log("chkOpenrelay, input", chkOpenRelay.checked);
        saveOpenRelayChecked();
    });
    */

    // getOpenRelayChecked();
    // getOpenRelayCredential();
    checkCanUseOpenRelay();

    function checkCanUseOpenRelay() {
        // const keyLen = inpOpenRelayCredential.value.trim().length;
        const keyLen = settingOpenRelayCred.valueS.trim().length;
        console.log({ keyLen });
        _lblChkOpenRelay.inert = keyLen < 36;
    }

    const _divOpenRelay = mkElt("p", undefined, [
        mkElt("a", { href: "https://dashboard.metered.ca/" }, "Open Relay"),
        " credential:",
        _inpOpenRelayCredential,
        _lblChkOpenRelay,
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
        divRoom,
        divSecret,
        // _divOpenRelay, // Google STUN servers seems to work just as well
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
    /*
    const OLDiconReplicate = modMdc.mkMDCicon("sync_alt");
    const OLDbtnReplicate2 = modMdc.mkMDCbutton("Sync devices", "raised", OLDiconReplicate);
    OLDbtnReplicate2.title = "Sync your mindmaps between your devices";
    OLDbtnReplicate2.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        OLDbtnStopReplicate.inert = false;
        OLDbtnReplicate2.inert = true;
        const room = `mm4i: ${inpRoom.value.trim()}`;
        const passkey = inpSecret.value.trim();
        debugger; // eslint-disable-line no-debugger
    });
    */

    /*
    const divReplicate2 = mkElt("p", undefined, [
        btnReplicate2,
    ]);
    divReplicate2.style = `
        display: flex;
        display: none;
        gap: 10px;
        `;
    */



    /*
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
            const modIdbReplicator = await importFc4i("idb-replicator");
            console.log({ modIdbReplicator });
            debugger;
            modIdbReplicator.establishConnection("test-client-id");
            modMdc.mkMDCsnackbar("Started sync", 6000);
        } else {
            modMdc.mkMDCsnackbar("Canceled sync", 6000);
        }
    });
    */


    /*
    const divIdbReplicator = mkElt("div", undefined, [
        mkElt("p", undefined, `This is a test.Nothing is done here yet.`),
        btnTestIdbReplicator,
    ]);
    */


    const iconReplication = modMdc.mkMDCicon("sync_alt");
    const btnStartReplication = modMdc.mkMDCbutton("Sync devices", "raised", iconReplication);
    btnStartReplication.title = "Sync your mindmaps between your devices";

    const iconStop = modMdc.mkMDCicon("stop");
    const btnStopReplication = modMdc.mkMDCbutton("Stop", "raised", iconStop);
    btnStopReplication.title = "Stop sync";
    btnStopReplication.inert = true;

    let isReplicating = false;

    btnStartReplication.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        btnStartReplication.inert = true;
        btnStopReplication.inert = false;
        btnTestSend.inert = false;
        isReplicating = true;
        // openChannelToPeer(doSync);
        dataChannel = await mod2peers.openChannelToPeer(doSync, {
            setSyncLogState,
            setSyncLogInitiator,
            logSignaling,
            logWSimportant,
            logWSinfo,
            logWSdetail,
            logDataChannel,
        },
            btnTestSend
        );
        // debugger;
        doSync(dataChannel);
    });
    btnStopReplication.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        isReplicating = false;
        if (replicationPool) {
            await replicationPool.cancel();
            replicationPool = undefined;
            modMdc.mkMDCsnackbar("Stopped sync", 6000);
        } else {
            modMdc.mkMDCsnackbar("No sync to stop", 6000);
        }
        btnStopReplication.inert = true;
        btnStartReplication.inert = false;
    });



    btnTestSend.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const msg = "Hi (" + Date().toString().slice(0, 24) + ")";
        logWSdetail("btnTestSend msg:", msg);
        console.log("btnTestSend", dataChannel.id);
        const dataChannelState = dataChannel?.readyState;
        // const signalingChannel.
        if (dataChannel && dataChannelState === "open") {
            const obj = {
                type: "test-hi",
                msg
            }
            dataChannel.send(msg);
            // dataChannel.send(JSON.stringify(obj));
            const msgInfo = `btnTestSend Sent message: ${msg} `;
            console.log(msgInfo);
            modMdc.mkMDCsnackbar(msgInfo)
        } else {
            const msgError = `btnTestSend Data channel not open: "${dataChannelState}"`;
            console.error(msgError, { isInitiator });
            modMdc.mkMDCsnackbar(msgError, "background:red;");
        }
    });

    const divGrok = mkElt("p", undefined, [
        btnStartReplication,
        btnStopReplication,
        btnTestSend,
    ]);
    divGrok.style = `
        display: flex;
        gap: 10px;
        `;


    const spanMyId = mkElt("span", undefined, "for myId");
    spanMyId.id = "span-my-id";
    const spanNumId = mkElt("span", undefined, "for numId");
    spanNumId.id = "span-num-id";
    const divIds = mkElt("div", undefined, [spanMyId, " / ", spanNumId,]);
    divIds.id = "div-ids";
    divIds.style = `
      background: lightgray;
      padding: 0 2px;
      color: blueviolet;
      margin-bottom: 2px;
    `;

    const body = mkElt("div", undefined, [
        notReady,
        eltTitle,
        divInfoCollapsible,
        detKeys,
        // mkElt("hr"),
        divGrok,
        divIds,
        divSyncLog,
    ]);
    body.id = "sync-dialog-body";

    // getSecretKey();
    // getRoomKey();
    checkSyncKeys();

    await modMdc.mkMDCdialogAlert(body);

}

let signalingChannel;
let myId;
let clientNum;
let isInitiator = false;
async function OLDopenChannelToPeer(funDoSync) {
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
                logSignaling("open", evt);
                resolve(signalingChannel);  // Resolve the promise when the connection is successful
            });
            signalingChannel.addEventListener("init", function (msg) {
                logSignaling("init", msg);
                throw Error("init event not expected");
            });

            signalingChannel.addEventListener("message", function (event) {
                const jsonData = event.data;
                const data = JSON.parse(jsonData);
                const dataType = data.type;
                logSignaling(`message: type ${dataType}`, event);
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
            // logWSdetail("WebSocket signaling server connection established:", signalingServerChannel);
            return signalingServerChannel;
        } catch (error) {
            logWSError("Failed to connect to signaling server:", error.message);
        }
    }

    setSyncLogState("Initialize syncing", "yellowgreen");
    signalingChannel = await initiateSignalingConnection(urlSignaling);
    myId = new Date().toISOString().slice(-10);
    const spanMyId = document.getElementById("span-my-id");
    if (!spanMyId) throw Error(`Could not find span-my-id`);
    spanMyId.textContent = myId;
    let myOffer;
    sendFirstMessageToServer(myId);
    let peerConnection;
    if (!sendPeerOfferToSignaling()) { return; }




    // logWSdetail("signaling Server:", { signalingChannel });
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
        logWSdetail(`signalingServer message: ${dataType}`, { data });
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
            logWSinfo("Peer connection already exists, skipping start");
            return;
        }
        // logWebSocketInfo("start Peer Connection");
        // _logSyncLog("Start peer connection");

        await setupPeerConnection();
        if (!peerConnection) throw Error("peerConnection is undefined");

        logWSimportant("await peerConnection.createOffer()");
        myOffer = await peerConnection.createOffer();
        // logWSdetail("Offer created:", myOffer);
        // await peerConnection.setLocalDescription(myOffer);
        signalingChannel.send(JSON.stringify({
            type: "offer",
            offer: myOffer,
            myId,
            clientNum
        }));
        logSignaling("send: Offer");
        setSyncLogState("Wating for peer", "red");
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

        if (settingUseOpenRelay.value) {
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

        logWSimportant("new RTCPeerConnection", { iceConfiguration });
        peerConnection = new RTCPeerConnection(iceConfiguration);

        initialCreateDatachannel();
        function initialCreateDatachannel() {
            logWSimportant('peerConnection.createDataChannel("textChannel"');
            dataChannel = peerConnection.createDataChannel("textChannel");
            // setupDataChannel();
        }


        // Standard RTCPeerConnection events
        peerConnection.addEventListener("icecandidate", (event) => {
            const candidate = event.candidate;
            if (candidate) {
                logWSimportant("PCmessage icecandidate");
                logSignaling("send: icecandidate");
                signalingChannel.send(JSON.stringify({
                    type: "candidate",
                    candidate: candidate
                }));
            } else {
                logWSinfo("PCmessage icecandidate:", candidate);
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
            logWSimportant("PCmessage negotiationneeded");
            // FIX-ME:
            // startPeerConnection(); // Trigger offer creation if needed
        });

        peerConnection.addEventListener("signalingstatechange", () => {
            const msg = `Peer signalingstatechange: ${peerConnection.signalingState}`;
            logWSimportant(msg);
        });



        peerConnection.addEventListener("iceconnectionstatechange", () => {
            const newState = peerConnection.iceConnectionState;
            logWSimportant(`Peer iceconnectionstatechange: ${newState}`);
        });

        peerConnection.addEventListener("icegatheringstatechange", () => {
            const msg = `Peer icegatheringstatechange: ${peerConnection.iceGatheringState}`;
            logWSimportant(msg);
        });

        peerConnection.addEventListener("connectionstatechange", () => {
            const state = peerConnection.connectionState;
            const msg = `Peer connectionstatechange: ${state}`;
            if (state == "failed") {
                logWSError(msg);
            } else {
                logWSimportant(msg);
            }
        });

        logWSinfo("Adding listener for datachannel");
        peerConnection.addEventListener("datachannel", (event) => {
            const msg = `Peer datachannel ${dataChannel.id}: ${dataChannel.label}`;
            logWSimportant(msg);
            if (!isInitiator) {
                const oldChannel = dataChannel;
                const newChannel = event.channel;
                const oldId = oldChannel.id;
                const newId = newChannel.id;
                if (oldId == newId) {
                    debugger;
                    logWSimportant(`Something has changed in API: old: ${oldId} == new: ${newId}`);
                }
                logWSimportant(`dataChannel = event.channel, old: ${oldId}, new: ${newId}`);
                const oldState = oldChannel.readyState;
                const newState = newChannel.readyState;
                logWSimportant(`states - old: ${oldId}/${oldState}, new: ${newId}/${newState}`);
                // FIX-ME: to close or not to close???
                // Currently closing the old channel will also close the new (2025-04-21)
                // oldChannel.close();
                dataChannel = newChannel;
                setupDataChannel();
            } else {
                logWSimportant("Ignoring received data channel as initiator");
            }
        });

        peerConnection.addEventListener("track", (event) => {
            logWSimportant("PCmessage track:", event.track.kind);
            // Not used here (no media), but logged for completeness
        });

        peerConnection.addEventListener("close", () => {
            btnTestSend.style.backgroundColor = "red";
            btnTestSend.style.color = "black";
            const msg = `Peer close, close dataChannel:${dataChannel.id}`;
            logWSimportant(msg);
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


        setSyncLogInitiator(isInitiator);
        const me = `${myId} / clientNum:${clientNum}`;
        logWSimportant(`handle offer, isInitiator:${isInitiator}`, { offer, from, me });
        const re = /^(.*?) \/ (.*?)$/;
        const mFrom = re.exec(from);
        if (!mFrom) throw Error(`mFrom is ${mFrom}`);
        const fromMyId = mFrom[1];
        const fromClient = mFrom[2];
        const fromClientNum = parseInt(fromClient.slice(10));
        if (fromMyId == myId) debugger;
        if (fromClientNum == clientNum) debugger;
        if (isInitiator) {
            logWSdetail("Is initiator, skipping offer");
            // FIX-ME: has not this already been done???
            logWSimportant("peerConnection.setLocalDescription(myOffer)", myOffer);
            await peerConnection.setLocalDescription(myOffer);
            setupDataChannel();
            return;
        }
        setupDataChannel();
        try {
            logWSimportant("peerConnection.setRemoteDescription");
            await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
            logWSimportant("await peerConnection.createAnswer()");
            const answer = await peerConnection.createAnswer();
            logWSimportant("peerConnection.setLocalDescription(answer)");
            await peerConnection.setLocalDescription(answer); // Will send ICE Candidate to server

            signalingChannel.send(JSON.stringify({
                type: "answer",
                answer: answer
            }));
            logWSimportant("Answer sent");
        } catch (error) {
            logWSError("Error handling offer", error);
        }
    }

    // Handle incoming answer
    async function handleAnswer(answer) {
        logWSdetail("handleAnswer", { isTheInitiator: isInitiator });
        if (isInitiator) return;
        try {
            logWSimportant("await peerConnection.setRemoteDescription", { answer });
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            logWSError("Error handling answer", error);
        }
    }

    // Handle ICE candidate
    async function handleCandidate(candidate, data) {
        // logWSdetail("handleCandidate", candidate);
        console.log("%chandleCandidate", "background:yellow;color:black; font-size:20px;", { candidate, data });
        try {
            logWSimportant("peerConnection.addIceCanditate", candidate);
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            logWSError("Error in handlingCandidate", error, candidate);
        }
    }

    function setupDataChannel() {
        // console.warn(`%c>>>>>>>>>>>> setupDataChannel ${dataChannel.id}`, "font-size:20px;");
        logDataChannel(dataChannel.id, "setupDataChannel", dataChannel);
        // const dataChannelSetup = dataChannel;

        dataChannel.addEventListener("open", () => {
            const readyState = dataChannel.readyState;
            console.log({ readyState });
            btnTestSend.style.backgroundColor = "greenyellow";
            btnTestSend.style.color = "black";
            // FIX-ME: Why do we get this 2 times???
            logDataChannel(dataChannel.id, "open");
            signalingChannel.close();
            setSyncLogState("Connected to peer", "green");
            funDoSync(dataChannel);
        });
        dataChannel.addEventListener("message", (evt) => logDataChannel(dataChannel.id, "message", evt.data));
        dataChannel.addEventListener("message", (evt) => console.log("message 2", dataChannel.id, evt.data));
        dataChannel.addEventListener("error", (evt) => {
            btnTestSend.style.backgroundColor = "black";
            btnTestSend.style.color = "red";
            logWSError("datachannel error", evt);
        });
        dataChannel.addEventListener("close", (evt) => {
            btnTestSend.style.backgroundColor = "red";
            btnTestSend.style.color = "black";
            logDataChannel(dataChannel.id, "close", evt.data);
        });

        return dataChannel;
    }

    function sendFirstMessageToServer(myId) {
        logSignaling(`send: FirstMessage, myId:${myId}`);
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


let handledOpenBefore = false;
const modDbMindmaps = await importFc4i("db-mindmaps");
// debugger;
const myMindmaps = await (async () => {
    const arrAll = await modDbMindmaps.DBgetAllMindmaps();
    console.log({ arrAll });
    const arrMetaName = arrAll.map(mm => {
        console.log(mm);
        const metaName = mm.jsmindmap.meta.name;
        return metaName;
    });
    console.log({ arrMetaName });
    const mindmaps = arrMetaName.reduce((current, item) => {
        const [key, updated] = item.split("/");
        current[key] = updated;
        return current;
    }, {});
    console.log({ myMindmaps: mindmaps });
    return mindmaps;
})();
let peerMindmaps;
async function doSync() {
    // debugger;
    console.log(dataChannel.id, { channelToPeer: dataChannel });
    const wasOpenedBefore = handledOpenBefore;
    // if (wasOpenedBefore) debugger; // FIX-ME:
    handledOpenBefore = true;
    dataChannel.addEventListener("message", evt => {
        evt.stopPropagation();
        logDataChannel(dataChannel.id, "message synch", evt);
        handleMessageSync(evt);
    });
    function tellWhatIneed() {
        if (!myMindmaps) {
            console.log(`tellWhatIneed, myMindmaps is ${myMindmaps}`);
            return;
        }
        if (!peerMindmaps) {
            console.log(`tellWhatIneed, peerMindmaps is ${peerMindmaps}`);
            return;
        }
        const myKeys = Object.keys(myMindmaps);
        const peerKeys = Object.keys(peerMindmaps);
        const needKeys = [];
        peerKeys.forEach(pk => {
            if (!myKeys.includes(pk)) {
                needKeys.push(pk);
            } else {
                const myUpdated = myMindmaps[pk];
                const peerUpdated = peerMindmaps[pk];
                console.log({ myUpdated, peerUpdated });
                if (peerUpdated > myUpdated) {
                    needKeys.push(pk);
                }
            }
        });
        console.log({ needKeys });
        const obj = {
            type: "need-keys",
            needKeys
        }
        dataChannel.send(JSON.stringify(obj));
    }
    function handleMessageSync(evt) {
        console.log("handleMessageSync", { evt });
        const strData = evt.data;
        const tofData = typeof strData;
        if (tofData != "string") throw Error(`Expeced data to be type "string", but it is ${tofData}`);
        let data;
        try {
            data = JSON.parse(strData);
        } catch (err) {
            const isJsonErr = err instanceof SyntaxError;
            console.log({ isJsonErr, err });
            if (!isJsonErr) throw err;
            if (!strData.startsWith("Hi (")) throw Error(`Unexpected string: "${strData}"`);
            const msg = `handleMessage, skipping test message "${strData}"`;
            console.log(msg);
            modMdc.mkMDCsnackbar(msg);
            return;
        }
        console.log("%chandleMessage", "font-size:20px; color:red", { data });
        switch (data.type) {
            case "my-mindmaps":
                peerMindmaps = data.myMindmaps;
                if (peerMindmaps == undefined) throw Error(`data.myMindmaps is undefined`);
                console.log({ peerMindmaps, myMindmaps });
                tellWhatIneed();
                break;
            case "need-keys":
                const neededKeys = data.needKeys;
                console.log({ neededKeys });
                // myMindmaps =
                const promNeededMm = [];
                neededKeys.forEach(key => {
                    const promMindmap = modDbMindmaps.DBgetMindmap(key);
                    console.log({ promMindmap });
                    promNeededMm.push(promMindmap);
                });
                (async () => {
                    let arrSettled;
                    try {
                        arrSettled = await Promise.allSettled(promNeededMm);
                    } catch (err) {
                        console.error(err, arrSettled);
                        throw Error("Could not find all needed mindmaps");
                    }
                    const arrNeededMindmaps = await Promise.all(promNeededMm);
                    console.log({ arrNeededMindmaps });
                    const obj = {
                        type: "mindmaps-you-needed",
                        arrNeededMindmaps
                    }
                    // debugger;
                    dataChannel.send(JSON.stringify(obj));
                })();
                break;
            case "mindmaps-you-needed":
                const arrNeededMindmaps = data.arrNeededMindmaps;
                arrNeededMindmaps.forEach(mm => {
                    debugger;
                    const key = mm.key;
                    const [metaKey, metaUpdated] = mm.meta.name.split("/");
                    if (key != metaKey) throw Error(`key:${key} != metaKey:${metaKey}`);
                    modDbMindmaps.DBsetMindmap(key, mm, metaUpdated);
                });
                break;
            default:
                const errMsg = `Unrecognized data.type: ${data.type}`;
                console.error(errMsg);
                throw Error(errMsg);
        }
    }
    logDataChannel(dataChannel.id, `doSync, wasOpenedBefore:${wasOpenedBefore}`);
    console.log(`%cdoSync, wasOpenedBefore:${wasOpenedBefore}`, "font-size:30px");
    if (!wasOpenedBefore) return; // FIX-ME:


    const objMessage = {
        "type": "my-mindmaps",
        myMindmaps,
    }
    const json = JSON.stringify(objMessage);
    dataChannel.send(json);
    tellWhatIneed();
}

function logWSinfo(...args) {
    return;
    const arg0 = args.shift();
    const msg = `WS: ${arg0}`;
    console.log(`%c ${msg}`, "background:blue; color:white;", ...args);
    // _logSyncLog(msg);
}
function _logWSimportant(...args) {
    // console.warn("%c WS: ", "background:blue; color:white; font-size:20px;", ...args);
    console.log("%c WS: ", "background:blue; color:white; font-size:20px;", ...args);

    // console.trace("%c WS: ", "background:blue; color:white; font-size:20px;", ...args);
}
function logWSimportant(...args) {
    _logWSimportant(...args);
    _logWSsyncLog(args[0]);
}
function logWSError(...args) {
    const arg0 = args.shift();
    const msg = `WS error: ${arg0}`;
    console.error(`%c ${msg} `, "background:red; color:white;", ...args);
    _logWSsyncLog(msg);
}
function logWSdetail(...args) {
    return;
    console.log(...args);
}
function logSignaling(...args) {
    return;
    const arg0 = args.shift();
    const msg = `Signaling server - ${arg0}`;
    // console.log(`%c ${msg}`, "background:darkgreen; color:white;", ...args);
    console.log(`%c ${msg}`, "background:darkgreen; color:white;");
    _logWSsyncLog(msg);
}

/**
 * 
 * @param {number} id 
 * @param  {...any} args 
 */
function logDataChannel(id, ...args) {
    // const id = args.shift();
    console.warn(`%c Data Channel ${id}: `, "background:cyan; color:black;", ...args);
}
