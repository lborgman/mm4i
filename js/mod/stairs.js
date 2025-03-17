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
    let theDialog;
    console.log({ modMdc, modCustRend });
    const r = await modCustRend.getOurCustomRenderer();
    const nameMM = r.getMindmapName();
    if (!nameMM) return;

    // console.log({ ourStairs }); debugger;
    const divOurStairs = mkElt("div");
    divOurStairs.style = `
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-left: 20px;
        margin-right: 20px;
    `;
    refreshListing();
    async function getJmDisplayed() {
        const modCustRend = await importFc4i("jsmind-cust-rend");
        const theCustomRenderer = await modCustRend.getOurCustomRenderer();
        const jmDisplayed = theCustomRenderer.THEjmDisplayed;
        return jmDisplayed;
    }
    async function getCurrentStep() {
        // const modCustRend = await importFc4i("jsmind-cust-rend");
        // const theCustomRenderer = await modCustRend.getOurCustomRenderer();
        // const jmDisplayed = theCustomRenderer.THEjmDisplayed;
        const jmDisplayed = await getJmDisplayed();
        const selected_node = jmDisplayed?.get_selected_node();
        console.log({ selected_node });
        if (!selected_node) return 0;
        // const selectedElt = getDOMeltFromNode(selectedNode); // FIX-ME:
        const selectedElt = jsMind.my_get_DOM_element_from_node(selected_node)
        console.log({ selectedElt });
        if (!selectedElt) return 0;
        const eltMark = selectedElt.querySelector(".stair-mark");
        if (!eltMark) return 0;
        const strStep = eltMark.getAttribute("stair-step-n");
        if (!strStep) throw Error("There is no attribute stair-step-n");
        return parseInt(strStep);
    }
    function addStairControlEdit(nameStair) {
        const idControl = "stair-marks-control";
        const oldControl = document.getElementById(idControl);
        oldControl?.remove();
        const btnPrev = modMdc.mkMDCiconButton("arrow_back_ios_new");
        btnPrev.id = "prev-stair-step";
        btnPrev.addEventListener("click", async evt => {
            evt.stopPropagation();
            alert("not implemented here");
        });
        // btnPrev.inert = true;
        const btnNext = modMdc.mkMDCiconButton("arrow_forward_ios");
        btnNext.id = "next-stair-step";
        btnNext.addEventListener("click", async evt => {
            evt.stopPropagation();
            alert("not implemented here");
        });
        const btnSave = modMdc.mkMDCiconButton("save", "Save stair");
        btnSave.addEventListener("click", evt => {
            evt.stopPropagation();
            const objMarks = getCurrentObjStairMarks();
            const arrNodeid = Object.keys(objMarks).sort().map(key => {
                const eltMark = objMarks[key];
                const eltJmnode = eltMark.closest("jmnode");
                const nodeId = eltJmnode.getAttribute("nodeid");
                return nodeId;
            });
            saveStair(nameMM, nameStair, arrNodeid);
            modMdc.mkMDCsnackbar(`Saved stair "${nameStair}"`);

        })
        const btnClose = modMdc.mkMDCiconButton("close", "Cancel");
        const eltInfoStair = mkElt("span", undefined, `Edit stair "${nameStair}"`);
        const divControl = mkElt("div", undefined, [
            eltInfoStair,
            // btnPrev,
            // btnNext,
            btnSave,
            btnClose,
        ]);
        divControl.id = idControl;
        btnClose.addEventListener("click", evt => {
            evt.stopPropagation();
            // clearStairMarks();
            divControl.remove();
            const shield = document.getElementById(editShieldId);
            shield?.remove();
            viewStair(nameStair);
        });
        document.body.appendChild(divControl);
    }

    function addStairControlView(nameStair) {
        const idControl = "stair-marks-control";
        const oldControl = document.getElementById(idControl);
        oldControl?.remove();
        const btnPrev = modMdc.mkMDCiconButton("arrow_back_ios_new");
        btnPrev.id = "prev-stair-step";
        // btnPrev.inert = true;
        const btnNext = modMdc.mkMDCiconButton("arrow_forward_ios");
        btnNext.id = "next-stair-step";
        btnPrev.addEventListener("click", async evt => {
            evt.stopPropagation();
            stepPrevNext(false);
        });
        btnNext.addEventListener("click", evt => {
            evt.stopPropagation();
            stepPrevNext(true);
        });
        async function stepPrevNext(forward) {
            const currentStep = await getCurrentStep();
            console.log({ currentStep });
            const objStair = getCurrentObjStairMarks();
            const arrSteps = Object.keys(objStair).map(strStep => parseInt(strStep));
            if (forward) {
                const maxStep = Math.max(...arrSteps);
                if (maxStep == currentStep) {
                    modMdc.mkMDCsnackbar("At last node");
                    return;
                }
            } else {
                const minStep = Math.min(...arrSteps);
                if (minStep == currentStep) {
                    modMdc.mkMDCsnackbar("At first node");
                    return;
                }
            }
            const idxCurrent = arrSteps.indexOf(currentStep);
            const toStep = arrSteps[idxCurrent + (forward ? 1 : -1)];
            const toMark = objStair[toStep];
            const toJmnode = toMark.closest("jmnode");
            const toNodeid = toJmnode.getAttribute("nodeid");
            const jmDisplayed = await getJmDisplayed();
            jmDisplayed.select_node(toNodeid);
        }

        const btnClose = modMdc.mkMDCiconButton("close", "Hide stair");
        const eltInfoStair = mkElt("span", undefined, `Stair "${nameStair}"`);
        const divControl = mkElt("div", undefined, [
            eltInfoStair,
            btnPrev,
            btnNext,
            btnClose,
        ]);
        divControl.id = idControl;
        btnClose.addEventListener("click", evt => {
            evt.stopPropagation();
            clearStairMarks();
            divControl.remove();
        });
        document.body.appendChild(divControl);
    }

    function getCurrentObjStairMarks() {
        const eltJmnodes = document.querySelector("jmnodes");
        if (!eltJmnodes) throw Error("Could not find <jmnodes>");
        const obj = {};
        eltJmnodes.querySelectorAll(".stair-mark").forEach(eltStairMark => {
            console.log({ eltStairMark });
            const strStepN = eltStairMark.getAttribute("stair-step-n");
            if (strStepN == null) throw Error(`eltStairMark does not have attribute "step-stair-n"`)
            const stepN = parseInt(strStepN);
            obj[stepN] = eltStairMark;
        });
        console.log({ obj });
        return obj;
    }

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
            // const btnName = modMdc.mkMDCbutton(nameStair);
            const spanName = mkElt("span", undefined, nameStair);
            spanName.style = `
                background: orange;
                display: flex;
                flex-direction: column;
                justify-content: center;
                NOfont-weight: bold;
                font-size: 1.5rem;
            `;
            const btnView = modMdc.mkMDCiconButton("visibility", `Show stair "${nameStair}"`)
            const btnEdit = modMdc.mkMDCiconButton("edit", `Edit stair "${nameStair}"`)
            const btnDelete = modMdc.mkMDCiconButton("delete_forever", `Delete stair "${nameStair}"`);
            btnView.addEventListener("click", async evt => {
                evt.stopPropagation();
                theDialog.mdc.close();

                viewStair(nameStair);

            });
            btnEdit.addEventListener("click", evt => {
                evt.stopPropagation();
                editStair(nameStair);
            });
            btnDelete.addEventListener("click", async evt => {
                evt.stopPropagation();
                const answer = await modMdc.mkMDCdialogConfirm(`Delete stair "${nameStair}"`, "Yes", "Cancel");
                if (!answer) return;
                deleteStair(nameMM, nameStair);
                refreshListing();
            });
            const divEntry = mkElt("div", undefined, [spanName, btnView, btnEdit, btnDelete]);
            divEntry.style = `
              display: grid;
              grid-template-columns: 1fr 40px 40px 40px;
              NOgap: 10px;
        `;
            divEntry.dataset.nameStair = name;
            divEntry.dataset.strStair = strVal;
            // divOurStairs.appendChild(divEntry);
            divOurStairs.appendChild(divEntry);
        });
    }

    // debugger; // eslint-disable-line no-debugger
    const divNotReady = mkElt("p", undefined, "Nearly ready...");
    divNotReady.style = `
        background: red;
        background: yellow;
        padding: 10px;
        color: yellow;
    `;

    // const eltTitle = mkElt("h2", undefined, `Mindmap "${nameMM}" stairs`);
    const eltTitle = mkElt("h2", undefined, [
        "Stairs for mindmap ", mkElt("i", undefined, nameMM),
    ]);
    eltTitle.style = `
        position: relative;
        margin-bottom: 40px;
    `;

    const eltIcon = modMdc.mkMDCicon("add");
    const btnFab = modMdc.mkMDCfab(eltIcon, "Create new stair", true);
    eltTitle.appendChild(btnFab);
    btnFab.style = `
        position: absolute;
        right: 0px;
        top: 20px;
    `;

    const inpName = modMdc.mkMDCtextFieldInput();
    const tfName = modMdc.mkMDCtextField("New stair's name", inpName);
    const btnNameAdd = modMdc.mkMDCbutton("Add", "raised");
    const divName = mkElt("p", undefined, [
        tfName,
        btnNameAdd,
    ]);
    divName.style = `
        display: none;
        gap: 10px;
        margin-bottom: 30px;
    `;

    btnFab.addEventListener("click", evt => {
        evt.stopPropagation();
        if (divName.style.display == "flex") { divName.style.display = "none"; return; }
        divName.style.display = "flex";
        setTimeout(() => inpName.focus(), 500);
    });
    btnNameAdd.addEventListener("click", evt => {
        evt.stopPropagation();
        const nameStair = inpName.value.trim();
        if (nameStair.length == 0) {
            inpName.focus();
            return;
        }
        editStair(nameStair)
    });
    function viewStair(nameStair) {

        const stairMinMax = computeStairMinMax(nameStair)
        console.log({ stairMinMax });
        // clearStairMarks();
        addOurMarks(nameStair);
        addStairControlView(nameStair);

        function computeStairMinMax(nameStair) {
            const arrIds = getStair(nameMM, nameStair);
            const minStep = Math.min(...arrIds);
            const maxStep = Math.max(...arrIds);
            const objMinMax = { minStep, maxStep };
            console.log(objMinMax);
            return objMinMax;
        }
    }

    const editShieldId = "stair-view-edit-shield";
    function editStair(nameStair) {
        // clearStairMarks();
        addOurMarks(nameStair);
        const eltEditShield = mkElt("div", undefined,);
        eltEditShield.id = editShieldId;
        document.body.appendChild(eltEditShield);
        addStairControlEdit(nameStair);
        theDialog.mdc.close();
        document.body.addEventListener("click", evt => {
            const arrElts = document.elementsFromPoint(evt.clientX, evt.clientY);
            console.log({ arrElts });
            let eltsJmnode = arrElts.filter(elt => elt.tagName == "JMNODE");
            console.log({ eltsJmnode });
            if (eltsJmnode.length == 0) {
                const eltsStepMark = arrElts.filter(elt => elt.classList.contains("stair-mark"));
                console.log({ eltsStepMark });
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
            console.log("finale", { eltsJmnode });

            if (eltsJmnode.length > 1) {
                debugger; // eslint-disable-line no-debugger
            }
            if (eltsJmnode.length > 0) {
                const eltJmnode = eltsJmnode[0];
                // const eltJmnodes = eltJmnode.closest("jmnodes");
                // const arrN = getCurrentStairSteps();
                // const getNewStepNum = Math.max(0, ...arrN) + 1;
                const objStair = getCurrentObjStairMarks();
                const arrN = Object.keys(objStair)
                const getNewStepNum = Math.max(0, ...arrN) + 1;
                updateStairMark(eltJmnode, getNewStepNum);
                return;
            }

        });
    }

    function updateStairMark(eltJmnode, nStep) {
        const oldMark = eltJmnode.querySelector(".stair-mark");
        if (oldMark) { oldMark.remove(); return; }
        addStairMark(eltJmnode, nStep);
    }

    function clearStairMarks() {
        // debugger;
        const qsa = document.querySelectorAll("jmnodes jmnode div.stair-mark");
        qsa.forEach(mark => mark.remove());
        return;
        const arrMiddle = getEltsStairN();
        arrMiddle.forEach(eltM => {
            const eltMark = eltM.closest(".stair-mark");
            eltMark?.remove();
        });
    }
    function addOurMarks(nameStair) {
        clearStairMarks();
        const eltJmnodes = document.querySelector("jmnodes")
        if (!eltJmnodes) throw Error("Could not find <jmnodes>");
        const arrIds = getStair(nameMM, nameStair);
        if (!arrIds) return;
        const qsa = eltJmnodes.querySelectorAll("jmnode")
        qsa.forEach(eltJmnode => {
            const nodeid = eltJmnode.getAttribute("nodeid");
            const pos = arrIds.indexOf(nodeid);
            if (pos > -1) {
                addStairMark(eltJmnode, pos + 1);
            }
        });
    }

    function addStairMark(eltJmnode, nStep) {
        // const eltMiddle = mkElt("div", { class: "stair-mark-middle" }, "N");
        // const newMark = mkElt("div", { class: "stair-mark" }, [eltMiddle]);
        const strN = `${nStep}`;
        const newMark = mkElt("div", { class: "stair-mark" }, strN);
        newMark.setAttribute("stair-step-n", strN);
        eltJmnode.appendChild(newMark);
        // eltMiddle.textContent = `${nStep}`;
        if (nStep == 1) {
            // newMark.style.fontSize = "22px";
            newMark.classList.add("stair-mark-first");
        }
    }


    const body = mkElt("div", undefined, [
        divNotReady,
        eltTitle,
        divName,
        divOurStairs,
    ]);
    const btnClose = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnClose]);
    theDialog = await modMdc.mkMDCdialog(body, eltActions);
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
function getStair(nameMindmap, nameStair) {
    const key = `${nameMindmap}---${nameStair}`; console.log({ key });
    const str = localStorage.getItem(key);
    const val = JSON.parse(str);
    return val;
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

function OLDgetCurrentStairSteps() {
    const eltJmnodes = document.querySelector("jmnodes")
    if (!eltJmnodes) throw Error("Could not find <jmnodes>");
    const arrStairN = [...eltJmnodes.querySelectorAll(".stair-mark")];
    const arrN = arrStairN.map(elt => {
        const str = elt.getAttribute("stair-step-n");
        if (str == null) throw Error(`Did not find attribute "stair-step-mark"`);
        const int = parseInt(str);
        return int;
    });
    arrN.sort();
    return arrN;
}
