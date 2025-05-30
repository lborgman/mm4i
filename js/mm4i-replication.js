// @ts-check
const MM4I_REPL_VER = "0.0.04";
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
// const settingUseOpenRelay = new SettingsRepl("use-open-relay", false);
// const settingOpenRelayCred = new SettingsRepl("open-relay-cred", "");
// const settingRoom = new SettingsRepl("room", "");

const settingSecret = new SettingsRepl("secret", "");
const settingRouting = new SettingsRepl("routing", "");

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


let syncIsReady = false;
const divSyncLogLog = mkElt("div", { id: "div-sync-log-log", class: "display-none" });
const divSyncingHeaderMain = mkElt("b");
const divSyncingHeaderDots = mkElt("span");
divSyncingHeaderDots.style = `
        color: red;
        background: #0001;
    `;
divSyncingHeaderDots.addEventListener("click", evt => {
    evt.stopImmediatePropagation();
    divSyncLogLog.classList.toggle("display-none");
});
const divSyncingHeader = mkElt("div", undefined, [
    divSyncingHeaderMain,
    divSyncingHeaderDots
]);
divSyncingHeader.style = `
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 10px;
    `;

const divSyncLog = mkElt("div", undefined, [
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
    if (!syncIsReady) { divSyncingHeaderDots.append("."); }
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
        divQRresult.appendChild(mkElt("div", undefined, [mkElt("i", undefined, "Secret key: "), peerSecret]));
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

let setOfferRestrictions;
export async function replicationDialog() {
    const isOnline = await funIsOnline();
    if (!isOnline) {
        modMdc.mkMDCdialogAlert("Can't sync because device is not online.");
        return;
    }
    const notReady = mkElt("p", undefined, `Usable (${MM4I_REPL_VER})`);
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
        NObottom: -14px;
        top: 0px;
        right: 14px;
        color: white;
        background-color: cornflowerblue;
        border-radius: 50%;
    `;
    btnInfo.addEventListener("click", evt => {
        evt.stopPropagation();
        modTools.toggleHeightExpander(divInfoCollapsible);
    });



    /*
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
    const btnGenerateSecret = modMdc.mkMDCiconButton("enhanced_encryption", "Generate random secret", 40);
    btnGenerateSecret.addEventListener("click", async (evt) => {
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
        const btnScanQR = modMdc.mkMDCbutton("Scan peer secret QR code", "raised");
        btnScanQR.addEventListener("click", async (evt) => {
            evt.stopPropagation();
            dialogScanningQR();
        });
        const idDevice = settingPeerjsId.valueS;
        const body = mkElt("div", undefined, [
            mkElt("h2", undefined, `Peer "${idDevice}" secret key`),
            canvas,
            mkElt("p", undefined, ` Scan QR above with MM4I on your other device:`),
            mkElt("div", undefined, btnScanQR),
            // mkElt("hr", { style: "background-color:gray; width:80%; height: 1px;" }),
            mkElt("p", { style: "width:100%;" }, `Or, type the secret key you see below:`),
            mkElt("div", { style: "font-weight:700; background:white; color:darkred; padding:8px;" }, secretKey),
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
    const lblSecretKey = mkElt("label", undefined, [
        mkElt("span", { style: "margin-right:10px" }, "Secret key:"),
        btnGenerateSecret,
        btnQR,
        btnUnhide,
        spanSecret,
    ]);
    lblSecretKey.style = `
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


    const inpRouting = settingRouting.getInputElement();
    inpRouting.style = `
        width: 4em;
        `;
    const btnGenerateRouting = modMdc.mkMDCiconButton("ifl", "Generate random secret", 40);
    btnGenerateRouting.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const newKey = generateRobustRandomAsciiString(4);
        settingSecret.value = newKey;
    });
    const lblRoutingKey = mkElt("label", undefined, [
        mkElt("span", { style: "margin-right:10px" }, "Routing key:"),
        inpRouting,
        btnGenerateRouting,
    ]);
    lblRoutingKey.style = `
        font-weight: 500;
        font-style: italic;
        display: flex;
        align-items: center;
        `;


    const lblPeerjsId = mkElt("label", undefined, ["My device name: ", inpPeerjsId]);
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

    const btnInfoKeys = modMdc.mkMDCiconButton("info_i", "What are these keys for?", 24);
    btnInfoKeys.style = `
        position: absolute;
        top: 24px;
        right: 14px;
        color: white;
        background-color: cornflowerblue;
        border-radius: 50%;
    `;
    const divKeys = mkElt("div", undefined, [
        lblRoutingKey,
        lblSecretKey,
        btnInfoKeys
    ]);
    divKeys.style = `
        padding-left: 20px;
        position: relative;
        `;

    const divSecret = mkElt("div", { class: "mdc-card" }, [
        mkElt("p", undefined, lblPeerjsId),
        divKeys
    ]);
    divSecret.style = `
        padding: 10px;
        background-color: #ffffff30;
        margin-bottom: 30px;
        `;








    const spanSumKeysValid = mkElt("span", undefined, "Sync keys");
    spanSumKeysValid.id = "mm4i-sumkeys-valid";
    const spanSumKeysInvalid = mkElt("span", undefined, "Sync keys are invalid");
    spanSumKeysInvalid.id = "mm4i-sumkeys-invalid";
    const spanSumKeys = mkElt("span", undefined, [spanSumKeysInvalid, spanSumKeysValid]);
    const sumKeys = mkElt("summary", undefined, spanSumKeys);
    sumKeys.id = "sum-sync-keys";
    sumKeys.style.minHeight = "unset";
    const bodyKeys = mkElt("div", undefined, [
        divSecret,
    ]);









    // const iconReplication = modMdc.mkMDCicon("sync_alt");
    const iconSyncPeers = modMdc.mkMDCicon("p2p");
    const btnSyncPeers = modMdc.mkMDCbutton("Sync peers", "raised", iconSyncPeers);
    btnSyncPeers.title = "Sync your mindmaps between your peer devices";

    const iconPrivacy = modMdc.mkMDCicon("shield_with_heart");
    const btnPrivacy = modMdc.mkMDCbutton("Privacy", "outlined", iconPrivacy);
    btnPrivacy.title = "Set mindmaps to share";

    let _isReplicating = false;

    const currentKey = window["current-mindmapKey"];
    const currentPrivacy = await modMMhelpers.getMindmapPrivacy(currentKey);
    const currentName = await modMMhelpers.getMindmapTopic(currentKey);

    const spanCurrent = mkElt("span", undefined, `Current mindmap (${currentName})`);
    const radCurrent = mkElt("input", { type: "radio", name: "select-sync", value: currentKey });
    const lblCurrent = mkElt("label", undefined, [radCurrent, spanCurrent]);
    const divCurrent = mkElt("div", undefined, lblCurrent);

    const radNone = mkElt("input", { type: "radio", name: "select-sync", value: "none" });
    const lblNone = mkElt("label", undefined, [radNone, "Do not offer any mindmaps"]);
    const divNone = mkElt("div", undefined, lblNone);

    const radAll = mkElt("input", { type: "radio", name: "select-sync", value: "all" });
    const lblAll = mkElt("label", undefined, [radAll, "All shareable mindmaps"]);
    const divAll = mkElt("div", undefined, lblAll);

    switch (currentPrivacy) {
        case "shared":
            radCurrent.checked = true;
            break;
        case "private":
            radNone.checked = true;
            lblCurrent.inert = true;
            spanCurrent.textContent = `Current mindmap (${currentName}, not shareable)`;
            break;
        default:
            throw Error(`Unknown privacy: "${currentPrivacy}"`);
    }




    const divRad = mkElt("div", undefined, [
        divCurrent,
        divNone,
        divAll
    ]);
    divRad.style = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-left: 10px;
    `;
    const divSelectSync = mkElt("p", undefined, [
        mkElt("div", undefined, [
            "Select mindmaps to share to peer (",
            mkElt("span", { style: "color:red" }, "not fully implemented yet"),
            "):",
        ]),
        divRad
    ]);
    divSelectSync.style = `
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    btnSyncPeers.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const offerWhich = divSelectSync.querySelector("input[type=radio][name=select-sync]:checked").value;
        switch (offerWhich) {
            case "none":
                setOfferRestrictions = true;
                break;
            case "all":
                setOfferRestrictions = false;
                break;
            default:
                setOfferRestrictions = new Set([offerWhich]);
        }
        dialogSyncPeers();
    });
    btnPrivacy.addEventListener("click", async evt => {
        dialogMindmapPrivacy();
    });


    const divMainButtons = mkElt("p", undefined, [
        btnSyncPeers,
        btnPrivacy,
    ]);
    divMainButtons.style = `
        display: flex;
        gap: 10px;
        `;



    const body = mkElt("div", undefined, [
        notReady,
        eltTitle,
        divInfoCollapsible,
        bodyKeys,
        divSelectSync,
        divMainButtons,
        divSyncLog,
    ]);
    body.id = "sync-dialog-body";

    checkSyncKeys();
    await modMdc.mkMDCdialogAlert(body);
}


// let handledOpenBefore = false;
const modDbMindmaps = await importFc4i("db-mindmaps");
const modMMhelpers = await importFc4i("mindmap-helpers");

const funIsOnline = window["PWAonline"];


function getMindmapsKeysAndUpdated(arrMm) {
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
const myMindmapsAllKeyUpdated = getMindmapsKeysAndUpdated(arrAllMm);

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
        // debugger;
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
let mindmapsToOffer;
async function setupPeerConnection(remotePeerObj) {
    const remotePrivateId = remotePeerObj.id;
    const modPeerjs = await importFc4i("peerjs");
    const myPublicId = makePublicId(settingPeerjsId.valueS);

    const arrUpdated = [];
    let peerOfferedWithRestrictions;
    const arrSharedMm = await modMMhelpers.getSharedMindmaps();
    mindmapsToOffer = getMindmapsKeysAndUpdated(arrSharedMm);
    // debugger;
    switch (setOfferRestrictions) {
        case false:
            break;
        case true:
            mindmapsToOffer = {};
            break;
        default:
            if (!(setOfferRestrictions instanceof Set)) throw Error("setOfferRestrictions is not Set");
            const arrKeys = Object.keys(mindmapsToOffer);
            arrKeys.forEach(k => {
                if (!setOfferRestrictions.has(k)) {
                    delete mindmapsToOffer[k];
                }
            });
    }

    let dlgWaitingForPeer;
    async function startDialogWaitPeer() {
        if (dlgWaitingForPeer == "done") return;
        const eltH2 = mkElt("h2", undefined, `Waiting for "${remotePeerObj.id}"...`);
        eltH2.id = "wait-peer-h2";
        eltH2.style.color = "blue";
        const eltInstructions = mkElt("div", undefined, mkElt("p", undefined,
            `... Please also start sync on peer device "${remotePeerObj.id}"!`));
        eltInstructions.id = "wait-peer-info";
        const body = mkElt("div", undefined, [
            eltH2,
            eltInstructions,
        ]);

        dlgWaitingForPeer = await modMdc.mkMDCdialogAlert(body, "Close");
        const eltDialog = dlgWaitingForPeer.dom.querySelector(".mdc-dialog__surface");
        eltDialog.style.backgroundColor = "yellow";
        eltDialog.style.maxWidth = "310px";
    }
    async function endDialogWaitPeer(dataMsg) {
        console.log({ dataMsg });
        const re = /o:(.*?),s:(.*?),a:(.*?)$/;
        const m = dataMsg.match(re);
        console.log({ m });
        if (!m) {
            debugger;
        }
        const peerNumOffered = parseInt(m[1]);
        const peerNumShared = parseInt(m[2]);
        const peerNumAll = parseInt(m[3]);
        // debugger;
        const dlg = dlgWaitingForPeer;
        dlgWaitingForPeer = "done";
        const eltInstructions = document.getElementById("wait-peer-info");
        const eltH2 = document.getElementById("wait-peer-h2");
        if (!eltInstructions) return;
        if (!eltH2) return;
        eltInstructions.textContent = "";
        eltH2.textContent = "Thanks, connected to peer!";

        const arrMindmaps = await modDbMindmaps.DBgetAllMindmaps();
        const arrShared = await modMMhelpers.getSharedMindmaps();
        const myNumAll = arrMindmaps.length;
        const myNumShared = arrShared.length;
        const myNumOffered = setOfferRestrictions ? setOfferRestrictions.size : myNumShared;
        const liMy = mkElt("li", undefined, [
            `Offered from this device: `,
            mkElt("b", undefined, myNumOffered),
            ` of ${myNumAll} mindmaps.`
        ]);
        const liPeer = mkElt("li", undefined, [
            `Offered from peer: `,
            mkElt("b", undefined, peerNumOffered),
            ` of ${peerNumAll} mindmaps.`
        ]);
        const ul = mkElt("ul", undefined, [liMy, liPeer]);
        eltInstructions.appendChild(ul);
        const totOffered = myNumOffered + peerNumOffered;
        if (totOffered == 0) {
            const pNothingToSync = mkElt("p", undefined, "There was no mindmaps that could be synced");
            eltInstructions.appendChild(pNothingToSync);
        } else {
            // debugger;
            setTimeout(() => { dlg.mdc.close(); }, 10 * 1000);
        }
    }

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

        setTimeout(async () => { startDialogWaitPeer(); }, 3 * 1000);

        setupDataConnection(peerJsDataChannel, "4OPEN");
    });
    peer.on('connection', (conn) => {
        const msg = "ON peer CONNECTION";
        logWSimportant(msg, { conn });
        peerJsDataChannel = conn;
        setupDataConnection(peerJsDataChannel, "4CONNECTION");
    });
    async function setupDataConnection(dataChannel, what4) {
        // FIX-ME: if open
        const msg = `setupDataConnection ${what4}`;
        logWSimportant(msg, { dataChannel });
        let saidHello = false;
        const numShared = (await modMMhelpers.getSharedMindmaps()).length;
        const numMindmaps = (await modDbMindmaps.DBgetAllMindmaps()).length;
        // debugger;
        dataChannel.on('open', async () => {
            // if (what4 == "4CONNECTION") return;
            if (saidHello) {
                logWSimportant("Second dataChannel ON OPEN");
                debugger;
                return;
            }
            saidHello = true;
            console.warn("peerJsDataConnection open", { dataChannel });
            const offer = setOfferRestrictions instanceof Set ? "s" :
                (setOfferRestrictions ? "n" : "a");
            // FIX-ME: too much info on next line???
            const msgHelloO = `Hello ON OPEN dataChannel < ${myPublicId} -- o:${offer},s:${numShared},a:${numMindmaps}`;
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
                            // debugger;
                            endDialogWaitPeer(data.msg);

                            const mySecretSha512 = await makeSecret512(settingSecret.valueS, data.variant);
                            const peerSecretSha512 = data.secretSha512;
                            const secret512Ok = mySecretSha512 == peerSecretSha512;
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
                            const len = Object.keys(mindmapsToOffer).length;
                            const arrInfo = ["R", '"hello"', "S", `"offer-keys" (${len})`];
                            const objMessage = {
                                "type": "offer-keys",
                                myMindmaps: mindmapsToOffer,
                            }
                            objMessage.setOfferRestrictions = setOfferRestrictions instanceof Set;
                            sendToPeer(objMessage, arrInfo, data);
                        }
                        break;
                    case "offer-keys":
                        {
                            peerMindmaps = data.myMindmaps;
                            if (peerMindmaps == undefined) throw Error(`data.myMindmaps is undefined`);
                            peerOfferedWithRestrictions = data.setOfferRestrictions;
                            tellWhatIneed();
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
                                if (peerOfferedWithRestrictions) {
                                    // console.log("peerOfferedWithRestrictions", { peerMindmaps });
                                    // debugger;
                                    const arrPeerKeys = Object.keys(peerMindmaps);
                                    const promMoreMm = [];
                                    arrPeerKeys.forEach(peerKey => {
                                        const promMindmap = modDbMindmaps.DBgetMindmap(peerKey);
                                        promMoreMm.push(promMindmap);
                                    });
                                    const arrMoreSettled = await Promise.allSettled(promMoreMm);
                                    arrMoreSettled.forEach((settled, idx) => {
                                        if (settled.status == "rejected") {
                                            console.error(`Error getting mindmap ${arrPeerKeys[idx]}:`, settled.reason);
                                        }
                                        const myMm = arrMoreSettled[idx].value;
                                        // debugger;
                                        if (myMm == undefined) {
                                            // console.error(`Mindmap ${arrPeerKeys[idx]} was undefined`);
                                            console.log(`We did not have mindmap ${arrPeerKeys[idx]}:`, settled.reason);
                                        } else {
                                            const peerMmUpdated = peerMindmaps[myMm.key];
                                            const myMmMetaParts = modDbMindmaps.getMindmapMetaParts(myMm);
                                            const myMmUpdated = myMmMetaParts.lastUpdated;
                                            if (modTools.leftISOtimeMoreRecent(myMmUpdated, peerMmUpdated)) {
                                                debugger;
                                                arrNeededMindmaps.push(myMm);
                                            }
                                        }
                                    });
                                    // debugger;
                                }
                                const objMindmapsYouNeeded = {
                                    type: "mindmaps-you-need",
                                    arrNeededMindmaps
                                }
                                arrInfo.push("S");
                                arrInfo.push(`mindmaps-you-need (${arrNeededMindmaps.length})`);
                                sendToPeer(objMindmapsYouNeeded, arrInfo, data);
                            })();
                        }
                        break;
                    case "mindmaps-you-need":
                        const arrNeededMindmaps = data.arrNeededMindmaps;
                        {
                            const len = arrNeededMindmaps.length;
                            const eltInfo = mkElt("span",
                                { style: "color:orange" },
                                `R:"mindmaps-you-need" (${len}), updating`);
                            logWSimportant(eltInfo, { data });
                        }
                        const currentKey = window["current-mindmapKey"];
                        // FIX-ME: arrProm is needed for some reason I do not understand
                        const arrProm = arrNeededMindmaps.map(mm => {
                            const key = mm.key;
                            const topic = modMMhelpers.getMindmapTopicO(mm);
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
                            const [metaKey, metaUpdated] = mm.meta.name.split("/"); // FIX-ME:
                            if (key != metaKey) throw Error(`key:${key} != metaKey:${metaKey}`);
                            arrUpdated.push(`Updated mindmap "${topic}"`);
                            console.log(`%cUpdating mindmap "${topic}" (${key})`, "color:orange; font-size: 18px;");
                            return modDbMindmaps.DBsetMindmap(key, mm, metaUpdated);
                        });
                        const arrSettled = await Promise.allSettled(arrProm);
                        console.log({ arrSettled });
                        arrSettled.forEach((settled, idx) => {
                            if (settled.status == "rejected") {
                                const msg = `Error updating mindmap ${arrNeededMindmaps[idx].key}`;
                                console.error(msg, settled.reason);
                                debugger;
                                throw Error(`${msg}: ${settled.reason.message}`);
                            }
                        });
                        logWSready();
                        const parent = divSyncLogLog.parentElement;
                        if (!parent) { throw Error("divSyncLogLog has no parent"); }
                        const divResultLog = mkElt("div", { id: "sync-result-log" });
                        parent.appendChild(divResultLog);
                        if (arrUpdated.length > 0) {
                            const msg = `Updated ${arrUpdated.length} mindmap(s):`;
                            logWSimportant(msg, { arrUpdated });
                            divResultLog.appendChild(mkElt("div", { style: "font-weight:bold;" }, msg));
                            arrUpdated.forEach(msg => {
                                divResultLog.appendChild(mkElt("div", undefined, msg));
                            });
                        } else {
                            const msg = `No mindmaps were updated`;
                            logWSimportant(msg, { arrUpdated });
                            divResultLog.appendChild(mkElt("p", { style: "font-weight:bold;" }, msg));
                        }
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

/**
 * 
 * @returns 
 */
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
        // dlgWaitingForPeer = await modMdc.mkMDCdialogAlert(body);
        // const eltDialog = dlgWaitingForPeer.dom.querySelector(".mdc-dialog__surface");
        const dlg = await modMdc.mkMDCdialogAlert(body, "Close");
        const eltDialog = dlg.dom.querySelector(".mdc-dialog__surface");
        eltDialog.style.minWidth = "300px";
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
                        // eltKnownPeers.style.minHeight = `${bcr.height}px`;
                        eltKnownPeers.style.height = `${bcr.height}px`;
                        eltKnownPeers.style.overflow = "auto";
                        eltKnownPeers.textContent = "";
                        eltKnownPeers.appendChild(mkElt("div", undefined, [
                            divSyncingHeader,
                        ]));
                        divSyncingHeaderMain.textContent = `Syncing with "${peer.id}"`;
                        // divSyncLogLog = mkElt("div");
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



    const divShareSelection = mkElt("div");
    switch (setOfferRestrictions) {
        case false:
            divShareSelection.textContent = "Offer all non-private mindmaps";
            break;
        case true:
            divShareSelection.textContent = "Don't offer any mindmaps";
            break;
        default:
            const arrPromNames = [...setOfferRestrictions].map(key => {
                console.log({ modMMhelpers });
                const promName = modMMhelpers.getMindmapTopic(key);
                return promName;
            });
            const arrSettled = await Promise.allSettled(arrPromNames);
            console.log({ arrSettled });
            const arrNames = arrSettled.map(settled => settled.value);
            const names = arrNames.join(", ");

            divShareSelection.textContent = `Offer mindmaps: "${names}"`;
            divShareSelection.appendChild(mkElt("span", { style: "color:red" }, " (not ready!)"));
    }
    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Sync with peers"),
        mkElt("p", undefined, [
            "This peer name: ", mkElt("b", undefined, settingPeerjsId.valueS),
            divShareSelection,
        ]),
        eltKnownPeers,
        divAddPeer,
    ]);

    const btnClose = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnClose]);
    const dlg = await modMdc.mkMDCdialog(body, eltActions);
    const eltDialog = dlg.dom.querySelector(".mdc-dialog__surface");
    // eltDialog.style.minWidth = "310px";
    eltDialog.style.width = "310px";
    return await new Promise((resolve) => {
        dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async _evt => {
            finishPeer();
            resolve(undefined);
        }));
    });

}
async function dialogMindmapPrivacy() {
    const divInfoPrivacy = mkElt("p", undefined, `
        By default mindmaps are private to the device where you create them.
        If you want to share them from this device to another device mark them as "shared" here.
        `);
    const divSearch = mkElt("p", undefined, mkElt("span", { style: "color:red" }, "div search here not ready"));
    const divMindmaps = mkElt("p", undefined, "div mindmaps here not ready");
    const body = mkElt("div", undefined, [
        mkElt("h2", undefined, "Select mindmaps to share"),
        divSearch,
        divMindmaps,
    ]);

    // FIX-ME: remove
    const arrShared = await modMMhelpers.getSharedMindmaps();
    const arrMindmaps = await modDbMindmaps.DBgetAllMindmaps();
    console.log({ arrShared });
    const arrToShow = arrMindmaps.map(mh => {
        const key = mh.key;
        const j = mh.jsmindmap;
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
        return { key, topic, j };
    });
    const currentKey = window["current-mindmapKey"];
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
        if (m.key == currentKey) {
            divMm.style.backgroundColor = "lightskyblue";
            divMm.style.color = "blue";
        }
        if (m.key == currentKey) {
            // divMm.style.backgroundColor = "lightskyblue";
            divMm.style.backgroundColor = "#87cefa45";
            divMm.style.color = "blue";
        }

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

function tellWhatIneed() {
    if (!myMindmapsAllKeyUpdated) {
        console.log(`tellWhatIneed, myMindmaps is ${myMindmapsAllKeyUpdated}`);
        return;
    }
    if (!peerMindmaps) {
        console.log(`tellWhatIneed, peerMindmaps is ${peerMindmaps}`);
        return;
    }
    // offer-keys
    const myKeyUpdated = Object.keys(myMindmapsAllKeyUpdated);
    mindmapsToOffer
    const peerKeys = Object.keys(peerMindmaps);
    const needKeys = [];
    peerKeys.forEach(pk => {
        if (!myKeyUpdated.includes(pk)) {
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
    const arrInfo = ["R", '"offer-keys"', "S", `"need-keys" (${needKeys.length})`];
    sendToPeer(objNeedKeys, arrInfo, objNeedKeys);
}


function _logWSinfo(...args) {
    return;
    const arg0 = args.shift();
    const msg = `WS: ${arg0}`;
    console.log(`%c ${msg}`, "background:blue; color:white;", ...args);
}
function _logWSimportant(...args) {
    console.warn("%c WS: ", "background:blue; color:white; font-size:20px;", ...args);
}
function logWSimportant(...args) {
    _logWSimportant(...args);
    const arg0 = args.shift();
    const eltMsg = mkElt("span", undefined, arg0);
    eltMsg.style.color = "blue";
    _logWSsyncLog(eltMsg);
}
function logWSready() {
    syncIsReady = true;
    const msg = "** Sync is ready **"
    console.warn("%c WS: ", "background:green; color:white; font-size:20px;", msg);
    const eltMsg = mkElt("span", undefined, msg);
    eltMsg.style.color = "green";
    _logWSsyncLog(eltMsg);
    divSyncingHeaderDots.style.color = "green";
    divSyncingHeaderDots.textContent = "*Ready*"
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


async function obfuscateName(name) {
    // console.log("obfuscateName", { name });
    if (name == undefined || name.length === 0) return "";
    const { default: Hashids } = await importFc4i("hashids");
    const hashids = new Hashids('your salt here', 20);
    const obfuscated = hashids.encodeHex(stringToHex(name));
    return obfuscated;

    function stringToHex(str) {
        return Array.from(str).map(c =>
            c.charCodeAt(0).toString(16).padStart(2, '0')
        ).join('');
    }
}
async function deobfuscateName(obfuscatedName) {
    if (obfuscateName == undefined || obfuscateName.length === 0) return "";
    const { default: Hashids } = await importFc4i("hashids");
    const hashids = new Hashids('your salt here', 20);
    const originalHex = hashids.decodeHex(obfuscatedName);
    const originalId = hexToString(originalHex);
    return originalId;

    function hexToString(hex) {
        return hex.match(/.{1,2}/g).map(byte =>
            String.fromCharCode(parseInt(byte, 16))
        ).join('');
    }
}

_testObfuscateName();
async function _testObfuscateName() {
    const names = [
        "Alice",
        "Bob",
        "Charlie",
        "Dave",
        // "Eve",
        // "Frank",
        // "Grace",
        // "Heidi",
        // "Ivan",
        // "Judy",
    ];
    await (async () => {
        for (const name of names) {
            const obfuscated = await obfuscateName(name);
            console.log(`Obfuscated "${name}" to "${obfuscated}"`);
            const deobfuscated = await deobfuscateName(obfuscated);
            console.log(`Deobfuscated "${obfuscated}" to "${deobfuscated}"`);
            if (name != deobfuscated) throw Error(`Deobfuscated name "${deobfuscated}" does not match original "${name}"`);
        }
    })();
}   