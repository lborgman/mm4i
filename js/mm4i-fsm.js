// @ts-check
const MM4I_FSM_VER = "0.0.3";
console.log(`here is mm4i-fsm.js, module,${MM4I_FSM_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

const importFc4i = window["importFc4i"];
const modJssm = await importFc4i("jssm");
// console.log({ modJssm });

export const fsmDeclaration = `
machine_name     : "mm4i <user@example.com>";
machine_license  : MIT;
machine_comment  : "mm4i pointer events";

start_states     : [Idle];
end_states       : [Idle];

flow: down;

// arrange [Green, Yellow];

Idle 'n_down' => n_Down;
n_Down 'up' => n_Click;
n_Click after 200 ms => Idle;
n_Click 'n_down' => n_Dblclick;
n_Dblclick after 1 ms => Idle;

Idle 'nr_down' => nr_Down;
nr_Down 'up' => nr_Click;
nr_Click after 200 ms => Idle;
nr_Click 'nr_down' => n_Dblclick;
nr_Down after 200 ms => c_Move;

n_Down after 200 ms => n_Move;
// n_Down 'move' => n_Move;
n_Move 'up' => Idle;


Idle 'c_down' => c_Down;
c_Down 'up' => c_Click;
c_Click after 200 ms => Idle;
c_Click 'c_down' => c_Dblclick;
c_Dblclick after 1 ms => Idle;
// c_Dblclick after 0 ms => Idle; // does not work
// c_Dblclick => Idle; // does not work
// c_Dblclick 'up' => Idle; // does not work because of popup

c_Down after 500 ms => c_Move;
c_Move 'up' => Idle;
// c_Down 'c_down' => c_Zoom;
c_Down 'start2' => c_Zoom;
// c_Zoom 'up' => Idle;
c_Zoom 'end2' => Idle;
Idle 'end2' => Idle;


// [Red Yellow Green] ~> Off;



// visual styling

state Idle    : { shape: octagon; background-color: lightgray; };

state n_Down     : { corners: rounded; background-color: wheat; };
state n_Move     : { corners: rounded; background-color: wheat; };
state n_Click    : { corners: rounded; background-color: wheat; };
state nr_Click    : { corners: rounded; background-color: wheat; };
state n_Dblclick : { corners: rounded; background-color: wheat; };

state c_Down     : { background-color: lightgray; };
state c_Move     : { background-color: lightgray; };
state c_Click    : { background-color: lightgray; };
state c_Dblclick : { background-color: lightgray; };
state c_Zoom       : { background-color: lightgray; };
`;


// https://github.com/oxc-project/oxc/issues/6476 (This is not oxc, but typescript)
// oxc, Property 'map' does not exist on type 'RegexpStringIterator<RegExpExecArray>'. ts(2339)
// fsmDeclaration.matchAll(/'([^']*?)'/g).map(m => m[1]);

// const arrEvents = [... new Set(fsmDeclaration.matchAll(/'([^']*?)'/g).map(m => m[1]))].sort();
const arrEvents = [... new Set(fsmDeclaration.matchAll(/'([^']*?)'/g))].map(m => m[1]).sort();
export function isEvent(str) { return arrEvents.includes(str); }
export function checkIsEvent(str) {
    if (!isEvent(str)) {
        const state = fsm.state();
        throw Error(`Unknown fsm event: ${str}, state: ${state}`);
    }
}

// const arrStates = [... new Set( fsmDeclaration.matchAll(/(?:=>|ms)\s+([^']*?);/g).map(m => m[1]) ) ].sort();
const arrStates = [... new Set(fsmDeclaration.matchAll(/=>\s+(\S+?)\s*;/g))].map(m => m[1]).sort();

export function isState(str) { return arrStates.includes(str); }
export function checkIsState(str) { if (!isState(str)) throw Error(`Unknown fsm state: ${str}`); }

export const fsm = modJssm.sm(fsmDeclaration.split("\\n"));

// export const hook_action = fsm.hook_action;
// export const hook_entry = fsm.hook_entry;
// let eventDownHandler;
// let eventUpHandler;
// export function setActionDownHandler(fun) { eventDownHandler = fun; }
// export function setActionUpHandler(fun) { eventUpHandler = fun; }

export function getPointerType(evt) {
    const pointerType = evt.pointerType;
    if (["mouse", "touch", "pen"].indexOf(pointerType) == -1) {
        const msg = `ERROR: Unknown pointerType: "${pointerType}"`;
        alert(msg);
        debugger; // eslint-disable-line no-debugger
    }
    return pointerType;
}

export async function setupFsmListeners(eltFsm) {
    const modZoom = await importFc4i("zoom");
    modZoom.pinchZoom(eltFsm);
    const zoomButtons = modZoom.mkZoomButtons(eltFsm, "horizontal");
    zoomButtons.id = "mm4i-zoom-buttons";
    document.body.appendChild(zoomButtons);

    const eltInner = eltFsm;
    if (!eltInner.classList.contains("jsmind-inner")) throw Error("not .jsmind-inner");
    if (eltInner.tagName !== "DIV") throw Error("not DIV");

    const eltContainer = eltInner.parentElement;
    if (eltContainer.id != "jsmind_container") throw Error("not #jsmind_container");


    // We need another layer to handle zoom/scroll:
    const eltZoomScroll = document.createElement("div");
    eltZoomScroll.classList.add("jsmind-zoom-scroll");
    eltZoomScroll.style = `
        position: relative;
        outline: 4px dotted black;
    `;
    eltInner.remove();
    eltZoomScroll.appendChild(eltInner);
    eltContainer.appendChild(eltZoomScroll);



    const eltJmnodes = eltInner.querySelector("jmnodes");
    const eltSvg = eltInner.querySelector("svg.jsmind");

    eltJmnodes.style.position = "static";
    eltSvg.style.position = "static";
    eltSvg.style.pointerEvents = "none";

    function adjustToSvgSize() {
        console.log({ eltContainer });
        const svgBox = eltSvg.getBBox();
        const W = svgBox.width;
        const H = svgBox.height;
        const x = svgBox.x;
        const y = svgBox.y;
        // eltSvg.setAttribute("width", W);
        // eltSvg.setAttribute("height", H);
        // eltSvg.setAttribute("x", x);
        // eltSvg.setAttribute("y", y);
        eltSvg.setAttribute("viewBox", `${x} ${y} ${W} ${H}`);

        eltSvg.style.width = `${W}px`;
        eltSvg.style.height = `${H}px`;
        eltJmnodes.style.width = `${W}px`;
        eltJmnodes.style.height = `${H}px`;
        // eltInner.style.width = `${svgW}px`;
        // eltInner.style.height = `${svgH}px`;
    }
    const testSizing = false; // confirm("adjustToSvgSize");
    if (testSizing) { setTimeout(adjustToSvgSize, 1000); }


    let addDebugEtc;
    addDebugEtc = true;
    addDebugEtc = false;
    // addDebugEtc = confirm("addDebugEtc");
    if (addDebugEtc) {
        // https://www.magicpattern.design/tools/css-backgrounds
        const applyCSS = (strCSS, toElement) => {
            const rows = strCSS.split(/;\s*(?:$|\n)/)
                .map(s => s.trim())
                .filter(s => !s.startsWith("NO"))
                .filter(s => s.length > 0)
                .map(s => s + ";");
            rows.forEach(row => {
                const reRow = /(\S+)\s*:\s*(.*?)\s*;/;
                const m = reRow.exec(row);
                if (!m) throw Error(`No match: ${row}`);
                const prop = m[1];
                const val = m[2];
                toElement.style[prop] = val;
            });
        }
        const applyPattern = (strCssPattern, toElement) => {
            toElement.backgroundColor = "";
            applyCSS(strCssPattern, toElement);
        }

        // back #e5e5f7
        let B = "#e5e5f7";
        // front #444cf7
        let F = "#444cf7";
        B = "transparent";

        F = "brown";
        const bgBoxes = `
background-color: ${B};
opacity: 0.8;
background-image:  linear-gradient(${F} 1px, transparent 1px), linear-gradient(to right, ${F} 1px, ${B} 1px);
background-size: 20px 20px;
        `;

        F = "green";
        F = "#145A32";
        F = "#784212";
        F = "#AF601A";
        F = "#B9770E";
        F = "#CA6F1E";
        const bgZigZag = `
background-color: ${B};
NOopacity: 0.8;
background-image:  linear-gradient(135deg, ${F} 25%, transparent 25%), linear-gradient(225deg, ${F} 25%, transparent 25%), linear-gradient(45deg, ${F} 25%, transparent 25%), linear-gradient(315deg, ${F} 25%, ${B} 25%);
background-position:  10px 0, 10px 0, 0 0, 0 0;
background-size: 60px 60px;
background-repeat: repeat;
outline: 4px dotted ${F};
        `;

        F = "darkseagreen";
        const bgDiagonal = `
background-color: ${B};
NOopacity: 0.8;
background: repeating-linear-gradient( 45deg, ${F}, ${F} 5px, ${B} 5px, ${B} 25px );
outline: 4px dashed ${F};
        `;

        F = "#4b0082"; // "indigo";
        const bgIsometric = `
background-color: ${B};
NOopacity: 0.8;
background-image:  linear-gradient(30deg, ${F} 12%, transparent 12.5%, transparent 87%, ${F} 87.5%, ${F}), linear-gradient(150deg, ${F} 12%, transparent 12.5%, transparent 87%, ${F} 87.5%, ${F}), linear-gradient(30deg, ${F} 12%, transparent 12.5%, transparent 87%, ${F} 87.5%, ${F}), linear-gradient(150deg, ${F} 12%, transparent 12.5%, transparent 87%, ${F} 87.5%, ${F}), linear-gradient(60deg, ${F}77 25%, transparent 25.5%, transparent 75%, ${F}77 75%, ${F}77), linear-gradient(60deg, ${F}77 25%, transparent 25.5%, transparent 75%, ${F}77 75%, ${F}77);
background-size: 20px 35px;
background-position: 0 0, 0 0, 10px 18px, 10px 18px, 0 0, 10px 18px;
outline: 4px double ${F};
        `;

        F = "red";
        const bgPolka = `
background-color: ${B};
opacity: 0.8;
background-image: radial-gradient(${F} 0.5px, ${B} 0.5px);
background-size: 10px 10px;
outline: 4px groove ${F};
        `;

        applyPattern(bgBoxes, document.body);
        applyPattern(bgDiagonal, eltContainer);
        applyPattern(bgIsometric, eltInner);
        applyPattern(bgPolka, eltJmnodes);
        applyPattern(bgZigZag, eltSvg);


        /*
        const bcr = eltJmnodes.getBoundingClientRect();
        eltInner.style.width = `${bcr.width}px`;
        eltInner.style.height = `${bcr.height}px`;
        */
        // eltInner.style.overflow = "hidden";
    }
    // return; // FIX-ME:


    eltFsm.addEventListener("touchstart", async evt => {
        const touches = evt.touches;
        const changedTouches = evt.changedTouches;
        const len = touches.length;
        if (len == 1) {
            console.log("eltFsm, touchstart", len, evt);
            return;
        }
        console.log("eltFsm, touchstart", len, evt, "touches:", touches, "changed:", changedTouches);
        actionWithErrorCheck("start2", evt);
        // const modZoom = await importFc4i("zoom");
        // console.log({ modZoom });
        // pinZoom = pinZoom || new modZoom.default(eltFsm);
        // pinZoom.enable();
    });
    eltFsm.addEventListener("touchend", evt => {
        // const touches = evt.touches;
        // const changedTouches = evt.changedTouches;
        // console.log("eltFsm, touchend", evt, "touches:", touches, "changed:", changedTouches);
        // pinZoom.disable();
        actionWithErrorCheck("end2", evt);
    });

    eltFsm.addEventListener("pointerdown", evt => {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        console.log("eltFsm, pointerdown", evt);
        const target = evt.target;
        if (!eltFsm.contains(target)) return;
        let actionWhere = "c";
        const eltJmnode = target.closest("jmnode");
        // if (eltJmnode && (!eltJmnode.classList.contains("root"))) { actionWhere = "n"; }
        if (eltJmnode) {
            actionWhere = "n";
            if (eltJmnode.classList.contains("root")) actionWhere = "nr";
        }
        // FIX-ME: mouse/pen or touch??
        const pointerType = getPointerType(evt);
        const action = `${actionWhere}_down`;
        actionWithErrorCheck(action, { eltJmnode, pointerType });
    });
    eltFsm.addEventListener("pointerup", evt => {
        console.log("eltFsm, pointerup", evt);
        const target = evt.target;
        if (!eltFsm.contains(target)) return;
        const action = "up";
        actionWithErrorCheck(action);
    });
    function actionWithErrorCheck(action, data) {
        checkIsEvent(action);
        const state = fsm.state();
        const res = fsm.action(action, data);
        if (!res) {
            const msg = `State: ${state}, fsm.action(${action}) returned ${res}`
            console.error(msg);
            // throw Error(msg);
        }
    }
}