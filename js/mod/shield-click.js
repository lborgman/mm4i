// @ts-check
const SHIELD_CLICK_VER = "0.0.1";
window["logConsoleHereIs"](`here is shield-click.js, module, ${SHIELD_CLICK_VER}`);
if (document.currentScript) { throw "shield-click.js is not loaded as module"; }


// https://codepen.io/zakkain/pen/AoWEYg?editors=1111
/*
const eltPE = document.querySelector(".avoid-clicks");
function handleClick(_evt) {
    console.log("clicked eltPE");
}
addShieldClick(eltPE, handleClick);
*/
const msClick = 250;
export function addShieldClick(eltShield, handleClick, getResendElt) {
    let toDown;
    let toCursor;
    function clonePointerEvent(evt, newTarget) {
        const need = [
            "bubbles", "cancelable", "composed",
            "pointerId", "pointerType", "isPrimary",
            "clientX", "clientY",
            "screenX", "screenY",
            "pageX", "pageY",
            "width", "height",
            "tiltX", "tiltY",
            "pressure",
            "tangentialPressure",
            "buttons",
            "twist"
        ];
        const obj4Cloned = {};
        need.forEach(prop => {
            const val = evt[prop];
            if (val == undefined) {
                console.log(`${prop} is undefined`);
            } else {
                obj4Cloned[prop] = val;
                // console.log(prop, val);
            }
        });
        if (newTarget) {
            need["target"] = newTarget;
        }
        const clonedEvt = new PointerEvent(evt.type, obj4Cloned);
        return clonedEvt;
    }

    let eltsHere;
    eltShield.addEventListener("pointerdown", evt => {
        evt.stopImmediatePropagation();
        console.log("eltShield down");
        eltsHere = document.elementsFromPoint(evt.clientX, evt.clientY);
        const clonedEvt = clonePointerEvent(evt);

        clearTimeout(toCursor);
        toDown = setTimeout(() => {
            console.log("resend pointerdown");
            const elt = getResendElt(eltsHere);
            if (elt) {
                eltShield.style.pointerEvents = "none";
                document.body.addEventListener("pointerup", evt => {
                    console.log("body up");
                    eltShield.style.pointerEvents = "auto";
                    clearTimeout(toDown);
                    const elt = getResendElt(eltsHere);
                    if (!elt) return;
                    const clonedEvt = clonePointerEvent(evt, elt);
                    elt.dispatchEvent(clonedEvt);
                }, { once: true });
                elt.dispatchEvent(clonedEvt);
                toCursor = setTimeout(() => {
                    const st = getComputedStyle(elt);
                    eltShield.style.cursor = st.cursor;
                }, 200);
            }
        }, msClick);
    });
    eltShield.addEventListener("click", evt => {
        handleClick(evt);
    });
}