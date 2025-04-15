// @ts-check
const LOCAL_SETTINGS_VER = "0.1.01";
window["logConsoleHereIs"](`here is local-settings.js, module, ${LOCAL_SETTINGS_VER}`);
console.log(`%chere is local-settings.js ${LOCAL_SETTINGS_VER}`, "font-size:20px;");
if (document.currentScript) { throw "local-settings.js is not loaded as module"; }

if (window.location.hostname == "localhost") {
    // debugger;
    // console.log(`%cOur url: ${import.meta.url}`, "font-size:30px");
}


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
    /** @type {string | number | boolean} */ #cachedValue;
    #input;
    // static ourSettings = undefined;

    /**
     * Create a LocalSetting
     * @param {string} prefix - prefix for stored key
     * @param {string} key 
     * @param {string | number | boolean} defaultValue 
     */
    constructor(prefix, key, defaultValue) {
        this.#key = prefix + key;
        this.#defaultValue = defaultValue;

        const tofDef = typeof defaultValue;
        const arrDef = ["string", "number", "boolean"];
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
                default: throw Error("What did I do???");
            }
            const inp = document.createElement("input");
            this.#input = inp;
            inp.type = itype;
            // debugger;
            const handleInput = (evt) => {
                let val;
                switch (inp.type) {
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
                console.log({ inp, evt, val });
                this.#set_stored_itemValue(val);
            }
            inp.addEventListener("input", evt => {
                handleInput(evt);
            });

        })();
        console.log("this.#input", this.#input);
        
        this.#cachedValue = defaultValue;
        this.#get_stored_itemValue();
        this.#setInputValue();
        // FIX-ME: I have no idea how .ourSettings was supposed to be used???
        // LocalSetting.ourSettings = {};
        // LocalSetting.ourSettings[this.#key] = this;
    }
    get value() { return this.#getCachedValue(); }
    set value(val) {
        if (this.#input) {
            throw Error(`set value(val) can not be used when #input is set (${this.#key})`);
        }
        this.#set_stored_itemValue(val);
    }
    inputElement() { return this.#input; }
    /**
     * Bind the HTML element to this LocalSetting.
     * The value stored and the value of inp will be synched.
     * 
     * @param {HTMLInputElement} inp 
     * @param {boolean} mayUnbind
     */
    OLDbindToInput(inp, mayUnbind) {
        const tofMayUnbind = typeof mayUnbind;
        if ("boolean" !== tofMayUnbind) throw Error(`mayUnbind must be boolean, was "${mayUnbind}"`);
        if (this.#input) {
            // debugger;
            if (!mayUnbind) {
                throw Error(`bindToInput, already has .#input and "mayUnbind"==${mayUnbind}`);
            }
            // console.warn("bindToInput, already has .#input");
            if (this.#input.isConnected) {
                throw Error("bindToInput, already has .#input in DOM");
            }
        }
        this.#input = inp;
        this.#setInputValue();
        const handleInput = (evt) => {
            let val;
            switch (inp.type) {
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
            console.log({ inp, evt, val });
            this.#set_stored_itemValue(val);
        }
        inp.addEventListener("input", evt => {
            handleInput(evt);
        });
    }
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
        localStorage.setItem(this.#key, val.toString());
    }
    /** Fetch stored value and put it in #cachedValue */
    #get_stored_itemValue() {
        const stored = localStorage.getItem(this.#key);
        // if (stored == null) { this.#cachedValue = this.#defaultValue; return; }
        if (stored == null) { return; }
        const defValType = typeof this.#defaultValue;
        switch (defValType) {
            case "string":
                this.#cachedValue = stored;
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
            default:
                throw Error(`Can't handle default value type: ${defValType}`);
        }
    }
    #setInputValue() {
        switch (this.#input.type) {
            case "checkbox":
                this.#input.checked = this.#cachedValue;
            default:
                // console.log(inp.type);
                this.#input.value = this.#cachedValue;
        }
    }
    #getCachedValue() { return this.#cachedValue; }
    #removeItemValue() {
        localStorage.removeItem(this.#key);
        this.#cachedValue = this.#defaultValue;
    }
}
