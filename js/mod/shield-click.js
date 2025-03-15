// https://codepen.io/zakkain/pen/AoWEYg?editors=1111
const eltPE = document.querySelector(".avoid-clicks");
function handleClick(_evt) {
    console.log("clicked eltPE");
}
addShieldClick(eltPE, handleClick);
export function addShieldClick(eltShield, handleClick) {
    let toPE;
    const msClick = 250;
    eltShield.addEventListener("pointerdown", evt => {
        evt.stopImmediatePropagation();
        console.log("eltShield down");
        const eltsHere = document.elementsFromPoint(evt.clientX, evt.clientY);
        let obj4Cloned = {};
        // console.log("length", Object.keys(evt).length);
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
        need.forEach(prop => {
            const val = evt[prop];
            if (val == undefined) {
                console.log(`${prop} is undefined`);
            } else {
                obj4Cloned[prop] = val;
                // console.log(prop, val);
            }
        });
        const clonedEvt = new PointerEvent(evt.type, obj4Cloned);
        toPE = setTimeout(() => {
            console.log("resend");
            document.body.addEventListener("pointerup", evt => {
                console.log("body up");
                eltShield.style.pointerEvents = "auto";
            }, { once: true });
            eltShield.style.pointerEvents = "none";
            eltsHere[1].dispatchEvent(clonedEvt);
        }, msClick);
    });
    eltShield.addEventListener("pointerup", evt => {
        evt.stopImmediatePropagation();
        console.log("eltShield up");
        clearTimeout(toPE);
    });
    eltShield.addEventListener("click", evt => {
        handleClick(evt);
    });
}