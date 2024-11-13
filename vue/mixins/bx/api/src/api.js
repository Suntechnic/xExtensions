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

export const MixinBxApi = {
    inject: ['apiParams'],
	props: {
        apiHost: {
			type: String,
			required: true,
            default: ''
		},
        apiUrl: {
			type: String,
			required: true,
            default: '/api/'
		},
        apiVersion: {
			type: String,
			required: true,
            default: 'v1'
		},
        apiPoints: {
			required: Object,
            required: true,
            default: {}
		}
	},
    data ()
	{
		return {
			api: {
                host: '',
				url: '/api/',
                version: 'v1',
                points: {}
			}
		}
	},
    created () {
        if (this.apiParams?.host) {
            this.api.host = this.apiParams.host;
        } else this.api.host = this.apiHost;

        if (this.apiParams?.url) {
            this.api.url = this.apiParams.url;
        } else this.api.url = this.apiUrl;

        if (this.apiParams?.version) {
            this.api.version = this.apiParams.version;
        } else this.api.version = this.apiVersion;

        if (this.apiParams?.points) {
            this.api.points = this.apiParams.points;
        } else this.api.points = this.apiPoints;
    },
	computed: {
        apiFullUrl () {
            let Url = this.api.host + this.api.url;
            if (this.api.version) {
                Url = Url + this.api.version + '/';
            }
            return Url;
        },
        apiPointsUrl () {
            let refPonintsUrl = {};
            for (let name in this.api.points) {
                let EndPoint = this.api.points[name]
                if (typeof EndPoint != 'string' && EndPoint.uri) {
                    EndPoint = EndPoint.uri;
                } else {
                    console.error('x.vue.bx.api','Invalid endpoint settings'+name, EndPoint);
                    continue
                }
                refPonintsUrl[name] = this.apiFullUrl + this.api.points[name];
            }
            return refPonintsUrl;
        }
    },
    methods: {
        getPointUrl (name, data) {
            let PointUrl = this.apiPointsUrl[name];

            if (PointUrl) {
                if (data && typeof data == 'object') {
                    for (let Key in data) {
                        let Val = data[Key];
                        let Placer = '{'+Key+'}';
                        PointUrl = PointUrl.replace(Placer,Val);
                    }
                }
                return PointUrl;
            } else {
                console.error('x.vue.bx.api','Invalid endpoint: '+name, this.apiPointsUrl);
            }
        }
    }
}
