// @ts-check
const STAIRS_VER = "0.0.1";
window["logConsoleHereIs"](`here is stairs.js, module, ${STAIRS_VER}`);
if (document.currentScript) { throw "stairs.js is not loaded as module"; }

const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];

const modMdc = await importFc4i("util-mdc");
const modCustRend = await importFc4i("jsmind-cust-rend");
const modShieldClick = await importFc4i("shield-click");

export async function dialogStairs() {
    console.log({ modMdc, modCustRend });
    const r = await modCustRend.getOurCustomRenderer();
    const nameMM = r.getMindmapName();
    if (!nameMM) return;

    // console.log({ ourStairs }); debugger;
    const divOurStairs = mkElt("div");
    divOurStairs.style = `
        display: flex;
        flex-direction: column;
        NOgap: 10px;
        margin-left: 20px;
    `;
    refreshListing();
    function refreshListing() {
        divOurStairs.textContent = "";
        const ourStairs = getStairs(nameMM);
        if (ourStairs.length == 0) {
            divOurStairs.textContent = "There are no stairs for this mindmap.";
            return;
        }
        ourStairs.forEach(obj => {
            const nameStair = obj.nameStair;
            const strVal = obj.strStair;
            const btnName = modMdc.mkMDCbutton(nameStair);
            btnName.title = `Display stair "${nameStair}"`;
            const btnDelete = modMdc.mkMDCiconButton("delete_forever", `Delete stair "${nameStair}"`);
            btnDelete.addEventListener("click", evt => {
                evt.stopPropagation();
                console.log("delete stair", nameStair);
                deleteStair(nameMM, nameStair);
                refreshListing();
            });
            const divEntry = mkElt("div", undefined, [btnName, btnDelete]);
            divEntry.style = `
            display: grid;
            grid-template-columns: 100px 40px;
            gap: 10px;
        `;
            divEntry.dataset.nameStair = name;
            divEntry.dataset.strStair = strVal;
            divOurStairs.appendChild(divEntry);
            divOurStairs.appendChild(divEntry);
        });
    }

    // debugger; // eslint-disable-line no-debugger
    const divNotReady = mkElt("p", undefined, "Not ready!");
    divNotReady.style = `
        background: red;
        padding: 10px;
        color: yellow;
    `;

    const eltTitle = mkElt("h2", undefined, `Mindmap "${nameMM}" stairs`);
    eltTitle.style = `
        display: flex;
        gap: 20px;
    `;

    const eltIcon = modMdc.mkMDCicon("add");
    const btnFab = modMdc.mkMDCfab(eltIcon, "Create new stair", true);
    eltTitle.appendChild(btnFab);

    const inpName = modMdc.mkMDCtextFieldInput();
    const tfName = modMdc.mkMDCtextField("New stair's name", inpName);
    const btnNameContinue = modMdc.mkMDCbutton("Add", "raised");
    const divName = mkElt("div", undefined, [
        tfName,
        btnNameContinue,
    ]);
    divName.style = `
        display: none;
        gap: 10px;
    `;

    btnFab.addEventListener("click", evt => {
        evt.stopPropagation();
        if (divName.style.display == "flex") { divName.style.display = "none"; return; }
        divName.style.display = "flex";
        setTimeout(() => inpName.focus(), 500);
    });
    btnNameContinue.addEventListener("click", evt => {
        evt.stopPropagation();
        const nameStair = inpName.value.trim();
        if (nameStair.length == 0) {
            inpName.focus();
            return;
        }
        editStair(nameStair)
    });
    let nStep = 0;
    function editStair(nameStair) {
        console.log("editStair", nameStair);
        const arrDialogContainer = [...document.querySelectorAll(".mdc-dialog__container")];
        const arrDcs = arrDialogContainer.map(elt => elt.style);
        arrDcs.forEach(dcs => {
            dcs.transitionProperty = "opacity";
            dcs.transitionDuration = "1s";
        });

        const eltShieldTitle = mkElt("span", undefined, `Edit stair ${nameStair}`);
        eltShieldTitle.style = `
            font-size: 20px;
            padding-right: 10px;
        `;
        const btnSave = modMdc.mkMDCbutton("Save");
        const btnCancel = modMdc.mkMDCbutton("Cancel");
        const btnRenumber = modMdc.mkMDCbutton("Renumber");
        const divShieldButtons = mkElt("div", undefined, [
            btnSave,
            btnCancel,
            btnRenumber,
        ])
        const eltShieldTop = mkElt("div", undefined, [
            eltShieldTitle,
            divShieldButtons,
        ]);
        eltShieldTop.style = `
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            background-color: midnightblue;
            color: white;
            margin-top: 0;
            padding: 10px;
        `;
        btnSave.addEventListener("click", evt => {
            evt.stopPropagation();
            // renumber
            const arrStairN = getEltsStairN();
            const arrJmnode = arrStairN.map(elt => elt.closest("jmnode"));
            console.log({ arrJmnode });
            const arrIds = arrJmnode.map(elt => elt?.getAttribute("nodeid")); console.log({ arrIds });
            saveStair(nameMM, nameStair, arrIds);
        });

        btnCancel.addEventListener("click", evt => {
            evt.stopPropagation();
            stopEdit();
        });
        btnRenumber.addEventListener("click", evt => {
            evt.stopPropagation();
            // debugger; // eslint-disable-line no-debugger
            const arrStairN = getEltsStairN();
            let n = 0;
            arrStairN.forEach(elt => {
                elt.textContent = `${++n}`;
                elt.style.backgroundColor = "red";
                elt.style.fontSize = null;
                const eltPrev = elt.previousElementSibling;
                if (!eltPrev) throw Error("There was no .previousElementSibling");
                eltPrev.textContent = "<";
                if (n == 1) {
                    eltPrev.textContent = "|";
                    elt.style.fontSize = "22px";
                }
            });

        });
        function getEltsStairN() {
            const eltJmnodes = document.querySelector("jmnodes");
            if (!eltJmnodes) throw Error("Could not find <jmnodes>");
            const arrStairN = [...eltJmnodes.querySelectorAll(".stair-mark-middle")];
            console.log({ arrStair: arrStairN });
            const sortByStep = (a, b) => {
                const strA = a.textContent;
                const strB = b.textContent;
                const nA = parseInt(strA);
                if (Number.isNaN(nA)) throw Error(`Not a number: "${strA}"`);
                const nB = parseInt(strB);
                if (Number.isNaN(nB)) throw Error(`Not a number: "${strB}"`);
                if (nB < nA) return 1
                if (nB > nA) return -1
                return 0;
            }
            arrStairN.sort(sortByStep);
            console.log({ arrStairN });
            return arrStairN;
        }


        const eltEditShield = mkElt("div", undefined, eltShieldTop);
        eltEditShield.style = `
                position: fixed;
                top: 0px;
                left: 0px;
                bottom: 0px;
                right: 0px;
                z-index: 9999;
                background-color: rgba(25, 25, 112, 0.4);
                pointer-events: auto;
                NOpointer-events: none;
            `;
        /*
        eltEditShield.addEventListener("pointerdown", evt => {
            evt.stopImmediatePropagation();
            shieldPointerDown(evt);
        });
        */
        modShieldClick.addShieldClick(eltEditShield, shieldPointerDown, getJsmindInner);
        function getJsmindInner(eltsHere) {
            const elts = eltsHere.filter(elt => elt.classList.contains("jsmind-inner"));
            return elts[0];
        }
        function shieldPointerDown(evt) {
            // console.log("pointer-down eltShield");
            const arrElts = document.elementsFromPoint(evt.clientX, evt.clientY);
            // console.log({ arrElts });
            let eltsJmnode = arrElts.filter(elt => elt.tagName == "JMNODE");
            if (eltsJmnode.length == 0) {
                const eltsStepMark = arrElts.filter(elt => elt.classList.contains("stair-mark"));
                if (eltsStepMark.length > 1) {
                    debugger; // eslint-disable-line no-debugger
                }
                if (eltsStepMark.length > 0) {
                    const eltStepMark = eltsStepMark[0];
                    const eltJmnode = eltStepMark.closest("jmnode");
                    if (!eltJmnode) throw Error("Did not find <jmnode> from .stair-mark");
                    eltsJmnode = [eltJmnode];
                }
            }

            // console.log({ eltsJmnode });
            if (eltsJmnode.length > 1) {
                debugger; // eslint-disable-line no-debugger
            }
            if (eltsJmnode.length > 0) {
                const eltJmnode = eltsJmnode[0];
                updateStairMark(eltJmnode);
                return;
            }
            const eltsJsmindInner = arrElts.filter(elt => elt.classList.contains("jsmind-inner"));
            const eltJsmindInner = eltsJsmindInner[0];
            // resend
        }
        function updateStairMark(eltJmnode) {
            const oldMark = eltJmnode.querySelector(".stair-mark");
            if (oldMark) { oldMark.remove(); return; }
            const btnLeft = mkElt("div", { class: "stair-mark-left" }, "<");
            const eltMiddle = mkElt("div", { class: "stair-mark-middle" }, "N");
            const btnRight = mkElt("div", { class: "stair-mark-right" }, ">");
            const newMark = mkElt("div", { class: "stair-mark" }, [btnLeft, eltMiddle, btnRight]);
            eltJmnode.appendChild(newMark);
            eltMiddle.textContent = `${++nStep}`;
            if (nStep == 1) {
                btnLeft.textContent = "|";
                newMark.style.fontSize = "22px";
            }
        }

        startEdit();
        function startEdit() {
            arrDcs.forEach(dcs => { dcs.opacity = 0; });
            // arrDialogContainer.forEach(cnt => { })
            setTimeout(() => {
                arrDcs.forEach(dcs => { dcs.display = "none"; });
            }, 1 * 1000);
            document.body.appendChild(eltEditShield);
        }
        function stopEdit() {
            arrDcs.forEach(dcs => { dcs.display = null; dcs.opacity = 1; });
            eltEditShield.remove();
            clearStairMarks();
        }
        function clearStairMarks() {
            const arrMiddle = getEltsStairN();
            arrMiddle.forEach(eltM => {
                const eltMark = eltM.closest(".stair-mark");
                eltMark?.remove();
            });
        }
    }


    const body = mkElt("div", undefined, [
        divNotReady,
        eltTitle,
        divName,
        divOurStairs,
    ]);
    modMdc.mkMDCdialogAlert(body, "Close");
}



function saveStair(nameMindmap, nameStair, arrIds) {
    const key = `${nameMindmap}---${nameStair}`; console.log({ key });
    const value = JSON.stringify(arrIds);
    localStorage.setItem(key, value);
}
function deleteStair(nameMindmap, nameStair) {
    const key = `${nameMindmap}---${nameStair}`; console.log({ key });
    localStorage.removeItem(key);
}

/**
 * 
 * @param {string} nameMindMap 
 */
function getStairs(nameMindMap) {
    let keys = Object.keys(localStorage);
    const arrStairs = [];
    const lenName = nameMindMap.length;
    for (let key of keys) {
        const val = localStorage.getItem(key);
        console.log(`${key}: ${val}`);
        if (key.startsWith(`${nameMindMap}---`)) {
            const strStair = localStorage.getItem(key);
            const nameStair = key.slice(lenName + 3);
            const objStair = { nameStair, strStair };
            arrStairs.push(objStair);
            // FIX-ME: sort
        }
    }
    return arrStairs;
}
