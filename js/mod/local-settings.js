// @ts-check
const LOCAL_SETTINGS_VER = "0.3.01";
window["logConsoleHereIs"](`here is local-settings.js, module, ${LOCAL_SETTINGS_VER}`);
// console.log(`%chere is local-settings.js ${LOCAL_SETTINGS_VER}`, "font-size:20px;");
if (document.currentScript) { throw "local-settings.js is not loaded as module"; }

export function getVersion() { return LOCAL_SETTINGS_VER; }

/** @typedef {string | number | boolean} inputType */
/** @typedef {Object} jsonObjectType */

/**
 * class for binding localStorage to HTML input element.
 * @example
 *  class MySettings extends LocalSetting {
 *    constructor(key, defaultValue) {
 *        super("mysettings-", key, defaultValue);
 *    }
 *  }
 *  const someSetting = new MySettings("some-setting", false);
 * 
 * */
export class LocalSetting {
    #key; #defaultValue; #tofDef;
    // /** @type {string | number | boolean} */ #cachedValue;
    /** @type {inputType | jsonObjectType} */ #cachedValue;
    #input;
    // static ourSettings = undefined;

    /**
     * Create a LocalSetting
     * @param {string} prefix - prefix for stored key
     * @param {string} key 
     * @param {string | number | boolean | object} defaultValue 
     */
    constructor(prefix, key, defaultValue) {
        this.#key = prefix + key;
        this.#defaultValue = defaultValue;

        const tofDef = typeof defaultValue;
        const arrDef = ["string", "number", "boolean", "object"];
        if (!arrDef.includes(tofDef)) throw Error(`LocalSetting value type must be: ${arrDef}`);
        this.#tofDef = tofDef;
        // #addAndSetupInput() {}
        // this.#input = (() => {
        (() => {
            let itype;
            switch (tofDef) {
                case "string": itype = "text"; break;
                case "number": itype = "number"; break;
                case "boolean": itype = "checkbox"; break;
                case "object": return;
                default: throw Error("What did I do???");
            }
            const inp = document.createElement("input");
            this.#input = inp;
            inp.type = itype;
            // debugger;
            const handleInput = (evt) => {
                let val;
                switch (inp.type) {
                    case "text":
                        // val = JSON.stringify(inp.value);
                        val = inp.value.trim();
                        break;
                    case "checkbox":
                        val = inp.checked;
                        break;
                    case "number":
                        val = inp.value.trim();
                        val = +val;
                        break;
                    case "range":
                        val = +inp.value;
                        break;
                    default:
                        console.log(inp.type);
                        val = inp.value;
                }
                // console.log({ inp, evt, val });
                this.#set_stored_itemValue(val);
            }
            inp.addEventListener("input", evt => {
                handleInput(evt);
            });
            /*
             "change" is fired only after user modifies the value AND leave the input field.
             The changed value should then already have been handled by the "input" event.
            */
            /*
            inp.addEventListener("change", evt => {
                handleInput(evt);
            });
            */

        })();
        // console.log("this.#input", this.#input);

        this.#cachedValue = defaultValue;
        this.#get_stored_itemValue();
        this.#setInputValue();
        // FIX-ME: I have no idea how .ourSettings was supposed to be used???
        // LocalSetting.ourSettings = {};
        // LocalSetting.ourSettings[this.#key] = this;
    }
    get value() { return this.#getCachedValue(); }
    get valueS() { return /** @type {string} */ (this.#getCachedValue()); }
    get valueB() { return /** @type {boolean} */ (this.#getCachedValue()); }
    get valueN() { return /** @type {number} */ (this.#getCachedValue()); }
    set value(val) {
        if (this.#input) {
            if (this.#input.isConnected) {
                console.warn("set value(val) can perhaps not be used when #input is set", this);
            }
        }
        this.#set_stored_itemValue(val);
        if (this.#input) {
            this.#setInputValue();
        }
    }
    /**
     * Use this when inserting the <input> element in the DOM.
     * 
     * Do not assign a value with inp.value = ...
     * This will make inp.value out of sync with the instance object.
     * 
     * @returns {HTMLInputElement} - the input element or undefined if type is object
     */
    getInputElement() { if (!this.#input) throw Error("This setting has no input element"); return this.#input; }
    defaultValue() { return this.#defaultValue; }
    valueType() { return this.#tofDef; }
    reset() {
        this.#removeItemValue();
        if (this.#input) { this.#setInputValue(); }
    }

    /**
     * Store val and also put it in #cachedValue
     * @param {string|number|boolean} val 
     */
    #set_stored_itemValue(val) {
        const tofVal = typeof val;
        if (tofVal !== this.#tofDef) {
            throw Error(`#set_itemValue, ${this.#key}: typeof val==${tofVal}, expected ${this.#tofDef}`);
        }
        this.#cachedValue = val;
        localStorage.setItem(this.#key, JSON.stringify(val)); // FIX-ME: is this correct?
    }
    /** Fetch stored value and put it in #cachedValue */
    #get_stored_itemValue() {
        const stored = localStorage.getItem(this.#key);
        // if (stored == null) { this.#cachedValue = this.#defaultValue; return; }
        if (stored == null) { return; }
        this.#cachedValue = JSON.parse(stored);
        return;
        const defValType = typeof this.#defaultValue;
        switch (defValType) {
            case "string":
                // this.#cachedValue = stored;
                try {
                    this.#cachedValue = JSON.parse(stored);
                }
                catch (err) {
                    // console.warn(`localStorage value for ${this.#key} is not JSON: ${stored}`);
                    this.#cachedValue = stored;
                }
                break;
            case "number":
                this.#cachedValue = +stored;
                break;
            case "boolean":
                switch (stored) {
                    case "true":
                        this.#cachedValue = true;
                        break;
                    case "false":
                        this.#cachedValue = false;
                        break;
                    default:
                        throw Error(`String does not match boolean: ${stored}`);
                }
                break;
            case "object":
                const objJson = JSON.parse(stored); // FIX-ME: Can this be used for all value types?
                this.#cachedValue = objJson;
                break;
            default:
                throw Error(`Can't handle default value type: ${defValType}`);
        }
    }
    /** Assign cached value to input element. */
    // handleInput()
    #setInputValue() {
        if (!this.#input) {
            if (this.#tofDef !== "object") {
                throw Error("input is not set, but type is not object");
            }
            return;
        }
        switch (this.#input.type) {
            case "checkbox":
                if (typeof this.#cachedValue !== "boolean") throw Error("expected boolean");
                this.#input.checked = this.#cachedValue;
                break;
            default:
                if (typeof this.#cachedValue !== "string") {
                    debugger;
                    throw Error("expected string");
                }
                this.#input.value = this.#cachedValue;
        }
    }
    #getCachedValue() { return this.#cachedValue; }
    #removeItemValue() {
        localStorage.removeItem(this.#key);
        this.#cachedValue = this.#defaultValue;
    }
}

/**
 * Test function to check if localStorage can handle all value types.
 * 
 * I added this test function because there was a problem with quoted strings.
 * 
 * Always store using JSON.stringify(val) and retrieve using JSON.parse(stored)
 * solves the problem. And works for all value types.
 */
function _testValueTypesInLocalStorage() {
    const testObj = {
        str: "normal string",
        strQ: "quoted \"string\"",
        num: 123,
        bool: true,
        obj: { a: 1, b: 2 },
        arr: [1, 2, 3],
    };
    const mkTestKey = (key) => `test-${key}`;
    let someError = false;
    for (const [key, value] of Object.entries(testObj)) {
        localStorage.setItem(mkTestKey(key), JSON.stringify(value));
    }
    for (const [key, _value] of Object.entries(testObj)) {
        const testKey = mkTestKey(key);
        const initValue = testObj[key];
        const valueType = typeof initValue;
        const stored = localStorage.getItem(testKey);
        if (stored == null) { throw Error(`localStorage.getItem(${testKey}) returned null`); }
        const parsed = JSON.parse(stored);

        const retrValue = parsed;
        let someErrorHere = false;
        const tofRetrieved = typeof retrValue;
        if (tofRetrieved !== valueType) {
            console.warn("retrieved !== valueType", { valueType, tofRetrieved });
            someErrorHere = true;
        } else if (retrValue !== initValue) {
            if (valueType === "object") {
                if (JSON.stringify(retrValue) !== JSON.stringify(initValue)) {
                    someErrorHere = true;
                }
            }
            else {
                someErrorHere = true;
            }
            if (someErrorHere) {
                console.warn("retrValue !== initValue", { initValue, retrValue });
            }
        }
        if (someErrorHere) { someError = true; }
        const style = someErrorHere
            ? "color:yellow;background:red;font-size:18px"
            : "color:white;background:green;font-size:16px";
        console.log("%cTEST-RESULT", style, initValue, valueType, tofRetrieved, { testKey, retrValue, stored, parsed });
    }
    if (someError) {
        console.error("TEST found error", { someError });
        debugger;
    }
}
// _testValueTypesInLocalStorage();