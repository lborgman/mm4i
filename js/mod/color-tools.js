// @ts-check
const COLOR_TOOLS_VER = "0.0.7";
if (window["logConsoleHereIs"]) window["logConsoleHereIs"](`here is color-tools.js, module, ${COLOR_TOOLS_VER}`);
if (document.currentScript) { throw "color-tools.js is not loaded as module"; }

// const mkElt = window["mkElt"];
// const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];
// const importFc4i = window["importFc4i"];


/**
 * @typedef {Object} ObjectCEILab
 * @property {number} L
 * @property {number} a
 * @property {number} b
*/

/**
 * @typedef {Object} ObjectXYZ
 * @property {number} X
 * @property {number} Y
 * @property {number} Z
*/

/**
 * @typedef {Object} ObjectRGB
 * @property {number} R
 * @property {number} G
 * @property {number} B
*/

/**
 * @typedef {Object} ObjectRGBA
 * @property {number} R
 * @property {number} G
 * @property {number} B
 * @property {number} A
*/



// https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/47355187#47355187
const color_convert = function () {
    console.warn("color_convert");
    // debugger;
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

function toRgba(color) {
    // debugger;
    const res = color_convert.to_rgba(color);
    if (res == "rgba(-1,-1,-1,-1)") throw Error(`Invalid color ${color}`);
    return res;
}
function toRgbaArr(color) {
    // debugger;
    const tofColor = typeof color;
    if (tofColor != "string") throw Error(`Expected "string", got "${tofColor}"`);
    const res = color_convert.to_rgba_array(color);
    if (res.join(",") == "-1,-1,-1,-1") throw Error(`Invalid color ${color}`);
    return res;
}
function arrToRgba(arrColor) {
    // debugger;
    const a = arrColor;
    return `rgba(${a[0]},${a[1]},${a[2]},${a[3] / 255})`;
}
function OLDtoHex6(color) {
    const res = color_convert.to_hex(color);
    return res;
}


// https://stackoverflow.com/questions/47022484/in-js-find-the-color-as-if-it-had-0-5-opacity-on-a-white-background
export function computeMixed(frontColor, backColor) {
    console.warn("computeMixed", frontColor, backColor);
    const objFrontRGBA = computeStyleColorToRGBA(frontColor);
    const objBackRGBA = computeStyleColorToRGBA(backColor);
    console.log({ objFrontRGBA, objBackRGBA });

    if (objBackRGBA.A != 255) {
        throw Error(`Background must be opaque: ${backColor}`);
    }
    if (objFrontRGBA.A == 255) { return objFrontRGBA; }
    const alfaFront = objFrontRGBA.A / 255;
    const newComponentF = (frontComp, backComp) => Math.floor(frontComp * alfaFront + backComp * (1 - alfaFront));
    const objRes = {};
    "RGB".split("").forEach(i => { objRes[i] = newComponentF(objFrontRGBA[i], objBackRGBA[i]) });
    const strRgb = RGB2rgb(objRes);
    console.log({ objRes, strRgb });
    // debugger;

    const arrBackColor = color_convert.to_rgba_array(backColor);
    if (arrBackColor[3] != 255) {
        throw Error(`Background must be opaque: ${backColor}`);
    }
    const arrFrontColor = color_convert.to_rgba_array(frontColor);
    if (arrFrontColor[3] == 255) { return toRgba(frontColor); }

    const alphaFront = arrFrontColor[3] / 255;
    const newComponent = (frontComp, backComp) => Math.floor(frontComp * alphaFront + backComp * (1 - alphaFront));
    const arrRes = [];
    [0, 1, 2].forEach(i => { arrRes[i] = newComponent(arrFrontColor[i], arrBackColor[i]) });
    const res = `rgb(${arrRes.join(",")})`;
    console.log(res);
    debugger;
    return res;
}

/**
 * Colors returned from getComputedStyle can have 3 different formats
 * according to Gemini AI.
 * 
 * @param {string} strColor 
 * @return {ObjectRGBA}
 */
export function computeStyleColorToRGBA(strColor) {
    if (strColor == "transparent") {
        return { R: 0, G: 0, B: 0, A: 0 }
    }
    if (strColor.startsWith("rgb(")) {
        const v = strColor.slice(4, -1).split(",").map(Number);
        return { R: v[0], G: v[1], B: v[2], A: 1 }
    }
    if (strColor.startsWith("rgba(")) {
        const v = strColor.slice(5, -1).split(",").map(Number);
        return { R: v[0], G: v[1], B: v[2], A: v[3] }
    }
    throw Error(`Unexpected color from getComputedStyle: "${strColor}"`);
}
export function getBackgroundColorAtPoint(x, y, eltTop = undefined) {
    const arrElts = document.elementsFromPoint(x, y);
    // console.log({ arrElts });
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
    // console.log({ arrOurElts });
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
        // const backgroundImage = st.backgroundImage;
        // console.log({ stOpacity, rgbaOpacity, opacity, backgroundColor, arrRgba, backgroundImage });
        arrRgba[3] = 255 * opacity;
        const rgba = arrToRgba(arrRgba);
        // return rgba;
        return { rgba, elt };
    })
        .filter(val => val != undefined);
    // console.log({ arrColorFiltered });
    let nonTransColor = arrColorFiltered.pop().rgba;
    // console.log({ nonTransColor });
    let transColorObj = arrColorFiltered.pop();
    while (transColorObj) {
        console.log({ transColorObj });
        nonTransColor = computeMixed(transColorObj.rgba, nonTransColor);
        transColorObj = arrColorFiltered.pop();
    }
    // console.log({ nonTransColor });
    return nonTransColor;
}

// https://css-tricks.com/converting-color-spaces-in-javascript/
// function RGBToHex(rgb) { return standardizeColorTo6Hex(rgb); }


// https://stackoverflow.com/questions/1573053/javascript-function-to-convert-color-names-to-hex-codes/47355187#47355187
// https://issues.chromium.org/issues/401731818
export function standardizeColorTo6Hex(strColor) {
    const colorIn = strColor.replaceAll(" ", "");
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) { throw Error("Could not get canvas 2d"); }
    ctx.fillStyle = strColor;
    let colorOut = ctx.fillStyle
    if (ctx.fillStyle == "#000000") {
        switch (colorIn) {
            case "black":
            case "rgb(0,0,0)":
            case "hsl(0deg,0%,0%)":
            case "#000000":
            case "#000":
                break;
            default:
                const msg = `standardizeColorTo6Hex, bad color?: ${strColor} => ${ctx.fillStyle}`;
                console.error(msg);
            // throw Error(msg); // FIX-ME:
        }
    }
    if (!colorOut.startsWith("#")) {
        if (colorOut.startsWith("rgba")) {
            const msg = `Colors with transparency converted to rgba: ${strColor} -> ${colorOut}`;
            console.error(msg);
            // throw Error(msg); // FIX-ME:
        }
    }
    return colorOut;
}

/*
// no longer needed
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
*/

/**
 * 
 * @param {ObjectRGB} objRGB 
 * @returns {string}
 */
function RGBtoHEX6(objRGB) {
    assertObjectColor(objRGB);
    const { R, G, B } = objRGB;
    const hex = n => n.toString(16).padStart(2, "0");
    return `#${hex(R)}${hex(G)}${hex(B)}`;
}
function RGB2rgb(objRGB) {
    assertObjectColor(objRGB);
    const { R, G, B } = objRGB;
    return `rgb(${R},${G},${B})`;
}

function RGBAtoHEX8(objRGBA) {
    assertObjectColor(objRGBA);
    const { R, G, B, A } = objRGBA;
    const hex = n => n.toString(16).padStart(2, "0");
    return `#${hex(R)}${hex(G)}${hex(B)}${hex(A)}`;
}
function RGBA2rgba(objRGBA) {
    assertObjectColor(objRGBA);
    const { R, G, B, A } = objRGBA;
    return `rgba(${R},${G},${B},${A})`;
}

// debugger; // eslint-disable-line no-debugger
// console.log("workaround test:", rgbStringToHex("rgb(140, 124, 111)")); // Outputs: "#8c7c6f"



//////////////////////
// Accesibility color contrast

// https://codepen.io/davidhalford/pen/AbKBNr
// Named getxCorrectTextColor there
export function getBlackOrWhiteTextColor(bgColor) {
    return (isDarkBG(bgColor)) ? "#ffffff" : "#000000";
}

function getHexR(h) { return parseInt((cutHex(h)).substring(0, 2), 16) }
function getHexG(h) { return parseInt((cutHex(h)).substring(2, 4), 16) }
function getHexB(h) { return parseInt((cutHex(h)).substring(4, 6), 16) }
function cutHex(h) { return (h.charAt(0) == "#") ? h.substring(1, 7) : h }

export function isDarkBG(bgColor) {

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
    // debugger; // eslint-disable-line no-debugger
    const img = document.createElement("img");
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const res = new Promise((resolve, reject) => {

        img.onload = () => {
            // debugger; // eslint-disable-line no-debugger
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
            const isDarkBG = avgBrightness < 128;
            console.log({ avgBrightness, isDarkBG });
            // const brightness = parseFloat(avgBrightness.toFixed(1));
            const brightness = Math.round(avgBrightness);

            // debugger; // eslint-disable-line no-debugger
            const avgColorLAB = calculateAvgColorCEILab(imageData);
            // const avgColorXYZ = labToXyz(avgColorLAB.l, avgColorLAB.a, avgColorLAB.b);
            const avgColorXYZ = CEILabToXYZ(avgColorLAB);
            const avgColorRGB = XYZtoRGB(avgColorXYZ);
            // rgbtohex
            // const avgRgbColor = `rbg(${avgColorRGB.join(",")})`;
            const avgRgbColor = `rgb(${avgColorRGB.R}, ${avgColorRGB.G}, ${avgColorRGB.B})`;
            const avgHexColor = standardizeColorTo6Hex(avgRgbColor);
            const contrastColorRGB = getCEILabContrastingRGB(avgHexColor);
            const contrastColor = RGBtoHEX6(contrastColorRGB);
            // const coloredContrast = contrastRatio(avgColorRGB, contrastColorRGB).toFixed(1);
            const coloredContrast = contrastDeltaERgb(avgColorRGB, contrastColorRGB).toFixed(1);
            console.log({ coloredContrast });
            // debugger; // eslint-disable-line no-debugger

            // const whiteContrast = contrastRatio(avgColorRGB, { R: 255, G: 255, B: 255 }).toFixed(1);
            const whiteContrast = contrastDeltaERgb(avgColorRGB, { R: 255, G: 255, B: 255 }).toFixed(1);
            // const blackContrast = contrastRatio(avgColorRGB, { R: 0, G: 0, B: 0 }).toFixed(1);
            const blackContrast = contrastDeltaERgb(avgColorRGB, { R: 0, G: 0, B: 0 }).toFixed(1);

            resolve({
                isDarkBG, brightness,
                // avgColorLAB, avgColorXYZ, avgColorRGB, avgRgbColor,
                avgHexColor,
                contrastColor,
                coloredContrast,
                whiteContrast,
                blackContrast,
            });
        }
        img.addEventListener("error", (evt) => {
            console.error("Could not load", { srcImg, evt });
            reject("Could not load srcImg");
        });
        if (typeof srcImg == "string") {
            img.src = srcImg;
        } else {
            if (!(srcImg instanceof Blob)) throw Error("Expected image blob");
            const objecturl = URL.createObjectURL(srcImg)
            img.src = objecturl;
        }
    });
    return res;
}


/*** Color contrast using CIE-LAB */
let logClrCnvTest = false;
const stLogClrCnv = "font-size:18px; background:yellow; color:red; padding:1px 3px;";
function startLogClrCnvTest(hexColor) {
    if (!hexColor.startsWith("#")) throw Error(`Not a hex format color: "${hexColor}`);
    logClrCnvTest = true;
    consoleLogRedTest(`>>> Start color conversion test%c ${hexColor} `, `background:${hexColor}; font-size:20px; padding:4px;`, hexColor);
}
function stopLogClrCnvTest() {
    consoleLogRedTest(`<<< Stop color conversion test`);
    logClrCnvTest = false;
}
function consoleLogRedTest(...args) {
    if (!logClrCnvTest) return;
    const styledArg = `%c${args[0]}`;
    console.log(styledArg, stLogClrCnv, ...args.slice(1));
}

export function getCEILabContrastingRGB(strColor) {
    const hexColor = standardizeColorTo6Hex(strColor);
    const objRGBin = hexToRGB(hexColor);

    // Step 1: Convert RGB to LAB
    const objXYZin = RGBtoXYZ(objRGBin);
    const objCEILabIn = XYZtoCEILab(objXYZin);
    const { L, a, b } = objCEILabIn;

    // Step 2: Adjust Lightness for contrast
    const newL = L < 50 ? 85 : 15; // Make light colors dark, dark colors light

    // Step 3: Adjust Chromaticity for distinct contrast
    let newA = -a; // Invert chromaticity
    let newB = -b; // Invert chromaticity
    newA = a; // Don't invert chromaticity
    newB = b; // Don't invert chromaticity

    // (Optional): Amplify chromaticity for more vibrancy
    // newA = a * 1.5;
    // newB = b * 1.5;

    // Step 4: Convert back to RGB
    const objXYZout = CEILabToXYZ({ L: newL, a: newA, b: newB });
    // return XYZtoRGB(objXYZout);
    const objRGBout = XYZtoRGB(objXYZout);

    const oldLogRedTest = logClrCnvTest;
    if (isBlackOrWhite(hexColor)) logClrCnvTest = false;
    if (logClrCnvTest) {
        console.log("%cgetCEILabContrastingRGB", stLogClrCnv,
            { strColor, objRGBin, objXYZin, objCEILabIn, objXYZout, objRGBout });
    }
    logClrCnvTest = oldLogRedTest;

    return objRGBout
}
export function getCEILabContrastingHEX(strColor) {
    const objRGB = getCEILabContrastingRGB(strColor);
    return RGBtoHEX6(objRGB);
}




// Example Usage:
// const strColor = "red";
// const hexIn = standardizeColorTo6Hex(strColor);
// const rgbRed = hexToRGB(hexIn);
// const contrastingRedRGB = getCEILabContrastingRGB(strColor);
// const hexOut = RGBtoHEX(contrastingRedRGB);
// const ctColor = contrastRatio(rgbRed, contrastingRedRGB)

startLogClrCnvTest("#38483a");
// contrastTest("#38483a");
stopLogClrCnvTest();

function contrastTest(hexTest) {
    const rgbTest = hexToRGB(hexTest);

    const hexBlack = "#000000";
    const rgbBlack = hexToRGB(hexBlack);
    const ctBlack = contrastRatio(rgbTest, rgbBlack);
    const ctceilabBlack = contrastDeltaERgb(rgbTest, rgbBlack);

    const hexWhite = "#ffffff";
    const rgbWhite = hexToRGB(hexWhite);
    const ctWhite = contrastRatio(rgbTest, rgbWhite);
    const ctceilabWhite = contrastDeltaERgb(rgbTest, rgbWhite);

    // CEILab contrasting
    const hexContrasting = getCEILabContrastingHEX(hexTest);
    const rgbContrasting = hexToRGB(hexContrasting);
    const ctContrasting = contrastRatio(rgbTest, rgbContrasting);
    const ctceilabContrasting = contrastDeltaERgb(rgbTest, rgbContrasting)

    const objContrasts =
    {
        ctBlack, ctceilabBlack,
        ctWhite, ctceilabWhite,
        hexContrasting,
        ctContrasting, ctceilabContrasting,
    };

    consoleLogRedTest(
        `Contrast checks`,
        "before",
        objContrasts,
        "after",
    );
}



function hexToRGB(strHex) {
    const R = getHexR(strHex);
    const G = getHexG(strHex);
    const B = getHexB(strHex);
    return { R, G, B };
}

// Convert sRGB to XYZ (helper functions)
/**
 * 
 * @param {ObjectRGB} objRGB 
 * @returns {ObjectXYZ} 
 */
function RGBtoXYZ(objRGB) {
    assertObjectColor(objRGB);
    const { R, G, B } = objRGB;

    // Removes gamma encoding, independent of illumination (like D65)
    const linearize = (xNorm) => {
        const myLin = xNorm <= 0.04045 ? xNorm / 12.92 : Math.pow((xNorm + 0.055) / 1.055, 2.4);
        let xLinear;
        if (xNorm <= 0.04045) {
            xLinear = xNorm / 12.92;
        } else {
            xLinear = Math.pow((xNorm + 0.055) / 1.055, 2.4);
        }
        if (myLin != xLinear) debugger; // eslint-disable-line no-debugger
        return xLinear;
    };

    // const rNorm = R / 255;
    const rNorm = 0.2196;

    // const gNorm = G / 255;
    const gNorm = 0.2824;

    // const bNorm = B / 255;
    const bNorm = 0.2275;

    const rL = linearize(rNorm);
    const gL = linearize(gNorm);
    const bL = linearize(bNorm);

    // Assumes D65
    const X = rL * 0.4124564 + gL * 0.3575761 + bL * 0.1804375;
    const Y = rL * 0.2126729 + gL * 0.7151522 + bL * 0.0721750;
    const Z = rL * 0.0193339 + gL * 0.1191920 + bL * 0.9503041;
    const objXYZ = { X, Y, Z };

    const oldLogRedTest = logClrCnvTest;
    if (isBlackOrWhite(objRGB)) logClrCnvTest = false;
    if (logClrCnvTest) { console.log("%cRGBtoXYZ", stLogClrCnv, { R, rL, G, gL, B, bL, objXYZ }); }
    logClrCnvTest = oldLogRedTest;

    return objXYZ
}

// Convert XYZ to LAB
/**
 * 
 * @param {ObjectXYZ} objXYZ
 * @returns {ObjectCEILab}
 */
function XYZtoCEILab(objXYZ) {
    const { X, Y, Z } = objXYZ

    // This step assumes D65
    // Called "normalize XYZ" and should be used when converting to LAB
    const refX = 0.95047;
    const refY = 1.00000;
    const refZ = 1.08883;
    const xr = X / refX;
    const yr = Y / refY;
    const zr = Z / refZ;


    const f = (value) => (value > 0.008856 ? Math.pow(value, 1 / 3) : (7.787 * value) + (16 / 116));

    const fxr = f(xr);
    const fyr = f(yr);
    const fzr = f(zr);

    // Names L, a, b are used by CEILAB
    const L = (116 * fyr) - 16;
    const a = 500 * (fxr - fyr);
    const b = 200 * (fyr - fzr);
    const objLab = { L, a, b }

    // const oldLogRedTest = logRedTest;
    // if (isBlackOrWhite(hexColor)) logRedTest = false;
    if (logClrCnvTest) {
        const objRGB = XYZtoRGB(objXYZ);
        const oldLogRedTest = logClrCnvTest;
        if (isBlackOrWhite(objRGB)) logClrCnvTest = false;
        if (logClrCnvTest) {
            console.log("%cXYZtoCEILab", stLogClrCnv, { X, xr, fxr, Y, yr, fyr, Z, zr, fzr, objLab });
        }
        logClrCnvTest = oldLogRedTest;

    }
    return objLab;
}


// Convert LAB back to XYZ
/**
 * 
 * @param {ObjectCEILab} objLab 
 * @returns {ObjectXYZ}
 */
function CEILabToXYZ(objLab) {
    assertObjectColor(objLab);
    const { L, a, b } = objLab;
    const refX = 0.95047;
    const refY = 1.00000;
    const refZ = 1.08883;

    const fy = (L + 16) / 116;
    const fx = a / 500 + fy;
    const fz = fy - b / 200;

    const X = refX * (fx > 0.206893 ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787);
    const Y = refY * (fy > 0.206893 ? Math.pow(fy, 3) : (fy - 16 / 116) / 7.787);
    const Z = refZ * (fz > 0.206893 ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787);

    return { X, Y, Z };
}

// Convert XYZ back to RGB
/**
 * 
 * @param {ObjectXYZ} objXYZ 
 * @returns {ObjectRGB}
 */
function XYZtoRGB(objXYZ) {
    assertObjectColor(objXYZ);
    const { X, Y, Z } = objXYZ;
    const rRaw = X * 3.2404542 - Y * 1.5371385 - Z * 0.4985314;
    const gRaw = -X * 0.9692660 + Y * 1.8760108 + Z * 0.0415560;
    const bRaw = X * 0.0556434 - Y * 0.2040259 + Z * 1.0572252;

    const delinearize = (value) => {
        return value <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(value, 1 / 2.4) - 0.055;
    };

    const rLin = delinearize(rRaw);
    const gLin = delinearize(gRaw);
    const bLin = delinearize(bRaw);

    const rClamped = Math.max(0, Math.min(1, rLin));
    const gClamped = Math.max(0, Math.min(1, gLin));
    const bClamped = Math.max(0, Math.min(1, bLin));

    const R = Math.round(rClamped * 255);
    const G = Math.round(gClamped * 255);
    const B = Math.round(bClamped * 255);

    return { R, G, B }
}

// Calculate contrasting color in LAB

// Example Usage
// const avgColor = [100, 150, 200]; // Replace with your calculated avgColor
// const contrastingColor = getContrastingColorLAB(avgColor);
// console.log(`LAB-based contrasting color: rgb(${contrastingColor.join(",")})`);





export function calculateAvgColorCEILab(imageData) {
    const data = imageData.data;
    let totalL = 0, totalA = 0, totalB = 0;

    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
        // const { x, y, z } = RGBtoXYZ({ R: data[i], G: data[i + 1], B: data[i + 2] });
        const objXYZ = RGBtoXYZ({ R: data[i], G: data[i + 1], B: data[i + 2] });
        const { L, a, b } = XYZtoCEILab(objXYZ);

        totalL += L;
        totalA += a;
        totalB += b;
    }

    // Average the LAB values
    const avgL = totalL / totalPixels;
    const avgA = totalA / totalPixels;
    const avgB = totalB / totalPixels;

    return { L: avgL, a: avgA, b: avgB };
}

// Example Usage:
// const avgLabColor = calculateAvgColorLab(imageData);
// console.log(`Average LAB color: L=${avgLabColor.l}, a=${avgLabColor.a}, b=${avgLabColor.b}`);

/*
  From Microsoft Copilot
  Here's a simple JavaScript function to calculate the contrast ratio between two colors.
  The function takes two colors in RGB format and computes their
  contrast ratio according to the WCAG (Web Content Accessibility Guidelines):
*/
export function getLuminance(objRGB) {
    assertObjectColor(objRGB);
    const { R, G, B } = objRGB;
    let channel = [R, G, B].map(value => {
        value /= 255; // Convert to a fraction
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channel[0] + 0.7152 * channel[1] + 0.0722 * channel[2];
}
export function contrastRatio(objRGB1, objRGB2) {
    assertObjectColor(objRGB1);
    assertObjectColor(objRGB2);

    const lum1 = getLuminance(objRGB1);
    const lum2 = getLuminance(objRGB2);

    // L1 is the brighter luminance, L2 is the dimmer one
    const brighter = Math.max(lum1, lum2);
    const dimmer = Math.min(lum1, lum2);

    return (brighter + 0.05) / (dimmer + 0.05);
}

// Example usage
// const color1 = { R: 255, G: 255, B: 255 }; // White
// const color2 = { R: 0, G: 0, B: 0 };       // Black
// console.log("Contrast Ratio:", contrastRatio(color1, color2));


// Function to calculate Delta E (CIE76) perceptual color difference
function calculateDeltaElab(objLAB1, objLAB2) {
    assertObjectColor(objLAB1);
    assertObjectColor(objLAB2);

    // lab1 and lab2 are objects with properties { L, a, b }
    const deltaL = objLAB2.L - objLAB1.L;
    const deltaA = objLAB2.a - objLAB1.a;
    const deltaB = objLAB2.b - objLAB1.b;

    // Delta E formula
    const deltaE = Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2);
    return deltaE;
}
// Example usage
if (false) {
    const redLAB = { L: 53.24, a: 80.09, b: 67.20 };       // LAB values for red
    const cyanLAB = { L: 91.11, a: -48.08, b: -14.14 };    // LAB values for cyan
    const deltaE = calculateDeltaElab(redLAB, cyanLAB);
    console.log("Delta E between red and cyan:", deltaE);
}

export function contrastDeltaERgb(objRGB1, objRGB2) {
    const lab1 = toLab(objRGB1);
    const lab2 = toLab(objRGB2);
    return calculateDeltaElab(lab1, lab2);
    function toLab(objRGB) {
        // const hex = standardizeColorTo6Hex(strColor);
        // const objRGB = hexToRGB(hex);
        const objXYZ = RGBtoXYZ(objRGB);
        const objLab = XYZtoCEILab(objXYZ);
        return objLab;
    }
}
export function contrastDeltaEStr(strColor1, strColor2) {
    const lab1 = toLab(strColor1);
    const lab2 = toLab(strColor2);
    return calculateDeltaElab(lab1, lab2);
    function toLab(strColor) {
        const hex = standardizeColorTo6Hex(strColor);
        const objRGB = hexToRGB(hex);
        const objXYZ = RGBtoXYZ(objRGB);
        const objLab = XYZtoCEILab(objXYZ);
        return objLab;
    }
}
// Test it
if (false) {
    const deltaEstr = contrastDeltaEStr("red", "cyan");
    console.log(`%cDelta E between "red" and "cyan:"`, "background:yellow; color:black;", { deltaEstr });
}




// function assertNumber(n) { if (Number.isNaN(n)) { throw Error(`Not a number: ${n}`); } }
function assertObjectColor(obj) {
    const tofObj = typeof obj;
    if (tofObj != "object") { throw Error(`Not an object: ${tofObj}`); }
    if (Array.isArray(obj)) { throw Error(`obj is array: ${JSON.stringify(obj)}`); }
    const keys = Object.keys(obj);
    const kl = keys.length;
    if (![3, 4].includes(kl)) throw Error(`Expected 3 or 4 keys, but got ${kl}`);
    const strKeys = keys.join("");
    if (!["XYZ", "RGB", "RGBA", "Lab"].includes(strKeys)) {
        console.error(`Not recognized: "${strKeys}`);
        debugger; // eslint-disable-line no-debugger
    }
    const values = Object.values(obj);
    values.forEach(v => {
        if (Number.isNaN(v)) {
            console.error("NaN in ", obj);
            debugger; // eslint-disable-line no-debugger
        }
    })
}
function isBlackOrWhite(color) {
    let strColor = color;
    if (typeof color != "string") {
        strColor = RGBtoHEX6(color);
    }
    if (!strColor.startsWith("#")) throw Error(`Color "${strColor}" is not in hex format`);
    return ["#000000", "#ffffff"].includes(strColor);
}