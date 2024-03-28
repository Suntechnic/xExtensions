import {MixinBxApi} from 'x.vue.mixins.bx.api';

export const MixinBxFormSubscribe = {
    mixins: [MixinBxApi],
	props: {
        email: { // email, если получен - будет выведен как  email по умолчанию
			type: String,
			required: true,
            default: ''
		},
        apiPoints: { // список необходимых именованных точек api проекта
			required: true,
            default: {
                    add: 'subscribe/add' // куда отправлять запрос на добавление
                }
		}
	},
	data ()
	{
		return {
			form: {
				email: ''
			},
            state: {
                exchange: 0,
                sended: 0
            }
		}
	},
	computed: {
        
    },
    created()
	{
		this.form.email = this.email;
	},
	methods: {
        ////////////////////////////////////////////////////////////////////////
        // абстрактные методы //////////////////////////////////////////////////
        success (Response) {
            let response = JSON.parse(Response);
            console.log(response);
        },
        fail (Response) {
            let response = JSON.parse(Response);
            console.log(response);
        },
        // абстрактные методы //////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////
        $_success (Response) {
            let response = JSON.parse(Response);
            
            if (response.errors?.length) {
                // вывод ошибок должен быть реализован в реализации компонента
            } else if (response.data?.code == 0) { // все хорошо
                this.state.sended = this.state.sended + 1
            }
            
            this.success(Response);
            this.state.exchange = this.state.exchange-1;
        },
        $_fail (Response) {
            let response = JSON.parse(Response);
            
            
            this.fail(Response);
            this.state.exchange = this.state.exchange-1;
        },
		send ()
		{
            let data = {
                    email: this.form.email,
                    sessid: BX.bitrix_sessid()
                };

            this.state.exchange = this.state.exchange+1;

            BX.ajax.post(
                    this.apiPointsUrl.add,
                    data,
                    this.$_success,
                    this.$_fail
                );
                    
		}
	}
}
