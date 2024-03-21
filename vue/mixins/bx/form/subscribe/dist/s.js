/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports,x_vue_mixins_bx_api) {
    'use strict';

    var MixinBxFormSubscribe = {
      mixins: [x_vue_mixins_bx_api.MixinBxApi],
      props: {
        email: {
          type: String,
          required: true,
          "default": ''
        },
        apiPoints: {
          required: true,
          "default": {
            add: 'subscribe/add'
          }
        }
      },
      data: function data() {
        return {
          form: {
            email: ''
          }
        };
      },
      computed: {},
      created: function created() {
        this.form.email = this.email;
      },
      methods: {
        success: function success(response) {
          response = JSON.parse(response);
          console.log(response);
        },
        fail: function fail(response) {
          response = JSON.parse(response);
          console.log(response);
        },
        save: function save() {
          var data = {
            email: this.form.email,
            sessid: BX.bitrix_sessid()
          };
          BX.ajax.post(this.apiPointsUrl.add,
          //'/api/v1/subscribe/add',
          data, this.success, this.fail);
        }
      }
    };

    exports.MixinBxFormSubscribe = MixinBxFormSubscribe;

}((this.BX.X.Vue.Mixins = this.BX.X.Vue.Mixins || {}),BX.X.Vue.Mixins));
//# sourceMappingURL=s.js.map
