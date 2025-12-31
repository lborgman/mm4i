// @ts-check

/**
 * @typedef {PointerEvent & { syntheticType?: "down"|"up"|"move"|"click"|"doubleclick"}} SyntheticEvent
 * SyntheticEvent extends PointerEvent with an optional syntheticType.
 *
 * @typedef {{
 *   lastDown?: number,
 *   downTime?: number,
 *   startX?: number,
 *   startY?: number
 * }} ElementState
 * Per-element state for timing and movement thresholds.
 *
 * @typedef {{
 *   types?: ("pointerdown"|"pointermove"|"pointerup"|"click"|"dblclick")[],
 *   capture?: boolean,
 *   passive?: boolean,
 *   clickTimeMs?: number,
 *   clickMovePx?: number,
 *   doubleClickTimeMs?: number,
 *   useNativeClick?: boolean,
 *   useNativeDblClick?: boolean
 * }} DelegatedOptions
 * Options for attaching root listeners and detection thresholds.
 */

/**
 * DelegatedEvents provides event delegation for pointer events
 * and synthetic stubs like "down", "up", "move", "click", and "doubleclick".
 *
 * It unifies native events with synthetic detection:
 * - Emits "down"/"move"/"up" on pointer events.
 * - Emits "click" from native click OR synthesized (down→up within thresholds).
 * - Emits "doubleclick" from native dblclick (if enabled) OR synthesized (two downs within threshold).
 *
 * @example
 * import DelegatedEvents from "./delegatedEvents.js";
 * const delegator = new DelegatedEvents(document, { passive: false });
 * delegator.on(".item", "down", e => { e.preventDefault(); });
 * delegator.on(".item", "move", e => { * drag * });
 * delegator.on(".item", "up", e => { * end drag * });
 * delegator.on(".item", "click", e => { * tap/click * });
 * delegator.on(".item", "doubleclick", e => { * open * });
 */
export default class DelegatedEvents {
  #root;
  /** @type {Map<string, ((event: SyntheticEvent) => void)[]>} */
  #handlers;
  /** @type {WeakMap<HTMLElement, ElementState>} */
  #elementState;
  #boundDispatch;
  /** @type {DelegatedOptions} */
  #options;

  /**
   * @param {Document|HTMLElement} root
   * @param {DelegatedOptions} [options]
   */
  constructor(root = document, options) {
    this.#root = root;
    this.#handlers = new Map();
    this.#elementState = new WeakMap();
    this.#options = {
      types: ["pointerdown", "pointermove", "pointerup", "click", "dblclick"],
      capture: false,
      passive: true,
      clickTimeMs: 250,
      clickMovePx: 5,
      doubleClickTimeMs: 300,
      useNativeClick: true,
      useNativeDblClick: true,
      ...options
    };
    this.#boundDispatch = this.#dispatch.bind(this);
    this.#bind();
  }

  /**
   * Register a delegated handler.
   * @param {string} selector
   * @param {"pointerdown"|"pointerup"|"pointermove"|"click"|"dblclick"|"down"|"up"|"move"|"doubleclick"} type
   * @param {(event: SyntheticEvent) => void} handler
   */
  on(selector, type, handler) {
    const key = `${selector}|${type}`;
    if (!this.#handlers.has(key)) this.#handlers.set(key, []);
    this.#handlers.get(key).push(handler);
  }

  /**
   * Remove a previously registered handler.
   * @param {string} selector
   * @param {"pointerdown"|"pointerup"|"pointermove"|"click"|"dblclick"|"down"|"up"|"move"|"doubleclick"} type
   * @param {(event: SyntheticEvent) => void} handler
   */
  off(selector, type, handler) {
    const key = `${selector}|${type}`;
    const list = this.#handlers.get(key);
    if (!list) return;
    const idx = list.indexOf(handler);
    if (idx >= 0) list.splice(idx, 1);
    if (list.length === 0) this.#handlers.delete(key);
  }

  /** @type Object<string, number> */
  selectorsDepth = {}

  /**
   * Emit an event of the given type to handlers matching the selector and target ancestry.
   * @param {string} selector
   * @param {"pointerdown"|"pointerup"|"pointermove"|"click"|"dblclick"|"down"|"up"|"move"|"doubleclick"} type
   * @param {SyntheticEvent} event
   */
  emit(selector, type, event) {
    const key = `${selector}|${type}`;
    const handlers = this.#handlers.get(key);
    if (!handlers || handlers.length === 0) return;
    // const hitElement = document.elementFromPoint(event.clientX, event.clientY);
    let el = /** @type {HTMLElement|null} */ (event.target);
    const arrEl = [];
    while (el && el !== this.#root) {
      if (el.matches(selector)) {
        if (this.selectorsDepth[selector] == undefined) {
          let depth = 0;
          let elp = el;
          while (elp != this.#root) {
            if (!elp.parentElement) throw Error("No elp.parentElement");
            elp = elp.parentElement;
            depth++;
          }
          this.selectorsDepth[selector] = depth;
        }
        console.log(`el.matches(${selector})`, el);
        // if (el.contains(hitElement)) {
        for (const fn of handlers) fn.call(el, event);
        break;
        // arrEl.push(el)
        // }
      }
      el = el.parentElement;
    }
    /*
    // FIX-ME: sort
    const theEl = arrEl.pop();
    if (theEl) {
      for (const fn of handlers) fn.call(theEl, event);
    }
    */
  }

  /**
   * Detach all root listeners and clear handlers.
   */
  destroy() {
    for (const type of this.#options.types || []) {
      this.#root.removeEventListener(type, this.#boundDispatch, {
        capture: this.#options.capture
      });
    }
    this.#handlers.clear();
    this.#elementState = new WeakMap();
  }

  /**
   * Attach root listeners.
   */
  #bind() {
    for (const type of this.#options.types || []) {
      console.log(`%c#bind ${type}`, "color:red;");
      this.#root.addEventListener(type, this.#boundDispatch, {
        capture: this.#options.capture,
        passive: this.#options.passive
      });
    }
    console.log(`%cthis.#root`, "color:red;font-size:1.2rem", this.#root);
    // debugger;
  }

  /**
   * Dispatch incoming native events and synthesize semantic ones.
   * @param {PointerEvent | MouseEvent} event
   */
  #dispatch(event) {
    // return; // FIX-ME:
    // event.stopImmediatePropagation();
    const eventType = event.type;
    const isPointer = eventType.startsWith("pointer");
    if (event.type == "pointermove") { return; }
    if (event.type != "pointermove") {
      console.warn(`%c#dispatch, eventType==${eventType}`, "color:red;font-size:20px;", event.target);
    }
    if (isPointer) {
      if (event.type === "pointerdown") this.#handlePointerDown(/** @type {PointerEvent} */(event));
      // else if (event.type === "pointermove") this.#handlePointerMove(/** @type {PointerEvent} */(event));
      else if (event.type === "pointerup") this.#handlePointerUp(/** @type {PointerEvent} */(event));
    } else if (event.type === "click") {
      if (this.#options.useNativeClick) this.#emitNativeLike("click", /** @type {MouseEvent} */(event));
    } else if (event.type === "dblclick") {
      if (this.#options.useNativeDblClick) this.#emitNativeLike("doubleclick", /** @type {MouseEvent} */(event));
    }
  }

  /**
   * Emit native-based events ("click"/"doubleclick") to matching handlers.
   * @param {"click"|"doubleclick"} type
   * @param {MouseEvent} event
   */
  #emitNativeLike(type, event) {
    // FIX-ME: all events should go through this!
    // Iterate registered handlers once; emit to those with matching type
    // const arrEmit = [];
    for (const key of this.#handlers.keys()) {
      const parts = key.split("|");
      const selector = parts[0];
      const registeredType = parts[1];
      if (registeredType !== type) continue;
      this.emit(selector, type, /** @type {SyntheticEvent} */(event));
      // arrEmit.push({ selector, type, event });
    }
  }

  /**
   * Handle pointerdown: emit "down", synthesize "doubleclick", and record state.
   * @param {PointerEvent} event
   */
  #handlePointerDown(event) {
    // Emit synthetic "down"
    this.#emitSyntheticForRegistered("down", event);

    // Synthesize doubleclick from two downs within threshold
    for (const key of this.#handlers.keys()) {
      const parts = key.split("|");
      const selector = parts[0];
      const registeredType = parts[1];
      if (registeredType !== "doubleclick") continue;

      let el = /** @type {HTMLElement|null} */ (event.target);
      while (el && el !== this.#root) {
        if (el.matches(selector)) {
          const state = this.#elementState.get(el) || {};
          const now = performance.now();
          if (state.lastDown && now - state.lastDown < (this.#options.doubleClickTimeMs || 300)) {
            this.emit(selector, "doubleclick", /** @type {SyntheticEvent} */({ ...event, syntheticType: "doubleclick" }));
          }
          // initialize per-element state for click synthesis
          state.lastDown = now;
          state.downTime = now;
          state.startX = event.clientX;
          state.startY = event.clientY;
          this.#elementState.set(el, state);
          break;
        }
        el = el.parentElement;
      }
    }
  }

  /**
   * Handle pointermove: emit "move".
   * @param {PointerEvent} event
   */
  #handlePointerMove(event) {
    this.#emitSyntheticForRegistered("move", event);
  }

  /**
   * Handle pointerup: emit "up" and possibly synthesize "click".
   * @param {PointerEvent} event
   */
  #handlePointerUp(event) {
    // Emit synthetic "up"
    this.#emitSyntheticForRegistered("up", event);

    // Synthesize click if within time and movement thresholds
    const clickTime = this.#options.clickTimeMs || 250;
    const clickMove = this.#options.clickMovePx || 5;

    for (const key of this.#handlers.keys()) {
      const parts = key.split("|");
      const selector = parts[0];
      const registeredType = parts[1];
      if (registeredType !== "click") continue;

      let el = /** @type {HTMLElement|null} */ (event.target);
      while (el && el !== this.#root) {
        if (el.matches(selector)) {
          const state = this.#elementState.get(el);
          if (state && state.downTime != null && state.startX != null && state.startY != null) {
            const dt = performance.now() - state.downTime;
            const dx = Math.abs(event.clientX - state.startX);
            const dy = Math.abs(event.clientY - state.startY);
            if ((!this.#options.useNativeClick) && dt <= clickTime && dx <= clickMove && dy <= clickMove) {
              this.emit(selector, "click", /** @type {SyntheticEvent} */({ ...event, syntheticType: "click" }));
            }
          }
          break;
        }
        el = el.parentElement;
      }
    }
  }

  /**
   * Emit a synthetic stub ("down"|"up"|"move") for all matching registrations.
   * @param {"down"|"up"|"move"} type
   * @param {PointerEvent} event
   */
  #emitSyntheticForRegistered(type, event) {
    for (const key of this.#handlers.keys()) {
      const parts = key.split("|");
      const selector = parts[0];
      const registeredType = parts[1];
      if (registeredType !== type) continue;
      this.emit(selector, type, /** @type {SyntheticEvent} */({ ...event, syntheticType: type }));
    }
  }
}
