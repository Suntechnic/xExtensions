this.BX = this.BX || {};
(function (exports,x_vue_loader) {
    'use strict';

    // экстеншены которые должны быть на всех страницах
    var Core = {};
    window.addEventListener('load', function () {
      BX.ready(function () {
        x_vue_loader.init();
      });
    });

    exports.Core = Core;

}((this.BX.X = this.BX.X || {}),BX.X.Vue));
//# sourceMappingURL=s.js.map
