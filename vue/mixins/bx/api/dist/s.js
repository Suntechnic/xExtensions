/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports) {
    'use strict';

    /**
     * компонент использующий миксин, должен содержать ключ api
     * в ключе api должен быть ключ points содержащий описания эндпонинтов
     * example:

    api: {
        host: "retail-crm.com", // может быть указан хост, тогда запрос будет выполняться к нему, если хост задан, sessid не передается
        protocol: "https", // если протокол не задан, то используется https
        version: "v1", // версия api обязательна, но используется только для опередления готовности api
        points: {
            tradeinCatalog: {
                uri: "/api/v1/tradein/{CodeProject}/",
                parameters: {
                    CodeProject: "[^/]+"
                },
                methods: [
                    "GET",
                    "HEAD"
                ]
            },
        }
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
          apiDebug: false,
          // можно переопределить для рассширенной отладки
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
            _this$api3,
            _this = this;
          if ((_this$api2 = this.api) !== null && _this$api2 !== void 0 && _this$api2.version && (_this$api3 = this.api) !== null && _this$api3 !== void 0 && _this$api3.points) {
            var _BX;
            // если есть версия (нет версии - значит api не загружен) и точки
            data = data || {};
            var EndPoint = this.api.points[name];
            if (!EndPoint) {
              console.error('x.vue.bx.api', 'Invalid endpoint: ' + name, this.api.points);
              return;
            }
            var DefaultMethod = EndPoint.methods[0] || 'GET';
            var Url = this.getPointUrl(name, data);
            if (this.api.host) {
              // для стаороннего хоста сессию не используем
              Url = this.api.host + Url;
              if (this.api.protocol) {
                Url = this.api.protocol + '://' + Url;
              } else {
                Url = 'https://' + Url;
              }
            } else if (!data.sessid && (_BX = BX) !== null && _BX !== void 0 && _BX.bitrix_sessid) {
              data.sessid = BX.bitrix_sessid();
            }
            var method = BX.ajax['get'];
            if (DefaultMethod == 'POST') method = BX.ajax['post'];
            if (this.apiDebug) {
              console.log('x.vue.bx.api', 'API query', name, Url, data);
            }
            this.apiState.queryWaitingResponse++;
            method(Url, data, function (response) {
              _this.apiState.queryWaitingResponse--;
              if (_this.apiDebug) {
                console.log('x.vue.bx.api', 'API response', name, response);
              }
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
