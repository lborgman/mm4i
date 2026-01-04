// @ts-check
const DELEGATE_FSM_XSTATE_VER = "0.0.1";
window["logConsoleHereIs"](`here is deletage-fsm-xstate.js, module,${DELEGATE_FSM_XSTATE_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

const importFc4i = window["importFc4i"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];

/*
Grok recommends XState:
https://github.com/statelyai/xstate
https://stately.ai/docs/xstate
https://stately.ai/docs/cheatsheet
*/
// export const a = {}; // FIX-ME:
// debugger;

/**
 * 
 * @param {HTMLDivElement} root 
 * @param {Function} funGetFsmEvent 
 */
export async function startFsm(root, funGetFsmEvent) {
    const modXstate = await importFc4i('xstate');
    const { createMachine, createActor, assign } = modXstate;

    const pointerMachine = createMachine({
        id: 'pointer',
        initial: "Idle",
        context: {
            startX: 0,
            startY: 0,
            pointerId: null,
            target: null,
            threshold: 10,
            dblClickDelay: 300 // ms
        },
        states: {
            idle: {
                on: {
                    POINTER_DOWN: {
                        target: "Pressing",
                        actions: assign(({ evt }) => ({
                            startX: evt.clientX,
                            startY: evt.clientY,
                            pointerId: evt.pointerId,
                            target: evt.target
                        }))
                    }
                }
            },
            pressing: {
                on: {
                    POINTER_MOVE: {
                        target: "Dragging",
                        guard: ({ context, evt }) => {
                            const dist = Math.hypot(evt.clientX - context.startX, evt.clientY - context.startY);
                            return dist > context.threshold;
                        }
                    },
                    POINTER_UP: {
                        target: "waitingForSecondTap"
                    }
                }
            },
            dragging: {
                entry: 'capturePointer',
                on: {
                    POINTER_MOVE: { actions: 'handleDrag' },
                    POINTER_UP: { target: "Idle" }
                },
                exit: 'releasePointer'
            },
            waitingForSecondTap: {
                after: {
                    // If the timer expires, it's a single click
                    300: {
                        target: "Idle",
                        actions: 'emulateClick'
                    }
                },
                on: {
                    POINTER_DOWN: {
                        target: "Idle",
                        actions: 'emulateDblClick'
                    }
                }
            }
        }
    }, {
        actions: {
            capturePointer: ({ context, evt }) => {
                console.log("capturePointer", { context, evt });
                root.setPointerCapture(evt.pointerId);
            },
            releasePointer: ({ context, evt }) => {
                root.releasePointerCapture(evt.pointerId);
            },
            handleDrag: ({ evt }) => {
                console.log('Dragging...', evt.clientX, evt.clientY);
            },
            emulateClick: ({ context, evt }) => {
                console.log("emulateClick", { context, evt });
                root.setPointerCapture(evt.pointerId);
                // const btn = context.target.closest('button');
                // console.log('Emulated CLICK', btn ? `on ${btn.id}` : 'on background');
                // Trigger your actual logic here
                console.log('Emulated CLICK');
            },
            emulateDblClick: ({ context, evt }) => {
                console.log("emulateDblClick", { context, evt });
                // const btn = context.target.closest('button');
                // console.log('Emulated DBLCLICK', btn ? `on ${btn.id}` : 'on background');
                // Trigger your double-click logic here
                console.log('Emulated DBLCLICK');
            }
        }
    });

    // Start the Actor
    const pointerActor = createActor(pointerMachine).start();

    // const root = document.getElementById('root');

    const handleEvent = (type) => (evt) => {
        console.log("handleEvent", { type, evt });
        pointerActor.send({ type, evt });
    };
    root.addEventListener('pointerdown', handleEvent('POINTER_DOWN'));
    // root.addEventListener('pointermove', handleEvent('POINTER_MOVE'));
    root.addEventListener('pointerup', handleEvent('POINTER_UP'));
    root.addEventListener('pointercancel', handleEvent('POINTER_CANCEL'));
}