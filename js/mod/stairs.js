// @ts-check
const STAIRS_VER = "0.0.1";
window["logConsoleHereIs"](`here is stairs.js, module, ${STAIRS_VER}`);
if (document.currentScript) { throw "stairs.js is not loaded as module"; }

const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const importFc4i = window["importFc4i"];

const modTools = await importFc4i("toolsJs");
const modMdc = await importFc4i("util-mdc");
const modCustRend = await importFc4i("jsmind-cust-rend");
// const modShieldClick = await importFc4i("shield-click");

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
        const jsMind = window["jsMind"];
        const selectedElt = jsMind.my_get_DOM_element_from_node(selected_node);
        console.log({ selectedElt });
        if (!selectedElt) return 0;
        const eltMark = selectedElt.querySelector(".stair-mark");
        if (!eltMark) return 0;
        const strStep = eltMark.getAttribute("stair-step-n");
        if (!strStep) throw Error("There is no attribute stair-step-n");
        return parseInt(strStep);
    }
    function addStairControlEdit(nameStair, bodyClickHandler) {
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
            saveStair(nameMM, nameStair);
            modMdc.mkMDCsnackbar(`Saved stair "${nameStair}"`);
        })
        const btnCloseEdit = modMdc.mkMDCiconButton("close", "Cancel");
        const eltInfoStair = mkElt("span", undefined, `Edit stair "${nameStair}"`);
        const divControl = mkElt("div", undefined, [
            eltInfoStair,
            // btnPrev,
            // btnNext,
            btnSave,
            btnCloseEdit,
        ]);
        divControl.id = vieweditControlId;
        btnCloseEdit.addEventListener("click", async evt => {
            // evt.stopPropagation();
            evt.stopImmediatePropagation();
            const stairScreen = screenStair();
            const stairSaved = getStair(nameMM, nameStair);
            const isSaved = JSON.stringify(stairSaved) == JSON.stringify(stairScreen);
            console.log({ isSaved });
            if (!isSaved) {
                const body = mkElt("p", undefined, "Save changes?");
                const save = await modMdc.mkMDCdialogConfirm(body, "Yes", "No");
                console.log({ save });
                if (save) {
                    saveStair(nameMM, nameStair);
                    modMdc.mkMDCsnackbar("Saved stair");
                    // I think there is a chromium bug here. Test waiting 1 second.
                    // alert("saved");
                    await modTools.waitSeconds(1);
                }
            }
            document.body.removeEventListener("click", bodyClickHandler);
            exitEditOrView();
            viewStair(nameStair);
        });
        document.body.appendChild(divControl);
    }

    function addStairControlView(nameStair) {
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
            const objStairMarks = getCurrentObjStairMarks();
            const arrSteps = Object.keys(objStairMarks).map(strStep => parseInt(strStep));
            if (forward) {
                const maxStep = Math.max(...arrSteps);
                if (maxStep == currentStep) {
                    modMdc.mkMDCsnackbar("At last step");
                    return;
                }
            } else {
                const minStep = Math.min(...arrSteps);
                if (minStep == currentStep) {
                    modMdc.mkMDCsnackbar("At first step");
                    return;
                }
            }
            const idxCurrent = arrSteps.indexOf(currentStep);
            const toStep = arrSteps[idxCurrent + (forward ? 1 : -1)];
            const toMark = objStairMarks[toStep];
            const toJmnode = toMark.closest("jmnode");
            const toNodeid = toJmnode.getAttribute("nodeid");
            const jmDisplayed = await getJmDisplayed();
            jmDisplayed.select_node(toNodeid);
        }

        const btnCloseView = modMdc.mkMDCiconButton("close", "Hide stair");
        const eltInfoStair = mkElt("span", undefined, `Stair "${nameStair}"`);
        const divControl = mkElt("div", undefined, [
            eltInfoStair,
            btnPrev,
            btnNext,
            btnCloseView,
        ]);
        divControl.id = vieweditControlId;
        btnCloseView.addEventListener("click", evt => {
            evt.stopPropagation();
            exitEditOrView();
        });
        document.body.appendChild(divControl);
    }

    function refreshListing() {
        divOurStairs.textContent = "";
        const ourStairs = getStairs(nameMM);
        if (ourStairs.length == 0) {
            divOurStairs.textContent = "There are no stairs for this mindmap.";
            return;
        }
        ourStairs.sort((a, b) => { return a.nameStair.localeCompare(b.nameStair); });
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
    const divNotReady = mkElt("p", undefined, "It might be almost ready...");
    divNotReady.style = `
        background: red;
        background: yellow;
        padding: 10px;
        color: yellow;
        color: black;
    `;

    // const eltTitle = mkElt("h2", undefined, `Mindmap "${nameMM}" stairs`);
    const eltTitle = mkElt("h2", undefined, [
        "Stairs for mindmap ", mkElt("i", undefined, nameMM),
    ]);
    eltTitle.style = `
        position: relative;
        margin-bottom: 50px;
    `;

    const divInfo = mkElt("div", undefined, [
        mkElt("p", undefined, `
            Mindmap stairs are paths that you define between the mindmap nodes.
            You can define several stairs.
            You give each of them a name.
            `),
        mkElt("p", undefined, `
            The stairs are shown as step numbers added to the mindmap nodes contained in the stair.
            `),
        mkElt("p", undefined, `
            You edit a stair by just clicking the mindmap nodes you want (or do not want) in the stair.
            The steps are added in the order you click the nodes.
            `),
    ]);
    const divInfoCollapsible = modTools.mkHeightExpander(divInfo);
    const btnInfo = modMdc.mkMDCiconButton("info_i");
    // const eltIconInfo = modMdc.mkMDCicon("info_i");
    // const btnInfo = modMdc.mkMDCfab(eltIconInfo, "What is a stair here?", true);
    eltTitle.appendChild(btnInfo);
    btnInfo.style = `
        position: absolute;
        top: 24px;
        right: 60px;
        color: blue;
    `;
    btnInfo.addEventListener("click", evt => {
        evt.stopPropagation();
        modTools.toggleHeightExpander(divInfoCollapsible);
    })

    const eltIcon = modMdc.mkMDCicon("add");
    const btnFabAdd = modMdc.mkMDCfab(eltIcon, "Create new stair", true);
    eltTitle.appendChild(btnFabAdd);
    btnFabAdd.style = `
        position: absolute;
        top: 24px;
        right: 0px;
    `;

    const inpName = modMdc.mkMDCtextFieldInput();
    const tfName = modMdc.mkMDCtextField("New stair's name", inpName);
    const btnNameAdd = modMdc.mkMDCbutton("Add", "raised");
    const divName = mkElt("p", undefined, [
        tfName,
        btnNameAdd,
    ]);
    divName.style = `
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
    `;
    const divNameExpander = modTools.mkHeightExpander(divName);

    btnFabAdd.addEventListener("click", evt => {
        evt.stopPropagation();
        // if (divName.style.display == "flex") { divName.style.display = "none"; return; }
        // divName.style.display = "flex";
        // setTimeout(() => inpName.focus(), 500);
        modTools.toggleHeightExpander(divNameExpander);
        setTimeout(() => inpName.focus(), 1200);
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
        if (!addOurMarks(nameStair)) {
            modMdc.mkMDCsnackbar(`Stair "${nameStair} is empty`);
            return;
        }
        addStairControlView(nameStair);
    }

    const vieweditShieldId = "stair-view-edit-shield";
    const vieweditControlId = "stair-view-edit-control";
    function exitEditOrView() {
        const shield = document.getElementById(vieweditShieldId);
        shield?.remove();
        const control = document.getElementById(vieweditControlId);
        control?.remove();
        clearStairMarks();
        document.body.classList.remove("editing-stair");
    }
    function editStair(nameStair) {
        exitEditOrView();
        document.body.classList.add("editing-stair");
        addOurMarks(nameStair);
        const eltEditShield = mkElt("div", undefined,);
        eltEditShield.id = vieweditShieldId;
        document.body.appendChild(eltEditShield);

        addStairControlEdit(nameStair, bodyClickHandler);
        document.body.addEventListener("click", bodyClickHandler);

        theDialog.mdc.close();
        function bodyClickHandler(evt) {
            // evt.stopPropagation();
            evt.stopImmediatePropagation();
            const arrElts = document.elementsFromPoint(evt.clientX, evt.clientY);
            // console.log({ arrElts });
            let eltsJmnode = arrElts.filter(elt => elt.tagName == "JMNODE");
            // console.log({ eltsJmnode });
            if (eltsJmnode.length == 0) {
                const eltsStepMark = arrElts.filter(elt => elt.classList.contains("stair-mark"));
                // console.log({ eltsStepMark });
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
            console.log("bodyClickHandler finale", { eltsJmnode });

            if (eltsJmnode.length > 1) {
                debugger; // eslint-disable-line no-debugger
            }
            if (eltsJmnode.length > 0) {
                const eltJmnode = eltsJmnode[0];
                // const arrN = getCurrentStairSteps();
                const objStairMarks = getCurrentObjStairMarks();
                const arrStepN = Object.keys(objStairMarks).map(k => parseInt(k));
                const newStepNum = Math.max(0, ...arrStepN) + 1;
                updateStairMark(eltJmnode, newStepNum);
                return;
            }

        }
    }

    function updateStairMark(eltJmnode, nStep) {
        const oldMark = eltJmnode.querySelector(".stair-mark");
        if (oldMark) { oldMark.remove(); return; }
        addStairMark(eltJmnode, nStep);
    }

    function clearStairMarks() {
        const qsa = document.querySelectorAll("jmnodes jmnode div.stair-mark");
        qsa.forEach(mark => mark.remove());
    }
    function addOurMarks(nameStair) {
        const arrIds = getStair(nameMM, nameStair);
        if (!arrIds) return false;
        const eltJmnodes = document.querySelector("jmnodes")
        if (!eltJmnodes) throw Error("Could not find <jmnodes>");
        const qsa = eltJmnodes.querySelectorAll("jmnode")
        qsa.forEach(eltJmnode => {
            const nodeid = eltJmnode.getAttribute("nodeid");
            const pos = arrIds.indexOf(nodeid);
            if (pos > -1) {
                addStairMark(eltJmnode, pos + 1);
            }
        });
        return true;
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
        divInfoCollapsible,
        // divName,
        divNameExpander,
        divOurStairs,
    ]);
    const btnCloseDialog = modMdc.mkMDCdialogButton("Close", "close", true);
    const eltActions = modMdc.mkMDCdialogActions([btnCloseDialog]);
    theDialog = await modMdc.mkMDCdialog(body, eltActions);
}


function getCurrentObjStairMarks() {
    const eltJmnodes = document.querySelector("jmnodes");
    if (!eltJmnodes) throw Error("Could not find <jmnodes>");
    const obj = {};
    const qsaStairMark = eltJmnodes.querySelectorAll(".stair-mark")
    console.log({ qsaStairMark });
    qsaStairMark.forEach(eltStairMark => {
        // console.log({ eltStairMark });
        const strStepN = eltStairMark.getAttribute("stair-step-n");
        if (strStepN == null) throw Error(`eltStairMark does not have attribute "step-stair-n"`)
        const stepN = parseInt(strStepN);
        obj[stepN] = eltStairMark;
    });
    // console.log({ obj });
    return obj;
}

/** @typedef {number|"root"} nodeid */

/**
 * 
 * @returns {nodeid[]}
 */
function screenStair() {
    const objStairMarks = getCurrentObjStairMarks();
    console.log({ objStairMarks });
    const arrNodeid = Object.keys(objStairMarks).sort().map(key => {
        const eltMark = objStairMarks[key];
        const eltJmnode = eltMark.closest("jmnode");
        const nodeId = eltJmnode.getAttribute("nodeid");
        return nodeId;
    });
    return arrNodeid;
}

/**
 * 
 * @param {string} nameMindmap 
 * @param {string} nameStair 
 */
function saveStair(nameMindmap, nameStair) {
    console.warn("saveStair", { nameMindmap, nameStair });
    const key = `${nameMindmap}---${nameStair}`;
    // console.log({ key });
    const arrJmNodeid = screenStair();
    const value = JSON.stringify(arrJmNodeid);
    localStorage.setItem(key, value);

    const valShow = JSON.stringify(arrJmNodeid, undefined, 4);
    modMdc.mkMDCdialogAlert(
        mkElt("div", undefined, [
            mkElt("h2", undefined, "saveStair"),
            mkElt("pre", undefined, valShow),
        ]));
}

/**
 * 
 * @param {string} nameMindmap 
 * @param {string} nameStair 
 */
function deleteStair(nameMindmap, nameStair) {
    const key = `${nameMindmap}---${nameStair}`; console.log({ key });
    localStorage.removeItem(key);
}

/**
 * 
 * @param {string} nameMindmap 
 * @param {string} nameStair 
 * @returns {[any]} 
 */
function getStair(nameMindmap, nameStair) {
    const key = `${nameMindmap}---${nameStair}`;
    // console.log({ key });
    const str = localStorage.getItem(key);
    if (!str) throw Error(`Could not find saved stair "${key}"`);
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

