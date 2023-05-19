this.BX = this.BX || {};
(function (exports,x_vue_loader) {
    'use strict';

    var ControllersInstances = {};
    var core = {
      Controller: /*#__PURE__*/function () {
        function Controller(node, code) {
          var _node$dataset;
          babelHelpers.classCallCheck(this, Controller);
          // получаем ноду
          if (typeof node == 'string') {
            var selector = node;
            node = document.querySelector(selector);
            if (!node) console.error('Invalid selector', selector);
          }
          if (!node) {
            console.error('Invalid node for controller');
            return null;
          }

          // если ноде уже назначен идентификатор контролера
          if ((_node$dataset = node.dataset) !== null && _node$dataset !== void 0 && _node$dataset.controller && ControllersInstances[node.dataset.controller]) {
            return ControllersInstances[node.dataset.controller]; // возвращем его
          }

          // регистрируем контроллер этой ноды

          this.node = node; // назначаем ноду в контролер
          code = code || '';
          this.uid = code + '_' + Math.floor(Math.random() * 10000000);
          while (ControllersInstances[this.uid]) {
            this.uid = code + '_' + Math.floor(Math.random() * 10000000);
          }
          ControllersInstances[this.uid] = this;
          node.dataset.controller = this.uid;
          return this.init();
        }
        babelHelpers.createClass(Controller, [{
          key: "init",
          value: function init() {}
        }]);
        return Controller;
      }()
    };
    var ajax = {
      cache: {
        bumbalalay: 7
      },
      runAction: function runAction(action, config, cacheTTL) {
        var _this = this;
        cacheTTL = parseInt(cacheTTL) || 0;
        var promise = new Promise(function (resolve, reject) {
          if (cacheTTL) {
            var hash = BX.md5(action + JSON.stringify(config));
            if (_this.cache[hash]) {
              resolve(JSON.parse(_this.cache[hash]));
              return;
            }
            BX.ajax.runAction(action, config).then(function (response) {
              _this.cache[hash] = JSON.stringify(response);
              setTimeout(function () {
                delete _this.cache[hash];
              }, cacheTTL * 1000);
              resolve(response);
            }, reject);
          } else {
            BX.ajax.runAction(action, config).then(resolve, reject);
          }
        });
        return promise;
      }
    };
    console.time('x.core.load');
    window.addEventListener('load', function () {
      BX.ready(function () {
        BX.onCustomEvent('x.core:loaded');
        console.timeEnd('x.core.load');
        x_vue_loader.loader.init();
        BX.onCustomEvent('x.core:inited');
      });
    });

    exports.ControllersInstances = ControllersInstances;
    exports.core = core;
    exports.ajax = ajax;

}((this.BX.X = this.BX.X || {}),BX.X.Vue));
//# sourceMappingURL=s.js.map
