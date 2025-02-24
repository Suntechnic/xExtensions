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

export const MixinBxApi = {
    data () {
		return {
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

                let method = BX.ajax['get'];
                if (DefaultMethod == 'POST') method = BX.ajax['post'];

                this.apiState.queryWaitingResponse++;

                if (!data.sessid && BX?.bitrix_sessid) {
                    data.sessid = BX.bitrix_sessid()
                }
                method(
                        Url,
                        data,
                        (response) => {
                            this.apiState.queryWaitingResponse--;
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
