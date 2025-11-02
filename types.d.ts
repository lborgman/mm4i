// globals.d.ts
interface Window {
    logConsoleHereIs: (msg: string) => void;
    mkElt: (...args: any[]) => HTMLElement;
    // Add any other window globals here
    errorHandlerAsyncEvent: (asyncFun: function) => void;
}