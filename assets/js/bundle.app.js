/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ (function() {

eval("\r\nvar __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {\r\n    if (kind === \"a\" && !f) throw new TypeError(\"Private accessor was defined without a getter\");\r\n    if (typeof state === \"function\" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError(\"Cannot read private member from an object whose class did not declare it\");\r\n    return kind === \"m\" ? f : kind === \"a\" ? f.call(receiver) : f ? f.value : state.get(receiver);\r\n};\r\nvar _DOMRender_instances, _DOMRender_render, _DOMRender_alertMessage;\r\nclass DOMRender {\r\n    constructor() {\r\n        _DOMRender_instances.add(this);\r\n    }\r\n    alertMessage(m) {\r\n        __classPrivateFieldGet(this, _DOMRender_instances, \"m\", _DOMRender_alertMessage).call(this, m);\r\n    }\r\n}\r\n_DOMRender_instances = new WeakSet(), _DOMRender_render = function _DOMRender_render() {\r\n    let s = 'asdf';\r\n}, _DOMRender_alertMessage = function _DOMRender_alertMessage(m) {\r\n    alert(m);\r\n};\r\nconst rendere = new DOMRender();\r\nrendere.alertMessage('alert message');\r\n\n\n//# sourceURL=webpack://web-pack-basic-setup/./src/app.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/app.ts"]();
/******/ 	
/******/ })()
;