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
// https://issues.chromium.org/issues/401731818
export function standardizeColorTo6Hex(strColor) {
    // console.log(">>> standardizeColorTo6Hex IN", { strColor });
    const colorIn = strColor.trim().replaceAll(" ", "");
    // console.log("Input length:", strColor.length);
    // console.log("Input char codes:", [...strColor].map(c => String.fromCharCode(c.charCodeAt(0))));
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) { throw Error("Could not get canvas 2d"); }
    ctx.fillStyle = strColor;
    let colorOut = ctx.fillStyle
    if (ctx.fillStyle == "#000000") {
        switch (colorIn) {
            case "black":
            case "rgb(0,0,0)":
            case "#000000":
                break;
            default:
                const msg = `standardizeColorTo6Hex, bad color?: ${strColor} => ${ctx.fillStyle}`;
                console.error(msg);
                throw Error(msg);
        }
    }
    // console.log(">>> standardizeColorTo6Hex OUT", colorOut);
    return colorOut;
}
// export function to6HexColor(color) { return standardizeColorTo6Hex(color); }
// const st1 = standardizeColorTo6Hex("rbg(10, 10, 10)"); console.log({ st1 });

// Workaround for the issue above:
function rgbStringToHex(rgbStr) {
    const rgbRegex = /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i;
    const match = rgbStr.match(rgbRegex);
    if (!match) throw new Error("Invalid RGB format");

    const [, r, g, b] = match.map(Number);
    if ([r, g, b].some((value) => value < 0 || value > 255)) {
        throw new Error("RGB values must be between 0 and 255");
    }

    return `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

/**
 * 
 * @param {ObjectRGB} rgb 
 * @returns {string}
 */
function rgbToHEX(rgb) {
    const { r, g, b } = rgb;
    const hex = n => n.toString(16).padStart(2, "0");
    return `#${hex(r)}${hex(g)}${hex(b)}`;
}

// debugger;
// console.log("workaround test:", rgbStringToHex("rgb(140, 124, 111)")); // Outputs: "#8c7c6f"



//////////////////////
// Accesibility color contrast

// https://codepen.io/davidhalford/pen/AbKBNr
// Named getxCorrectTextColor there
export function getBlackOrWhiteTextColor(bgColor) {
    return (isDark(bgColor)) ? "#ffffff" : "#000000";
}

function getHexR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }
function getHexG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }
function getHexB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }
function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }

export function isDark(bgColor) {

    /*
        From this W3C document: http://www.w3.org/TR/AERT#color-contrast
    
        Color brightness is determined by the following formula: 
        ((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
    */

    const threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

    const hex = standardizeColorTo6Hex(bgColor);
    const hRed = getHexR(hex);
    const hGreen = getHexG(hex);
    const hBlue = getHexB(hex);

    const cBrightness = ((hRed * 299) + (hGreen * 587) + (hBlue * 114)) / 1000;
    return cBrightness < threshold;
    // if (cBrightness > threshold) { return "#000000"; } else { return "#ffffff"; }
}


export async function getDataForTextOnImage(srcImg) {
    // debugger;
    const img = document.createElement("img");
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const res = new Promise((resolve, _reject) => {

        img.onload = () => {
            // debugger;
            const imgWidth = img.width;
            const imgHeight = img.height;

            // Set canvas dimensions to hold a 3x3 grid of the image
            canvas.width = imgWidth * 3;
            canvas.height = imgHeight * 3;

            // Draw the image in a 3x3 grid
            for (let row = -1; row <= 1; row++) {
                for (let col = -1; col <= 1; col++) {
                    ctx.drawImage(img, col * imgWidth, row * imgHeight);
                }
            }

            // Apply blur and grayscale
            // ctx.filter = 'blur(20px) grayscale(1)';
            ctx.filter = 'blur(20px)';
            ctx.drawImage(canvas, 0, 0); // Redraw blurred image

            // Focus on the center image area
            const x = imgWidth; // Start at the actual image's top-left corner
            const y = imgHeight;
            const width = imgWidth;
            const height = imgHeight;
            const imageData = ctx.getImageData(x, y, width, height);
            const data = imageData.data;

            // Calculate average brightness
            let totalBrightness = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                totalBrightness += brightness;
            }
            const avgBrightness = totalBrightness / (data.length / 4);
            // avgBrightness < 128 ? 'white' : 'black';
            const isDark = avgBrightness < 128;
            console.log({ avgBrightness, isDark });
            // const brightness = parseFloat(avgBrightness.toFixed(1));
            const brightness = Math.round(avgBrightness);

            // debugger;
            const avgColorLAB = calculateAvgColorLab(imageData);
            // const avgColorXYZ = labToXyz(avgColorLAB.l, avgColorLAB.a, avgColorLAB.b);
            const avgColorXYZ = labToXyz(avgColorLAB);
            const avgColorRGB = xyzToRgb(avgColorXYZ);
            // rgbtohex
            // const avgRgbColor = `rbg(${avgColorRGB.join(",")})`;
            const avgRgbColor = `rgb(${avgColorRGB.r}, ${avgColorRGB.g}, ${avgColorRGB.b})`;
            const avgHexColor = standardizeColorTo6Hex(avgRgbColor);
            const contrastColorRGB = getContrastingColorLAB(avgHexColor);
            const contrastColor = rgbToHEX(contrastColorRGB);

            resolve({
                isDark, brightness,
                // avgColorLAB, avgColorXYZ, avgColorRGB, avgRgbColor,
                avgHexColor,
                contrastColor,
            });
        }
        img.src = srcImg;
    });
    return res;
}


/*** Color contrast using CIE-LAB */
// hexto
export function getContrastingColorLAB(strColor) {
    const hexColor = standardizeColorTo6Hex(strColor);
    const objRGB = hexToRGB(hexColor);

    // Step 1: Convert RGB to LAB
    const xyz = rgbToXyz(objRGB);
    const { l, a, b } = xyzToLab(xyz);

    // Step 2: Adjust Lightness for contrast
    const newL = l < 50 ? 85 : 15; // Make light colors dark, dark colors light

    // Step 3: Adjust Chromaticity for distinct contrast
    const newA = -a; // Invert chromaticity
    const newB = -b; // Invert chromaticity

    // (Optional): Amplify chromaticity for more vibrancy
    // const newA = a * 1.5;
    // const newB = b * 1.5;

    // Step 4: Convert back to RGB
    const newXyz = labToXyz({ l: newL, a: newA, b: newB });
    return xyzToRgb(newXyz);
}



// Example Usage:
const avgColor = "red"
const contrastingColor = getContrastingColorLAB(avgColor);
// console.log(`LAB-based contrasting color to rgb(${avgColor.join(",")}): rgb(${contrastingColor.join(",")})`);
console.log(`LAB-based contrasting color to ${avgColor}): rgb(${contrastingColor})`);
// const rgb1 = `rgb(${avgColor.join(",")})`;
const rgb1 = JSON.stringify(avgColor);
// const rgb2 = `rgb(${contrastingColor.join(",")})`;
const rgb2 = JSON.stringify(contrastingColor);
console.log(`LAB-based contrasting color to %c${rgb1}%c: %c${rgb2}`, `background:${rgb1}`, "", `background:${rgb2}`);



function hexToRGB(strHex) {
    const r = getHexR(strHex);
    const g = getHexG(strHex);
    const b = getHexB(strHex);
    return { r, g, b };
}

// Convert sRGB to XYZ (helper functions)
/**
 * 
 * @param {ObjectRGB} rgb 
 * @returns {ObjectXYZ} 
 */
function rgbToXyz(rgb) {
    const { r, g, b } = rgb;
    const linearize = (value) => {
        value /= 255;
        return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const rL = linearize(r);
    const gL = linearize(g);
    const bL = linearize(b);

    const x = rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375;
    const y = rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750;
    const z = rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041;

    return { x, y, z };
}

// Convert XYZ to LAB
/**
 * 
 * @param {ObjectXYZ} xyz
 * @returns {ObjectLAB}
 */
function xyzToLab(xyz) {
    const { x, y, z } = xyz
    const refX = 0.95047; // Reference white D65
    const refY = 1.00000;
    const refZ = 1.08883;

    const xr = x / refX;
    const yr = y / refY;
    const zr = z / refZ;

    const f = (value) => (value > 0.008856 ? Math.pow(value, 1 / 3) : (7.787 * value) + (16 / 116));

    return {
        l: (116 * f(yr)) - 16,
        a: 500 * (f(xr) - f(yr)),
        b: 200 * (f(yr) - f(zr)),
    };
}

/**
 * @typedef {Object} ObjectLAB
 * @property {number} l
 * @property {number} a
 * @property {number} b
*/

/**
 * @typedef {Object} ObjectXYZ
 * @property {number} x
 * @property {number} y
 * @property {number} z
*/

/**
 * @typedef {Object} ObjectRGB
 * @property {number} r
 * @property {number} g
 * @property {number} b
*/

// Convert LAB back to XYZ
/**
 * 
 * @param {ObjectLAB} objLab 
 * @returns {ObjectXYZ}
 */
function labToXyz(objLab) {
    assertObject(objLab);
    const { l, a, b } = objLab;
    const refX = 0.95047;
    const refY = 1.00000;
    const refZ = 1.08883;

    const fy = (l + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const x = refX * (fx > 0.206893 ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787);
    const y = refY * (fy > 0.206893 ? Math.pow(fy, 3) : (fy - 16 / 116) / 7.787);
    const z = refZ * (fz > 0.206893 ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787);

    return { x, y, z };
}

// Convert XYZ back to RGB
/**
 * 
 * @param {ObjectXYZ} objXyz 
 * @returns {ObjectRGB}
 */
function xyzToRgb(objXyz) {
    const { x, y, z } = objXyz;
    const rRaw = x * 3.2404542 - y * 1.5371385 - z * 0.4985314;
    const gRaw = -x * 0.9692660 + y * 1.8760108 + z * 0.0415560;
    const bRaw = x * 0.0556434 - y * 0.2040259 + z * 1.0572252;

    const delinearize = (value) => {
        return value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    };

    /*
    return [
        Math.round(Math.max(0, Math.min(1, delinearize(r))) * 255),
        Math.round(Math.max(0, Math.min(1, delinearize(g))) * 255),
        Math.round(Math.max(0, Math.min(1, delinearize(b))) * 255),
    ];
    */
    const r = Math.round(Math.max(0, Math.min(1, delinearize(rRaw))) * 255);
    const g = Math.round(Math.max(0, Math.min(1, delinearize(gRaw))) * 255);
    const b = Math.round(Math.max(0, Math.min(1, delinearize(bRaw))) * 255);
    return { r, g, b }
}

// Calculate contrasting color in LAB

// Example Usage
// const avgColor = [100, 150, 200]; // Replace with your calculated avgColor
// const contrastingColor = getContrastingColorLAB(avgColor);
// console.log(`LAB-based contrasting color: rgb(${contrastingColor.join(",")})`);





export function calculateAvgColorLab(imageData) {
    const data = imageData.data;
    let totalL = 0, totalA = 0, totalB = 0;

    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        const { x, y, z } = rgbToXyz({ r: data[i], g: data[i + 1], b: data[i + 2] });
        const { l, a, b } = xyzToLab({ x, y, z });

        totalL += l;
        totalA += a;
        totalB += b;
    }

    // Average the LAB values
    const avgL = totalL / totalPixels;
    const avgA = totalA / totalPixels;
    const avgB = totalB / totalPixels;

    return { l: avgL, a: avgA, b: avgB };
}

// Example Usage:
// const avgLabColor = calculateAvgColorLab(imageData);
// console.log(`Average LAB color: L=${avgLabColor.l}, a=${avgLabColor.a}, b=${avgLabColor.b}`);


function assertNumber(n) { if (Number.isNaN(n)) { throw Error(`Not a number: ${n}`); } }
function assertObject(obj) {
    const tofObj = typeof obj;
    if (tofObj != "object") { throw Error(`Not an object: ${tofObj}`); }
}