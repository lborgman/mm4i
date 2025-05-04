// @ts-check
const MM4I_REPL_VER = "0.0.02";
window["logConsoleHereIs"](`here is mm4i-replication.js, module, ${MM4I_REPL_VER}`);
console.log(`%chere is mm4i-replication.js ${MM4I_REPL_VER}`, "font-size:20px;");
if (document.currentScript) { throw "mm4i-replication.js is not loaded as module"; }


/*
const btnTestSend = document.createElement("button");
btnTestSend.textContent = "send";
btnTestSend.title = "Send test message to peer";
btnTestSend.style = `
    background-color: violet;
    border-radius: 50%;
    box-shadow: 7px 7px 5px 0px rgba(0,0,0,0.5);
`;
btnTestSend.inert = true;
*/



const mkElt = window["mkElt"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];

// const mod2peers = await importFc4i("webrtc-2-peers");
// console.log({ mod2peers });

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
/**
 * 
 * @param {string} secret 
 * @param {string} variant 
 * @returns {Promise<string>}
 */
async function makeSecret512(secret, variant) {
    // return settingSecret.valueS;
    const buffer = await window.crypto.subtle.digest("SHA-512", (new TextEncoder()).encode(`${secret} + ${variant}`));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function isEqualSecret512(e1, e2) {
    return JSON.stringify((new Uint8Array(e1))) == JSON.stringify((new Uint8Array(e2)));
}

const settingPeerjsId = new SettingsRepl("peerjs-id", "");
// const settingPeerjsSavedPeers = new SettingsRepl("peerjs-saved-peers", JSON.stringify([]));
const settingPeerjsSavedPeers = new SettingsRepl("peerjs-saved-peers", []);
const settingPeerjsLatestPeer = new SettingsRepl("latest-peer", null); // A string, but we would like to set it


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

/*
const divSyncLogHeader = mkElt("div", undefined, [
    mkElt("div", { style: "display:flex; gap:10px;" }, ["Sync:", divSyncLogState]),
    btnSyncLogLog,
]);
divSyncLogHeader.style = `
    display: flex;
    justify-content: space-between;
`;
*/

let divSyncLogLog;
/*
const divSyncLogLog = mkElt("div");
divSyncLogLog.style = `
        color: gray;
        max-height: 100px;
        overflow-y: auto;
    `;
*/

const divSyncLog = mkElt("div", undefined, [
    // divSyncLogHeader,
    divSyncLogLog,
]);

btnSyncLogLog.addEventListener("click", evt => {
    evt.stopPropagation();
    divSyncLogLog.style.display = "none";
});
// setSyncLogInactive();


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
function setSyncLogInitiator(tellIsInitiator) {
    // _isInitiator = tellIsInitiator;
    divSyncLogState.style.textDecoration = tellIsInitiator ? "overline" : "underline";
}

function setSyncLogInactive() {
    setSyncLogState("Not started", "gray");
    divSyncLogLog.textContent = "";
    divSyncLogHeader.inert = true;
}
/////////////////



let mm4iDataChannel;
export async function replicationDialog() {
    // const peersVer = mod2peers.getVersion();
    // const peersVer = "No 2peers";
    const localVer = modLocalSettings.getVersion();
    const notReady = mkElt("p", undefined, `Not ready (this ${MM4I_REPL_VER}/LS ${localVer})`);
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



    const inpRoom = settingRoom.getInputElement();
    inpRoom.style = `
      margin-left: 10px;
      border: 1px solid grey;
      border-radius: 5px;
      padding: 4px;
    `;
    inpRoom.addEventListener("input", (_evt) => {
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


    const inpSecret = settingSecret.getInputElement();
    inpSecret.style = `
      min-width: 20px;
      NOmargin-left: 10px;
      border: 1px solid red;
      border-radius: 5px;
      padding: 4px;
      background-color: black;
      color: red;
    `;

    const inpPeerjsId = settingPeerjsId.getInputElement();
    inpPeerjsId.style = `
      min-width: 20px;
      margin-left: 10px;
      border: 1px solid grey;
      border-radius: 5px;
      padding: 4px;
    `;

    function checkSyncKeys() {
        let valid = true;
        const passkey = settingSecret.valueS.trim();
        const { strength } = getPasskeyStrength(passkey);
        if (strength < 3) {
            valid = false;
        }
        /*
        const room = settingRoom.valueS.trim();
        if (room.length == 0) {
            valid = false;
        }
        */
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
        // debugger;
        const hasSecretKey = settingSecret.valueS !== "";
        if (hasSecretKey) {
            const body = mkElt("div", undefined, [
                mkElt("p", undefined, `This will generate a strong random secret key. `),
                mkElt("p", undefined, `It will replace your current secret key. Do you want to continue?`),
            ]);
            const answer = await modMdc.mkMDCdialogConfirm(body, "Continue", "Cancel");
            if (!answer) return;
        }
        const newKey = generateRobustRandomAsciiString(16);
        // inppSecret.value = newKey; // This would lead to inppSecret out of sync with settingSecret
        settingSecret.value = newKey;
        getAndShowStrength(newKey);
        // saveSecretKey();
        modMdc.mkMDCsnackbar("Updated secret key", 6000);
    });

    const spanStrengthText = mkElt("span");
    const prgStrength = mkElt("progress", { value: 0, max: 100 });
    prgStrength.style = `
        width: 100%;
        `;
    const divStrength = mkElt("div", undefined, [prgStrength, spanStrengthText]);
    divStrength.style = `
        width: 100%;
        `;
    divStrength.id = "mm4i-strength";

    const spanSecret = mkElt("span", undefined, [inpSecret, divStrength]);
    spanSecret.style = `
        display: flex;  
        flex-direction: column;
        margin-left: 10px;
        `;
    // const lblSecret = mkElt("label", undefined, ["Secret: ", inpSecret, btnGenerate]);
    const lblSecret = mkElt("label", undefined, ["Secret: ", spanSecret, btnGenerate]);
    lblSecret.style = `
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      NOgap: 5px;
      font-weight: 500;
      font-style: italic;
    `;
    inpSecret.addEventListener("input", (_evt) => {
        // evt.stopPropagation();
        const passkey = inpSecret.value.trim();
        const strength = getAndShowStrength(passkey);
        if (strength < 3) {
            // clearSecretKey();
            // return;
        }
        checkSyncKeys();
    });
    getAndShowStrength(settingSecret.valueS);

    const lblPeerjsId = mkElt("label", undefined, ["Name for this web browser: ", inpPeerjsId]);
    lblPeerjsId.style = `
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: center;
      NOgap: 5px;
      font-weight: 500;
      font-style: italic;
    `;
    inpPeerjsId.addEventListener("input", (_evt) => {
        // evt.stopPropagation();
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

    const divSecret = mkElt("div", undefined, [
        mkElt("p", undefined, lblPeerjsId),
        mkElt("p", undefined, lblSecret),
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
        // divRoom,
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








    const iconReplication = modMdc.mkMDCicon("sync_alt");
    const btnStartReplication = modMdc.mkMDCbutton("Sync devices", "raised", iconReplication);
    btnStartReplication.title = "Sync your mindmaps between your devices";

    // const iconStop = modMdc.mkMDCicon("stop");
    // const btnStopReplication = modMdc.mkMDCbutton("Stop", "raised", iconStop);
    // btnStopReplication.title = "Stop sync";
    // btnStopReplication.inert = true;

    let _isReplicating = false;

    btnStartReplication.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const usePeer2 = false;
        if (usePeer2) {
            btnStartReplication.inert = true;
            // btnStopReplication.inert = false;
            // btnTestSend.inert = false;
            _isReplicating = true;
            const objLogFuns = {
                logWSError,
                setSyncLogState,
                setSyncLogInitiator,
                logSignaling,
                logWSimportant,
                logWSinfo,
                logWSdetail,
                logDataChannel,
            };
            mm4iDataChannel = await mod2peers.openChannelToPeer(objLogFuns, btnTestSend);
            doSync(mm4iDataChannel);
        } else {
            // OLDopenChannelToPeer(doSync);
            // peerJsSync(settingPeerjsId.valueS);
            dialogSyncPeers();
        }
    });
    /*
    btnStopReplication.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        _isReplicating = false;
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
    */



    /*
    btnTestSend.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const msg = "Hi (" + Date().toString().slice(0, 24) + ")";
        logWSdetail("btnTestSend msg:", msg);
        let ourDataChannel = mod2peers.getDataChannel();
        console.log("btnTestSend", ourDataChannel.id);
        const ourDataChannelState = ourDataChannel?.readyState;
        if (ourDataChannel && ourDataChannelState === "open") {
            // const _obj = { type: "test-hi", msg }
            ourDataChannel.send(msg);
            // ourDataChannel.send(JSON.stringify(obj));
            const msgInfo = `btnTestSend Sent message: ${msg} `;
            console.log(msgInfo);
            modMdc.mkMDCsnackbar(msgInfo)
        } else {
            const msgError = `btnTestSend Data channel not open: "${ourDataChannelState}"`;
            console.error(msgError);
            modMdc.mkMDCsnackbarError(msgError, 10 * 1000);
        }
    });
    */

    const divGrok = mkElt("p", undefined, [
        btnStartReplication,
        // btnStopReplication,
        // btnTestSend,
    ]);
    divGrok.style = `
        display: flex;
        gap: 10px;
        `;


    /*
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
    */

    const body = mkElt("div", undefined, [
        notReady,
        eltTitle,
        divInfoCollapsible,
        // detKeys,
        bodyKeys,
        // mkElt("hr"),
        divGrok,
        // divIds,
        divSyncLog,
    ]);
    body.id = "sync-dialog-body";

    // getSecretKey();
    // getRoomKey();
    checkSyncKeys();

    await modMdc.mkMDCdialogAlert(body);

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
function makePublicId(privateId) {
    // FIX-ME:
    const id = `mm4i-${privateId}`;
    return id;
}
let peerJsDataConnection;
let peer;
async function setupPeerConnection(remotePrivateId) {
    const modPeerjs = await importFc4i("peerjs");
    const myPublicId = makePublicId(settingPeerjsId.valueS);
    peer = new modPeerjs.Peer(myPublicId);
    peer.on('open', async (id) => {
        const msg = 'ON peer OPEN, My peer ID is: ' + id;
        logWSimportant(msg);
        // const remotePrivateId = await dialogSyncPeers();
        // debugger;
        if (remotePrivateId == undefined) {
            // peer.close(); // FIX-ME: close peer connection
            peer.destroy(); // FIX-ME: close peer connection
            return;
        }
        const remotePublicId = makePublicId(remotePrivateId);
        console.log({ remotePrivateId, remotePublicId });
        peerJsDataConnection = peer.connect(remotePublicId, { reliable: true });
        setupDataConnection(peerJsDataConnection);
    });
    peer.on('connection', (conn) => {
        const msg = "peer ON connection";
        logWSimportant(msg, { conn });
        peerJsDataConnection = conn;
        setupDataConnection(peerJsDataConnection);
    });
    function setupDataConnection(dataChannel) {
        // FIX-ME: if open
        const msg = "setupDataConnection";
        logWSimportant(msg, { dataChannel });
        dataChannel.on('open', async () => {
            console.warn("peerJsDataConnection open", { dataChannel });
            const msgHelloO = "Hello ON dataChannel OPEN from " + myPublicId;
            const secretKey = settingSecret.valueS;
            const variant = (new Date()).toISOString();
            const secretSha512 = await makeSecret512(secretKey, variant);
            if (typeof secretSha512 !== "string") { throw Error("secretSha512 is not a string"); }
            const objHelloO = {
                type: "hello",
                msg: msgHelloO,
                myId: myPublicId,
                secretSha512,
                variant,
                // secretKey,
                // mindmaps: myMindmaps,
            };
            console.log("Sending", objHelloO);
            peerJsDataConnection.send(objHelloO);
            // doSync(dataChannel);
        });
        dataChannel.on("data", (data) => {
            console.log("peerJsDataConnection data", { data });
            // logDataChannel(dataChannel.id, "message", data);
            // handleMessageSync(data);
            handleDataChannelMessage(data);
            async function handleDataChannelMessage(data) {
                const tofData = typeof data;
                if (tofData !== "object") {
                    const msg = `peerJsDataConnection data is not an object: "${tofData}"`;
                    console.error(msg, { data });
                    throw Error(msg);
                }
                const msgType = data.type;
                // handleMessageSync
                switch (msgType) {
                    case "hello":
                        {
                            // debugger;
                            // const mySecretKey = settingSecret.valueS;
                            // const peerSecretKey = data.secretKey;
                            // const tempOk = mySecretKey == peerSecretKey;
                            // if (!tempOk) {
                            // const msg = `Secret key mismatch: "${mySecretKey}" != "${peerSecretKey}"`;
                            // peer.destroy();
                            // logWSError(msg);
                            // modMdc.mkMDCdialogAlert(msg);
                            // break;
                            // }
                            const mySecretSha512 = await makeSecret512(settingSecret.valueS, data.variant);
                            const peerSecretSha512 = data.secretSha512;
                            const secretOk = isEqualSecret512(mySecretSha512, peerSecretSha512);
                            console.log({ secretOk });
                            if (!secretOk) {
                                const msg = `Secret key did not match peer`;
                                peer.destroy();
                                logWSError(msg);
                                modMdc.mkMDCdialogAlert(msg);
                                break;
                            }
                            const len = Object.keys(myMindmaps).length;
                            const msg = `Got hello, sending my keys/values (${len})`;
                            logWSimportant(msg, { data });
                            const objMessage = {
                                "type": "my-keys",
                                myMindmaps,
                            }
                            dataChannel.send(objMessage);
                        }
                        break;
                    case "my-keys":
                        {
                            const msg = "Got my-keys, tell keys I need";
                            logWSimportant(msg, { data });
                            peerMindmaps = data.myMindmaps;
                            if (peerMindmaps == undefined) throw Error(`data.myMindmaps is undefined`);
                            console.log({ peerMindmaps, myMindmaps });
                            tellWhatIneed(dataChannel);
                        }
                        break;
                    case "need-keys":
                        const neededKeys = data.needKeys;
                        console.log({ neededKeys });
                        {
                            const len = neededKeys.length;
                            const msg = `Got need-keys, sending those keys (${len})`;
                            logWSimportant(msg, { data });
                        }
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
                            const objMindmapsYouNeeded = {
                                type: "keys-you-needed",
                                arrNeededMindmaps
                            }
                            // debugger;
                            // dataChannel.send(JSON.stringify(objMindmapsYouNeeded));
                            dataChannel.send(objMindmapsYouNeeded);
                        })();
                        break;
                    case "keys-you-needed":
                        const arrNeededMindmaps = data.arrNeededMindmaps;
                        {
                            const len = arrNeededMindmaps.length;
                            const msg = `Got keys-you-needed (${len}), updating`;
                            logWSimportant(msg, { data });
                        }
                        const currentKey = window["current-mindmapKey"];
                        arrNeededMindmaps.forEach(mm => {
                            const key = mm.key;
                            if (key == currentKey) {
                                const btnRefeshKey = mkElt("button", undefined, "Mindmap was updated, refresh");
                                btnRefeshKey.style = `
                                    position: absolute;
                                    top: 20px;
                                    left: 20px;
                                    background-color: red;
                                    color: white;
                                    padding: 10px;
                                    border-radius: 5px;
                                    `;
                                btnRefeshKey.addEventListener("click", async (evt) => {
                                    evt.stopPropagation();
                                    window.location.reload();
                                });
                                const shield = mkElt("div", undefined, [btnRefeshKey]);
                                shield.style = `
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                    width: 100%;
                                    height: 100%;
                                    z-index: 7;
                                    background-color: rgba(0, 0, 0, 0.5);
                                    backdrop-filter: blur(2px);
                                `;
                                const container = document.getElementById("jsmind_container");
                                if (container == null) { throw Error("Did not find jsmind_container"); }
                                container.appendChild(shield);
                            }
                            const [metaKey, metaUpdated] = mm.meta.name.split("/");
                            if (key != metaKey) throw Error(`key:${key} != metaKey:${metaKey}`);
                            modDbMindmaps.DBsetMindmap(key, mm, metaUpdated);
                        });
                        logWSimportant("*** Sync is ready ***");
                        // destroy and close
                        // FIX-ME: is this correct?
                        dataChannel.close();
                        peer.destroy();
                        break;

                    default:
                        const msg = `peerJsDataConnection data type not handled: "${msgType}"`;
                        console.error(msg, { data });
                        throw Error(msg);
                }
            }
        });
        dataChannel.on("error", (err) => {
            console.error("peerJsDataConnection error", { err });
        });
        dataChannel.on("close", () => {
            console.warn("peerJsDataConnection close", { dataChannel });
            dataChannel = undefined; // FIX-ME: close peer connection
            peer.destroy(); // FIX-ME: close peer connection
        });
    }
}
let ourOkButton;
async function dialogSyncPeers() {
    const eltKnownPeers = mkElt("p", { id: "mm4i-known-peers" });
    listPeers();
    const inpAddPeer = mkElt("input", { type: "text" });
    const lblAddPeer = mkElt("label", undefined, ["Add web browser: ", inpAddPeer]);
    const iconAddPeer = modMdc.mkMDCicon("add_circle_outline");
    const btnAddPeer = modMdc.mkMDCiconButton(iconAddPeer, "Add", 30);
    btnAddPeer.title = "Add other web browser";
    const divAddPeer = mkElt("div", undefined, [
        lblAddPeer, btnAddPeer
    ]);
    divAddPeer.style = `
        display: flex;
        align-items: center;
        `;
    btnAddPeer.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const newPeerId = inpAddPeer.value.trim();
        if (newPeerId.length === 0) {
            modMdc.mkMDCsnackbar("No name was entered", 4000);
            return;
        }
        addPeerId(newPeerId);
        listPeers();
    });
    function listPeers() {
        eltKnownPeers.textContent = "";
        const arrSavedPeers = settingPeerjsSavedPeers.value;
        // console.log({ arrSavedPeers });
        if (arrSavedPeers.length === 0) {
            eltKnownPeers.textContent = "No saved web browser names";
        } else {
            if (ourOkButton) { ourOkButton.inert = false; }
            eltKnownPeers.appendChild(mkElt("div", undefined, [`Known other web browsers:`]));
            const latestPeer = settingPeerjsLatestPeer.value;
            let didSelect = false;
            arrSavedPeers.forEach((peer, idx) => {
                const iconSync = modMdc.mkMDCicon("sync_alt");
                // const btnSync = modMdc.mkMDCiconButton(iconSync, "Sync", 30);
                const OLDbtnSync = modMdc.mkMDCbutton("Sync", "raised", iconSync);
                OLDbtnSync.title = "Sync with this web browser";
                OLDbtnSync.addEventListener("click", async (evt) => {
                    evt.stopPropagation();
                    // settingPeerjsLatestPeer.value = peer;
                    const msg = `Sync with web browser "${peer}"`;
                    modMdc.mkMDCsnackbar(msg, 4000);
                    // const remotePeerId = peer;
                    // return peer;
                    setupPeerConnection(peer);
                });


                const iconRemove = modMdc.mkMDCicon("delete_forever");
                const btnRemove = modMdc.mkMDCiconButton(iconRemove, "Remove", 30);
                btnRemove.style.opacity = "0.5";
                // btnRemove.title = "Remove this web browser from the list";
                btnRemove.title = "Forget this web browser";
                btnRemove.addEventListener("click", async (evt) => {
                    evt.stopPropagation();
                    const secTrans = 1;
                    const divPeer = btnRemove.closest("div.mm4i-peer-item");
                    const bcr = divPeer.getBoundingClientRect();
                    const h = bcr.height;
                    divPeer.style.height = `${h}px`;
                    divPeer.style.opacity = "1.0";
                    divPeer.style.transitionProperty = `opacity, height`
                    divPeer.style.transitionDuration = `${secTrans}s`;
                    divPeer.style.opacity = "0.0";
                    // divPeer.style.transitionDelay = `${secTrans}s`;
                    divPeer.style.height = "0px";
                    // return;
                    removePeerId(peer);
                    // listPeers(); // FIX-ME:
                    // const msg = `Removed peer id "${peer}"`;
                    // modMdc.mkMDCsnackbar(msg, 4000);
                });
                const iconThisDevice = modMdc.mkMDCicon("phone_android");
                const deg360 = peer.split("").map(char => char.charCodeAt(0)).reduce((sum, val) => sum + val) * 4294967296 % 360;
                const maxRotate = 30;
                const rotate = (deg360 % maxRotate) - maxRotate / 2;
                iconThisDevice.style.rotate = `${rotate}deg`;
                const hue = deg360;
                iconThisDevice.style.color = `hsl(${hue}, 70%, 70%)`;
                // const btnTestUI = modMdc.mkMDCbutton(peer, "raised", iconThisDevice);
                // const btnTestUI = modMdc.mkMDCbutton(peer, undefined, iconThisDevice);
                const btnTestUI = modMdc.mkMDCbutton(`Sync ${peer}`, "outlined", iconThisDevice);
                btnTestUI.title = `Click to sync with web browser "${peer}"`;
                btnTestUI.style.textTransform = "none";
                btnTestUI.style.minWidth = "180px";
                btnTestUI.addEventListener("click", async (evt) => {
                    evt.stopPropagation();
                    const secTrans = 1;
                    eltKnownPeers.style.opacity = "1";
                    eltKnownPeers.style.transition = `opacity ${secTrans}s ease-in-out`;
                    eltKnownPeers.style.opacity = "0";
                    setTimeout(() => {
                        const bcr = eltKnownPeers.getBoundingClientRect();
                        eltKnownPeers.style.minHeight = `${bcr.height}px`;
                        eltKnownPeers.textContent = "";
                        eltKnownPeers.appendChild(mkElt("div", undefined, [
                            mkElt("b", undefined, `Syncing with web browser "${peer}"`)
                        ]));
                        divSyncLogLog = mkElt("div");
                        eltKnownPeers.appendChild(divSyncLogLog);

                        eltKnownPeers.classList.add("mdc-card");
                        eltKnownPeers.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
                        eltKnownPeers.style.padding = "10px";
                        eltKnownPeers.style.opacity = "1";
                        setupPeerConnection(peer);
                    }, secTrans * 1000);
                });
                const divPeer = mkElt("div", undefined, [
                    btnTestUI,
                    btnRemove,
                ]);
                divPeer.classList.add("mm4i-peer-item");
                divPeer.style = `
                    display: flex;
                    width: calc(100% - 40px);
                    margin-left: 20px;
                    margin-right: 20px;
                    height: 40px;
                    gap: 10px;
                    align-items: center;
                    justify-content: space-between;
                    `;
                eltKnownPeers.appendChild(divPeer);
            });
        }
    }
    function removePeerId(otherPeerId) {
        const arrSavedPeers = settingPeerjsSavedPeers.value;
        const idx = arrSavedPeers.indexOf(otherPeerId);
        if (idx > -1) {
            arrSavedPeers.splice(idx, 1);
            settingPeerjsSavedPeers.value = arrSavedPeers;
            // listPeers();
        }
    }
    function addPeerId(newPeerId) {
        const arrSavedPeers = settingPeerjsSavedPeers.value;
        if (arrSavedPeers.includes(newPeerId)) {
            modMdc.mkMDCsnackbar(`Peer id "${newPeerId}" already exists`, 4000);
            return;
        }
        arrSavedPeers.push(newPeerId);
        // settingPeerjsSavedPeers.value = JSON.stringify(arrSavedPeers);
        settingPeerjsSavedPeers.value = arrSavedPeers;
        const msg = `Added peer id "${newPeerId}"`;
        modMdc.mkMDCsnackbar(msg, 4000);
    }



    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Sync with other web browser"),
        mkElt("p", undefined, ["This web browser: ", mkElt("b", undefined, settingPeerjsId.valueS)]),
        eltKnownPeers,
        divAddPeer,
    ]);

    // modMdc.mkMDCdialogAlert(body, "Close");
    // FIX-ME: we must handle closing the dialog
    const btnClose = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnClose]);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    return await new Promise((resolve) => {
        dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async _evt => {
            // const action = evt.detail.action;
            peer?.destroy(); // FIX-ME: close peer connection
            resolve(undefined);
        }));
    });

}

function tellWhatIneed(dataChannel) {
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
    const objNeedKeys = {
        type: "need-keys",
        needKeys
    }
    // dataChannel.send(JSON.stringify(objNeedKeys));
    dataChannel.send(objNeedKeys);
}

async function doSync(dataChannel) {
    console.log(dataChannel.id, { channelToPeer: dataChannel });
    const wasOpenedBefore = handledOpenBefore;
    // if (wasOpenedBefore) debugger; // FIX-ME:
    handledOpenBefore = true;
    debugger; // eslint-disable-line no-debugger
    dataChannel.addEventListener("message", evt => {
        // evt.stopPropagation();
        debugger; // eslint-disable-line no-debugger
        logDataChannel(dataChannel.id, "message synch", evt);
        handleMessageSync(evt);
    });
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
            case "my-keys":
                peerMindmaps = data.myMindmaps;
                if (peerMindmaps == undefined) throw Error(`data.myMindmaps is undefined`);
                console.log({ peerMindmaps, myMindmaps });
                debugger; // eslint-disable-line no-debugger
                tellWhatIneed(dataChannel);
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
                        type: "keys-you-needed",
                        arrNeededMindmaps
                    }
                    // debugger;
                    dataChannel.send(JSON.stringify(obj));
                })();
                break;
            case "keys-you-needed":
                const arrNeededMindmaps = data.arrNeededMindmaps;
                arrNeededMindmaps.forEach(mm => {
                    debugger; // eslint-disable-line no-debugger
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
    // if (!wasOpenedBefore) return; // FIX-ME:


    const objMessage = {
        "type": "my-keys",
        myMindmaps,
    }
    const json = JSON.stringify(objMessage);
    dataChannel.send(json);
    // tellWhatIneed();
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
    console.warn("%c WS: ", "background:blue; color:white; font-size:20px;", ...args);

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
