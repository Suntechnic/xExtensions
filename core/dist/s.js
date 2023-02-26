this.BX = this.BX || {};
(function (exports,x_vue_loader) {
    'use strict';

    var Core = {};
    console.time('realoader');
    window.addEventListener('load', function () {
      BX.ready(function () {
        console.timeEnd('realoader');
        x_vue_loader.loader.init();
        BX.onCustomEvent('x.core:loaded');
      });
    });

    exports.Core = Core;

}((this.BX.X = this.BX.X || {}),BX.X.Vue));
//# sourceMappingURL=s.js.map
