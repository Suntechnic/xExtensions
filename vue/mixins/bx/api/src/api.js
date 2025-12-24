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
                queryWaitingResponse: 0,
                queries: {}
            }
        }
    },
    created () {
        // если есть this.$store
        if (this.$store) {
            // проверим есть ли в его состояиии ключ api
            if (!this.$store.state.api) {
                // зарегистируем естил нет
                this.$store.registerModule('api', {
                    namespaced: true,
                    state: {
                        queries: {}
                    },
                    getters: {
                        // получает список имен точек и возращает true если есть активные запросы к ним
                        // если передан пустой массив - то возращает true если есть вообще активные запросы
                        hasQueries (state) {
                            return (names)=>{
                                //сonsole.log('getter api/hasQueries', names);
                                if (Array.isArray(names) && names.length > 0) {
                                    for (let UUID in state.queries) {
                                        let Query = state.queries[UUID];
                                        if (names.includes(Query.name)) {
                                            return true;
                                        }
                                    }
                                    return false;
                                } else {
                                    return Object.keys(state.queries).length > 0;
                                }
                            }
                        }
                    },
                    mutations: {
                        addQuery (state, payload) {
                            state.queries[payload.uuid] = payload.query;
                        },
                        removeQuery (state, payload) {
                            delete state.queries[payload.uuid];
                        }
                    }
                });
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

                let UUID = 'api-query-'+name+'-'+(new Date()).getTime()+'-'+Math.floor(Math.random()*10000);
                this.apiState.queries[UUID] = {
                    name: name,
                    url: Url,
                    data: data,
                    method: DefaultMethod,
                    timestamp: (new Date()).getTime()
                };
                // если есть this.$store
                if (this.$store) {
                    this.$store.commit('api/addQuery', {
                        uuid: UUID,
                        query: this.apiState.queries[UUID]
                    });
                }

                this.apiState.queryWaitingResponse++;
                method(
                        Url,
                        data,
                        (response) => {
                            this.apiState.queryWaitingResponse--;
                            delete this.apiState.queries[UUID];

                            // если есть this.$store
                            if (this.$store) {
                                this.$store.commit('api/removeQuery', {
                                    uuid: UUID
                                });
                            }

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
