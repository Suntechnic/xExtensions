/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports) {
    'use strict';

    var _apiPoints;
    /**
     * параметры api могут быть переданы props или в инъекции, в объекте apiParams
     * инъекция имеет приоритет
     * параметры будут скопированы в объект api:  {
                    host: '', // хост - по умолчения нет
    				url: '/api/', // папка api
                    version: 'v1', // версия (может быть пустой - будет пропущена)
                    points: {
                        add: 'subscribe/add',
                        del: {
                            uri: 'subscribe/del/{Id}',
                            methods: ['GET'],
                            parameters: {Id: '.*'}
                        }
                    } // справочник точек api с именами
    			}
     * apiFullUrl - полный url api: /api/v1/
     * apiPointsUrl - справочник url точек api: {add: '/api/v1/subscribe/add'} - локален для каждого компонента
     * 
     * метод getPointUrl служит для получения url эндпоинта по его имени
     * вторым параметром передаются данные для замены в url
     * 
     * пример роутов
        // группа api версии 1
        $routes->prefix('api/v1')->group(function (RoutingConfigurator $routes) {
                $routes->any('subscribe/add', [\Controllers\Subscribe::class,'add']);
            });
     */

    var MixinBxApi = {
      inject: ['apiParams'],
      props: {
        apiHost: {
          type: String,
          required: true,
          "default": ''
        },
        apiUrl: {
          type: String,
          required: true,
          "default": '/api/'
        },
        apiVersion: {
          type: String,
          required: true,
          "default": 'v1'
        },
        apiPoints: (_apiPoints = {
          required: Object
        }, babelHelpers.defineProperty(_apiPoints, "required", true), babelHelpers.defineProperty(_apiPoints, "default", {}), _apiPoints)
      },
      data: function data() {
        return {
          api: {
            host: '',
            url: '/api/',
            version: 'v1',
            points: {}
          }
        };
      },
      created: function created() {
        var _this$apiParams, _this$apiParams2, _this$apiParams3, _this$apiParams4;
        if ((_this$apiParams = this.apiParams) !== null && _this$apiParams !== void 0 && _this$apiParams.host) {
          this.api.host = this.apiParams.host;
        } else this.api.host = this.apiHost;
        if ((_this$apiParams2 = this.apiParams) !== null && _this$apiParams2 !== void 0 && _this$apiParams2.url) {
          this.api.url = this.apiParams.url;
        } else this.api.url = this.apiUrl;
        if ((_this$apiParams3 = this.apiParams) !== null && _this$apiParams3 !== void 0 && _this$apiParams3.version) {
          this.api.version = this.apiParams.version;
        } else this.api.version = this.apiVersion;
        if ((_this$apiParams4 = this.apiParams) !== null && _this$apiParams4 !== void 0 && _this$apiParams4.points) {
          this.api.points = this.apiParams.points;
        } else this.api.points = this.apiPoints;
      },
      computed: {
        apiFullUrl: function apiFullUrl() {
          var Url = this.api.host + this.api.url;
          if (this.api.version) {
            Url = Url + this.api.version + '/';
          }
          return Url;
        },
        apiPointsUrl: function apiPointsUrl() {
          var refPonintsUrl = {};
          for (var name in this.api.points) {
            var EndPoint = this.api.points[name];
            if (typeof EndPoint != 'string' && EndPoint.uri) {
              EndPoint = EndPoint.uri;
            } else {
              console.error('x.vue.bx.api', 'Invalid endpoint settings' + name, EndPoint);
              continue;
            }
            refPonintsUrl[name] = this.apiFullUrl + this.api.points[name];
          }
          return refPonintsUrl;
        }
      },
      methods: {
        getPointUrl: function getPointUrl(name, data) {
          var PointUrl = this.apiPointsUrl[name];
          if (PointUrl) {
            if (data && babelHelpers["typeof"](data) == 'object') {
              for (var Key in data) {
                var Val = data[Key];
                var Placer = '{' + Key + '}';
                PointUrl = PointUrl.replace(Placer, Val);
              }
            }
            return PointUrl;
          } else {
            console.error('x.vue.bx.api', 'Invalid endpoint: ' + name, this.apiPointsUrl);
          }
        }
      }
    };

    exports.MixinBxApi = MixinBxApi;

}((this.BX.X.Vue.Mixins = this.BX.X.Vue.Mixins || {})));
//# sourceMappingURL=s.js.map
