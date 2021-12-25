this.BX = this.BX || {};
(function (exports) {
    'use strict';

    BX.ready(function () {
      // функция инициализации
      var initVue = function initVue() {
        document.querySelectorAll('[vue]').forEach(function (elm) {
          var _APP, _APP$config;

          var datasetAttrs = '';

          for (var name in elm.dataset) {
            datasetAttrs = datasetAttrs + ' ' + name + '="' + elm.dataset[name] + '"';
          }

          var template = '<' + elm.getAttribute('vue') + datasetAttrs + '/>';
          if (((_APP = APP) === null || _APP === void 0 ? void 0 : (_APP$config = _APP.config) === null || _APP$config === void 0 ? void 0 : _APP$config.debug) > 2) console.log('load vue component', elm.getAttribute('vue'), elm.dataset);
          BX.BitrixVue.createApp({
            el: elm,
            template: template
          });
        });
      }; // инициализация компонентов


      initVue(); // поддержка композита

      if (window.frameCacheVars !== undefined) {
        BX.addCustomEvent("onFrameDataReceived", initVue);
      }
    });

}((this.BX[''] = this.BX[''] || {})));
//# sourceMappingURL=script.js.map
