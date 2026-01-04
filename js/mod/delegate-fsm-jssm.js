// @ts-check
const DELEGATE_FSM_JSSM_VER = "0.0.1";
window["logConsoleHereIs"](`here is delegate-fsm-jssm.js, module,${DELEGATE_FSM_JSSM_VER}`);
if (document.currentScript) throw Error("import .currentScript"); // is module

const importFc4i = window["importFc4i"];
const errorHandlerAsyncEvent = window["errorHandlerAsyncEvent"];


// export const a = {}; // FIX-ME:

/**
 * 
 * @param {HTMLDivElement} root 
 * @param {Function} funGetFsmEvent 
 */
export async function startFsm(root, funGetFsmEvent) {
    const modJssm = await importFc4i('jssm');
    // const { createMachine, createActor, assign } = modXstate;
    // import { sm } from 'jssm';

    const mouseMachine = modJssm.sm`
  Idle        'down'  -> Pressed;
  Pressed     'up'    -> Clicked;
  Pressed     'move'  -> Dragging;
  Clicked     'down'  -> DoubleClick;
  Clicked     after 300ms -> Idle;
  Dragging    'move'  -> Dragging;
  Dragging    'up'    -> Idle;
  DoubleClick 'done'  -> Idle;
`;

    // 1. INPUT: Mapping DOM to Machine
    const el = document.getElementById('box');
    root.addEventListener('pointerdown', (e) => mouseMachine.action('down', { x: e.clientX, y: e.clientY }));
    root.addEventListener('pointerup', () => mouseMachine.action('up'));
    root.addEventListener('pointermove', () => mouseMachine.action('move'));

    // 2. GLOBAL LOGGING: See everything
    mouseMachine.hook_any_transition(ctx => {
        console.log(`[Log] ${ctx.from} -> ${ctx.to} via action: ${ctx.action}`);
    });

    // 3. TARGETED OUTPUTS: The "Emulated" events
    // Trigger "Click" only when we successfully exit the Clicked state back to Idle via time
    mouseMachine.hook_entry('Idle', (ctx) => {
        if (ctx.from === 'Clicked' && !ctx.action) {
            console.log("EMULATED EVENT: Single Click");
        }
    });

    mouseMachine.hook_entry('DoubleClick', () => {
        console.log("EMULATED EVENT: Double Click");
        mouseMachine.action('done');
    });

    mouseMachine.hook_entry('Dragging', () => {
        console.log("EMULATED EVENT: Drag Started");
    });

}
