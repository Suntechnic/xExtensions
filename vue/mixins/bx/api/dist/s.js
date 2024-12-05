/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports) {
    'use strict';

    /**
     * компонент использующий миксин, должен содержать ключ api
     * в ключе api должен быть ключ points содержащий описания эндпонинтов вида:
     * 
    userGet: {
        uri: "/api/v1/user/{Id}/",
        parameters: {
            Id: "[^/]+"
        },
        methods: [
            "GET",
            "HEAD"
        ]
    },
    userSet: {
        uri: "/api/v1/user/{Id}/",
        parameters: {
            Id: "[^/]+"
        },
        methods: [
            "POST"
        ]
    },
     * 
     * пример роутов
        // группа api версии 1
        $routes->prefix('api/v1')->group(function (RoutingConfigurator $routes) {
                $routes->any('subscribe/add', [\Controllers\Subscribe::class,'add']);
            });
     */

    var MixinBxApi = {
      data: function data() {
        return {
          apiState: {
            probe: 0,
            queryWaitingResponse: 0
          }
        };
      },
      methods: {
        getPointUrl: function getPointUrl(name, data) {
          var _this$api;
          if ((_this$api = this.api) !== null && _this$api !== void 0 && _this$api.points) {
            var EndPoint = this.api.points[name];
            if (EndPoint !== null && EndPoint !== void 0 && EndPoint.uri) {
              var Url = EndPoint.uri;
              if (data && babelHelpers["typeof"](data) == 'object') {
                for (var Key in data) {
                  var Val = data[Key];
                  var Placer = '{' + Key + '}';
                  Url = Url.replace(Placer, Val);
                }
              }
              return Url;
            }
            console.error('x.vue.bx.api', 'Invalid endpoint: ' + name, EndPoint);
          } else {
            console.error('x.vue.bx.api', 'API is not available');
          }
        },
        queryPoint: function queryPoint(name, data, callback) {
          var _this$api2,
            _this = this;
          if ((_this$api2 = this.api) !== null && _this$api2 !== void 0 && _this$api2.points) {
            var _BX;
            data = data || {};
            var EndPoint = this.api.points[name];
            var DefaultMethod = EndPoint.methods[0] || 'GET';
            var Url = this.getPointUrl(name, data);
            var method = BX.ajax['get'];
            if (DefaultMethod == 'POST') method = BX.ajax['post'];
            this.apiState.queryWaitingResponse++;
            if (!data.sessid && (_BX = BX) !== null && _BX !== void 0 && _BX.bitrix_sessid) {
              data.sessid = BX.bitrix_sessid();
            }
            method(Url, data, function (response) {
              _this.apiState.queryWaitingResponse--;
              callback(response);
            });
          } else {
            var reCall = function reCall() {
              _this.queryPoint(name, data, callback);
            };
            if (this.apiState.probe) {
              if (this.apiState.probe == 16) {
                console.warn('x.vue.bx.api', 'Very long waiting for the API to be ready');
              }
              if (this.apiState.probe > 128) {
                console.error('x.vue.bx.api', 'Very long waiting for the API to be ready. The API has been stopped!');
                return;
              }
              setTimeout(reCall, 100 * this.apiState.probe);
              this.apiState.probe++;
            } else {
              this.apiState.probe = 1;
              this.$nextTick(reCall);
            }
          }
        }
      }
    };

    exports.MixinBxApi = MixinBxApi;

}((this.BX.X.Vue.Mixins = this.BX.X.Vue.Mixins || {})));
//# sourceMappingURL=s.js.map
