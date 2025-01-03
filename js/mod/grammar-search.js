// @ts-check

const GRAMMAR_SEARCH_VER = "0.0.1";
window["logConsoleHereIs"](`here is grammar-search.js, module, ${GRAMMAR_SEARCH_VER}`);
if (document.currentScript) { throw "grammar-search.js is not loaded as module"; }
// console.log(`TEMP: here is grammar-search.js, module, ${GRAMMAR_SEARCH_VER}`);

const importFc4i = window["importFc4i"];

// FIX-ME: try to build a grammar like here:
// https://github.com/dmaevsky/rd-parse-jsexpr/blob/master/src/grammar.js

const modRdParser = await importFc4i("rd-parser");
// import { Ignore, All, Any, Optional, Star, Node } from 'rd-parse';
const { Ignore, All, Any, Optional, Star, Node } = modRdParser;
console.log({Ignore});

const withSrcMap = (reducer = ([n]) => n) => (parts, ...$$) => srcMap(reducer(parts, ...$$), ...$$);

const StringLiteral = Node(StringToken, ([raw]) => ({ type: 'Literal', value: eval(raw), raw }));
const SearchString = Node(StringLiteral);
const Grammar = Node(Any(ArrowFunction, ConditionalExpression), withSrcMap());
const Expression = $ => Grammar($);
export function grammar() {}