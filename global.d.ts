// global.d.ts

declare global {
  /**
   * Create a DOM element
   * @param {string} type - Tag name ("div", "span", etc.)
   * @param {{[key: string]: string | number | boolean} | null | undefined} [attrib] 
   *        Optional attributes object — passed to setAttribute()
   * @param {string | HTMLElement | Array<string | HTMLElement> | null | undefined} [inner] 
   *        Optional text or child nodes
   * @returns {HTMLElement}
   */
  function mkElt(
    type: string,
    attrib?: Record<string, string | number | boolean> | null,
    inner?: string | HTMLElement | readonly (string | HTMLElement)[] | null
  ): HTMLElement;

  // your existing global logger
  function logConsoleHereIs(message: string, ...optionalParams: any[]): void;

  /**
   * Your custom dynamic import wrapper — works exactly like the built-in `import()`
   * @param modulePath Path or specifier to import
   * @returns Promise that resolves to the module namespace object
   */
  function importFc4i<T = any>(modulePath: string): Promise<T>;

  /**
   * @param relLink
   */
  function makeAbsLink(relLink: string): string;


  // make them available on window too (in case some old code uses window.mkElt)
  /*
  interface Window {
    mkElt: typeof mkElt;
    logConsoleHereIs: typeof logConsoleHereIs;
    importFc4i: typeof importFc4i;
  }
  */

  // This trick merges globals into window (no need for explicit interface Window {} block)
  // ... but it is not officially supported (yet).
  var window: Window & typeof globalThis;
}



// checkIsMMformatJmdisplayed(jmDisplayed, "wantToSave");
/** * 
 */
// type MMformatJmDisplayed = Object;
// type MMformatJmDisplayed = object;

/** @typedef {Object} MMformatStored */

  interface MMformatJmDisplayed {
    get_data: Function;
    get_selected_node: Function;
    NOT_SAVEABLE: boolean | string | undefined;
    mind: object;
  }


  export {};   // keeps it working in module mode