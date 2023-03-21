this.BX = this.BX || {};
(function (exports,x_vue_loader) {
    'use strict';

    var Core = {};
    console.time('x.core.load');
    window.addEventListener('load', function () {
      BX.ready(function () {
        BX.onCustomEvent('x.core:loaded');
        console.timeEnd('x.core.load');
        x_vue_loader.loader.init();
        BX.onCustomEvent('x.core:inited');
      });
    });

    exports.Core = Core;

}((this.BX.X = this.BX.X || {}),BX.X.Vue));
//# sourceMappingURL=s.js.map
