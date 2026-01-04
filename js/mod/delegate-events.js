// @ts-check

// jssm
// const modDelegateFsm = await importFc4i("delegate-fsm-xstate");
const modDelegateFsm = await importFc4i("delegate-fsm-jssm");

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
      types: ["pointerdown", "pointermove", "pointerup", "click", "dblclick", "doubleclick"],
      capture: false,
      passive: true,
      clickTimeMs: 250,
      clickMovePx: 5,
      doubleClickTimeMs: 300,
      useNativeClick: true,
      // useNativeDblClick: true,
      ...options
    };
    this.#boundDispatch = this.#dispatch.bind(this);

    this.#startFsm();
    // this.#bind();
    // this.#addEventListeners();
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
        console.log(`el.matches(${selector})`, el, handlers);
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
  #startFsm() {
    (async () => {
      function callback(fsmEvent) {
        console.log("fsmEvent", fsmEvent);
      }
      modDelegateFsm.startFsm(this.#root, callback);
    })();
  }

  /**
   * Add event listeners more carefully!
   */
  #OLD1addEventListeners() {
    // #addEventListeners() {
    const element = this.#root;

    /** @type {?number} */
    let singleClickTimer = null;
    let pointerDownData = null;  // Will store info about the down event
    const MOVE_THRESHOLD = 10;   // Pixels – adjust to your needs (5–15 is typical)

    function clearSingleTimer() {
      if (singleClickTimer !== null) {
        clearTimeout(singleClickTimer);
        singleClickTimer = null;
      }
    }

    element.addEventListener('pointerdown', (e) => {
      const ePointerId = e.pointerId;
      console.log("pointerdown", { ePointerId });
      // Reset everything on new down
      clearSingleTimer();
      pointerDownData = {
        pointerId: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        pointerType: e.pointerType,
      };

      // Capture the pointer so we get all move/up/cancel events even if outside element
      element.setPointerCapture(e.pointerId);
    });

    element.addEventListener('pointermove', (e) => {
      if (!pointerDownData || e.pointerId !== pointerDownData.pointerId) return;

      const dx = e.clientX - pointerDownData.x;
      const dy = e.clientY - pointerDownData.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > MOVE_THRESHOLD) {
        // Movement detected → this is a drag/move
        clearSingleTimer();

        console.log('Drag/move started', { dx, dy, distance });
        // → Run your drag/move logic here (or dispatch a custom event)

        // Optional: clear pointerDownData if you don't need further tracking
        pointerDownData = null;
      }
    });

    element.addEventListener('pointerup', (e) => {
      const eDetail = e.detail;
      console.log("pointerup", { eDetail });
      if (!pointerDownData || e.pointerId !== pointerDownData.pointerId) return;

      // If we already detected a move, do nothing for click/tap
      if (singleClickTimer === null && pointerDownData) {
        // This means move threshold was exceeded earlier → ignore click/tap
        console.log("This means move threshold was exceeded earlier → ignore click/tap");
        pointerDownData = null;
        return;
      }

      if (e.detail !== 2.5) {
        // Double tap/click
        clearSingleTimer();
        console.log('Double tap/click');
        // → Run your double action here
        // } else if (e.detail === 1) {
        // FIX-ME: It alwasy seems to be 0???
      } else if (e.detail !== 0.5) {
        // Potential single tap/click – wait to confirm no second tap
        singleClickTimer = setTimeout(() => {
          console.log('Single tap/click');
          // → Run your single action here
          singleClickTimer = null;
        }, 300); // Matches typical double-click/tap interval
      }

      pointerDownData = null; // Reset
    });

    element.addEventListener('pointercancel', (e) => {
      // Touch canceled (e.g., scrolling started, or system interrupt)
      clearSingleTimer();
      pointerDownData = null;
    });
  }

  #OLD2addEventListeners() {
    // #addEventListeners() {
    const element = this.#root;

    // Track active pointers for multi-touch support
    const activePointers = new Map();
    /** @type {?number} */
    let singleClickTimer = null;
    const MOVE_THRESHOLD = 10;
    const DOUBLE_CLICK_SPEED = 300;

    element.addEventListener('pointerdown', (e) => {
      const ePointerId = e.pointerId;
      console.log("pointerdown", { ePointerId });
      // 1. Handle Multi-touch: Store state per pointerId
      activePointers.set(e.pointerId, {
        startX: e.clientX,
        startY: e.clientY,
        isDrag: false
      });

      // 2. Capture pointer so we track movement even off-element
      element.setPointerCapture(e.pointerId);

      // Clear timer if a second click starts (interrupts single-click wait)
      if (singleClickTimer) {
        clearTimeout(singleClickTimer);
        singleClickTimer = null;
      }
    });

    element.addEventListener('pointermove', (e) => {
      const data = activePointers.get(e.pointerId);
      if (!data) return;

      // Calculate distance from start
      const dx = e.clientX - data.startX;
      const dy = e.clientY - data.startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > MOVE_THRESHOLD) {
        data.isDrag = true;

        // If we move, it's definitely not a click
        if (singleClickTimer) {
          clearTimeout(singleClickTimer);
          singleClickTimer = null;
        }

        console.log('Dragging...', { dx, dy });
        // Execute drag logic here...
      }
    });

    element.addEventListener('pointerup', (e) => {
      const eDetail = e.detail;
      const ePointerId = e.pointerId;
      console.log("pointerup", { eDetail, ePointerId });
      const dataActive = activePointers.get(e.pointerId);
      console.log({ dataActive });
      if (!dataActive) return;

      // Only process click logic if the pointer didn't move much
      if (!dataActive.isDrag) {
        if (e.detail === 2) {
          console.log('Double tap/click detected');
          // Action for double click
        } else if (e.detail === 1) {
          // Standard single-click wait logic
          console.log('Maybe Single tap/click');
          singleClickTimer = setTimeout(() => {
            console.log('Single tap/click confirmed');
            singleClickTimer = null;
          }, DOUBLE_CLICK_SPEED);
        }
      } else {
        console.log('Drag finished');
      }

      // Cleanup this specific pointer
      activePointers.delete(e.pointerId);
    });

    element.addEventListener('pointercancel', (e) => {
      if (singleClickTimer) clearTimeout(singleClickTimer);
      activePointers.delete(e.pointerId);
    });
  }

  #OLD3addEventListeners() {
    // #addEventListeners() {
    const element = this.#root;
    const MOVE_THRESHOLD = 10;
    let pointerData = null;

    element.addEventListener('pointerdown', (e) => {
      // 1. Just record the start. DO NOT capture yet.
      pointerData = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        isDragging: false
      };
    });

    element.addEventListener('pointermove', (e) => {
      if (!pointerData || e.pointerId !== pointerData.id) return;

      // 2. Check if we should start dragging
      if (!pointerData.isDragging) {
        const dx = e.clientX - pointerData.startX;
        const dy = e.clientY - pointerData.startY;

        if (Math.hypot(dx, dy) > MOVE_THRESHOLD) {
          pointerData.isDragging = true;

          // 3. NOW we capture. This "steals" the pointer from the button.
          element.setPointerCapture(e.pointerId);
          console.log("Movement threshold met: Dragging started, child clicks suppressed.");
        }
      }

      if (pointerData.isDragging) {
        // Run your drag logic here (e.g., moving an element)
        // this.#handleDrag(e);
      }
    });

    element.addEventListener('pointerup', (e) => {
      if (!pointerData || e.pointerId !== pointerData.id) return;

      if (pointerData.isDragging) {
        console.log("Drag finished.");
        // Capture is released automatically on pointerup by the browser,
        // but you can call element.releasePointerCapture(e.pointerId) if needed.
      } else {
        // 4. This block only runs if we NEVER moved enough to capture.
        // The browser will now naturally fire a 'click' event on the child button.
        console.log("Interaction was a tap/click.");
      }

      pointerData = null;
    });
  }

  #OLD4addEventListeners() {
    // #addEventListeners() {
    const element = this.#root;
    const MOVE_THRESHOLD = 15; // Increased slightly for high-DPI mouse sensitivity
    let pointerData = null;

    element.addEventListener('pointerdown', (e) => {
      // Record the start, but let the event bubble so the button feels the 'down'
      pointerData = {
        id: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        isDragging: false,
        target: e.target // We remember exactly what was clicked
      };
    });

    element.addEventListener('pointermove', (e) => {
      if (!pointerData || e.pointerId !== pointerData.id) return;

      if (!pointerData.isDragging) {
        const dist = Math.hypot(e.clientX - pointerData.startX, e.clientY - pointerData.startY);

        if (dist > MOVE_THRESHOLD) {
          pointerData.isDragging = true;
          element.setPointerCapture(e.pointerId);
          element.classList.add('is-dragging'); // UI feedback
        }
      }

      if (pointerData.isDragging) {
        // Execute your drag logic here...
      }
    });

    element.addEventListener('pointerup', (e) => {
      if (!pointerData || e.pointerId !== pointerData.id) return;

      element.classList.remove('is-dragging');
      // We don't release capture manually; pointerup does it automatically.

      // Note: We don't put 'click' logic here! 
      // pointerData is kept until the 'click' event fires immediately after this.
      setTimeout(() => { pointerData = null; }, 0);
    });

    // THE KEY: Use the click event for ALL actions
    element.addEventListener('NOclick',
      (e) => {
        // 1. If we were dragging, kill the click entirely
        if (pointerData && pointerData.isDragging) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // 2. Otherwise, check WHAT was clicked (Event Delegation)
        const btn = e.target.closest('button');
        if (btn) {
          console.warn("Button Clicked via Delegation:", btn.id);
          // this.#handleButtonClick(btn);
          // btn.click();
        } else {
          console.warn("Background Clicked");
        }
      },
      { capture: true }
    );
  }
  #addEventListeners() {
    let num = 1;
    num = parseInt(prompt("#OLD...addEventListener()", num));
    // debugger;
    console.log(`this.#OLD${num}addEventListeners();`);
    switch (num) {
      case 0:
        debugger;
        break;
      case 1:
        this.#OLD1addEventListeners();
        break;
      case 2:
        this.#OLD2addEventListeners();
        break;
      case 3:
        this.#OLD3addEventListeners();
        break;
      case 4:
        this.#OLD4addEventListeners();
        break;
      default:
        debugger;
    }
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
      console.warn(`%c#dispatch, eventType==${eventType}, isPointer==${isPointer}`, "color:red;", event.target);
    }
    if (isPointer) {
      if (event.type === "pointerdown") this.#handlePointerDown(/** @type {PointerEvent} */(event));
      // else if (event.type === "pointermove") this.#handlePointerMove(/** @type {PointerEvent} */(event));
      else if (event.type === "pointerup") this.#handlePointerUp(/** @type {PointerEvent} */(event));
    } else if (event.type === "click") {
      if (this.#options.useNativeClick) this.#emitNativeLike("click", /** @type {MouseEvent} */(event));
    } else if (event.type === "dblclick") {
      if (this.#options.useNativeDblClick) this.#emitNativeLike("dblclick", /** @type {MouseEvent} */(event));
    } else if (event.type === "doubleclick") {
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

(() => {
  const b = mkElt("button", undefined, "my button")
  b.style = "position:fixed;top:200px;left:0px;"
  const divInner = document.body.querySelector("div.jsmind-inner");
  divInner?.appendChild(b);
  b.addEventListener("click", (evt) => {
    evt.stopImmediatePropagation();
    console.warn("clicked b");
  })
});