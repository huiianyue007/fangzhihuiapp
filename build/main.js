require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

module.exports = {
  router: {
    base: '/site/'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: '房智汇',
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0' }, { hid: 'description', name: 'description', content: '房智汇' }, { 'http-equiv': 'cache-control', content: 'max-age=0' }, { 'http-equiv': 'cache-control', content: 'no-cache' }, { 'http-equiv': 'expires', content: '0' }, { 'http-equiv': 'expires', content: 'Tue, 01 Jan 1980 1:00:00 GMT' }, { 'http-equiv': 'pragma', content: 'no-cache' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/LOGO1.ico' }],
    script: [{ src: 'html5plus://ready' }, { src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js' }]
  },
  /*
  ** Global CSS
  */
  css: [{ src: 'assets/scss/main.scss', lang: 'scss' }, 'swiper/dist/css/swiper.css', 'vue-tk/dist/vue-tk.css', 'mint-ui/lib/style.css', 'vue-tkui/dist/vue-tkui.css'],
  /*
  ** Customize the progress-bar color
  */
  // loading: { color: '#3B8070' },
  loading: '~/components/loading.vue',
  plugins: [{
    src: 'plugins/init.js'
  }, {
    src: 'plugins/vuexStorage.js'
  }, {
    src: 'plugins/getAccess.js'
  }, {
    src: 'plugins/clientInit.js',
    ssr: false
  }, {
    src: 'plugins/history.js',
    ssr: false
  }, {
    src: 'plugins/woopra.js',
    ssr: false
  }, {
    src: 'plugins/wxConfig.js',
    ssr: false
  }, {
    src: 'plugins/i18n.js'
  }],
  build: {
    vendor: ['vue-tk', 'vue2-google-maps', 'vue-tkui', 'echarts']
  },
  env: {
    config: process.env.npm_config_config || null
  }
};

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("koa");

/***/ },
/* 2 */
/***/ function(module, exports) {

module.exports = require("nuxt");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_nuxt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_nuxt__);



var app = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();
var host = process.env.HOST || '0.0.0.0';
var port = process.env.npm_config_port || 3000;

// Import and Set Nuxt.js options
var config = __webpack_require__(0);
config.dev = !(app.env === 'production');

// Instantiate nuxt.js
var nuxt = new __WEBPACK_IMPORTED_MODULE_1_nuxt__["Nuxt"](config);

// Build in development
if (config.dev) {
  var builder = new __WEBPACK_IMPORTED_MODULE_1_nuxt__["Builder"](nuxt);
  builder.build().catch(function (e) {
    console.error(e); // eslint-disable-line no-console
    process.exit(1);
  });
}

app.use(function (ctx) {
  ctx.status = 200; // koa defaults to 404 when it sees that status is unset

  return new Promise(function (resolve, reject) {
    ctx.res.on('close', resolve);
    ctx.res.on('finish', resolve);
    nuxt.render(ctx.req, ctx.res, function (promise) {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject);
    });
  });
});

app.listen(port, host);
console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console

/***/ }
/******/ ]);
//# sourceMappingURL=main.map