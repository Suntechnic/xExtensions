/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports) {
    'use strict';

    var XDev = {
      props: {
        title: {
          type: String,
          required: true
        },
        value: {
          required: true
        }
      },
      computed: {
        config: function config() {
          return this.$store.state.config;
        },
        show: function show() {
          var _this$config, _this$config$env;
          return ((_this$config = this.config) === null || _this$config === void 0 ? void 0 : (_this$config$env = _this$config.env) === null || _this$config$env === void 0 ? void 0 : _this$config$env.stage) === 'dev';
        }
      },
      template: /* vue-html */"\n    <details class=\"x-dev\" v-if=\"show\">\n        <summary class=\"x-dev-title\">QR value</summary>\n        <div class=\"x-dev-value\">{{ value }}</div>\n    </details>\n    "
    };

    exports.XDev = XDev;

}((this.BX.X.Vue.Components = this.BX.X.Vue.Components || {})));
//# sourceMappingURL=s.js.map
