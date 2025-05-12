// @ts-check
const MM4I_REPL_VER = "0.0.03";
window["logConsoleHereIs"](`here is mm4i-replication.js, module, ${MM4I_REPL_VER}`);
console.log(`%chere is mm4i-replication.js ${MM4I_REPL_VER}`, "font-size:20px;");
if (document.currentScript) { throw "mm4i-replication.js is not loaded as module"; }



const mkElt = window["mkElt"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];


const secretKeyMinLength = 8;



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
    const str = `${secret} + ${variant}`;
    const buffer = await window.crypto.subtle.digest("SHA-512", (new TextEncoder()).encode(str));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}
function _OLDisEqualSecret512(e1, e2) {
    return JSON.stringify((new Uint8Array(e1))) == JSON.stringify((new Uint8Array(e2)));
}

const settingPeerjsId = new SettingsRepl("peerjs-id", "");
// const settingPeerjsSavedPeers = new SettingsRepl("peerjs-saved-peers", JSON.stringify([]));
const settingPeerjsSavedPeers = new SettingsRepl("peerjs-saved-peers", []);
const settingPeerjsLatestPeer = new SettingsRepl("latest-peer", null); // A string, but we would like to set it

if (settingPeerjsSavedPeers.value !== null) {
    const firstPeer = settingPeerjsSavedPeers.value[0];
    if (typeof firstPeer === "string") {
        settingPeerjsSavedPeers.reset();
    }
}

function addPeer(peerId, peerSecret) {
    const arrSavedPeers = settingPeerjsSavedPeers.value;
    const arrIds = arrSavedPeers.map(peerRec => peerRec.id);
    const idx = arrIds.indexOf(peerId);
    const oldPeer = arrSavedPeers[idx];
    if (oldPeer) {
        const oldSecret = oldPeer.secret;
        if (oldSecret && peerSecret) {
            if (oldSecret != peerSecret) {
                oldPeer.secret = peerSecret;
                settingPeerjsSavedPeers.value = arrSavedPeers;
                modMdc.mkMDCsnackbar(`Updated "${peerId}" secret`, 4000);
                return;
            } else {
                modMdc.mkMDCsnackbar(`Peer "${peerId}" already exists (with same secret)`, 4000);
                return;
            }
        }
        if (!oldSecret && !peerSecret) {
            modMdc.mkMDCsnackbar(`Peer "${peerId}" with no secret already exists`, 4000);
            return;
        }
    }
    const newPeer = {
        id: peerId,
    };
    if (peerSecret) {
        newPeer.secret = peerSecret;
    }
    arrSavedPeers.push(newPeer);
    settingPeerjsSavedPeers.value = arrSavedPeers;
    if (peerSecret) {
        modMdc.mkMDCsnackbar(`Added peer "${peerId}" (with secret)`, 4000);
    } else {
        modMdc.mkMDCsnackbar(`Added peer "${peerId}"`, 4000);
    }
}


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
    if (!divSyncLogLog) return;
    const line = mkElt("div", undefined, msg);
    divSyncLogLog.appendChild(line);
    line.scrollIntoView({ behavior: "smooth", block: "end" });
}
function setSyncLogState(state, color) {
    divSyncLogState.textContent = state;
    divSyncLogState.style.color = color;
    // divSyncLogHeader.inert = false;
}

function _setSyncLogInactive() {
    setSyncLogState("Not started", "gray");
    divSyncLogLog.textContent = "";
    // divSyncLogHeader.inert = true;
}
/////////////////



let _mm4iDataChannel;
async function dialogScanningQR() {
    let qrScanner;
    const eltVideo = mkElt("video", { id: "mm4i-video" });
    eltVideo.style = `
        width: 200px;
        height: 200px;
        outline: 2px dotted red;
        background-color: lightgray;`;
    const eltScannedQR = mkElt("p", { id: "mm4i-scanned-qr" });
    const body = mkElt("div", undefined, [
        mkElt("p", undefined, `Scan peer QR code with your phone camera.`),
        eltVideo,
        eltScannedQR,
    ]);
    // modMdc.mkMDCdialogAlert(body, "Close");
    const btnClose = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnClose]);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    new Promise((resolve) => {
        dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async _evt => {
            // const action = evt.detail.action;
            qrScanner.stop();
            resolve(undefined);
        }));
    });

    const modQRScan = await importFc4i("qr-scanner");
    console.log({ modQRScan });
    // debugger;
    const QrScanner = modQRScan.default;
    console.log("QR scanner", { QrScanner });
    qrScanner = new QrScanner(eltVideo, (result) => {
        console.log("QR result", { result });
        const [mm4iMark, peerName, peerSecret] = result.data.split("\n");
        eltScannedQR.textContent = result.data;
        if (!mm4iMark.startsWith("mm4i")) {
            const msg = `Not a valid mm4i QR code: "${mm4iMark}"`;
            modMdc.mkMDCsnackbarError(msg, 6000);
            return;
        }
        const divQRresult = mkElt("div", { class: "mdc-card" }, mkElt("b", undefined, "Added peer"));
        divQRresult.style = `
            background-color: greenyellow;
            padding: 10px;
            `;
        eltScannedQR.appendChild(divQRresult);
        divQRresult.appendChild(mkElt("div", undefined, [mkElt("i", undefined, "Name: "), peerName]));
        divQRresult.appendChild(mkElt("div", undefined, [mkElt("i", undefined, "Secret: "), peerSecret]));
        addPeer(peerName, peerSecret);
        modMdc.mkMDCsnackbar("Scanned peer QR", 6000);
        qrScanner.stop();
        eltVideo.remove();
    }, {
        returnDetailedScanResult: true,
        highlightCodeOutline: true,
    });
    qrScanner.start();
}

export async function replicationDialog() {
    const isOnline = await funIsOnline();
    if (!isOnline) {
        modMdc.mkMDCdialogAlert("Can't sync because device is not online.");
        return;
    }
    const notReady = mkElt("p", undefined, `Maybe soon ready, usable (${MM4I_REPL_VER})`);
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
    const btnInfo = modMdc.mkMDCiconButton("info_i", "What does mindmap sync mean?", 32);

    const eltTitle = mkElt("h2", undefined, "Mindmap sync");
    eltTitle.style.position = "relative";
    eltTitle.appendChild(btnInfo);
    btnInfo.style = `
        position: absolute;
        bottom: -14px;
        right: 14px;
        color: white;
        background-color: cornflowerblue;
        border-radius: 50%;
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
    /*
    const divRoom = mkElt("p", undefined, [
        // `Name announced.`,
        // mkElt("br"),
        lblRoom
    ]);
    */


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
            btnSyncPeers.inert = false;
        } else {
            document.body.classList.remove("sync-keys-valid");
            btnSyncPeers.inert = true;
        }
    }

    // const btnGenerate = modMdc.mkMDCiconButton("vpn_key", "Generate random secret", 40);
    const btnGenerate = modMdc.mkMDCiconButton("enhanced_encryption", "Generate random secret", 40);
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

    const btnUnhide = modMdc.mkMDCiconButton("visibility", "Unhide passkey", 40);
    btnUnhide.addEventListener("click", (evt) => {
        evt.stopPropagation();
        btnUnhide.style.display = "none";
        spanSecret.style.display = "flex";
    });
    const btnQR = modMdc.mkMDCiconButton("qr_code_2", "Show QR code", 40);

    btnQR.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const secretKey = settingSecret.valueS;
        const modQR = await importFc4i("qrcode");
        console.log({ modQR });
        // debugger;
        const canvas = mkElt("canvas", { id: "mm4i-qrcode" });
        await modQR.toCanvas(canvas, ["mm4i", settingPeerjsId.valueS, secretKey].join("\n"));
        const btnScanQR = modMdc.mkMDCbutton("Scan peer QR code", "raised");
        btnScanQR.addEventListener("click", async (evt) => {
            evt.stopPropagation();
            dialogScanningQR();
        });
        const body = mkElt("div", undefined, [
            mkElt("h2", undefined, `Peer "${settingPeerjsId.valueS}"`),
            canvas,
            mkElt("p", undefined, `Scan QR above with with MM4I. Or, type the secret key you see below:`),
            mkElt("p", { style: "font-weight:700;" }, secretKey),
            mkElt("hr", { style: "background-color:gray; width:80%; height: 1px;" }),
            btnScanQR,
        ]);
        body.style = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        `;
        await modMdc.mkMDCdialogAlert(body, "Close");
    });

    const spanSecret = mkElt("span", undefined, [inpSecret, divStrength]);
    spanSecret.style = `
        display: none;  
        flex-direction: column;
        margin-left: 10px;
        `;
    const lblSecret = mkElt("label", undefined, [
        mkElt("span", { style: "margin-right:10px" }, "Secret:"),
        btnGenerate,
        btnQR,
        btnUnhide,
        spanSecret,
    ]);
    lblSecret.style = `
      font-weight: 500;
      font-style: italic;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
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

    const lblPeerjsId = mkElt("label", undefined, ["My name: ", inpPeerjsId]);
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

    // let replicationPool;








    // const iconReplication = modMdc.mkMDCicon("sync_alt");
    const iconSyncPeers = modMdc.mkMDCicon("p2p");
    const btnSyncPeers = modMdc.mkMDCbutton("Sync peers", "raised", iconSyncPeers);
    btnSyncPeers.title = "Sync your mindmaps between your peer devices";

    const iconPrivacy = modMdc.mkMDCicon("shield_with_heart");
    const btnPrivacy = modMdc.mkMDCbutton("Privacy", "outlined", iconPrivacy);
    btnPrivacy.title = "Select mindmaps to sync";

    let _isReplicating = false;

    btnSyncPeers.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        dialogSyncPeers();
    });
    btnPrivacy.addEventListener("click", async evt => {
        dialogMindmapPrivacy();
    });


    const divGrok = mkElt("p", undefined, [
        btnSyncPeers,
        btnPrivacy,
    ]);
    divGrok.style = `
        display: flex;
        gap: 10px;
        `;



    const body = mkElt("div", undefined, [
        notReady,
        eltTitle,
        divInfoCollapsible,
        bodyKeys,
        divGrok,
        divSyncLog,
    ]);
    body.id = "sync-dialog-body";

    checkSyncKeys();
    await modMdc.mkMDCdialogAlert(body);
}


// let handledOpenBefore = false;
const modDbMindmaps = await importFc4i("db-mindmaps");
const modMMhelpers = await importFc4i("mindmap-helpers");

// const modPWA = await importFc4i("pwa");
// const funIsOnline = modPWA.PWAonline;
const funIsOnline = window["PWAonline"];

// debugger;
const myMindmapsAllKeyUpdatedOLD = await (async () => {
    const arrMm = await modDbMindmaps.DBgetAllMindmaps();
    // const arrMm = await modMMhelpers.getSharedMindmaps();
    const arrMetaName = arrMm.map(mm => {
        const metaName = mm.jsmindmap.meta.name;
        return metaName;
    });
    const mindmapsKeyUpdated = arrMetaName.reduce((current, item) => {
        const [key, updated] = item.split("/");
        current[key] = updated;
        return current;
    }, {});
    return mindmapsKeyUpdated;
})();

function getMindmapsKeysUpdated(arrMm) {
    const arrMetaName = arrMm.map(mm => {
        const metaName = mm.jsmindmap.meta.name;
        return metaName;
    });
    const mindmapsKeyUpdated = arrMetaName.reduce((current, item) => {
        const [key, updated] = item.split("/");
        current[key] = updated;
        return current;
    }, {});
    return mindmapsKeyUpdated;
}
const arrAllMm = await modDbMindmaps.DBgetAllMindmaps();
const myMindmapsAllKeyUpdated = getMindmapsKeysUpdated(arrAllMm);
const arrSharedMm = await modMMhelpers.getSharedMindmaps();
const myMindmapsSharedKeyUpdated = getMindmapsKeysUpdated(arrSharedMm);
// debugger;
if (JSON.stringify(myMindmapsAllKeyUpdatedOLD) != JSON.stringify(myMindmapsAllKeyUpdated)) {
    debugger;
}

let peerMindmaps;
function makePublicId(privateId) {
    // FIX-ME:
    const id = `mm4i-${privateId}`;
    return id;
}
let peerJsDataChannel;
let peer;
const SentAndRecieved = [];
window["S&R"] = SentAndRecieved;

function finishPeer() {
    if (!peer) {
        debugger;
        return;
    }
    // FIX-ME: how to handle the objects
    logWSimportant("* finishPeer()", { peer, peerJsDataChannel });
    if (peer) {
        if (peer.destroyed) {
            logWSimportant("** p.destroyed already");
        } else {
            logWSimportant("** p.destroy()");
            peer.destroy();
        }
    }
    if (peerJsDataChannel) {
        if (peerJsDataChannel.open) {
            logWSimportant("** c.close()");
            peerJsDataChannel.close();
        } else {
            logWSimportant("** c.closed already");
        }
    }
}
function sendToPeer(obj, arrInfo, otherData) {
    // const tofFromWhere = typeof fromWhere;
    if (!Array.isArray(arrInfo)) {
        const msg = `Expected fromWhere to be array of strings but it was ${arrInfo}`;
        SentAndRecieved.push(msg);
        console.error(msg);
        throw Error(msg);
    }
    const arrEltInfo = arrInfo.reduce(
        (tot, curr) => {
            const tofCurr = typeof curr;
            if (tofCurr != "string") { debugger; throw Error(`Expected "curr" to be "string", but it was "${tofCurr}`); }
            switch (curr) {
                case "R":
                    tot.push(mkElt("span", { style: "color:blue" }, "R:"));
                    break;
                case "S":
                    if (tot.length > 0) {
                        tot.push(mkElt("span", { style: "color:gray" }, "=>"));
                    }
                    tot.push(mkElt("span", { style: "color:green" }, "S:"));
                    break;
                default:
                    tot.push(curr);
            }
            return tot;
        },
        []);
    const eltInfo = mkElt("span", undefined, arrEltInfo);
    if (!peerJsDataChannel.open) {
        // debugger;

        const msg = `dataChannel not open when trying to send from ${eltInfo.textContent}`;
        logWSimportant(msg, obj);
        // console.warn(msg, obj);
        SentAndRecieved.push(msg);
        return;
    }
    /*
    const eltMsg = mkElt("span", undefined, [
        mkElt("span", { style: "color:green" }, "S:"),
        `${fromWhere}`,
    ])
    */
    const strInfo = eltInfo.textContent;
    // logWSimportant(eltMsg, { obj, otherData });
    _logWSimportant(strInfo, { obj, otherData });
    _logWSsyncLog(eltInfo);
    SentAndRecieved.push(strInfo);
    peerJsDataChannel.send(obj);
}
async function setupPeerConnection(remotePeerObj) {
    const remotePrivateId = remotePeerObj.id;
    const modPeerjs = await importFc4i("peerjs");
    const myPublicId = makePublicId(settingPeerjsId.valueS);
    peer = new modPeerjs.Peer(myPublicId);
    peer.on('open', async (id) => {
        const msg = 'ON peer OPEN, id: ' + id;
        logWSimportant(msg);
        if (remotePrivateId == undefined) {
            finishPeer();
            return;
        }
        const remotePublicId = makePublicId(remotePrivateId);
        // console.log({ remotePrivateId, remotePublicId });
        peerJsDataChannel = peer.connect(remotePublicId, { reliable: true });
        setupDataConnection(peerJsDataChannel, "4OPEN");
    });
    peer.on('connection', (conn) => {
        const msg = "ON peer CONNECTION";
        logWSimportant(msg, { conn });
        peerJsDataChannel = conn;
        setupDataConnection(peerJsDataChannel, "4CONNECTION");
    });
    function setupDataConnection(dataChannel, what4) {
        // FIX-ME: if open
        const msg = `setupDataConnection ${what4}`;
        logWSimportant(msg, { dataChannel });
        let saidHello = false;
        dataChannel.on('open', async () => {
            // if (what4 == "4CONNECTION") return;
            if (saidHello) {
                logWSimportant("Second dataChannel ON OPEN");
                debugger;
                return;
            }
            saidHello = true;
            console.warn("peerJsDataConnection open", { dataChannel });
            const msgHelloO = "Hello ON dataChannel OPEN from " + myPublicId;
            const secretKey = settingSecret.valueS;
            const variant = (new Date()).toISOString();
            const secret = remotePeerObj.secret || secretKey;
            const secretSha512 = await makeSecret512(secret, variant);
            const hasRemoteSecret = Object.keys(remotePeerObj).includes("secret");
            if (typeof secretSha512 !== "string") { throw Error("secretSha512 is not a string"); }
            const objHelloO = {
                type: "hello",
                msg: msgHelloO,
                myId: myPublicId,
                secretSha512,
                variant,
                hasRemoteSecret,
                secretKey,
                secret,
            };
            sendToPeer(objHelloO, ["S", '"hello"']);
            // doSync(dataChannel);
        });
        dataChannel.on("data", (data) => {
            // console.log("peerJsDataConnection data", { data });
            handleDataChannelMessage(data);
            async function handleDataChannelMessage(data) {
                const tofData = typeof data;
                if (tofData !== "object") {
                    const msg = `peerJsDataConnection data is not an object: "${tofData}"`;
                    console.error(msg, { data });
                    throw Error(msg);
                }
                const msgType = data.type;
                SentAndRecieved.push(`R: ${msgType}`);
                switch (msgType) {
                    case "hello":
                        {
                            const mySecretSha512 = await makeSecret512(settingSecret.valueS, data.variant);
                            const peerSecretSha512 = data.secretSha512;
                            const secret512Ok = mySecretSha512 == peerSecretSha512;
                            const secretOK = data.secret == settingSecret.valueS;
                            // console.log({ secret512Ok, secretOK });
                            // debugger;
                            if (!secret512Ok) {
                                debugger;
                                const peerHadMySecret =
                                    Object.keys(data).includes("hasRemoteSecret")
                                    && data.hasRemoteSecret;
                                console.log({ peerHadMySecret })
                                const msg = `Secret key did not match peer`;
                                // peer.destroy();
                                logWSError(msg);
                                const txtWhichKey = peerHadMySecret ?
                                    "Remote peer used secret key saved together with my name" :
                                    "Remote peer used its own secret key";
                                const header = mkElt("h2", undefined, `${msg}`);
                                header.style.color = "red";
                                const body = mkElt("div", undefined, [
                                    header,
                                    mkElt("p", undefined, txtWhichKey),
                                ]);
                                modMdc.mkMDCdialogAlert(body);
                                finishPeer();
                                break;
                            }
                            const len = Object.keys(myMindmapsAllKeyUpdated).length;
                            // const msg = `Got "hello" => "have-keys" (${len})`;
                            const arrInfo = ["R", '"hello"', "S", `"have-keys" (${len})`];
                            const objMessage = {
                                "type": "have-keys",
                                // myMindmaps: myMindmapsAllKeyUpdated,
                                myMindmaps: myMindmapsSharedKeyUpdated,
                            }
                            sendToPeer(objMessage, arrInfo, data);
                        }
                        break;
                    case "have-keys":
                        {
                            // const msg = "Got have-keys";
                            // logWSimportant(msg, { data });
                            peerMindmaps = data.myMindmaps;
                            if (peerMindmaps == undefined) throw Error(`data.myMindmaps is undefined`);
                            // console.log({ peerMindmaps, myMindmaps });
                            tellWhatIneed(dataChannel);
                        }
                        break;
                    case "need-keys":
                        const neededKeys = data.needKeys;
                        // console.log({ neededKeys });
                        {
                            const len = neededKeys.length;
                            // const msg = `After need-keys, keys (${len})`;
                            const arrInfo = ["R", `"need-keys" (${len})`];
                            // logWSimportant(msg, { data });
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
                                // console.log({ arrNeededMindmaps });
                                const objMindmapsYouNeeded = {
                                    type: "keys-you-needed",
                                    arrNeededMindmaps
                                }
                                arrInfo.push("S");
                                arrInfo.push(`keys-you-needed (${arrNeededMindmaps.length})`);
                                sendToPeer(objMindmapsYouNeeded, arrInfo, data);
                            })();
                        }
                        break;
                    case "keys-you-needed":
                        const arrNeededMindmaps = data.arrNeededMindmaps;
                        {
                            const len = arrNeededMindmaps.length;
                            const eltInfo = mkElt("span",
                                { style: "color:orange" },
                                `R:"keys-you-needed" (${len}), updating`);
                            logWSimportant(eltInfo, { data });
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
                        logWSready();
                        finishPeer();
                        break;

                    default:
                        const msg = `peerJsDataConnection data type not handled: "${msgType}"`;
                        console.error(msg, { data });
                        throw Error(msg);
                }
            }
        });
        dataChannel.on("error", (err) => {
            debugger;
            console.error("peerJsDataConnection error", { err });
        });
        dataChannel.on("close", () => {
            logWSimportant("dataChannel on close");
            finishPeer();
        });
    }
}
// let ourOkButton;
async function dialogSyncPeers() {
    const eltKnownPeers = mkElt("p", { id: "mm4i-known-peers" });
    listPeers();
    const iconNewPeer = modMdc.mkMDCicon("phone_android");
    const btnNewPeer = modMdc.mkMDCbutton("Add peer", "raised", iconNewPeer);
    const divAddPeer = mkElt("div", undefined, [
        // lblAddPeer, btnAddPeer,
        btnNewPeer,
    ]);
    divAddPeer.style = `
        display: flex;
        align-items: center;
        `;
    btnNewPeer.addEventListener("click", async (evt) => {
        evt.stopPropagation();

        let canUseCamera = true;
        let infoCamera = `Scan peer QR code with your device camera.`;
        const btnScanQR2 = modMdc.mkMDCbutton("Scan peer QR", "raised", "qr_code_2");
        try {
            const objUserMedia = await navigator.mediaDevices.getUserMedia({ video: true });
            const canUseCamera = objUserMedia.getVideoTracks().length > 0;
            if (canUseCamera) { objUserMedia.getVideoTracks()[0].stop() }
        } catch (err) {
            console.log({ err });
            canUseCamera = false;
            btnScanQR2.inert = true;
            switch (err.name) {
                case "NotAllowedError":
                    infoCamera = "Permission to access camera is denied.";
                    break;
                case "NotFoundError":
                    infoCamera = "No camera was found.";
                    break;
                default:
                    infoCamera = `An error occured while accessing the camera: ${err.message}.`;
            }
        }

        btnScanQR2.addEventListener("click", async (evt) => {
            evt.stopPropagation();
            modMdc.closeMyDialog(btnScanQR2);
            dialogScanningQR();
        });
        const divQR = mkElt("p", undefined, [
            mkElt("p", undefined, infoCamera),
            mkElt("div", undefined, [btnScanQR2]),
        ]);
        divQR.classList.add("mdc-card");
        divQR.style = `
            background-color: orange;
            padding: 10px;
        `;
        divQR.inert = !canUseCamera;


        // debugger;
        const inpPeerName = modMdc.mkMDCtextFieldInput();
        const tfPeerName = modMdc.mkMDCtextFieldOutlined("Peer Name", inpPeerName);
        const inpPeerSecret = modMdc.mkMDCtextFieldInput();
        const tfPeerSecret = modMdc.mkMDCtextFieldOutlined("Peer Secret (optional)", inpPeerSecret);
        const btnAddManually = modMdc.mkMDCbutton("Add peer", "raised");
        btnAddManually.addEventListener("click", async (evt) => {
            evt.stopPropagation();
            // debugger;
            const peerName = inpPeerName.value.trim();
            const peerSecret = inpPeerSecret.value.trim();
            console.log({ peerName, peerSecret });
            if (peerName.length === 0) {
                modMdc.mkMDCsnackbar("No peer name was entered", 4000);
                return;
            }
            const objPeer = { id: peerName, secret: peerSecret };
            const arrSavedPeers = settingPeerjsSavedPeers.value;
            const oldPeer = arrSavedPeers.find(peer => peer.id == objPeer.id);
            if (oldPeer) {
                const oldSecret = oldPeer.secret;
                if (peerSecret) {
                    if (oldSecret) {
                        const msg = `Peer "${oldPeer.id}" exists. Replace secret key?`;
                        const answer = await modMdc.mkMDCdialogConfirm(msg, "Replace", "Cancel");
                        if (!answer) { return; }
                        return;
                    }
                } else {
                    if (!oldSecret) {
                        const msg = `Peer "${oldPeer.id}" (with no secret) already exists"`;
                        console.warn(msg);
                        modMdc.mkMDCsnackbar(msg, 4000);
                        return;
                    }
                }
            }
            // debugger;
            addPeer(peerName, peerSecret);
        });

        const divManInputs = mkElt("div", undefined, [
            tfPeerName,
            tfPeerSecret,
            mkElt("div", undefined, [btnAddManually]),
        ]);
        divManInputs.style = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        const divManually = mkElt("p", undefined, [
            mkElt("p", undefined, `
                Enter peer manually.
                (If peer secret is not entered, this peer secret will be used.)
            `),
            divManInputs,
        ]);
        divManually.classList.add("mdc-card");
        divManually.style = `
            background-color: orange;
            padding: 10px;
        `;

        const body = mkElt("div", undefined, [
            mkElt("h2", undefined, `Add new peer`),
            divQR,
            divManually,
        ]);
        modMdc.closeMyDialog(btnNewPeer);
        modMdc.mkMDCdialogAlert(body, "Close");
    });
    function listPeers() {
        eltKnownPeers.textContent = "";
        const arrSavedPeers = settingPeerjsSavedPeers.value;
        // console.log({ arrSavedPeers });
        if (arrSavedPeers.length === 0) {
            eltKnownPeers.textContent = "No saved peers";
        } else {
            // if (ourOkButton instanceof HTMLElement) { ourOkButton.inert = false; }
            eltKnownPeers.appendChild(mkElt("div", undefined, [`Click to sync with peer:`]));
            const _latestPeer = settingPeerjsLatestPeer.value;
            arrSavedPeers.forEach((peer, _idx) => {
                const iconRemove = modMdc.mkMDCicon("delete_forever");
                const btnRemove = modMdc.mkMDCiconButton(iconRemove, "Remove", 30);
                btnRemove.style.color = "#aaa";
                btnRemove.title = "Forget this peer";
                btnRemove.addEventListener("click", async (evt) => {
                    evt.stopPropagation();
                    const answer = await modMdc.mkMDCdialogConfirm(`Forget peer "${peer.id}"?`, "Forget", "Cancel");
                    if (!answer) { return; }
                    const secTrans = 1;
                    const divPeer = btnRemove.closest("div.mm4i-peer-item");
                    const bcr = divPeer.getBoundingClientRect();
                    const h = bcr.height;
                    divPeer.style.height = `${h}px`;
                    divPeer.style.opacity = "1.0";
                    divPeer.style.transitionProperty = `opacity, height`
                    divPeer.style.transitionDuration = `${secTrans}s`;
                    divPeer.style.opacity = "0.0";
                    divPeer.style.height = "0px";
                    removePeerId(peer.id);
                });
                // login, key, passkey
                const iconName = peer.secret ? "phone_android" : "passkey";
                const iconThisDevice = modMdc.mkMDCicon(iconName);
                // alert(JSON.stringify(peer)); // Catch old version of peer list
                const peerId = typeof peer == "string" ? peer : peer.id;
                const deg360 = peerId.split("").map(char => char.charCodeAt(0)).reduce((sum, val) => sum + val) * 4294967296 % 360;
                const maxRotate = 30;
                const rotate = (deg360 % maxRotate) - maxRotate / 2;
                iconThisDevice.style.rotate = `${rotate}deg`;
                const hue = deg360;
                iconThisDevice.style.color = `hsl(${hue}, 70%, 70%)`;
                const btnSyncPeer = modMdc.mkMDCbutton(`${peer.id}`, "outlined", iconThisDevice);
                btnSyncPeer.title = `Click to sync with web browser "${peer}"`;
                btnSyncPeer.style.textTransform = "none";
                btnSyncPeer.style.minWidth = "180px";
                btnSyncPeer.addEventListener("click", async (evt) => {
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
                            mkElt("b", undefined, `Syncing with peer "${peer.id}"`)
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
                    btnSyncPeer,
                    btnRemove,
                ]);
                divPeer.classList.add("mm4i-peer-item");
                divPeer.style = `
                    display: flex;
                    width: calc(100% - 40px);
                    margin-left: 20px;
                    margin-right: 20px;
                    height: 40px;
                    gap: 5px;
                    align-items: center;
                    justify-content: space-between;
                    `;
                eltKnownPeers.appendChild(divPeer);
            });
        }
    }
    function removePeerId(remPeerId) {
        const tofPeerId = typeof remPeerId;
        if (tofPeerId !== "string") throw Error(`Expected peerId to be a string, but it is ${tofPeerId}`);
        const arrSavedPeers = settingPeerjsSavedPeers.value;
        const arrIds = arrSavedPeers.map(peerRec => peerRec.id);
        const idx = arrIds.indexOf(remPeerId);
        // const idx = arrSavedPeers.indexOf(otherPeerId);
        if (idx > -1) {
            arrSavedPeers.splice(idx, 1);
            settingPeerjsSavedPeers.value = arrSavedPeers;
            // listPeers();
        }
    }



    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Sync with other peers"),
        mkElt("p", undefined, ["This peer name: ", mkElt("b", undefined, settingPeerjsId.valueS)]),
        eltKnownPeers,
        divAddPeer,
    ]);

    const btnClose = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnClose]);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    return await new Promise((resolve) => {
        dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async _evt => {
            finishPeer();
            resolve(undefined);
        }));
    });

}
async function dialogMindmapPrivacy() {
    // const modMMhelpers = await importFc4i("mindmap-helpers");
    const divInfoPrivacy = mkElt("p", undefined, `
        By default mindmaps are private to the device where you create them.
        If you want to share them from this device to another device mark them as "shared" here.
        `);
    const divSearch = mkElt("p", undefined, "div search here not ready");
    const divMindmaps = mkElt("p", undefined, "div mindmaps here not ready");
    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Select mindmaps to sync"),
        divSearch,
        divMindmaps,
    ]);

    // FIX-ME: remove
    const arrShared = await modMMhelpers.getSharedMindmaps();
    console.log({ arrShared });
    // debugger;

    const dbMindmaps = await importFc4i("db-mindmaps");
    const arrMindmaps = await dbMindmaps.DBgetAllMindmaps();
    const arrToShow = arrMindmaps.map(mh => {
        const key = mh.key;
        const j = mh.jsmindmap;
        const hits = mh.hits;
        let topic;
        switch (j.format) {
            case "node_tree":
                topic = j.data.topic;
                break;
            case "node_array":
                topic = j.data[0].topic;
                break;
            case "freemind":
                const s = j.data;
                topic = s.match(/<node .*?TEXT="([^"]*)"/)[1];
                break;
            default:
                throw Error(`Unknown mindmap format: ${j.format}`);
        }
        return { key, j, topic, hits };
    });
    const arrLi = arrToShow.map(m => {
        const topic = mkElt("span", undefined, m.topic);
        topic.style = `
                font-weight: bold;
            `;
        const chkShared = mkElt("input", { type: "checkbox", id: m.key });
        chkShared.addEventListener("input", evt => {
            // debugger;
            console.log(`input chkShared, ${chkShared.checked}, ${m.key}`);
            const privacy = chkShared.checked ? "shared" : "private";
            modMMhelpers.setMindmapPrivacy(m.key, privacy);
        });
        const privacy = modMMhelpers.getMindmapPrivacyFromObject(m.j);
        chkShared.checked = privacy == "shared";
        const lblShared = mkElt("label", undefined, [chkShared, mkElt("i", undefined, "share")]);

        const divMm = mkElt("div", undefined, [lblShared, topic]);
        divMm.style = `
                display: flex;
                flex-direction: row;
                gap: 20px;
            `;
        return divMm;
    });
    const divAllMm = mkElt("div", undefined, arrLi);
    divMindmaps.textContent = "";
    divMindmaps.appendChild(divAllMm);


    const btnClose = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnClose]);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    return await new Promise((resolve) => {
        dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async _evt => {
            // FIX-ME: Save changes
            resolve(undefined);
        }));
    });

}

function tellWhatIneed(dataChannel) {
    if (!myMindmapsAllKeyUpdated) {
        console.log(`tellWhatIneed, myMindmaps is ${myMindmapsAllKeyUpdated}`);
        return;
    }
    if (!peerMindmaps) {
        console.log(`tellWhatIneed, peerMindmaps is ${peerMindmaps}`);
        return;
    }
    const myKeys = Object.keys(myMindmapsAllKeyUpdated);
    const peerKeys = Object.keys(peerMindmaps);
    const needKeys = [];
    peerKeys.forEach(pk => {
        if (!myKeys.includes(pk)) {
            needKeys.push(pk);
        } else {
            const myUpdated = myMindmapsAllKeyUpdated[pk];
            const peerUpdated = peerMindmaps[pk];
            // console.log({ myUpdated, peerUpdated });
            if (peerUpdated > myUpdated) {
                needKeys.push(pk);
            }
        }
    });
    const objNeedKeys = {
        type: "need-keys",
        needKeys
    }
    // const msg = `Got "have-keys" => "need-keys" (${needKeys.length})`;
    const arrInfo = ["R", '"have-keys"', "S", `"need-keys" (${needKeys.length})`];
    // sendToPeer(objNeedKeys, msg, objNeedKeys);
    sendToPeer(objNeedKeys, arrInfo, objNeedKeys);
}

/*
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
            case "have-keys":
                peerMindmaps = data.myMindmaps;
                if (peerMindmaps == undefined) throw Error(`data.myMindmaps is undefined`);
                console.log({ peerMindmaps, myMindmaps });
                debugger; // eslint-disable-line no-debugger
                tellWhatIneed(dataChannel);
                break;
            case "need-keys":
                const neededKeys = data.needKeys;
                console.log({ neededKeys });
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
        "type": "have-keys",
        myMindmaps,
    }
    const json = JSON.stringify(objMessage);
    dataChannel.send(json);
}
*/

function _logWSinfo(...args) {
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
    const arg0 = args.shift();
    const eltMsg = mkElt("span", undefined, arg0);
    eltMsg.style.color = "blue";
    _logWSsyncLog(eltMsg);
}
function logWSready() {
    const msg = "** Sync is ready **"
    console.warn("%c WS: ", "background:green; color:white; font-size:20px;", msg);
    const eltMsg = mkElt("span", undefined, msg);
    eltMsg.style.color = "green";
    _logWSsyncLog(eltMsg);
}
function logWSError(...args) {
    const arg0 = args.shift();
    const msg = arg0;
    const eltMsg = mkElt("span", undefined, arg0);
    eltMsg.style.color = "red";
    console.error(`%c ${msg} `, "background:red; color:white;", ...args);
    _logWSsyncLog(eltMsg);
}
function _logDebug(...args) {
    const arg0 = args.shift();
    const msg = arg0;
    const eltMsg = mkElt("span", undefined, arg0);
    eltMsg.style.color = "red";
    eltMsg.style.backgroundColor = "yellow";
    console.warn(`%c ${msg} `, "background:red; color:white;", ...args);
    _logWSsyncLog(eltMsg);
    debugger; // eslint-disable-line no-debugger
}

function _logWSdetail(...args) {
    return;
    console.log(...args);
}

/**
 * 
 * @param {number} id 
 * @param  {...any} args 
 */
function _logDataChannel(id, ...args) {
    // const id = args.shift();
    console.warn(`%c Data Channel ${id}: `, "background:cyan; color:black;", ...args);
}
