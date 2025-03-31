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

export const MixinBxApi = {
    data () {
		return {
            apiDebug: false, // можно переопределить для рассширенной отладки
            apiState: {
                probe: 0,
                queryWaitingResponse: 0
            }
        }
    },
    methods: {
        getPointUrl (name, data) {
            if (this.api?.points) {
                let EndPoint = this.api.points[name];

                if (EndPoint?.uri) {
                    let Url = EndPoint.uri;
                    if (data && typeof data == 'object') {
                        for (let Key in data) {
                            let Val = data[Key];
                            let Placer = '{'+Key+'}';
                            Url = Url.replace(Placer,Val);
                        }
                    }
                    return Url;
                }

                console.error('x.vue.bx.api','Invalid endpoint: '+name, EndPoint);
            } else {
                console.error('x.vue.bx.api','API is not available');
            }
        },
        queryPoint (name, data, callback) {
            if (this.api?.version && this.api?.points) { // если есть версия (нет версии - значит api не загружен) и точки
                data = data || {};
                let EndPoint = this.api.points[name];

                if (!EndPoint) {
                    console.error('x.vue.bx.api','Invalid endpoint: '+name,this.api.points);
                    return;
                }

                let DefaultMethod = EndPoint.methods[0] || 'GET';
                let Url = this.getPointUrl(name, data);

                if (this.api.host) { // для стаороннего хоста сессию не используем
                    Url = this.api.host+Url;
                    if (this.api.protocol) {
                        Url = this.api.protocol+'://'+Url;
                    } else {
                        Url = 'https://'+Url;
                    }
                } else if (!data.sessid && BX?.bitrix_sessid) {
                    data.sessid = BX.bitrix_sessid()
                }

                let method = BX.ajax['get'];
                if (DefaultMethod == 'POST') method = BX.ajax['post'];

                if (this.apiDebug) {
                    console.log('x.vue.bx.api','API query',name,Url,data);
                }

                this.apiState.queryWaitingResponse++;
                method(
                        Url,
                        data,
                        (response) => {
                            this.apiState.queryWaitingResponse--;
                            if (this.apiDebug) {
                                console.log('x.vue.bx.api','API response',name,response);
                            }
                            callback(response);
                        }
                    );
            } else {
                let reCall = ()=>{
                        this.queryPoint(name, data, callback);
                    };
                if (this.apiState.probe) {
                    if (this.apiState.probe == 16) {
                        console.warn('x.vue.bx.api','Very long waiting for the API to be ready');
                    }
                    if (this.apiState.probe > 128) {
                        console.error('x.vue.bx.api','Very long waiting for the API to be ready. The API has been stopped!');
                        return;
                    }
                    setTimeout(reCall,100*this.apiState.probe);
                    this.apiState.probe++;
                } else {
                    this.apiState.probe = 1;
                    this.$nextTick(reCall);
                }
            }
        }
    }
}
