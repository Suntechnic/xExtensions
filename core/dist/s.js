/* eslint-disable */
this.BX = this.BX || {};
(function (exports,x_vue_loader) {
    'use strict';

    var ControllersInstances = {};
    // BX.X.ControllersInstances - инстанцы контроллеров

    var core = {
      Controller: /*#__PURE__*/function () {
        function Controller(node, code, options) {
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
          var i = 1;
          this.uid = code + '_' + i;
          while (ControllersInstances[this.uid]) {
            i++;
            this.uid = code + '_' + i;
          }
          ControllersInstances[this.uid] = this;
          node.dataset.controller = this.uid;
          return this.init(options || {});
        }
        babelHelpers.createClass(Controller, [{
          key: "init",
          value: function init() {}
        }]);
        return Controller;
      }()
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

}((this.BX.X = this.BX.X || {}),BX.X.Vue));
//# sourceMappingURL=s.js.map
