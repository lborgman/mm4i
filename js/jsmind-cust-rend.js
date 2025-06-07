// @ts-check

const logConsoleHereIs = window["logConsoleHereIs"];
const importFc4i = window["importFc4i"];
const mkElt = window["mkElt"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
const jsMind = window["jsMind"];

const CUST_REND_VER = "0.0.3";
logConsoleHereIs(`here is jsmind-cust-rend.js, module,${CUST_REND_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

const modTools = await importFc4i("toolsJs");
const debounce = modTools.debounce;
const wait4mutations = modTools.wait4mutations;


// FIX-ME: clean up
const modMMhelpers = await importFc4i("mindmap-helpers");
const modMdc = await importFc4i("util-mdc");
const modColorTools = await importFc4i("color-tools");
const modToastUIhelpers = await importFc4i("toast-ui-helpers");

// This creates a loop:
// const modJsEditCommon = await import( "jsmind-edit-common");



let theCustomRenderer;

function checkType(variable, wantType) {
    const hasType = typeof variable;
    if (hasType != wantType) {
        const msg = `Want type ${wantType}, but got type ${hasType}`;
        throw Error(msg);
    }
}

export class providerDetails {
    #name; #longName; #img; #getRec; #getRecLink;
    constructor(providerRec) {
        // console.warn("providerRec.constructor", providerRec);
        const len = Object.keys(providerRec).length;
        const wantLen = 5;
        if (len !== wantLen) {
            const msg = `providerRec has ${len} keys, but should have ${wantLen}`;
            throw Error(msg);
        }
        checkType(providerRec.name, "string");
        checkType(providerRec.longName, "string");
        checkType(providerRec.img, "string");
        checkType(providerRec.getRec, "function");
        checkType(providerRec.getRecLink, "function");
        if (providerRec.getRec.length != 1) throw Error("getRec function should take 1 argument");
        if (providerRec.getRecLink.length != 1) throw Error("showRec function should take 1 argument");
        this.#name = providerRec.name;
        this.#longName = providerRec.longName;
        this.#img = providerRec.img;
        this.#getRec = providerRec.getRec;
        this.#getRecLink = providerRec.getRecLink;
    }
    get name() { return this.#name; }
    get longName() { return this.#longName; }
    get img() { return this.#img; }
    get getRec() { return this.#getRec; }
    get getRecLink() { return this.#getRecLink; }
}


function mkNodeNotesPlaceholder(node) {
    if (node.isroot) {
        return `Enter your notes for node "${node.topic}". (Root node for this mindmap.)`;
    }
    return `Enter your notes for node "${node.topic}".`;
}

export class CustomRenderer4jsMind {
    #providers = {};
    // constructor(THEjmDisplayed, linkRendererImg)
    constructor() {
        // this.THEjmDisplayed = THEjmDisplayed;
        // this.linkRendererImg = linkRendererImg;
    }

    setJm(jmDisplayed) { this.THEjmDisplayed = jmDisplayed; }
    getJm() { return this.THEjmDisplayed; }
    setJmOptions(jmOptions) { this.THEjmOptions = jmOptions; }
    getJmOptions() { return this.THEjmOptions; }
    getMindmapName() {
        const mm = this.THEjmDisplayed;
        if (!mm) return;
        // const root_node = this.THEjmDisplayed.get_root();
        const root_node = mm.get_root();
        return root_node.topic;
    }
    getEltRoot() {
        const root_node = this.THEjmDisplayed.get_root();
        return jsMind.my_get_DOM_element_from_node(root_node);
    }
    getEltJmnodes() {
        const elt = this.getEltRoot();
        return elt.closest("jmnodes");
    }
    setMindmapGlobals(globals) {
        const root_node = this.THEjmDisplayed.get_root();
        root_node.data.mindmapGlobals = globals;
    }
    getMindmapGlobals() {
        // .shapeEtc
        const root_node = this.THEjmDisplayed.get_root();
        return root_node.data.mindmapGlobals;
    }
    applyThisMindmapGlobals() {
        const defaultGlobals = {
            themeCls: "theme-orange",
        }
        const globals = this.getMindmapGlobals() || defaultGlobals;
        if (!globals) return;
        const elt = this.getEltJmnodes();
        applyMindmapGlobals(elt, globals);
    }



    getLinkRendererImage(providerName) {
        return this.#providers[providerName].img;
    }

    /*
    async updateJmnodeFromCustom() {
        console.error("updateJmnodeFromCustom is obsolete");
        debugger; // eslint-disable-line no-debugger
    }
    */

    async editMindmapDialog() {
        const modJsEditCommon = await importFc4i("jsmind-edit-common");
        const modIsDisplayed = await importFc4i("is-displayed");
        // theme
        const rend = await getOurCustomRenderer();
        const mindmapName = rend.getMindmapName();
        const eltRoot = rend.getEltRoot();
        const eltJmnodes = eltRoot.closest("jmnodes");

        const idThemeChoices = "theme-choices";
        const divThemeChoicesInner = mkElt("div");
        divThemeChoicesInner.style = `
            display : flex;
            gap : 10px;
            flex-wrap: wrap;
            padding: 10px;
        `;
        const divThemeChoices = mkElt("div", { id: idThemeChoices }, divThemeChoicesInner);
        /*
        const divColorThemes = mkElt("div", undefined, [
            "Themes are for all nodes",
            divThemeChoices,
        ]);
        */
        const oldGlobals = rend.getMindmapGlobals();
        /** @type {{ themeCls: any, backgroundCss?: string, line_color?: any, line_width?: any }} */
        let tempGlobals;
        if (oldGlobals) tempGlobals = JSON.parse(JSON.stringify(oldGlobals));
        // const oldThemeCls = getJsmindTheme(eltJmnodes);
        const oldThemeCls = oldGlobals ? oldGlobals.themeCls : getJsmindTheme(eltJmnodes);
        console.log({ oldThemeCls });
        setupThemeChoices(oldThemeCls);
        let selectedThemeCls = oldThemeCls;
        function setupThemeChoices(oldThemeCls) {
            const arrFormThemes = modJsEditCommon.getMatchesInCssRules(/\.(theme-[^.#\s]*)/);
            function mkThemeAlt(cls) {
                const themeName = cls.substring(6);
                // console.log("mkThemeAlt", { cls, themeName });
                const inpRadio = /** @type {HTMLInputElement} */ (mkElt("input", { type: "radio", name: "theme", value: cls }));
                if (cls == oldThemeCls) inpRadio.checked = true;
                const eltLbl = mkElt("label", undefined, [inpRadio, themeName]);
                const eltBg = mkElt("div", { class: "jmnode-bg" }, eltLbl);
                eltBg.style = `
                    NOwidth: 120px;
                    padding: 10px;
                    display: block;
                    NOcolor: red !important;
                `;
                const eltJmnode = mkElt("jmnode", undefined, eltBg);
                eltJmnode.style = `
                    width: 140px;
                    NOpadding: 10px;
                    NOdisplay: block;
                `;
                return mkElt("jmnodes", { class: cls }, eltJmnode);
            }
            arrFormThemes.forEach(cls => {
                // divThemeChoices.appendChild(mkThemeAlt(cls));
                divThemeChoicesInner.appendChild(mkThemeAlt(cls));
            });

            // https://javascript.info/events-change-input
            divThemeChoices.addEventListener("change", evt => {
                evt.stopPropagation();
                console.log("theme change", evt.target);
            });
            divThemeChoices.addEventListener("input", evt => {
                evt.stopPropagation();
                console.log("theme input", evt.target);
                selectedThemeCls = evt.target?.value;
                // setJsmindTheme(jmnodesCopied, theme);
                funDebounceSomethingToSaveMm();
            });


        }

        function activateThemesTab() {
            console.log("activateThemesTab");
            const divThemeChoices = document.getElementById(idThemeChoices);
            checkThemesContrast(divThemeChoices);
        }
        let allThemesContrastsChecked = false;
        async function checkThemesContrast(divThemeChoices) {
            if (allThemesContrastsChecked) return;
            const modContrast = await importFc4i("acc-colors");
            setTimeout(() => {
                try {
                    const markWithOutline = false;
                    divThemeChoices.querySelectorAll("jmnode").forEach(jmnode => {
                        const tit = jmnode.textContent;
                        const sJmnode = getComputedStyle(jmnode);
                        const fgJmColor = sJmnode.color;
                        // const bgJmColor = sJmnode.backgroundColor;

                        const divBg = jmnode.querySelector("div.jmnode-bg");
                        const sBg = getComputedStyle(divBg);
                        const fgBgColor = sBg.color;
                        const bgBgColor = sBg.backgroundColor;

                        const fg = modColorTools.standardizeColorTo6Hex(fgBgColor);
                        const bg = modColorTools.standardizeColorTo6Hex(bgBgColor);
                        // console.log(tit, { fgJmColor, bgJmColor, fgBgColor, bgBgColor });

                        const contrast = modContrast.colorContrast(fg, bg);
                        if (contrast < 3.0) {
                            jmnode.classList.add(`low-theme-contrast`);
                            const msg = `${tit} low c (${contrast}): fg=="${fg}", bg=="${bg}"`;
                            console.log(msg);
                        }
                        if (markWithOutline) {
                            if (contrast < 7) jmnode.style.outline = "1px dotted red";
                            if (contrast < 4.5) jmnode.style.outline = "4px dotted red";
                            if (contrast < 3.0) jmnode.style.outline = "6px dotted red";
                            if (contrast < 2.5) jmnode.style.outline = "8px dotted red";
                            if (contrast < 2.0) jmnode.style.outline = "10px dotted red";
                        }
                        // const fgHex = to6HexColor(fgColor);
                        const fgHex = modColorTools.standardizeColorTo6Hex(fgJmColor);
                        const fgHexCorrect = modColorTools.getBlackOrWhiteTextColor(bgBgColor);
                        if (fgHex !== fgHexCorrect) {
                            jmnode.style.outlineColor = "black";
                        }
                        if (contrast < 4.5) {
                            // console.log(jmnode.textContent, { fgColor, bgColor, fgHexCorrect, fgHex, contrast });
                        }
                    });
                    allThemesContrastsChecked = true;
                    console.log({ allThemesContrastsChecked });
                } catch (err) {
                    console.error("checkThemesContrast", err);
                }
            }, 1000);
        }


        const divBgOpSlider = mkElt("div");
        const divBgOpacity = mkElt("div", undefined, [
            divBgOpSlider,
        ]);
        const divBgOpLabels = mkElt("div", undefined, [
            mkElt("div", undefined, "Transparent"),
            mkElt("div", undefined, "Opaque")
        ]);
        divBgOpLabels.style.display = "flex";
        divBgOpLabels.style.justifyContent = "space-between";

        const inpUseBgMm = modMdc.mkMDCcheckboxInput();
        const chkUseBgMm = await modMdc.mkMDCcheckboxElt(inpUseBgMm, "Set background color");
        console.log({ oldGlobals });

        const inpBgMmColor = /** @type {HTMLInputElement} */ (mkElt("input", { type: "color" }));
        let sliBgMmOpacity;
        const divBgCtrls = mkElt("div", { class: "mdc-card" }, [
            inpBgMmColor,
            mkElt("p", undefined, [
                divBgOpLabels,
                divBgOpacity
            ])
        ]);
        divBgCtrls.style.padding = "10px";
        const divBackground = mkElt("div", undefined, [
            mkElt("p", undefined, chkUseBgMm),
            divBgCtrls
        ]);
        /**
         * 
         * @param {boolean} disabled 
         */
        function setBgMmDisabled(disabled) {
            modMdc.setMDCSliderDisabled(sliBgMmOpacity, disabled);
            inpBgMmColor.disabled = disabled;
            if (disabled) {
                divBgCtrls.style.opacity = "0.3";
            } else {
                divBgCtrls.style.opacity = "1";
            }
        }
        inpUseBgMm.addEventListener("change", () => {
            console.log("inpUseBg", inpUseBgMm.checked);
            setBgMmDisabled(!inpUseBgMm.checked);
            funDebounceSomethingToSaveMm();
        });
        inpBgMmColor.addEventListener("change", () => {
            if (!inpUseBgMm.checked) return;
            funDebounceSomethingToSaveMm();
        })

        let bgTabInitialized = false;
        async function initBgMmTab() {
            if (bgTabInitialized) return;
            bgTabInitialized = true;
            const modColorTools = await importFc4i("color-tools");
            const s = getComputedStyle(eltJmnodes.closest(".jsmind-inner"));
            const hex = modColorTools.toHex6(s.backgroundColor);
            inpBgMmColor.value = hex;
            const arrRgba = modColorTools.toRgbaArr(s.backgroundColor);
            const opacity = arrRgba[3] / 255;
            const funChange = () => {
                console.log("change op");
            }
            const funInput = () => {
                console.log("input op");
                funDebounceSomethingToSaveMm();
            }
            // sliBgOpacity = await modIsDisplayed.mkSliderInContainer(divBgOpacity, 0, 1, opacity, step, title, funChange);
            const modIsDisplayed = await importFc4i("is-displayed");
            const iOpacity = Math.floor(100 * (opacity + 0.001));
            sliBgMmOpacity = await modIsDisplayed.mkSliderInContainer(
                divBgOpSlider,
                // FIX-ME: Can't get it to work with step "undefined"???
                // 0, 1, opacity, undefined,
                0, 100, iOpacity, 10,
                "Opacity", funChange, funInput);
            const inpBgEnabled = oldGlobals?.backgroundCss != undefined;
            inpUseBgMm.checked = inpBgEnabled;
            setBgMmDisabled(!inpBgEnabled);
        }
        // sli = await modIsDisplayed.mkSliderInContainer(eltCont, min, max, initVal, step, title, funChange);

        ////// tabs

        // mkMdcTabBarSimple(tabsRecs, contentElts, moreOnActivate) 

        // const taDesc = modMdc.mkMDCtextFieldTextarea(undefined, 10, 10);
        // const tafDesc = modMdc.mkMDCtextareaField("Mindmap description", taDesc);
        // const divDesc = mkElt("div", undefined, tafDesc);

        const pDesc = mkElt("p", undefined, "Mindmap description. Same as notes for root node.");
        const divMDE = mkElt("div");
        const divDesc = mkElt("div", undefined, [pDesc, divMDE]);
        const root_node = this.THEjmDisplayed.get_root();
        const initialDescription = root_node.data.shapeEtc.notes;
        // let currentDescription = initialDescription;
        const placeholder = mkNodeNotesPlaceholder(root_node);

        /** @param {string} val @returns {void} */
        const onChangeMMdesc = (val) => {
            root_node.data.shapeEtc.notes = val.trimEnd();
            modMMhelpers.DBrequestSaveThisMindmap(this.THEjmDisplayed, "Edit description");
        };


        const { btnEdit } = await modToastUIhelpers.setupToastUIpreview(divMDE, initialDescription, placeholder, onChangeMMdesc);
        btnEdit.style.right = "-4px";
        btnEdit.style.top = "-30px";

        const jmOpt = this.getJmOptions();
        const defaultLineW = jmOpt.view.line_width;
        const defaultLineC = jmOpt.view.line_color;
        const inpChkChangeLines = modMdc.mkMDCcheckboxInput();
        inpChkChangeLines.addEventListener("input", () => {
            disableCardLine(!inpChkChangeLines.checked);
        });
        inpChkChangeLines.addEventListener("change", () => {
            // console.log("chk line change"); debugger; // eslint-disable-line no-debugger
        });
        const lblChkLines = await modMdc.mkMDCcheckboxElt(inpChkChangeLines, "Change color and width");
        // lblChkLines.classList.add("mdc-chkbox-label-helper");
        const divPreviewLine = mkElt("div");
        // divPreviewLine.style.height = `${defaultLineW}px`;
        // divPreviewLine.style.backgroundColor = defaultLineC;
        const divLinePreview = mkElt("div", { id: "div-line-preview", class: "mdc-card" }, divPreviewLine);
        divLinePreview.style.padding = "20px";
        const inpLineColor = /** @type {HTMLInputElement} */ (mkElt("input", { type: "color" }));
        // inpLineColor.value = modColorConverter.toHex6(defaultLineC);
        const lblLineColor = mkElt("label", undefined, ["Line color: ", inpLineColor]);
        const divLineWidth = mkElt("div");
        let sliLineWidth;

        const cardLine = mkElt("div", { class: "mdc-card" }, [
            lblLineColor,
            divLineWidth,
        ]);
        cardLine.style.padding = "10px";
        const divLines = mkElt("div", undefined, [
            divLinePreview,
            lblChkLines,
            cardLine
        ]);
        divLines.style.display = "flex";
        divLines.style.gap = "10px";
        divLines.style.marginTop = "10px"; // FIX-ME:

        let initialLineValues;
        function getLineValues() {
            return {
                line_color: divPreviewLine.style.backgroundColor,
                line_width: divPreviewLine.style.height
            }
        }
        function disableCardLine(disabled) {
            // sliLineWidth["myMdc"].disabled = disable;
            modMdc.setMDCSliderDisabled(sliLineWidth, disabled);
            /*
            inpLineColor.disabled = disabled;
            if (disabled) {
                cardLine.style.opacity = "0.3";
            } else {
                cardLine.style.opacity = "1";
            }
            */
            inpLineColor.inert = disabled;
        }
        // .mindmapGlobals
        inpLineColor.addEventListener("input", () => {
            divPreviewLine.style.backgroundColor = inpLineColor.value;
            funDebounceSomethingToSaveMm();
        })
        let lineTabActivated = false;
        async function activateLineTab() {
            if (!sliLineWidth) {
                const funInput = () => {
                    console.log("funInput line width");
                    const val = sliLineWidth["myMdc"].getValue();
                    divPreviewLine.style.height = `${val}px`;
                    funDebounceSomethingToSaveMm();
                }
                sliLineWidth = await modIsDisplayed.mkSliderInContainer(divLineWidth, 1, 10, defaultLineW, 1, "Line width", undefined, funInput);
                // console.log({sli})
            }
            if (lineTabActivated) return;
            lineTabActivated = true;
            const bgColorJmnodes = getComputedStyle(eltJmnodes).backgroundColor;
            divLinePreview.style.backgroundColor = bgColorJmnodes;
            const old_line_width = oldGlobals?.line_width;
            const old_line_color = oldGlobals?.line_color;
            const old_line = !!old_line_width || !!old_line_color;
            inpChkChangeLines.checked = old_line;
            const line_width = old_line_width || defaultLineW;
            const line_color = old_line_color || defaultLineC;
            inpLineColor.value = modColorTools.toHex6(line_color);
            sliLineWidth["myMdc"].setValue(line_width);
            divPreviewLine.style.height = `${line_width}px`;
            divPreviewLine.style.backgroundColor = line_color;
            initialLineValues = getLineValues();
        }


        const tabRecs = ["Description", "Themes", "Background", "Lines"];
        const contentElts = mkElt("div", undefined,
            [divDesc, divThemeChoices, divBackground, divLines]);
        if (tabRecs.length != contentElts.childElementCount) throw Error("Tab bar setup number mismatch");
        const onActivateMore = (idx) => {
            // console.log("onActivateMore", idx);
            if (idx > tabRecs.length - 1) { throw Error(`There is no tab at idx=${idx} `); }
            switch (idx) {
                case 0:
                    break;
                case 1:
                    activateThemesTab();
                    break;
                case 2:
                    initBgMmTab();
                    break;
                case 3:
                    activateLineTab();
                    break;
                default:
                    throw Error(`Activation code missing for tab, idx=${idx} `);
            }
        }
        const eltTabs = modMdc.mkMdcTabBarSimple(tabRecs, contentElts, onActivateMore);

        const body = mkElt("div", undefined, [
            mkElt("h2", undefined, [
                mkElt("span", { style: "font-style:italic;opacity: 0.5;margin-right:10px;" }, "Mindmap:"),
                mindmapName
            ]),
            eltTabs,
            contentElts,
        ]);

        const btnTestMm = modMdc.mkMDCdialogButton("Test", "test");
        const btnSaveMm = modMdc.mkMDCdialogButton("Save", "save", true);
        const btnCancelMm = modMdc.mkMDCdialogButton("Cancel", "close");
        const eltActions = modMdc.mkMDCdialogActions([btnTestMm, btnSaveMm, btnCancelMm]);
        const dlg = await modMdc.mkMDCdialog(body, eltActions);
        const somethingHasChangedLines = () => {
            if (!initialLineValues) return false;
            const currentLineValues = getLineValues();
            return JSON.stringify(initialLineValues) != JSON.stringify(currentLineValues);
        }
        btnSaveMm.addEventListener("click", errorHandlerAsyncEvent(async () => {
            // if (initialDescription != currentDescription) { root_node.data.shapeEtc.notes = currentDescription; }
            // const saveGlobals = { themeCls: selectedThemeCls, }
            // const r = await getOurCustomRenderer();
            // rend.setMindmapGlobals(saveGlobals);
            if (somethingHasChangedLines()) {
                modMdc.mkMDCdialogAlert(
                    "Changes to line color/width is not shown until mindmap is opened next time");
            }
            rend.setMindmapGlobals(tempGlobals);
            rend.applyThisMindmapGlobals();
            this.requestSaveMindMap();
        }));
        btnTestMm.addEventListener("click", evt => {
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            evt.preventDefault();
            if (somethingHasChangedLines()) {
                modMdc.mkMDCdialogAlert(
                    "Changes to line color/width is not shown in preview");
            }
            const style = [
                "position: fixed",
                "top: 10",
                "left: 10",
                "z-index: 100",
                "font-size: 2rem",
                "font-family: sans-serif",
                "padding: 8px",
                "background: yellow",
                "color: red",
                "border: 1px solid red",
                "cursor: pointer",
                "box-shadow: red 8px 8px 8px"
            ].join(";");
            const eltPreviewInfo = mkElt("div", { style, class: "mdc-card" }, [
                "Preview",
                mkElt("div", { style: "font-size:0.8rem;" }, "Click to end preview")
            ]);
            eltPreviewInfo.title = "Click to end preview";
            eltPreviewInfo.addEventListener("click", evt => {
                evt.stopPropagation();
                closePreview();
            })
            function closePreview() {
                eltPreviewInfo.remove();
                dlg.dom.style.removeProperty("display");
                applyMindmapGlobals(eltJmnodes, oldGlobals);
            }
            document.body.appendChild(eltPreviewInfo);
            dlg.dom.style.display = "none";
            // const tempGlobals = { themeCls: selectedThemeCls, }
            applyMindmapGlobals(eltJmnodes, tempGlobals);
            // setTimeout(() => { closePreview(); }, 160 * 1000);
        });

        function somethingToSaveMm() {
            // if (initialDescription != currentDescription) return true;
            tempGlobals = {
                themeCls: selectedThemeCls,
            }
            if (inpUseBgMm.checked) {
                console.log({ inpBgMmColor }, inpBgMmColor.value);
                console.log({ modColorConverter: modColorTools });
                const arr = modColorTools.toRgbaArr(inpBgMmColor.value);
                const opRaw = sliBgMmOpacity["myMdc"].getInput().value;
                const op = Math.round(opRaw / 100 * 255);
                arr[3] = op;

                const bgColor = modColorTools.arrToRgba(arr);
                const bgCss = `background-color: ${bgColor}`;
                tempGlobals.backgroundCss = bgCss;
            } else {
            }
            if (inpChkChangeLines.checked) {
                tempGlobals.line_color = modColorTools.toRgba(inpLineColor.value);
                tempGlobals.line_width = sliLineWidth["myMdc"].getValue();
            }
            if (JSON.stringify(tempGlobals) != JSON.stringify(oldGlobals)) return true;
            return false;
        }
        btnSaveMm.disabled = true;
        btnTestMm.disabled = true;
        function checkSomethingToSaveMm() {
            const maySave = somethingToSaveMm();
            btnSaveMm.disabled = !maySave;
            btnTestMm.disabled = !maySave;
        }
        const debounceSomethingToSaveMm = debounce(checkSomethingToSaveMm, 1000);
        function funDebounceSomethingToSaveMm() { debounceSomethingToSaveMm(); }


        return await new Promise((resolve) => {
            dlg.dom.addEventListener("MDCDialog:closed", errorHandlerAsyncEvent(async evt => {
                const action = evt.detail.action;
                switch (action) {
                    case "save":
                        resolve(true);
                        break;
                    case "close":
                        resolve(false);
                        break;
                    default:
                        throw Error(`error in editMindmapDialog, action is ${action}`)
                }
            }));
        });
    }

    // FIX-ME: use this!
    requestSaveMindMap() {
        const jmDisplayed = this.THEjmDisplayed;
        modMMhelpers.DBrequestSaveThisMindmap(jmDisplayed, "Edit mindmap");
    }
    async editNotesDialog(eltJmnode) {
        let btnSave;
        const jmDisplayed = this.THEjmDisplayed;
        const node_ID = jsMind.my_get_nodeID_from_DOM_element(eltJmnode);
        const node = jmDisplayed.get_node(node_ID)
        const node_data = node.data;
        const shapeEtc = node_data.shapeEtc || {};
        const initialVal = shapeEtc.notes || "";

        const divEasyMdeOuterWrapper = mkElt("div");

        const body = mkElt("div", undefined, [
            mkElt("h2", undefined, [
                mkElt("span", { style: "font-style:italic;opacity:0.5;" }, "Node: "),
                node.topic
            ])
        ]);

        const placeholder = mkNodeNotesPlaceholder(node);
        // let retMkDialog;
        const objClose = {};
        /** @type {Object | undefined} */ let toastNotesEditor;
        const onChange = (val) => {
            shapeEtc.notes = val.trimEnd();
            modMMhelpers.DBrequestSaveThisMindmap(jmDisplayed, "Edit notes");
        };

        body.appendChild(divEasyMdeOuterWrapper);
        // FIX-ME: remove setTimeout??
        setTimeout(async () => {
            const { btnEdit } = await modToastUIhelpers.setupToastUIpreview(divEasyMdeOuterWrapper, initialVal, placeholder, onChange, objClose);
            // let btnSave;
            btnEdit.addEventListener("click", (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
                setTimeout(() => {
                    const btnSave = getBtnSave();
                    const btnCancel = btnSave.nextElementSibling;
                    const divS = btnSave.closest("div.mdc-dialog__surface");
                    const divMDE = divS.querySelector("div.EasyMDEContainer")
                    const ta = divMDE.previousElementSibling;
                    console.log({ btnSave, btnCancel, divS, divMDE, ta });

                    const ae = document.activeElement;
                    const isCancelAE = ae == btnCancel;
                    console.log(">>>>>>>>> ae", isCancelAE, ae);
                    if (!isCancelAE) {
                        divS.style.backgroundColor = "red";
                    } else {
                        divS.style.backgroundColor = "lawngreen";
                    }
                }, 1);
            });
        }, 1);

        function somethingToSaveNotes() {
            if (!toastNotesEditor) throw Error(`toastNotesEditor is ${toastNotesEditor}`);
            return toastNotesEditor.getMarkdown().trimEnd() != initialVal;
        }
        function getBtnSave() {
            if (btnSave) return btnSave;
            const contBtns = document.body.querySelector(".mdc-dialog__actions");
            if (!contBtns) throw Error("Did not find contBtns");
            // const contBtns = document.body.closest(".mdc-dialog__surface").querySelector(".mdc-dialog__actions");
            // FIX-ME: Should be the first?
            btnSave = contBtns.querySelector("button");
            if (btnSave?.textContent != "save") throw Error("Did not find the save button");
            return btnSave;
        }
        /*
        function setStateBtnSaveDisabled(disable) {
            const tof = typeof disable;
            if (tof != "boolean") throw Error(`Expected boolean, got ${tof} disable:${disable}`);
            const btn = getBtnSave();
            if (!btn) return;
            btn.disabled = disable
        }
        */
        // function setStateBtnSaveable() { setStateBtnSaveDisabled(!somethingToSaveNotes()); }
        // const debounceStateBtnSaveable = debounce(setStateBtnSaveable, 300);
        // function requestSetStateBtnSaveable() { debounceStateBtnSaveable(); }
        // requestSetStateBtnSaveable();
        // FIX-ME: move to mdc-util
        // setTimeout(() => setStateBtnSaveDisabled(true), 50);

        function funCheckSave(save) {
            if (!save) return somethingToSaveNotes();
            shapeEtc.notes = toastNotesEditor.getMarkdown().trimEnd();
            modMMhelpers.DBrequestSaveThisMindmap(jmDisplayed);
        }
        // const useConfirm = true;
        const useConfirm = false;
        if (useConfirm) {
            await modMdc.mkMDCdialogConfirm(body, "close", null, funCheckSave);
        } else {
            const btnClose = modMdc.mkMDCbutton("Close");
            const eltActions = modMdc.mkMDCdialogActions([btnClose]);
            const retMkDialog = await modMdc.mkMDCdialog(body, eltActions);
            ///// retMkDialog.mdc.close(); <- this is the original call
            // const funClose = function() { retMkDialog.mdc.close(); } // btn: ok
            // const funClose = function() { this.mdc.close(); }.bind(retMkDialog); // works, but why
            const funClose = function () {
                this.close();
            }.bind(retMkDialog.mdc); // works
            objClose.funClose = funClose;
            btnClose.addEventListener("click", () => {
                funClose();
            });
        }
    }
    async editNodeDialog(eltJmnode, scrollToNotes) {
        const modJsEditCommon = await importFc4i("jsmind-edit-common");
        const modIsDisplayed = await importFc4i("is-displayed");
        const clipImage = {};

        function somethingToSaveNode() {
            return JSON.stringify(initialShapeEtc) != JSON.stringify(currentShapeEtc);
        }

        const onAnyCtrlChangeNode = debounce(applyCurrentToCopied);
        function applyCurrentToCopied() {
            const changed = somethingToSaveNode();
            console.warn("applyToCopied", changed);
            requestSetStateBtnSave();
            requestUpdateCopiesSizes();
            modJsEditCommon.applyShapeEtc(currentShapeEtc, eltCopied);
        }

        /*
        const onCtrlsGrpChg = {
            border: setBorderCopied,
            shadow: onCtrlsChgShadow,
        };
        */
        const ctrlsSliders = {}

        const eltCopied = eltJmnode.cloneNode(true);
        const spanNotes = eltCopied.querySelector("span.has-notes-mark");
        spanNotes?.remove();

        eltCopied.style.outline = "1px dotted rgba(255,255,255,0.2)";
        eltCopied.style.top = 0;
        eltCopied.style.left = 0;
        const bcrOrig = eltJmnode.getBoundingClientRect();
        eltCopied.classList.remove("selected");
        eltCopied.classList.remove("jsmind-hit");
        eltCopied.classList.remove("left-side");
        eltCopied.classList.remove("right-side");
        eltCopied.classList.remove("has-children");
        if (eltCopied.style.width == "") {
            eltCopied.style.width = `${bcrOrig.width}px`;
            eltCopied.style.height = `${bcrOrig.height}px`;
        }

        // https://css-tricks.com/almanac/properties/r/resize/
        // eltCopied.style.overflow = "auto";
        eltCopied.draggable = null;

        const node_ID_copied = jsMind.my_get_nodeID_from_DOM_element(eltJmnode);
        const node_copied = this.THEjmDisplayed.get_node(node_ID_copied)
        const node_copied_data = node_copied.data;
        const initialTempData = {}; // For editing

        // .nodeLink
        // node_copied_data.nodeLink = node_copied_data.nodeLink || "";
        // initialTempData.nodeLink = node_copied_data.nodeLink;

        // .shapeEtc
        node_copied_data.shapeEtc = node_copied_data.shapeEtc || {};
        const copiedShapeEtc = node_copied_data.shapeEtc;

        const initialShapeEtc = JSON.parse(JSON.stringify(copiedShapeEtc));
        // FIX-ME: Image blob was erased, get it back:
        const bgObj = modJsEditCommon.getShapeEtcBgObj(copiedShapeEtc);
        modJsEditCommon.checkJmnodeBgObj(bgObj);
        initialShapeEtc.background = bgObj;
        modJsEditCommon.checkShapeEtcBgObj(initialShapeEtc);

        initialTempData.height = node_copied_data.height;
        initialTempData.width = node_copied_data.width;
        initialTempData.topic = node_copied.topic;
        const eltCopiedText = eltCopied.querySelector(".jmnode-text"); // FIX-ME:


        initialShapeEtc.temp = initialTempData;
        // console.log({ copiedShapeEtc, node_copied_data, initialTempData });

        const currentShapeEtc = JSON.parse(JSON.stringify(initialShapeEtc));
        // blob was erased, get it back:
        currentShapeEtc.background = initialShapeEtc.background;

        const currentTempData = currentShapeEtc.temp; // For things outside of .shapeEtc

        /* 
            css resize does not work well on Android Chrome today (2023-05-01).
            Add a workaround using pointerdown, -move and -up.
            https://javascript.info/pointer-events
            https://plnkr.co/edit/zSi5dCJOiabaCHfw?p=preview&preview
        */
        const jmnodesCopied = mkElt("jmnodes", undefined, eltCopied);
        // FIX-ME: MindmapGlobals
        // if (themeClass) jmnodesCopied.classList.add(themeClass);
        const origJmnodes = eltJmnode.closest("jmnodes");
        // const origJmnodesStyle = getComputedStyle(origJmnodes);
        // const origJmnodesParentStyle = getComputedStyle(origJmnodes.parentElement);
        const bcrJmnode = eltJmnode.getBoundingClientRect();
        const ourBgColor = modColorTools.getBackgroundColorAtPoint(bcrJmnode.x, bcrJmnode.y, origJmnodes);

        const themeCls = getJsmindTheme(origJmnodes)
        jmnodesCopied.classList.add(themeCls);

        const divEdnodeCopied = mkElt("div", { class: "mdc-card" }, [jmnodesCopied]);
        divEdnodeCopied.id = "div-ednode-copied";
        jmnodesCopied.style.backgroundColor = ourBgColor;
        divEdnodeCopied.style.backgroundColor = ourBgColor;

        const paddingDivEdnodeCopied = 8;
        divEdnodeCopied.style.position = "relative";
        divEdnodeCopied.style.width = "100%";
        divEdnodeCopied.style.padding = `${paddingDivEdnodeCopied}px`;
        divEdnodeCopied.style.border = "1px solid black";
        divEdnodeCopied.style.marginBottom = "5px";
        // https://stackoverflow.com/questions/59010779/pointer-event-issue-pointercancel-with-pressure-input-pen
        divEdnodeCopied.style.touchAction = "none";

        const lblBorderColor = mkCtrlColor("border.color", "black");

        function onCtrlChgBorderWidth() {
            const dialogBW = currentShapeEtc.border.width;
            if (dialogBW > 0) {
                divBorder.classList.remove("no-specified-border");
            } else {
                divBorder.classList.add("no-specified-border");
            }
            // setBorderCopied();
        }
        /*
        */

        /*
        function setBorderCopied() {
            // FIX-ME: should not happen any more... soon
            debugger; // eslint-disable-line no-debugger
            return;
        }
        */

        const divSliBorderWidth = mkElt("div", undefined, "Width: ");
        let sliBorderWidth;
        async function addSliBorderWidth() {
            const eltCont = divSliBorderWidth;
            const title = "Border width";
            const funChange = onCtrlChgBorderWidth;
            await mkSlider4shapeEtc("border.width", eltCont, 0, 20, 0, 2, title, funChange);
        }
        /*
        */


        const initialBorderStyle = initialShapeEtc.border?.style || "solid";
        function mkAltBorderStyle(styleName) {
            const inp = mkElt("input", { type: "radio", name: "borderstyle", value: styleName });
            if (styleName == initialBorderStyle) inp.checked = true;
            const eltShow = mkElt("span", undefined, styleName);
            const ss = eltShow.style;
            ss.width = "800px";
            ss.height = "30px";
            ss.borderBottom = `3px ${styleName} red`;
            ss.marginLeft = "5px";
            ss.marginRight = "20px";
            const lbl = mkElt("label", undefined, [inp, eltShow]);
            lbl.style.display = "inline-block";
            return lbl;
        }
        const divBorderStyle = mkElt("div", { id: "jsmind-ednode-div-border-style", class: "specify-border-detail" }, [
            mkAltBorderStyle("solid"),
            mkAltBorderStyle("dotted"),
            mkAltBorderStyle("dashed"),
            mkAltBorderStyle("double"),
        ]);
        divBorderStyle.addEventListener("change", () => {
            const borderStyle = getCtrlValBorderStyle()
            console.log({ borderStyle });
            currentShapeEtc.border = currentShapeEtc.border || {};
            currentShapeEtc.border.style = borderStyle;
        });

        const divCanBorder = mkElt("div", { class: "if-can-border" }, [
            divSliBorderWidth,
            lblBorderColor,
            divBorderStyle,
        ]);
        const divCannotBorder = mkElt("div", { class: "if-cannot-border" }, [
            mkElt("p", undefined, "Chosen shape can't have a border")
        ]);
        const divBorder = mkElt("div", { id: "jsmind-ednode-border" }, [
            divCanBorder,
            divCannotBorder,
        ]);

        let borderTabwasSetup = false;
        function setupBorderTab() {
            // return; // No setup needed with new UI slider
            if (borderTabwasSetup) return;
            borderTabwasSetup = true;
            addSliBorderWidth();
            if (!sliBorderWidth) return;
            /*
            debugger;
            inpBorderColor.value = initialShapeEtc.border?.color || "black";
            const borderStyle = initialShapeEtc.border?.style;
            divBorder.querySelectorAll("input[name=borderstyle]")
                // @ts-ignore
                .forEach((inp) => { if (inp.value == borderStyle) inp.checked = true });
            */
        }
        function activateBorderTab() {
            // FIX-ME:
            setupBorderTab();
            const currentShape = currentShapeEtc.shape;
            if (!modJsEditCommon.shapeCanHaveBorder(currentShape)) {
                divBorder.classList.add("cannot-border");
            } else {
                divBorder.classList.remove("cannot-border");
            }
        }

        let backgroundTabIsSetup = false;
        function setupJmnodeBgTab() {
            if (backgroundTabIsSetup) return;
            console.log(divBgChoices);
            backgroundTabIsSetup = true;
            console.log("setupJmnodeBgTab", { initialShapeEtc });
            modJsEditCommon.getShapeEtcBgObj(initialShapeEtc);
            const initBgObj = initialShapeEtc.background;
            const bgName = initBgObj ? initBgObj.bgName : "bg-choice-none";
            const bgVal = initBgObj ? initBgObj.bgValue : undefined;
            console.log({ bgName, bgVal });
            const rad = /** @type {HTMLInputElement} */ divBgChoices.querySelector(`#${bgName}`);
            if (!rad) throw Error(`Could not find #${bgName}`);
            rad.checked = true;
            switch (bgName) {
                case "bg-choice-none":
                    break;
                case "bg-choice-pattern":
                    // FIX-ME: There is some problem with the taImgPattern state.
                    // https://stackoverflow.com/questions/46795955/how-to-know-scroll-to-element-is-done-in-javascript
                    const funFocusTa = () => {
                        console.log("funFocusTa");
                        setTimeout(() => taImgPattern.focus(), 500);
                    };
                    document.addEventListener("scrollend", funFocusTa, { once: true });
                    taImgPattern.value = bgVal;
                    detPattern.open = true;
                    break;
                case "bg-choice-color":
                    inpBgColor.value = modColorTools.standardizeColorTo6Hex(bgVal);
                    detBgColor.open = true;
                    break;
                case "bg-choice-img-clipboard":
                    {
                        let blob, blurVal, fgColor;
                        blob = bgVal;
                        blurVal = "9";
                        // New format?
                        if (bgVal.blob) {
                            blob = bgVal.blob;
                            blurVal = bgVal.blur;
                            // debugger;
                            fgColor = bgVal.fgColor;
                        }
                        const blur = `blur(${blurVal}px)`;
                        clipImage.blob = blob;
                        const objectUrl = URL.createObjectURL(blob);
                        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

                        const divClipboardImage = document.getElementById("div-clipboard-image");
                        if (!divClipboardImage) throw Error("Could not find #div-cliboard-image");
                        divClipboardImageBg.style.backgroundImage = `url("${objectUrl}")`;
                        divClipboardImageBg.style.filter = blur;

                        // inpBlur.value = blurVal;
                        sliderBlur.set(blurVal);

                        (async () => {
                            // debugger;
                            const objTextImage = await modColorTools.getDataForTextOnImage(objectUrl);
                            console.log({ objTextImage });
                            divFgAccColor.textContent = `objTextImage: ${JSON.stringify(objTextImage, undefined, 4)}`;
                            divFgRadios.style.backgroundColor = objTextImage.avgHexColor;
                            const inpColor = mkElt("input", { type: "radio", name: "black-or-white", id: "colored-text" })
                            inpColor.dataset.color = objTextImage.contrastColor;
                            const contrastColor = objTextImage.contrastColor;
                            const lblColor = mkElt("label", undefined, [
                                inpColor,
                                contrastColor
                            ]);
                            lblColor.style.color = contrastColor;
                            divFgRadios.appendChild(lblColor);
                            let idText = "colored-text";
                            switch (fgColor) {
                                case "black":
                                    idText = "black-text";
                                    break;
                                case "white":
                                    idText = "white-text";
                                    break;
                            }
                            const inpTextChoice = document.getElementById(idText);
                            if (!inpTextChoice) throw Error(`Could not find #${idText}`);
                            /** @type {HTMLInputElement} */ (inpTextChoice).checked = true;
                            applyTextToPreviewImage(inpTextChoice);
                        })();

                        const d = rad.closest("div.bg-choice");
                        setBgNodeChoiceValid(d, true);
                        const det = d.querySelector("details")
                        det.open = true;
                    }
                    break;
                default:
                    throw Error(`Unknown bg choice: ${bgName}`);
            }
            // setBgChoiceThis(bgChoice);
            setTimeout(() => rad.scrollIntoView(), 500);
        }
        function activateBackgroundTab() {
            setupJmnodeBgTab();
        }

        const taTopic = modMdc.mkMDCtextFieldTextarea(undefined, 8, 50);
        taTopic.classList.add("jsmind-ednode-topic");
        taTopic.style.resize = "vertical";
        function onTaTopicInput() {
            currentShapeEtc.temp.topic = taTopic.value;
            eltCopiedText.textContent = taTopic.value;
        }
        taTopic.addEventListener("input", () => {
            onTaTopicInput();
        });
        // const initialCustomTopic = currentShapeEtc.nodeCustom;
        // const copiedWasCustom = initialCustomTopic != undefined;
        const initTopic = initialTempData.topic;
        const initNotes = initialShapeEtc.notes;

        const inpTopic = modMdc.mkMDCtextFieldInput("inp-node-topic", "text");
        inpTopic.value = initTopic;
        const tfTopic = modMdc.mkMDCtextFieldOutlined("Displayed Topic", inpTopic);
        function onInpTopicInput() {
            currentShapeEtc.temp.topic = inpTopic.value;
            eltCopiedText.textContent = inpTopic.value;
        }
        inpTopic.addEventListener("input", () => {
            onInpTopicInput();
        });


        // modMdc.mkMDC

        // const taEasyMde = mkElt("textarea", { placeholder: "Enter notes for this node" });
        // const divEasyMdeInert = mkElt("div", undefined, taEasyMde);
        // divEasyMdeInert.setAttribute("inert", "");
        // const divEasyMdeOuterWrapper = mkElt("div", undefined, divEasyMdeInert);
        const divEasyMdeOuterWrapper = mkElt("div");


        const divNotesTab = mkElt("div", undefined, [
            tfTopic,
            divEasyMdeOuterWrapper,
        ]);
        divNotesTab.style.gap = "30px";

        // let toastNotesInNodesEditor;
        const onChangeNotes = (val) => {
            currentShapeEtc.notes = val.trimEnd();
            requestSetStateBtnSave();
        };



        async function activateNotesTab() {
            const valNotes = initNotes;
            const placeholder = mkNodeNotesPlaceholder(node_copied);
            const { btnEdit } = await modToastUIhelpers.setupToastUIpreview(divEasyMdeOuterWrapper, valNotes, placeholder, onChangeNotes);
            btnEdit.style.right = "0px";
            btnEdit.style.top = "-20px";
        }

        const jmnodesShapes = mkElt("jmnodes");
        jmnodesShapes.classList.add(themeCls); // FIX-ME: might not fit background here
        jmnodesShapes.addEventListener("change", evt => {
            console.log({ evt });
            const target = evt.target;
            const tname = target.name;
            if (tname != "shape") throw Error(`evt.target.name != shape (${tname})`);
            const tval = target.value;
            const eltShape = eltCopied.querySelector(".jmnode-bg");
            modJsEditCommon.clearShapes(eltShape);
            if (tval.length == 0) {
                currentShapeEtc.shape = undefined;
            } else {
                eltShape.classList.add(tval);
                currentShapeEtc.shape = tval;
            }
        });
        // FIX-ME: MindmapGlobals
        // if (themeClass) jmnodesShapes.classList.add(themeClass);
        const eltCopiedNoShape = eltCopied.cloneNode(true);
        const divCopiedNoShape = eltCopiedNoShape.querySelector(".jmnode-bg");
        modJsEditCommon.clearShapes(divCopiedNoShape);
        // delete eltCopied.style.border;
        eltCopiedNoShape.style.border = null;
        eltCopiedNoShape.style.boxShadow = null;
        eltCopiedNoShape.style.filter = null;
        eltCopiedNoShape.style.backgroundColor = "rgba(0,0,0,0)";

        const desiredW = 60;
        const origW = bcrOrig.width;
        const scaleCopies = desiredW / origW;

        const formShapes = mkElt("form", undefined, jmnodesShapes);
        // formShapes.style.backgroundColor = origJmnodesParentStyle.backgroundColor;
        formShapes.style.backgroundColor = ourBgColor;
        const divShapes = mkElt("div", { id: "jsmind-ednode-shape" });
        // divShapes.style.backgroundColor = origJmnodesStyle.backgroundColor;
        divShapes.style.backgroundColor = ourBgColor;

        /*
        const arrCopiedChildren = [...eltCopied.querySelectorAll("jmnode>[class|=jsmind-custom-image]")];
        */


        const inpChkShapeBg = modMdc.mkMDCcheckboxInput();
        if (currentShapeEtc?.shapeBoxBg != undefined) {
            inpChkShapeBg.checked = currentShapeEtc.shapeBoxBg;
        } else {
            inpChkShapeBg.checked = true;
        }
        const chkShapeBg = await modMdc.mkMDCcheckboxElt(inpChkShapeBg, "Transparent box");
        const divShapeBg = mkElt("div", undefined, chkShapeBg);
        divShapeBg.style.marginBottom = "10px";
        divShapes.appendChild(divShapeBg);
        inpChkShapeBg.addEventListener("input", () => {
            console.log("inpChkShapgeBg input", inpChkShapeBg.checked);
            currentShapeEtc.shapeBoxBg = inpChkShapeBg.checked;
        })

        divShapes.appendChild(formShapes);

        function mkShapeCopy(shapeClass) {
            const eltCopy4shape = eltCopiedNoShape.cloneNode(true);
            eltCopy4shape.style.position = "relative";
            if (shapeClass) {
                const eltShape = eltCopy4shape.querySelector(".jmnode-bg");
                eltShape.classList.add(shapeClass);
            }
            return eltCopy4shape;
        }
        function mkShapeAlt(shapeClass) {
            const eltCopy4shape = mkShapeCopy(shapeClass);
            const ss = eltCopy4shape.style;
            ss.transformOrigin = "top left";
            ss.scale = scaleCopies;
            const eltScaleWrapper = mkElt("div", undefined, eltCopy4shape);
            const w = parseFloat(eltCopied.style.width);
            const h = parseFloat(eltCopied.style.height);
            eltScaleWrapper.style.width = `${w * scaleCopies}px`;
            eltScaleWrapper.style.height = `${h * scaleCopies}px`;
            const radioVal = shapeClass || "default";
            const inpRadio = mkElt("input", { type: "radio", name: "shape", value: radioVal });
            if (shapeClass) { inpRadio.dataset.shape = shapeClass; }
            // const eltLabel = mkElt("label", undefined, [inpRadio, eltCopy4shape]);
            const eltLabel = mkElt("label", undefined, [inpRadio, eltScaleWrapper]);
            eltLabel.style.display = "block";
            return eltLabel;
        }
        let computedStyleCopied;
        let promCompStyleCopied = new Promise(resolve => {
            setTimeout(() => {
                computedStyleCopied = getComputedStyle(eltCopied);
                resolve(computedStyleCopied);
            }, 500);
        })
        setTimeout(() => {
            const bcrCopied = eltCopied.getBoundingClientRect();
            function appendAlt(theAlt) {
                const clipping = mkElt("div", undefined, theAlt);
                const sc = clipping.style;
                sc.width = bcrCopied.width * scaleCopies;
                sc.height = bcrCopied.height * scaleCopies + 30;
                // sc.marginLeft = 10;
                // sc.overflow = "clip";
                jmnodesShapes.appendChild(clipping);
            }
            appendAlt(mkShapeAlt());
            modJsEditCommon.arrShapeClasses.forEach(cls => appendAlt(mkShapeAlt(cls)));
            setDialogShapeName(initialShapeEtc.shape);
        }, 500);

        function updateCopiesSizes() {
            const bcrCopied = eltCopied.getBoundingClientRect();
            const desiredW = 60;
            // const origW = bcrOrig.width;
            const origW = bcrCopied.width;
            const scaleCopies = desiredW / origW;
            function updateSize(divSmallCopy) {
                const clipping = divSmallCopy;
                if (clipping.tagName != "DIV") throw Error(`clipping is not DIV: ${clipping.tagName}`);
                const sc = clipping.style;
                sc.width = bcrCopied.width * scaleCopies;
                sc.height = bcrCopied.height * scaleCopies + 30;
                // jmnodesShapes.appendChild(clipping);
                const eltJmnodeSmall = divSmallCopy.querySelector("jmnode");
                const ss = eltJmnodeSmall.style;
                ss.scale = scaleCopies;
                ss.height = eltCopied.style.height;
                ss.width = eltCopied.style.width;
            }
            jmnodesShapes.parentElement.querySelectorAll("jmnodes>div")
                .forEach(clipping => {
                    updateSize(clipping);
                });
        }


        const inpBgColor = mkElt("input", { type: "color" });
        inpBgColor.value = "#adff2f"; // greenyellow, default was rgba(0, 0, 0, 0), in jsmind-mm4i.css
        const inpFgColor = mkElt("input", { type: "color" });
        promCompStyleCopied.then(style => {
            // Check if backgroundColor is our transparent default:
            const bgRgba = style.backgroundColor;
            if (bgRgba != "rgba(0, 0, 0, 0)") {
                inpBgColor.value = modColorTools.standardizeColorTo6Hex(style.backgroundColor);
            }
            inpFgColor.value = modColorTools.standardizeColorTo6Hex(style.color);
            checkColorContrast();
        });
        // let bgColorChanged;
        // let fgColorChanged;
        inpBgColor.addEventListener("input", () => {
            currentShapeEtc.temp.bgColor = inpBgColor.value;
            onAnyCtrlChangeNode();
            checkColorContrast();
        });
        inpFgColor.addEventListener("input", () => {
            currentShapeEtc.temp.fgColor = inpFgColor.value;
            onAnyCtrlChangeNode();
            eltCopied.style.color = inpFgColor.value;
            checkColorContrast();
        });
        const pContrast = mkElt("p");
        async function checkColorContrast() {
            const modContrast = await importFc4i("acc-colors");
            const fg = inpFgColor.value;
            const bg = inpBgColor.value;
            // const contrast = modContrast.colorContrast(inpFgColor.value, inpBgColor.value);
            const contrast = modContrast.colorContrast(fg, bg);
            if (contrast > 4.5) {
                pContrast.textContent = "Color contrast is ok.";
                pContrast.style.color = "";
            } else {
                console.warn("checkColorContrast, is low", { contrast, fg, bg });
                pContrast.textContent = `Color contrast is low: ${contrast.toFixed(1)}.`;
                pContrast.style.color = "red";
            }
        }
        const styleColors = [
            "display: flex",
            "flex-direction: column",
            "gap: 10px"
        ].join("; ");


        async function ApplyCurrentBgToCopied() {
            const bgObj = await getBgFromElts();
            if (!bgObj) return;
            currentShapeEtc.background = bgObj;
            modJsEditCommon.checkShapeEtcBgObj(currentShapeEtc);
            applyCurrentToCopied();
        }
        // const debounceApplyCurrentBgToCopied = debounce(ApplyCurrentBgToCopied, 2000);
        const debounceApplyCurrentBgToCopied = debounce(ApplyCurrentBgToCopied, 300);


        function setBgChoiceThis(eltChoice) {
            const inp = eltChoice.querySelector("input[name=bg-choice]");
            if (inp.disabled) {
                const val = inp.value;
                throw Error(`Can't choose disabled ${val}`);
            }
            inp.checked = true;
            debounceApplyCurrentBgToCopied();
        }
        function setBgNodeChoiceValid(eltChoice, valid) {
            if (!eltChoice.classList.contains("bg-choice")) {
                console.log("Not bg-choice: ", eltChoice);
                throw Error("eltChoice is not bg-choice")
            }
            // const inp = eltChoice.querySelector("input[name=bg-choice]");
            if (valid) {
                eltChoice.classList.remove("bg-choice-needs-value");
            } else {
                eltChoice.classList.add("bg-choice-needs-value");
            }
        }
        const mkBgChoice = (id, label, eltDetails) => {
            // if (!modJsEditCommon.isJmnodesBgName(id)) throw Error(`Not a jmnodesBgName: ${id}`);
            modJsEditCommon.checkJmnodesBgName(id);
            const inpRadio = mkElt("input", { type: "radio", id, name: "bg-choice" });
            inpRadio.style.gridArea = "r";
            inpRadio.style.marginRight = "10px";

            const lbl = mkElt("label", { for: id }, label);
            lbl.style.gridArea = "l";
            const container = mkElt("div", { class: "mdc-card bg-choice" }, [inpRadio, lbl]);
            if (eltDetails) {
                container.appendChild(eltDetails);
                eltDetails.style.gridArea = "d";
            }

            return container;
        }

        const bgChoiceNone = mkBgChoice("bg-choice-none", "No special");
        setBgNodeChoiceValid(bgChoiceNone, true);
        // const radChoiceNone = bgChoiceNone.querySelector("#bg-choice-none");

        const divClipboardImageText = mkElt("div", undefined, "TEMP");
        divClipboardImageText.style = `
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            background: transparent;
            color: red;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        const divClipboardImageBg = mkElt("div");
        divClipboardImageBg.style = `
            position: absolute;
            top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;
            background-size: cover;
        `;


        const divClipboardImage = mkElt("div", undefined, [divClipboardImageBg, divClipboardImageText]);
        divClipboardImage.id = "div-clipboard-image";
        const divImgPreviewContainer = mkElt("div", undefined, divClipboardImage);
        divImgPreviewContainer.style = `
            min-width: 100px;
            width: 100px;
        `;

        // const temp = document.getElementById("div-clipboard-image-2") debugger;
        const btnClipboard = modMdc.mkMDCbutton("Clipboard", "raised");
        btnClipboard.addEventListener("click", errorHandlerAsyncEvent(async () => {
            const added = await getBgFromClipboard(divClipboardImageBg);
            console.log({ added });
            if (!added) return;
            setBgNodeChoiceValid(bgChoiceImgClipboard, true);
            const currentBgName = divBgChoices.querySelector("input[name=bg-choice]:checked")?.id;
            console.log({ currentBgName });
            sliderBlur.set(0);
            divClipboardImageBg.style.filter = null;
            // debugger;
            if (currentBgName == "bg-choice-img-clipboard") {
                const bgValue = await getBgValueFromElt(currentBgName);
                const objTextContrast = await modColorTools.getDataForTextOnImage(bgValue.blob);
                console.log({ objTextContrast });
                const b = objTextContrast.blackContrast;
                const w = objTextContrast.whiteContrast;
                const c = objTextContrast.coloredContrast;
                const arrBWC = [
                    { contrast: b, color: "black" },
                    { contrast: w, color: "white" },
                    { contrast: c, color: "colored" }
                ];
                arrBWC.sort((a, b) => b.contrast - a.contrast);
                let best = arrBWC[0].color;
                console.log({ arrBWC });
                /*
                let best = "black";
                if (b > Math.max(w, c)) {
                    best = "white";
                    if (w > c) { best = "colored"; }
                }
                */
                console.log({ best });
                // divFgAccColor
                const inpBest = divFgRadios.querySelector(`#${best}-text`);
                inpBest.checked = true;
                applyTextToPreviewImage(inpBest);

                currentShapeEtc.background = modJsEditCommon.mkJmnodeBgObj(currentBgName, bgValue)
                debounceApplyCurrentBgToCopied();
            }
        }));
        async function onSliderChange(val) {
            console.log("onSliderChange", val);
            const blur = val;
            divClipboardImageBg.style.filter = `blur(${blur}px)`;
            const currentBgName = "bg-choice-img-clipboard";
            const bgValue = await getBgValueFromElt(currentBgName);
            currentShapeEtc.background = modJsEditCommon.mkJmnodeBgObj(currentBgName, bgValue)
            debounceApplyCurrentBgToCopied();
        }
        function onSliderInput(val) { console.log("onSliderInput", val); }

        const divInfoAcc = mkElt("div", undefined,
            "You can make node text more readable both by text color and by blurring the image."
        );
        const { eltSlider: eltSliderBlur, slider: sliderBlur } = await modMdc.mkMDCslider(0, 5, 0, undefined, "blur", onSliderChange, onSliderInput, false);
        // const sliderBlur = slider;
        // const eltSlider = await modMdc.mkMDCslider(0, 5, 1, 1, "blur", onSliderChange, onSliderInput, true);

        const divFgAccColor = mkElt("div");
        divFgAccColor.style.overflowWrap = "anywhere";
        divFgAccColor.style.whiteSpace = "pre";

        const inpBlack = mkElt("input", { type: "radio", name: "black-or-white", id: "black-text" })
        const lblBlack = mkElt("label", undefined, [inpBlack, "black"]);
        lblBlack.style.color = "black";
        const inpWhite = mkElt("input", { type: "radio", name: "black-or-white", id: "white-text" })
        const lblWhite = mkElt("label", undefined, [inpWhite, "white"]);
        lblWhite.style.color = "white";
        const divFgRadios = mkElt("div", undefined, [
            lblBlack, lblWhite
        ]);
        divFgRadios.style = `
            display: flex;
            gap: 10px;
            padding: 10px;
        `;
        divFgRadios.addEventListener("change", evt => {
            if (evt.target.name != "black-or-white") throw Error("evt.target.name != black-or-white");
            // console.log(evt.target.id);
            const target = evt.target;
            applyTextToPreviewImage(target);
        })
        const divFgText = mkElt("div", undefined, [
            divFgRadios
        ]);
        divFgText.style = `
            display: flex;
            gap: 5px;
        `;

        function applyTextToPreviewImage(inpradioTextChoice) {
            console.log({ inpradioTextChoice });
            const tn = inpradioTextChoice.tagName;
            // debugger;
            if (tn != "INPUT") throw Error(`Expected tagName "INPUT", got "${tn}"`);
            const type = inpradioTextChoice.type;
            if (type != "radio") throw Error(`Expected type "radio", got "${type}"`);
            let color;
            const textChoiceId = inpradioTextChoice.id;
            switch (textChoiceId) {
                case "white-text":
                    color = "white";
                    break;
                case "black-text":
                    color = "black";
                    break;
                case "colored-text":
                    color = "FIX-ME";
                    const parent = inpradioTextChoice.parentElement;
                    color = parent.textContent;
                    break;
                default:
                    throw Error(`Unknown textChoice.id: ${inpradioTextChoice.id}`);
            }
            divClipboardImageText.style.color = color;
            divClipboardImageText.textContent = color;
        }

        // const divBlur = mkElt("div", undefined, [tfBlur, eltSlider]);
        const sliderBlurContainer = mkElt("div", undefined, [
            "Blur:",
            eltSliderBlur,
        ]);
        sliderBlurContainer.style = `
            NOdisplay: flex;
            NOgap: 10px;
            display: grid;
            grid-template-columns: max-content 1fr;
            NOoutline: 1px dotted red;
        `;

        const divBlur = mkElt("div", undefined, [
            divFgText,
            sliderBlurContainer,
            divInfoAcc,
            divFgAccColor,
        ]);
        divBlur.id = "div-from-clipboard-blur";
        // debugger;
        divImgPreviewContainer.appendChild(divClipboardImage);
        const divFromClipboard = mkElt("div", undefined, [
            divImgPreviewContainer,
            divBlur,
        ]);
        divFromClipboard.style = `
            display: flex;
            gap: 20px;
        `;
        const divClipboard = mkElt("div", undefined, [
            "An image from the clipboard.",
            btnClipboard,
            divFromClipboard
        ]);



        const divImgPatternPreview = mkElt("div");
        divImgPatternPreview.style.height = 100;
        divImgPatternPreview.style.border = "2px black inset";
        divImgPatternPreview.style.background = "gray";
        const taImgPattern = modMdc.mkMDCtextFieldTextarea(undefined, 5, 80);
        const tafImgPattern = modMdc.mkMDCtextareaField("CSS3 pattern", taImgPattern);

        const divPatternValid = mkElt("div", undefined, "-");
        divPatternValid.style.display = "none";
        divPatternValid.style.padding = "4px";
        divPatternValid.style.fontSize = "1rem";
        divPatternValid.style.lineHeight = "1.2rem";
        // FIX-ME: I do not understand why 2.5rem is not enough???
        divPatternValid.style.minHeight = "calc(2.8rem + 4px)";
        const objCssPattern = {};


        const divImagePattern = mkElt("div", undefined, [
            tafImgPattern,
            divPatternValid,
        ]);


        const divBgColor = mkElt("div", undefined, [
            mkElt("label", undefined, ["Background color: ", inpBgColor]),
        ]);
        const detBgColor = mkElt("details", undefined, [
            mkElt("summary", undefined, "Choose color"),
            divBgColor
        ]);
        const bgChoiceColor = mkBgChoice("bg-choice-color", "Color", detBgColor);
        setBgNodeChoiceValid(bgChoiceColor, true);


        function tellPatternValid(msg) {
            console.log(msg);
            divPatternValid.textContent = msg;
        }
        let patternValid;

        function setBgPatternPreview() {
            const cssKeyVal = cssTxt2keyVal(taImgPattern.value);
            console.log({ cssKeyVal });
            if (typeof cssKeyVal == "string") {
                patternValid = cssKeyVal;
            } else patternValid = true;

            if (patternValid === true) {
                for (const prop in cssKeyVal) {
                    if (prop !== "background"
                        && !prop.startsWith("background-")
                        && prop !== "opacity"
                    ) {
                        patternValid = `Property "${prop}" not allowed`;
                        break;
                    }
                    const val = cssKeyVal[prop];
                    const cssDecl = `${prop}: ${val};`;
                    if (!isValidCssDecl(cssDecl)) patternValid = `Invalid css: ${cssDecl}`;
                }
            }

            const divThisChoice = divImagePattern.closest(".bg-choice");
            for (const prop in objCssPattern) { delete objCssPattern[prop]; }
            if (patternValid === true) {
                modMdc.setValidityMDC(taImgPattern, "");
                tellPatternValid("Valid");
                setBgNodeChoiceValid(divThisChoice, true);
                setBgChoiceThis(divThisChoice);
                for (const prop in cssKeyVal) {
                    const val = cssKeyVal[prop];
                    divImgPatternPreview.style[prop] = val;
                    objCssPattern[prop] = val;
                }
                // Unset repeat
                objCssPattern["background-repeat"] = "initial";
                divImagePattern.style.outline = "none";
            } else {
                // console.log("Not valid css:", patternValid);
                modMdc.setValidityMDC(taImgPattern, patternValid);
                tellPatternValid("Not valid: " + patternValid);
                setBgNodeChoiceValid(divThisChoice, false);
                setBgChoiceThis(bgChoiceNone);
                divImgPatternPreview.style.background = "gray";
                divImagePattern.style.outline = "2px dotted red";
            }
        }
        const debounceSetBgPatternPreview = debounce(setBgPatternPreview, 1000);
        taImgPattern.addEventListener("input", () => {
            debounceSetBgPatternPreview();
        });
        taImgPattern.addEventListener("change", () => {
            debounceSetBgPatternPreview();
        });
        const divPattern = mkElt("div", undefined, [
            mkElt("div", undefined, [
                "Use a CSS ",
                // mkElt("a", { href: "https://projects.verou.me/css3patterns/" }, "pattern"),
                mkElt("a", { href: "https://www.magicpattern.design/tools/css-backgrounds" }, "pattern"),
                ".",
            ]),
            divImagePattern,
            divImgPatternPreview
        ]);



        /*
        const detLink = mkElt("details", undefined, [
            mkElt("summary", undefined, "Edit link"),
            divLink
        ]);
        detLink.addEventListener("toggle", () => {
            setTimeout(() => {
                console.log("detLink.open", detLink.open);
                if (detLink.open) {
                    inpImageUrl.focus();
                }
            }, 100);
        });
        */
        const detClipboard = mkElt("details", undefined, [
            mkElt("summary", undefined, "Add clipboard image"),
            divClipboard
        ]);
        const detPattern = mkElt("details", undefined, [
            mkElt("summary", undefined, "Set up pattern"),
            divPattern
        ]);
        detPattern.addEventListener("toggle", () => {
            // FIX-ME: The delay should perhaps not be needed.
            //   Take a look at this again when switching to MDC 3.
            setTimeout(() => {
                if (detPattern.open) {
                    tafImgPattern.focus();
                }
            }, 1000);
        });

        // const bgChoiceImgLink = mkBgChoice("bg-choice-img-link", "Link image", detLink);
        // setBgNodeChoiceValid(bgChoiceImgLink, false);

        const bgChoiceImgClipboard = mkBgChoice("bg-choice-img-clipboard", "Clipboard image", detClipboard);
        setBgNodeChoiceValid(bgChoiceImgClipboard, false);

        const bgChoicePattern = mkBgChoice("bg-choice-pattern", "Pattern", detPattern);
        setBgNodeChoiceValid(bgChoicePattern, true);

        const divBgChoices = mkElt("div", { id: "bg-choices" }, [
            bgChoiceNone,
            bgChoiceColor,
            // bgChoiceImgLink,
            bgChoiceImgClipboard,
            bgChoicePattern,
        ]);
        // radChoiceLink = divBgChoices.querySelector("#bg-choice-img-link");
        // console.log({ radChoiceLink });
        setBgChoiceThis(bgChoiceNone);
        divBgChoices.addEventListener("input", errorHandlerAsyncEvent(async evt => {
            evt.stopPropagation();
            evt.stopImmediatePropagation();
            // console.log("hej input");
            // console.log(evt);
            const target = evt.target;
            if (target.name == "bg-choice") {
                const bgName = target.id;
                const currBgObj = modJsEditCommon.getShapeEtcBgObj(currentShapeEtc);
                if (bgName != currBgObj?.bgName) {
                    // getBgFromElts
                    const bgValue = await getBgValueFromElt(bgName);
                    currentShapeEtc.background = modJsEditCommon.mkJmnodeBgObj(bgName, bgValue)
                }
            }
            // FIX-ME: the above does not create an entry in console???
            // Tried reboot etc.
            // Suspect a chrome bug since there is another event handler here.
            // Try a timeout here:
            setTimeout(async () => {
                console.log("in timeout");
                const valBg = await getBgFromElts();
                console.log({ valBg });
                const valid = (undefined != valBg);
                const inpChecked = await getBgCssCheckedInp();
                console.log({ inpChecked });
                const eltChecked = inpChecked.closest("div.bg-choice")
                setBgNodeChoiceValid(eltChecked, valid);
                if (valid) {
                    debounceApplyCurrentBgToCopied();
                }
            }, 100);
        }));

        async function getBgCssCheckedInp() {
            // console.trace("getBgCssValueElt");
            let msWaited = 0;
            const msStep = 200;
            let elt;
            while ((!elt) && (msWaited < 2000)) {
                await modTools.waitSeconds(msStep / 1000);
                msWaited += msStep;
                elt = divBgChoices.querySelector("input[name=bg-choice]:checked")
            }
            if (!elt) throw Error("Could not find input[name=bg-choice]:checked");
            return elt;
        }
        async function getBgValueFromElt(bgName) {
            let bgValue;
            switch (bgName) {
                case "bg-choice-none":
                    bgValue = "no value";
                    break;
                case "bg-choice-color":
                    bgValue = inpBgColor.value.trim();
                    break;
                // case "bg-choice-img-link": bgValue = inpImageUrl.value.trim(); break;
                case "bg-choice-pattern":
                    bgValue = taImgPattern.value.trim();
                    break;
                case "bg-choice-img-clipboard":
                    {
                        let bgBlob;
                        // const blurVal = inpBlur.value;
                        const blurVal = sliderBlur.get();
                        if (clipImage.blob) {
                            bgBlob = clipImage.blob;
                        } else {
                            // FIX-ME: return minimal image
                            const canvas = document.createElement("canvas");
                            canvas.width = 1;
                            canvas.height = 1;
                            const ctx = canvas.getContext("2d");
                            if (!ctx) throw Error("Could not get canvas 2d");
                            ctx.fillStyle = "red";
                            ctx.fillRect(0, 0, 1, 1);
                            bgBlob = await new Promise(resolve => {
                                canvas.toBlob(blob => { resolve(blob); }, "image/webp");
                            });
                        }
                        // bgValue = bgBlob;
                        // debugger;
                        const fgInp = divFgRadios.querySelector("input:checked")
                            || divFgRadios.querySelector("input");
                        if (!fgInp) {
                            debugger; // eslint-disable-line no-debugger
                            return;
                        }
                        const fgId = fgInp.id;
                        let fgColor;
                        switch (fgId) {
                            case "white-text":
                                fgColor = "white";
                                break;
                            case "black-text":
                                fgColor = "black";
                                break;
                            case "colored-text":
                                fgColor = "red";
                                fgColor = fgInp.dataset.color;
                                break;
                            default:
                                throw Error(`Bad fgId: ${fgId}`);
                        }

                        bgValue = { blob: bgBlob, blur: blurVal, fgColor };
                    }

                    break;
                default:
                    throw Error(`Unknown bg-choice: ${bgName}`);
            }
            return bgValue;
        }
        async function getBgFromElts() {
            if (!backgroundTabIsSetup) return;
            const elt = await getBgCssCheckedInp();
            const bgName = elt.id;
            let bgValue = undefined;
            console.log("getBgCssValue", elt, bgName);
            bgValue = await getBgValueFromElt(bgName);
            const bgObj = modJsEditCommon.mkJmnodeBgObj(bgName, bgValue);
            return bgObj;
        }

        const divCurrentBg = mkElt("div", undefined);

        const divBackground = mkElt("div", { style: styleColors }, [
            // mkElt("label", undefined, ["Background color: ", inpBgColor]),
            mkElt("label", undefined, ["Text color: ", inpFgColor]),
            pContrast,
            divCurrentBg,
            // divAdd
            divBgChoices
        ]);





        // const aLinkPreview = mkElt("a");
        // const divLinkPreview = mkElt("div", undefined, ["Link: ", aLinkPreview]);

        // const inpLink = modMdc.mkMDCtextFieldInput(undefined, "url");
        // const strLink = initialShapeEtc.nodeLink;
        // const tfLink = modMdc.mkMDCtextField("Topic link", inpLink, strLink);

        /*
        const onInpLink = async () => {
            console.log("inpLink input");
            const maybeUrl = inpLink.value.trim();
            if (maybeUrl == "") {
                modMdc.setValidityMDC(inpLink, "");
                aLinkPreview.href = "";
                aLinkPreview.textContent = "";
                delete currentShapeEtc.nodeLink;
            } else {
                if (modTools.isValidUrl(maybeUrl) == true) {
                    console.log("inpLink", maybeUrl);
                    currentShapeEtc.nodeLink = maybeUrl;
                    aLinkPreview.href = maybeUrl;
                    aLinkPreview.textContent = maybeUrl;
                    modMdc.setValidityMDC(inpLink, "");
                } else {
                    delete currentShapeEtc.nodeLink;
                    aLinkPreview.href = "";
                    aLinkPreview.textContent = "";
                    modMdc.setValidityMDC(inpLink, "Not a link");
                }
            }
            // onAnyCtrlChange();
        }
        */
        // const debounceOnInpLink = debounce(onInpLink, 1000);
        // inpLink.addEventListener("input", debounceOnInpLink);
        /*
        setTimeout(() => {
            // modMdc.setMdcInputValid(inpLink, true);
            onInpLink();
        }, 100);
        */


        // let blobBg;
        const btnChangeBg = modMdc.mkMDCbutton("Change", "raised");
        btnChangeBg.addEventListener("click", errorHandlerAsyncEvent(async () => {
            await dlgBgImage();
        }));
        async function dlgBgImage() {
            // const eltInfoAdd = mkElt("p", undefined, `You can add a background image either as a link or as an image from cliboard.`);
            // const btnLink = modMdc.mkMDCbutton("Link", "raised");

            /*
            const body = mkElt("div", { id: "dlg-body-node-background" }, [
                mkElt("h2", undefined, "Node background"),
                mkElt("div", { style: "color:red;" }, "Not ready!"),
                divCurrentBg,
                divBgChoices
            ]);
            */
            // const save = await modMdc.mkMDCdialogConfirm(body, "save", "cancel");
        }
        async function getBgFromClipboard(toDiv) {
            const modImages = await importFc4i("images");
            const clipboardAccessOk = await modImages.isClipboardPermissionStateOk();
            if (clipboardAccessOk == false) {
                modTools.showInfoPermissionsClipboard();
                return false;
            }
            const resultImageBlobs = await modImages.getImagesFromClipboard();
            if (Array.isArray(resultImageBlobs)) {
                if (resultImageBlobs.length == 0) {
                    modImages.alertNoImagesFound();
                    return false;
                } else {
                    console.log(eltCopied);
                    const maxBlobSize = 20 * 1000;
                    // const maxBlobSize = 5 * 1000;
                    // const maxBlobSize = 1 * 1000;
                    // FIX-ME: only one
                    for (const blobIn of resultImageBlobs) {
                        const {
                            blobOut, // shrinked, msElapsed, typeIn, typeOut, quality
                        } = await modImages.shrinkImgBlobToSizes(blobIn, maxBlobSize);

                        const blob = blobOut;
                        const objectUrl = URL.createObjectURL(blob);

                        const darkBg = await modColorTools.getDataForTextOnImage(objectUrl);
                        console.log({ darkBg });
                        divFgAccColor.textContent = `darkBg: ${JSON.stringify(darkBg, undefined, 4)}`;

                        // clipImage.url = url;
                        clipImage.blob = blob;
                        // const objBackground = currentShapeEtc.background;
                        // objBackground.url = clipImage.url; // This is for somethingToSave()
                        // objBackground.blob = clipImage.blob;
                        currentShapeEtc.background =
                            modJsEditCommon.mkJmnodeBgObj("bg-choice-img-clipboard", blob);
                        requestSetStateBtnSave();
                        toDiv.style.backgroundImage = `url("${objectUrl}")`;
                        // const arrRgb = modColorTools.calculateAvgColorLab(imageData);
                        toDiv.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest"
                        });
                    }
                    // applyToCopied();
                }
            } else {
                // Should be an error object
                const err = resultImageBlobs;
                console.log({ err });
                if (!(err instanceof Error)) {
                    debugger; // eslint-disable-line no-debugger
                    throw Error(`resultImages is not instanceof Error`);
                }
                switch (err.name) {
                    case "NotAllowedError":
                        // handleClipboardReadNotAllowed();
                        modTools.showInfoPermissionsClipboard();
                        break;
                    case "DataError":
                        modImages.alertNoImagesFound();
                        break;
                    default:
                        debugger; // eslint-disable-line no-debugger
                        throw Error(`Unknown error name: ${err.name}, ${err.message}`);
                }
            }

            // btnAddBg.style.display = "none";
            return true;
        }
        /*
        function removeBg(blob) {
            btnChangeBg.style.display = null;
        }
        /*

        const detBasicNodeChoices =
            mkElt("div", undefined, [
                mkElt("b", undefined, "Node basics"),
                // tafTopic, 
                tfLink,
                // divLinkPreview
            ]);
        detBasicNodeChoices.style = `
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;


        async function setDialogCustomItem(objCustom) {
            const strCustom = JSON.stringify(objCustom);
            detNodeChoiceCustom.dataset.jsmindCustom = strCustom;
            await addBackupCustom(objCustom);
        }
        const btnSelectCustomItem = modMdc.mkMDCbutton("Select database item", "raised");
        btnSelectCustomItem.addEventListener("click", errorHandlerAsyncEvent(async () => {
            const objCustom = await modMMhelpers.pasteCustomClipDialog();
            console.log({ objCustom, eltCopied });
            if (!objCustom) return;
            await setDialogCustomItem(objCustom);
            showCustomItem();
            setCustomInCurrentShapeEtc(true);
        }));
        const divSelectCustomItem = mkElt("p", undefined, btnSelectCustomItem);

        const divCustomTitImg = mkElt("div", undefined, [
            mkElt("div", { id: "ednode-cust-title" }, "(title)"),
            mkElt("div", { id: "ednode-cust-image" }, "(image)"),
        ]);
        const divCustomContent = mkElt("div", { class: "custom-content" }, [
            divCustomTitImg,
            mkElt("div", { id: "ednode-cust-link" }, "(link)"),
            divSelectCustomItem,
        ]);
        divCustomContent.classList.add("display-none");

        // const strCopiedCustom = eltCopied.firstElementChild?.dataset.jsmindCustom;
        const strCopiedCustom = eltCopied.lastElementChild?.dataset.jsmindCustom;

        async function setCustomInCurrentShapeEtc(on) {
            if ("boolean" != typeof on) throw Error(`Not boolean: ${on}`);
            delete currentShapeEtc.nodeCustom;
            if (on) {
                const strCustom = detNodeChoiceCustom.dataset.jsmindCustom;
                if (strCustom) {
                    const objCustom = JSON.parse(strCustom);
                    console.log("setCustomInCurrent...", { objCustom });
                    const key = objCustom.key;
                    const provider = objCustom.provider;
                    currentShapeEtc.nodeCustom = { key, provider };
                    const strBackup = detNodeChoiceCustom.dataset.backupCustom;
                    if (strBackup) {
                        const objBackup = JSON.parse(strBackup);
                        // inpTitle
                        taTopic.dispatchEvent(new Event("focus"));
                        taTopic.value = objBackup.title;
                        onTaTopicInput();
                        inpLink.dispatchEvent(new Event("focus"));
                        inpLink.value = objBackup.url;
                        onInpLink();
                    }
                } else {
                    console.log("strCustom is undefined");
                }
            } else {
                console.log("off")
            }
            onAnyCtrlChangeNode();
        }
        // const OLdivTopicChoiceCustom = mkTopicChoice("topic-choice-custom", "Custom linked node", divCustomContent);
        const chkLinkCustom = mkElt("input", { type: "checkbox" });
        chkLinkCustom.addEventListener("change", () => {
            console.log("chkLinkCustom", chkLinkCustom.checked);
            if (chkLinkCustom.checked) {
                divCustomContent.classList.remove("display-none");
                setCustomInCurrentShapeEtc(true);
            } else {
                divCustomContent.classList.add("display-none");
                setCustomInCurrentShapeEtc(false);
            }
        });

        // const lblLinkCustom = mkElt("label", undefined, [chkLinkCustom, "Link Custom"]);
        // modMdc.mkMDCcheckboxElt
        const lbl = mkElt("span", undefined, "Link to Database Item");
        const eltLinkCustom = await modMdc.mkMDCcheckboxElt(chkLinkCustom, lbl);
        const detNodeChoiceCustom = mkElt("div", undefined, [
            // mkElt("div", undefined, "Custom linked node"),
            eltLinkCustom,
            divCustomContent
        ]);
        if (initialCustomTopic != undefined) {
            chkLinkCustom.checked = true;
            setDialogCustomItem(initialCustomTopic);
            showCustomItem();
            divCustomContent.classList.remove("display-none");
        }

        const divContent = mkElt("div", { id: "jsmind-ednode-content" }, [
            detBasicNodeChoices, detNodeChoiceCustom
        ]);
        /*
        function OLDcheckTopicChoiceThis(eltChoice) {
            const inp = eltChoice.querySelector("input[name=topic-choice]");
            inp.checked = true;
        }
        function OLDsetTopicChoiceEnabled(eltChoice, enabled) {
            const inp = eltChoice.querySelector("input[name=topic-choice]");
            inp.disabled = !enabled;
        }
        */




        // drop-shadow
        // https://developer.mozilla.org/en-US/docs/Web/CSS/filter-function/drop-shadow
        const divSliShadowOffX = mkElt("div");
        const divSliShadowOffY = mkElt("div");
        const divSliShadowBlur = mkElt("div");
        // const divSliShadowSpread = mkElt("div");

        const divShadow = mkElt("div", undefined, [
            mkElt("div", undefined, ["Horizontal offset:", divSliShadowOffX]),
            mkElt("div", undefined, ["Vertical offset:", divSliShadowOffY]),
            mkElt("div", undefined, ["Shadow blur:", divSliShadowBlur]),
            // mkElt("div", undefined, ["Shadow spread:", divSliShadowSpread]),
            mkElt("div", undefined, mkCtrlColor("shadow.color", "red")),
        ]);
        let shadowTabWasSetup = false;
        async function addSliShadowOffX() {
            const eltCont = divSliShadowOffX;
            const title = "Shadow horizontal offset";
            await mkSlider4shapeEtc("shadow.offX", eltCont, -10, 10, 0, 2, title, undefined);
        }
        async function addSliShadowOffY() {
            const eltCont = divSliShadowOffY;
            const title = "Shadow vertical offset";
            await mkSlider4shapeEtc("shadow.offY", eltCont, -10, 10, 0, 2, title, undefined);
        }
        async function addSliShadowBlur() {
            const eltCont = divSliShadowBlur;
            const title = "Shadow blur";
            await mkSlider4shapeEtc("shadow.blur", eltCont, 0, 50, 0, 5, title, undefined);
        }



        /////////////////////////////////////
        // Maybe generalize like below? But it gets a bit complicated...
        function getShapeEtcGrpMbr(strShEtc) {
            const arrShEtc = strShEtc.split(".");
            const grpName = arrShEtc[0];
            const mbrName = arrShEtc[1];
            return { grpName, mbrName }
        }
        function setInShapeEtc(val, pathShEtc, targetShEtc) {
            // let grpName, mbrName;
            // https://javascript.info/destructuring-assignment
            // ({ grpName, mbrName } = getGrpMbr(pathShEtc));
            const { grpName, mbrName } =
                typeof pathShEtc == "string" ? getShapeEtcGrpMbr(pathShEtc) : pathShEtc;
            targetShEtc[grpName] = targetShEtc[grpName] || {};
            const grp = targetShEtc[grpName];
            if (mbrName) { grp[mbrName] = val; } else { targetShEtc[grpName] = val }
        }
        function getFromShapeEtc(pathShEtc, sourceShEtc) {
            const { grpName, mbrName } =
                typeof pathShEtc == "string" ? getShapeEtcGrpMbr(pathShEtc) : pathShEtc;
            const grp = sourceShEtc[grpName];
            if (!grp) return grp;
            if (mbrName) return grp[mbrName];
            return grp;
        }



        function mkCtrlColor(pathShEtc, defaultColor) {
            const objShEtc = getShapeEtcGrpMbr(pathShEtc);
            const initColor = getFromShapeEtc(objShEtc, initialShapeEtc) || defaultColor;
            // const initHex6 = modJsEditCommon.to6HexColor(initColor);
            const initHex6 = modColorTools.standardizeColorTo6Hex(initColor);
            const inpColor = mkElt("input", { type: "color", value: initHex6 });
            // const funGrp = onCtrlsGrpChg[objShEtc.grpName];
            inpColor.addEventListener("input", () => {
                console.log("inpColor, input", inpColor.value);
                setInShapeEtc(inpColor.value, objShEtc, currentShapeEtc);
            });
            inpColor.addEventListener("change", () => {
                console.log("inpColor, change", inpColor.value);
                // setBorderCopied();
            });
            const lbl = mkElt("label", { class: "specify-border-detail" }, [
                "Color: ", inpColor
            ]);
            return lbl;
        }

        async function mkSlider4shapeEtc(pathShEtc, eltCont, min, max, defaultVal, step, title, funChgThis) {
            const objShEtc = getShapeEtcGrpMbr(pathShEtc);
            const initVal = getFromShapeEtc(objShEtc, initialShapeEtc) || defaultVal;
            let sli = ctrlsSliders[pathShEtc];
            if (sli) return;
            const funChange = () => {
                setInCurrent();
                if (funChgThis) funChgThis();
                // const funGrp = onCtrlsGrpChg[objShEtc.grpName];
                onAnyCtrlChangeNode(); // throttle
            }
            function setInCurrent() {
                const mdc = sli?.myMdc;
                const val = mdc?.getValue();
                if (val == undefined) return;
                setInShapeEtc(val, objShEtc, currentShapeEtc);
            }
            sli = await modIsDisplayed.mkSliderInContainer(eltCont, min, max, initVal, step, title, funChange);
            ctrlsSliders[pathShEtc] = sli;
        }
        /////////////////////////////////////

        function setupShadowTab() {
            if (shadowTabWasSetup) return;
            const promBlur = addSliShadowBlur();
            // const promSpread = addSliShadowSpread();
            const promOffX = addSliShadowOffX();
            const promOffY = addSliShadowOffY();
            // if (!(sliShadowOffX && sliShadowOffY && sliShadowBlur)) return;
            shadowTabWasSetup = true;
        }
        function activateShadowTab() {
            console.log("clicked shadow tab");
            setupShadowTab();
        }


        // console.log("setting up tabs bar", eltCopied);
        // mkMdcTabBarSimple(tabsRecs, contentElts, moreOnActivate) 
        const tabRecs = ["Notes",
            // "Content",
            "Shapes", "Border", "Shadow", "Background"];
        const contentElts = mkElt("div", undefined,
            [divNotesTab,
                // divContent,
                divShapes, divBorder, divShadow, divBackground]);
        if (tabRecs.length != contentElts.childElementCount) throw Error("Tab bar setup number mismatch");
        const onActivateMore = (idx) => {
            // console.log("onActivateMore", idx);
            const tabName = tabRecs[idx];
            const checkTabname = (wantName) => {
                if (tabName != wantName) throw Error(`Got tab ${tabName}, want ${wantName}`);
            }
            switch (idx) {
                case 0:
                    checkTabname("Notes");
                    activateNotesTab();
                    break;
                /*
            case 1:
                checkTabname("Content");
                break;
                */
                case 1:
                    checkTabname("Shapes");
                    break;
                case 2:
                    checkTabname("Border");
                    activateBorderTab();
                    break;
                case 3:
                    checkTabname("Shadow");
                    activateShadowTab();
                    break;
                case 4:
                    checkTabname("Background");
                    activateBackgroundTab();
                    break;
                // case 5:
                // activateThemesTab();
                // break;
                default:
                    throw Error(`There is no tab at idx=${idx} `);
            }
        }


        contentElts.classList.add("tab-elts");
        function inTextareaEasyMDE(elt) {
            if (elt.tagName != "TEXTAREA") return false;
            if (!elt.closest("div.EasyMDEContainer")) return false;
            return true;
        }
        contentElts.addEventListener("change", evt => {
            // taNotes
            if (inTextareaEasyMDE(evt.target)) return;
            console.log("contentElts change", evt.target);
            onAnyCtrlChangeNode(); // throttle
        });
        contentElts.addEventListener("input", evt => {
            // taNotes
            if (inTextareaEasyMDE(evt.target)) return;
            console.log("contentElts input", evt.target);
            onAnyCtrlChangeNode(); // throttle
        });

        const tabBar = modMdc.mkMdcTabBarSimple(tabRecs, contentElts, onActivateMore);
        const divEdnodeParts = mkElt("div", { id: "jsmind-ednode-parts" }, [
            divEdnodeCopied,
            tabBar,
            contentElts,
            // detThemes,
        ])
        const body = mkElt("div", { id: "jsmind-ednode" }, [
            mkElt("h2", undefined, "Edit node"),
            divEdnodeParts,
        ]);


        // The workaround:
        const thumbSize = "30";
        /*
        const style = [
            `width:${thumbSize}px`,
            `height:${thumbSize}px`,
        ].join(";");
        */
        const icon = modMdc.mkMDCicon("resize");
        icon.style = `
            fontSize: ${thumbSize}px;
            width: ${thumbSize}px;
            aspect-ratio: 1 / 1;
        `;
        const thumb = mkElt("span", undefined, icon);
        thumb.id = "jsmind-ednode-copied-resizer";
        thumb.title = "Resize";
        thumb.style = `
            position: absolute;
            visibility: hidden;
            cursor: pointer;
        `;
        divEdnodeCopied.appendChild(thumb);
        let bcrCd, bcrT;
        let newBcrC;
        function adjustDivCopiedHeight() {
            const bcrT = thumb.getBoundingClientRect();
            const bcrD = divEdnodeCopied.getBoundingClientRect();
            const newH = bcrT.bottom - bcrD.top + 20;
            divEdnodeParts.style.gridTemplateRows = `${newH}px min-content 1fr`;
        }
        // throttle or debounce??
        const debounceAdjustDivCopiedHeight = debounce(adjustDivCopiedHeight, 1000);

        setTimeout(async () => {
            const eltMutations = thumb.parentElement.parentElement.parentElement
            await wait4mutations(eltMutations, 500);
            // const resMu = await wait4mutations(eltMutations, 500);
            // console.log({ resMu });
            bcrCd = eltCopied.getBoundingClientRect();
            bcrT = thumb.getBoundingClientRect();
            if (thumb.style.position == "fixed") {
                thumb.style.left = bcrCd.left + bcrCd.width - bcrT.width / 2 + "px";
                thumb.style.top = bcrCd.top + bcrCd.height + - bcrT.height / 2 + "px";
            } else if (thumb.style.position == "absolute") {
                // const bcrDiv = divCopied.getBoundingClientRect();
                const bcrJmnodes = jmnodesCopied.getBoundingClientRect();
                thumb.style.left = bcrCd.right - bcrT.width / 2 - bcrJmnodes.left + "px";
                thumb.style.top = bcrCd.bottom - bcrT.height / 2 - bcrJmnodes.top + "px";
            } else {
                debugger; // eslint-disable-line no-debugger
            }
            thumb.style.visibility = "visible";
            newBcrC = eltCopied.getBoundingClientRect();
            // bcrOrigDivCopied = divEdnodeCopied.getBoundingClientRect();
            // console.log({ bcrOrigDivCopied });
            // adjustDivCopiedHeight();
            debounceAdjustDivCopiedHeight();
        },
            // 100 - too small, strange things happens!
            // 500
            1
        );

        let thumbShiftX, thumbShiftY;
        let thumbStartX, thumbStartY;
        function onThumbDown(evts) {
            console.log("onThumbDown", { evts });
            evts.preventDefault(); // prevent selection start (browser action)

            const bcrThumb = thumb.getBoundingClientRect();
            // const bcrCd = eltCopied.getBoundingClientRect();
            const evt = evts[0] || evts;
            thumbStartX = evt.clientX;
            thumbStartY = evt.clientY;
            thumbShiftX = thumbStartX - bcrThumb.left;
            thumbShiftY = thumbStartY - bcrThumb.top;

            thumb.setPointerCapture(evts.pointerId);
            thumb.onpointermove = onThumbMove;
            thumb.onpointerup = evts => {
                console.log("onpointerup", { evts });
                thumb.onpointermove = null;
                thumb.onpointerup = null;
                newBcrC = eltCopied.getBoundingClientRect();
                currentTempData.width = newBcrC.width;
                currentTempData.height = newBcrC.height;
                // FIX-ME: check somethingtosave
                // somethingToSave();
                onAnyCtrlChangeNode();
            }
        };

        // let n = 0;
        // jsmind-ednode-parts
        // console.log({ divEdnodeParts, divEdnodeCopied });
        function onThumbMove(evts) {
            // const target = evts.target;
            const evt = evts[0] || evts;
            const nowClientX = evt.clientX;
            const nowClientY = evt.clientY;
            const padd = paddingDivEdnodeCopied;
            if (thumb.style.position == "fixed") {
                debugger; // eslint-disable-line no-debugger
                thumb.style.left = nowClientX - thumbShiftX + 'px';
                thumb.style.top = nowClientY - thumbShiftY + 'px';
            } else if (thumb.style.position == "absolute") {
                // const bcrDiv = divCopied.getBoundingClientRect();
                const bcrJmnodes = jmnodesCopied.getBoundingClientRect();


                thumb.style.left = nowClientX - thumbShiftX - bcrJmnodes.left + padd + 'px';
                thumb.style.top = nowClientY - thumbShiftY - bcrJmnodes.top + padd + 'px';
            } else {
                debugger; // eslint-disable-line no-debugger
            }
            // const diffLeft = nowX - thumbStartX;
            // const diffTop = nowY - thumbStartY;
            // return;
            // const bcrC = eltCopied.getBoundingClientRect();

            // from setTimeout:
            //     thumb.style.left = bcrCd.right - bcrT.width / 2 - bcrJmnodes.left + "px";
            //     thumb.style.top = bcrCd.bottom - bcrT.height / 2 - bcrJmnodes.top + "px";

            const thumbClientLeft = nowClientX - thumbShiftX;
            const thumbClientTop = nowClientY - thumbShiftY;

            const bcrC2 = eltCopied.getBoundingClientRect();
            // const bcrT2 = thumb.getBoundingClientRect();
            // console.log("thumbTop, bcrCd.top", thumbClientTop, bcrCd.top, bcrC2, bcrT2);
            // FIX-ME: bcrCd.top != bcrC2.top ????? Chrome bug or just timing?

            // eltCopied.style.width = bcrC.width + diffLeft - padd + "px";
            //     thumb.style.left = bcrCd.right - bcrT.width / 2 - bcrJmnodes.left + "px";
            eltCopied.style.width = thumbClientLeft - bcrC2.left + padd + bcrT.width / 2 + "px";

            // eltCopied.style.height = bcrC.height + diffTop - padd + "px";
            //     thumb.style.top = bcrCd.bottom - bcrT.height / 2 - bcrJmnodes.top + "px";
            eltCopied.style.height = thumbClientTop - bcrC2.top + padd + bcrT.height / 2 + "px";

            // adjustDivCopiedHeight();
            debounceAdjustDivCopiedHeight();
        };

        thumb.onpointerdown = onThumbDown;
        thumb.ondragstart = () => false;



        // Getters and setters for dialog input values
        function setDialogShapeName(shapeName) {
            const inpShape = divShapes.querySelector(`input[name=shape][value=${shapeName}]`);
            if (inpShape) inpShape.checked = true;
        }



        /////////// Shadow


        /////////// Border

        // let initValSliBorderWidth;
        /*
        function getCtrlValBorderWidth(val) {
            // FIX-ME:
            const mdc = sliBorderWidth?.myMdc;
            return mdc?.getValue();
        }
        */

        function getCtrlValBorderStyle() {
            return divBorderStyle.querySelector("[name=borderstyle]:checked").value;
        }

        // function getCtrlValBorderColor() { return inpBorderColor.value; }


        /*
        function getCtrlValShadowBlur() {
            const mdc = sliShadowBlur?.myMdc;
            return mdc?.getValue();
        }
        */
        /*
        function onCtrlsChgShadow() {
            // const b = getCtrlValShadowBlur();
            const b = getFromShapeEtc("shadow.blur", currentShapeEtc) || 0;
            if (b <= 0) { eltCopied.style.filter = "none"; return; }
            const s = getFromShapeEtc("shadow.spread", currentShapeEtc) || 0;
            const x = getFromShapeEtc("shadow.offX", currentShapeEtc) || 0;
            const y = getFromShapeEtc("shadow.offY", currentShapeEtc) || 0;
            if (isNaN(b) || isNaN(x) || isNaN(y)) {
                console.error("Some shadow val is not set yet");
                return;
            }
            const c = getFromShapeEtc("shadow.color", currentShapeEtc) || "red";
            eltCopied.style.filter = `drop-shadow(${x}px ${y}px ${b}px ${s}px ${c})`;
        }
        */

        let btnSave;
        function getBtnSave() {
            if (btnSave) return btnSave;
            // const contBtns = body.querySelector(".mdc-dialog__actions");
            const contBtns = body.closest(".mdc-dialog__surface").querySelector(".mdc-dialog__actions");
            // FIX-ME: Should be the first?
            btnSave = contBtns.querySelector("button");
            if (btnSave.textContent != "save") throw Error("Did not find the save button");
            return btnSave;
        }
        function setStateBtnSave() {
            const btn = getBtnSave();
            if (!btn) return;
            btn.disabled = !somethingToSaveNode();
        }
        const debounceStateBtnSave = debounce(setStateBtnSave, 300);
        function requestSetStateBtnSave() { debounceStateBtnSave(); }
        requestSetStateBtnSave();

        const debounceUpdateCopiesSizes = debounce(updateCopiesSizes, 300);
        function requestUpdateCopiesSizes() { debounceUpdateCopiesSizes(); }

        if (scrollToNotes) {
            setTimeout(() => {
                if (!body.ownerDocument) {
                    debugger; // eslint-disable-line no-debugger
                    throw Error("body is not yet in document");
                }
                const divNotes = body.querySelector("div.EasyMDEContainer");
                console.log({ divNotes });
                if (!divNotes) {
                    debugger; // eslint-disable-line no-debugger
                    throw Error("Could not find notes");
                }
                const opt = { behavior: "smooth" };
                divNotes.scrollIntoView(opt);
            }, 200);
        }

        const save = await modMdc.mkMDCdialogConfirm(body, "save", "cancel");
        console.log({ save });
        if (save) {
            const saveFromButton = () => {
                if (!somethingToSaveNode()) throw Error("Save button enabled but nothing to save?");

                // FIX-ME: temp
                const currTemp = currentShapeEtc.temp;
                const initTemp = initialShapeEtc.temp;
                delete currentShapeEtc.temp;
                node_copied_data.shapeEtc = currentShapeEtc;

                const sameTopic = currTemp.topic == initTemp.topic;
                if (!sameTopic) {
                    this.THEjmDisplayed.update_node(node_ID_copied, currTemp.topic);
                }

                const sameW = currTemp.width == initTemp.width;
                const sameH = currTemp.height == initTemp.height;
                console.log({ currTemp, initTemp, sameW, sameH });
                if (!sameW || !sameH) {
                    this.THEjmDisplayed.set_node_background_image(node_ID_copied, undefined, currTemp.width, currTemp.height);
                }
                console.log({ currTemp });

                setTimeout(async () => {
                    console.log("setTimeout in save", { eltJmnode });
                    // FIX-ME: set size once again to trigger a reflow. (Bug in jsMind.)
                    this.THEjmDisplayed.set_node_background_image(node_ID_copied, undefined, currTemp.width, currTemp.height);
                    delete currTemp.width;
                    delete currTemp.height;
                    // await modJsEditCommon.fixJmnodeProblem(eltJmnode);
                    modJsEditCommon.applyNodeShapeEtc(node_copied, eltJmnode);
                    modMMhelpers.DBrequestSaveThisMindmap(this.THEjmDisplayed);

                    // FIX-ME: use lastElementChild instead???
                    // if (node_copied.data.fc4i) this.updateJmnodeFromCustom(eltJmnode);
                    /*
                    const eltLast = eltJmnode.lastElementChild;
                    if (!eltLast) return;
                    const strCustom = eltLast.dataset.jsmindCustom;
                    if (strCustom) {
                        this.updateJmnodeFromCustom(eltJmnode);
                        // } else {
                        // this.updateEltNodeLink(eltJmnode);
                    }
                    */
                }, 1100);


                const sameFgColor = currTemp.fgColor == initTemp.fgColor;
                const sameBgColor = currTemp.bgColor == initTemp.bgColor;
                if (!sameFgColor || !sameBgColor) {
                    this.THEjmDisplayed.set_node_color(node_ID_copied, currTemp.bgColor, currTemp.fgColor);
                }

            }
            saveFromButton();
        }
    }
    /*
    mindmapDblclick = (evt) => {
        const target = evt.target;
        let eltJmnode;
        let eltJmnodes;
        const tn = target.tagName;
        if (tn == "JMNODE") { eltJmnode = target; }
        eltJmnode = eltJmnode || target.closest("jmnode");
        if (eltJmnode) {
            this.editNodeDialog(eltJmnode);
            return;
        }
        if (tn == "JMNODES") { eltJmnodes = target; }
        eltJmnodes = eltJmnodes || target.closest("jmnodes");
        if (eltJmnodes) {
            this.editMindmapDialog(eltJmnode);
        }
    }
    */
}
// const cr4j = new CustomRenderer4jsMind();
// console.log({ cr4j });

export function addJmnodeBgAndText(eltJmnode) {
    console.warn("Add bg and text called");
    debugger; // eslint-disable-line no-debugger
    return;
    const eltTxt = mkElt("div", { class: "jmnode-text" });
    eltTxt.classList.add("multiline-ellipsis");
    const eltBg = mkElt("div", { class: "jmnode-bg" });
    eltJmnode.insertBefore(eltTxt, eltJmnode.firstElementChild);
    eltJmnode.insertBefore(eltBg, eltJmnode.firstElementChild);
    return { eltTxt, eltBg };
}



function getJsmindTheme(eltJmnodes) {
    checkTagName(eltJmnodes, "JMNODES");
    const themes = [...eltJmnodes.classList].filter(cls => cls.startsWith("theme-"));
    if (themes.length > 1) {
        const err = `Several JsMind themes: ${themes.join(" ")}`;
        throw Error(err);
    }
    return themes[0];
}
function setJsmindTheme(eltJmnodes, theme) {
    checkTagName(eltJmnodes, "JMNODES");
    const arrCls = [...eltJmnodes.classList];
    const strJsmindThemeStart = "theme-"
    arrCls.forEach(cls => {
        if (cls.startsWith(strJsmindThemeStart)) eltJmnodes.classList.remove(cls)
    });
    if (!theme) return;
    if (!theme.startsWith(strJsmindThemeStart)) Error(`${theme} is not a jsmind theme`);
    eltJmnodes.classList.add(theme);
}

function checkTagName(elt, expectName) {
    const tn = elt.nodeName;
    if (elt.nodeName !== expectName) {
        console.error(`Expected DOM elt ${expectName}, got ${tn}`, elt);
        throw Error(`Expected DOM elt ${expectName}, got ${tn}`);
    }
}

export async function getOurCustomRenderer() {
    theCustomRenderer = theCustomRenderer || await createOurCustomRenderer();
    return theCustomRenderer;
}
async function createOurCustomRenderer() {
    // console.warn("createOurCustomRenderer");
    theCustomRenderer = new CustomRenderer4jsMind();
    return theCustomRenderer;
}
export function setOurCustomRendererJm(jmDisplayed) {
    theCustomRenderer.setJm(jmDisplayed);
}
export function setOurCustomRendererJmOptions(jmOptions) {
    theCustomRenderer.setJmOptions(jmOptions);
}
/*
export async function ourCustomRendererAddProvider(providerRec) {
    const prov = new providerDetails(providerRec)
    const custRend = await getOurCustomRenderer();
    custRend.addProvider(prov);
}
*/
export function clearBgCssValue(elt) {
    const bgStyle = elt.style;
    for (const prop in bgStyle) {
        if (prop.startsWith("background")) {
            const val = bgStyle[prop];
            if ("string" == typeof val) {
                // "backgroundColor".replaceAll(/([A-Z])/g, "-$1").toLowerCase()
                const cssName = prop.replaceAll(/([A-Z])/g, "-$1").toLowerCase()
                bgStyle.removeProperty(cssName);
            }
        }
    }
}
function applyBgCssValue(elt, bgCssValues) {
    if (!((elt.classList.contains("jmnode-bg") || elt.classList.contains("jsmind-inner")))) {
        console.warn("Class 'jmnode-bg' missing on elt", { elt });
        throw Error("Class 'jmnode-bg' missing");
    }
    clearBgCssValue(elt);
    const bgStyle = elt.style;
    for (const prop in bgCssValues) {
        if (!prop.startsWith("background") && prop != "opacity")
            throw Error(`Bg property not background or opacity: ${prop}`);
        const val = bgCssValues[prop];
        // console.log("applyBgCssValue", prop, val);
        bgStyle[prop] = val;
    }
}
export function applyJmnodeBgCssText(jmnode, bgCssText) {
    const bgCssValues = cssTxt2keyVal(bgCssText);
    applyJmnodeBgCssValue(jmnode, bgCssValues);
}
function applyJmnodeBgCssValue(jmnode, bgCssValues) {
    const tn = jmnode.tagName;
    if (tn != "JMNODE") throw Error(`Not a <jmnode>: ${tn}`);
    const eltBg = jmnode.querySelector(".jmnode-bg");
    applyBgCssValue(eltBg, bgCssValues);
}

export function applyMindmapGlobals(eltJmnodes, mindmapGlobals) {
    setJsmindTheme(eltJmnodes, undefined);
    if (!mindmapGlobals) { return; }
    for (const prop in mindmapGlobals) {
        switch (prop) {
            case "themeCls":
                const themeCls = mindmapGlobals[prop];
                setJsmindTheme(eltJmnodes, themeCls);
                break;
            case "backgroundCss":
                const bgCssText = mindmapGlobals[prop];
                const bgCssValues = cssTxt2keyVal(bgCssText);
                applyBgCssValue(eltJmnodes.closest(".jsmind-inner"), bgCssValues);
                break;
            case "line_color":
            case "line_width":
                // Not handled here
                break;
            default:
                throw Error(`Unknown property in minmapGlobals: ${prop}`);
        }
    }
}


// https://stackoverflow.com/questions/9014804/javascript-validate-css
/**
 * 
 * @param {string} css 
 * @returns {string}
 */
function css_sanitize(css) {
    const iframe = document.createElement("iframe");
    // iframe.setAttribute("sandbox", "sandbox");
    iframe.style.display = "none";
    iframe.style.width = "10px"; //make small in case display:none fails
    iframe.style.height = "10px";
    document.body.appendChild(iframe);
    if (iframe.contentDocument == null) throw Error("iframe.contentDocument is null");
    const style = iframe.contentDocument.createElement('style');
    style.innerHTML = css;
    iframe.contentDocument.head.appendChild(style);
    if (style.sheet == null) throw Error("style.sheet is null");
    const result = Array.from(style.sheet.cssRules).map(rule => rule.cssText || '').join('\n');
    iframe.remove();
    return result;
}
function isValidCss(cssDecls) {
    const cssRaw = "#temp { " + cssDecls + " }";
    const cssClean = css_sanitize(cssRaw);
    if (cssClean.length < 14) return false;
    return true;
}
function isValidCssDecl(cssDecl) {
    // Only one line allowed
    cssDecl = cssDecl.trim();
    if (!cssDecl.endsWith(";")) return false;
    if (2 != cssDecl.split(";").length) return false;
    return isValidCss(cssDecl);
}

function cssTxt2keyVal(cssTxt) {
    // Return string on invalid CSS
    let taVal = cssTxt.trim();
    taVal = taVal.replaceAll(/\s+/g, " ");
    taVal = taVal.replaceAll(/\s+/g, " ");
    taVal = taVal.replaceAll(new RegExp("/\\*.*?\\*/", "g"), " ");
    taVal = taVal.replaceAll(/\s+/g, " ").trim();
    if (!taVal.endsWith(";")) taVal += ";";
    // console.log({ taVal });
    if (!isValidCss(taVal)) return "Invalid CSS";
    const parts = taVal.split(";").map(p => p.trim()).filter(p => p.length > 0);
    const cssKV = {};
    for (let i = 0, len = parts.length; i < len; i++) {
        const p = parts[i];
        // let [prop, val] = p.split(":");
        const idx = p.indexOf(":");
        if (idx == -1) return `Invalid css: ${p}`;
        const prop = p.slice(0, idx);
        const val = p.slice(idx + 1);
        const cssDecl = `${prop}: ${val};`;
        if (!isValidCssDecl(cssDecl)) return `Invalid css: ${cssDecl}`;
        cssKV[prop.trim()] = val.trim();
    }
    return cssKV;
}


createOurCustomRenderer();



forCoverage();
function forCoverage() {
    return;
    const r = new CustomRenderer4jsMind();
    console.log(r);
}