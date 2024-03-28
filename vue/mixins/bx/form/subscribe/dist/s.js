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
          // email, если получен - будет выведен как  email по умолчанию
          type: String,
          required: true,
          "default": ''
        },
        apiPoints: {
          // список необходимых именованных точек api проекта
          required: true,
          "default": {
            add: 'subscribe/add' // куда отправлять запрос на добавление
          }
        }
      },
      data: function data() {
        return {
          form: {
            email: ''
          },
          state: {
            exchange: 0,
            sended: 0
          }
        };
      },
      computed: {},
      created: function created() {
        this.form.email = this.email;
      },
      methods: {
        ////////////////////////////////////////////////////////////////////////
        // абстрактные методы //////////////////////////////////////////////////
        success: function success(Response) {
          var response = JSON.parse(Response);
          console.log(response);
        },
        fail: function fail(Response) {
          var response = JSON.parse(Response);
          console.log(response);
        },
        // абстрактные методы //////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        $_success: function $_success(Response) {
          var _response$errors, _response$data;
          var response = JSON.parse(Response);
          if ((_response$errors = response.errors) !== null && _response$errors !== void 0 && _response$errors.length) ; else if (((_response$data = response.data) === null || _response$data === void 0 ? void 0 : _response$data.code) == 0) {
            // все хорошо
            this.state.sended = this.state.sended + 1;
          }
          this.success(Response);
          this.state.exchange = this.state.exchange - 1;
        },
        $_fail: function $_fail(Response) {
          var response = JSON.parse(Response);
          this.fail(Response);
          this.state.exchange = this.state.exchange - 1;
        },
        send: function send() {
          var data = {
            email: this.form.email,
            sessid: BX.bitrix_sessid()
          };
          this.state.exchange = this.state.exchange + 1;
          BX.ajax.post(this.apiPointsUrl.add, data, this.$_success, this.$_fail);
        }
      }
    };

    exports.MixinBxFormSubscribe = MixinBxFormSubscribe;

}((this.BX.X.Vue.Mixins = this.BX.X.Vue.Mixins || {}),BX.X.Vue.Mixins));
//# sourceMappingURL=s.js.map
