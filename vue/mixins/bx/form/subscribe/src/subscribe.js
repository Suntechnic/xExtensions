import {MixinBxApi} from 'x.vue.mixins.bx.api';

export const MixinBxFormSubscribe = {
    mixins: [MixinBxApi],
	props: {
        email: {
			type: String,
			required: true,
            default: ''
		},
        apiPoints: {
			required: true,
            default: {add: 'subscribe/add'}
		}
	},
	data ()
	{
		return {
			form: {
				email: ''
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
        success (response) {
            response = JSON.parse(response);
            console.log(response);
        },
        fail (response) {
            response = JSON.parse(response);
            console.log(response);
        },
		save ()
		{
            let data = {
                    email: this.form.email,
                    sessid: BX.bitrix_sessid()
                };

				BX.ajax.post(
                        this.apiPointsUrl.add, //'/api/v1/subscribe/add',
                        data,
                        this.success,
                        this.fail
                    );
                    
		}
	}
}
