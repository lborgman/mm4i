// https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/47355187#47355187
const color_convert = function () {
    var pub = {}, canvas, context;
    canvas = document.createElement('canvas');
    canvas.height = 1;
    canvas.width = 1;
    // willReadFreguently silence a console warning. 
    context = canvas.getContext('2d', { willReadFrequently: false });

    function byte_to_hex(byte) {
        // Turns a number (0-255) into a 2-character hex number (00-ff)
        return ('0' + byte.toString(16)).slice(-2);
    }

    pub.to_rgba_array = function (color) {
        /**
         * Turns any valid canvas fillStyle into a 4-element Uint8ClampedArray with bytes
         * for R, G, B, and A. Invalid styles will return [0, 0, 0, 0]. Examples:
         * color_convert.to_rgb_array('red')  # [255, 0, 0, 255]
         * color_convert.to_rgb_array('#ff0000')  # [255, 0, 0, 255]
         * color_convert.to_rgb_array('garbagey')  # [0, 0, 0, 0]
         */
        // Setting an invalid fillStyle leaves this unchanged
        context.fillStyle = 'rgba(-1,-1,-1,-1)';
        // We're reusing the canvas, so fill it with something predictable
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
        return context.getImageData(0, 0, 1, 1).data;
    }

    pub.to_rgba = function (color) {
        /**
         * Turns any valid canvas fill style into an rgba() string. Returns
         * 'rgba(0,0,0,0)' for invalid colors. Examples:
         * color_convert.to_rgba('red')  # 'rgba(255,0,0,1)'
         * color_convert.to_rgba('#f00')  # 'rgba(255,0,0,1)'
         * color_convert.to_rgba('garbagey')  # 'rgba(0,0,0,0)'
         * color_convert.to_rgba(some_pattern)  # Depends on the pattern
         *
         * @param color  A string, pattern, or gradient
         * @return  A valid rgba CSS color string
         */
        var a = pub.to_rgba_array(color);
        return 'rgba(' + a[0] + ',' + a[1] + ',' + a[2] + ',' + (a[3] / 255) + ')';
    }

    pub.to_hex = function (color) {
        /**
         * Turns any valid canvas fill style into a hex triple. Returns
         * '#000000' for invalid colors. Examples:
         * color_convert.to_hex('red')  # '#ff0000'
         * color_convert.to_hex('rgba(255,0,0,1)')  # '#ff0000'
         * color_convert.to_hex('garbagey')  # '#000000'
         * color_convert.to_hex(some_pattern)  # Depends on the pattern
         *
         * @param color  A string, pattern, or gradient
         * @return  A valid rgba CSS color string
         */
        var a = pub.to_rgba_array(color);
        // Sigh, you can't map() typed arrays
        var hex = [0, 1, 2].map(function (i) { return byte_to_hex(a[i]) }).join('');
        return '#' + hex;
    }

    return pub;
}();

export function toRgba(color) {
    const res = color_convert.to_rgba(color);
    if (res == "rgba(-1,-1,-1,-1)") throw Error(`Invalid color ${color}`);
    return res;
}
export function toRgbaArr(color) {
    const tofColor = typeof color;
    if (tofColor != "string") throw Error(`Expected "string", got "${tofColor}"`);
    const res = color_convert.to_rgba_array(color);
    if (res.join(",") == "-1,-1,-1,-1") throw Error(`Invalid color ${color}`);
    return res;
}
export function arrToRgba(arrColor) {
    const a = arrColor;
    return `rgba(${a[0]},${a[1]},${a[2]},${a[3] / 255})`;
}
export function toHex6(color) {
    const res = color_convert.to_hex(color);
    return res;
}

// https://stackoverflow.com/questions/47022484/in-js-find-the-color-as-if-it-had-0-5-opacity-on-a-white-background
export function computeMixed(frontColor, backColor) {
    const arrBackColor = color_convert.to_rgba_array(backColor);
    if (arrBackColor[3] != 255) {
        throw Error(`Background must be opaque: ${backColor}`);
    }
    const arrFrontColor = color_convert.to_rgba_array(frontColor);
    if (arrFrontColor[3] == 255) { return toRgba(frontColor); }

    const alphaFront = arrFrontColor[3] / 255;
    // newComponent = floor(oldComponent x alpha + backgroundComponent x (1 - alpha)) 
    const newComponent = (frontComp, backComp) => Math.floor(frontComp * alphaFront + backComp * (1 - alphaFront));
    const arrRes = [];
    [0, 1, 2].forEach(i => { arrRes[i] = newComponent(arrFrontColor[i], arrBackColor[i]) });
    return `rgb(${arrRes.join(",")})`;
}

export function getBackgroundColorAtPoint(x, y, eltTop = undefined) {
    const arrElts = document.elementsFromPoint(x, y);
    console.log({ arrElts });
    // Look for eltTop
    let arrOurElts = [...arrElts];
    if (eltTop) {
        for (let i = 0, len = arrElts.length; i < len; i++) {
            const elt = arrElts[i];
            if (elt == eltTop) {
                arrOurElts = arrElts.slice(i, len);
                break;
            }
        }
    }
    console.log({ arrOurElts });
    const arrColorFiltered = arrOurElts.map(elt => {
        const st = getComputedStyle(elt);
        const stOpacity = st.opacity;
        // if (stOpacity == 0) return;
        const backgroundColor = st.backgroundColor;
        const arrRgba = toRgbaArr(backgroundColor);
        const rgbaOpacity = arrRgba[3] / 255;
        // if (rgbaOpacity == 0) return;
        const opacity = stOpacity * rgbaOpacity;
        if (opacity == 0) return;
        const backgroundImage = st.backgroundImage;
        console.log({ stOpacity, rgbaOpacity, opacity, backgroundColor, arrRgba, backgroundImage });
        arrRgba[3] = 255 * opacity;
        const rgba = arrToRgba(arrRgba);
        // return rgba;
        return { rgba, elt };
    })
        .filter(val => val != undefined);
    console.log({ arrColorFiltered });
    let nonTransColor = arrColorFiltered.pop().rgba;
    console.log({ nonTransColor });
    let transColorObj = arrColorFiltered.pop();
    while (transColorObj) {
        console.log({ transColorObj });
        nonTransColor = computeMixed(transColorObj.rgba, nonTransColor);
        transColorObj = arrColorFiltered.pop();
    }
    console.log({ nonTransColor });
    return nonTransColor;
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
// function RGBToHex(rgb) { return standardizeColorTo6Hex(rgb); }

// https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/47355187#47355187
export function standardizeColorTo6Hex(strColor) {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) { throw Error("Could not get canvas 2d"); }
    ctx.fillStyle = strColor;
    return ctx.fillStyle;
}
// export function to6HexColor(color) { return standardizeColorTo6Hex(color); }


//////////////////////
// Accesibility color contrast

// https://codepen.io/davidhalford/pen/AbKBNr
// Named getxCorrectTextColor there
export function getBlackOrWhiteTextColor(bgColor) {
    return (isDark(bgColor))? "#ffffff": "#000000";
}
export function isDark(bgColor) {

    /*
        From this W3C document: http://www.w3.org/TR/AERT#color-contrast
    
        Color brightness is determined by the following formula: 
        ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
    */

    const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    const hex = standardizeColorTo6Hex(bgColor);
    const hRed = hexToR(hex);
    const hGreen = hexToG(hex);
    const hBlue = hexToB(hex);

    function hexToR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }
    function hexToG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }
    function hexToB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }
    function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }

    const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    return cBrightness < threshold;
    // if (cBrightness > threshold) { return "#000000"; } else { return "#ffffff"; }
}
