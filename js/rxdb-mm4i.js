// @ts-check
const RXDB_MM4I_VER = "0.0.1";
window["logConsoleHereIs"](`here is rxdb-mm4i.js, module, ${RXDB_MM4I_VER}`);
console.log(`%chere is stairs.js`, "font-size:30px;");
if (document.currentScript) { throw "rxdb-mm4i.js is not loaded as module"; }

const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];



const modRxdbSetup = await importFc4i("rxdb-setup");
const modTools = await importFc4i("toolsJs");
const modMdc = await importFc4i("util-mdc");

export async function rxdbDialog() {
    const secretKeyMinLength = 8;
    const keySecretKey = "mm4i-webrct-secret-key";
    const keyRoomKey = "mm4i-webrct-room-key";
    // debugger;
    const ver = modRxdbSetup.getVersion();
    console.log({ m: modRxdbSetup, ver });
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
    // const iconReplicate = modMdc.mkMDCicon("sync_alt", "Sync devices", 40);
    const iconReplicate = modMdc.mkMDCicon("sync_alt");
    const btnReplicate = modMdc.mkMDCbutton("Sync devices", "raised", iconReplicate);
    btnReplicate.title = "Sync your mindmaps between your devices";
    btnReplicate.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        debugger; // eslint-disable-line no-debugger
        const room = `mm4i: ${inpRoom.value.trim()}`;
        const passkey = inpSecret.value.trim();
        replicationPool = await modRxdbSetup.replicateMindmaps(room, passkey);
        replicationPool.error$.subscribe(err => console.error('WebRTC Error:', err));
        btnStopReplicate.inert = false;
        btnTestSync.inert = true;
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
        btnTestSync.inert = false;
        btnReplicate.inert = false;
    });

    const divReplicate = mkElt("p", undefined, [
        btnReplicate,
        btnStopReplicate,
    ]);
    divReplicate.style = `
    display: flex;
    gap: 10px;
`;

    const btnTestSync = modMdc.mkMDCbutton("Test sync", "raised");
    btnTestSync.title = "Test sync";
    btnTestSync.addEventListener("click", async (evt) => {
        evt.stopPropagation();
        const body = mkElt("div", undefined, [
            mkElt("p", undefined, `This is a test of the sync functionality. `),
            mkElt("p", undefined, `It will not affect your mindmap.`),
        ]);
        const answer = await modMdc.mkMDCdialogConfirm(body, "Continue", "Cancel");
        if (answer) {
            const room = "mm4i: test sync";
            const passkey = "test sync passkey";
            replicationPool = await modRxdbSetup.replicateMindmaps(room, passkey);
            replicationPool.error$.subscribe(err => console.error('WebRTC Error:', err));
            btnTestSync.inert = true;
            btnReplicate.inert = true;
            btnStopReplicate.inert = false;
            modMdc.mkMDCsnackbar("Started sync", 6000);
        } else {
            modMdc.mkMDCsnackbar("Canceled sync", 6000);
        }
    });
    const divTestSync = mkElt("p", undefined, [
        mkElt("div", undefined, "Debugging sync"),
        btnTestSync,
    ]);
    divTestSync.style = `
    background-color: black;
    color: white;
    padding: 10px;
`;

    const body = mkElt("div", undefined, [
        notReady,
        eltTitle,
        divInfoCollapsible,
        divReplicate,
        detKeys,
        divTestSync,
    ]);

    getSecretKey();
    getRoomKey();
    checkSyncKeys();

    await modMdc.mkMDCdialogAlert(body);

}

