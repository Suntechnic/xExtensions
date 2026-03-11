export const Grammar = {
    methods: {
        /*
         * Склонение по числам
        
        this.declOfNum(val, [
                'товар', // 1 товар
                'товара', // 2 товара
                'товаров' // 10 товаров
            ]);
        
        */
		declOfNum (number, titles) // declOfNum(val, ['товар','товара','товаров'])
        {
			let cases = [2, 0, 1, 1, 1, 2];  
			return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
        },
    }
}


export const Model = {
    props: {
        modelValue: {
        type: [String, Number, Array, null],
        default: null
        }
    },
    emits: ['update:modelValue'],
    computed: {
        model: {
            get() {
                return this.modelValue
            },
            set(value) {
                this.$emit('update:modelValue', value)
            }
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * @deprecated Используй modelMixin с computed:model (modelValue + update:modelValue)
 * Пример:
 *  import { Model } from './modelMixin'
 *  export default { mixins: [modelMixin], ... }
 */
export const Input = {
    props: {
        modelValue: {
			//type: String
		},
	},
    emits: ['update:modelValue'],
	data ()
	{
		return {
			valueModel: ''
		}
	},
    created()
	{
		this.valueModel = this.modelValue;
	},
    watch: {
		valueModel (val,oval)
        {
            if (this.modelValue != val) this.$emit('update:modelValue', val);
        },
        modelValue (val,oval)
        {
            if (this.valueModel != val) this.valueModel = val;
        }
	}
}

// миксин для поля ввода требующего контроля за содержимым
export const InputContented = {
    data ()
	{
		return {
			state: {
				focused: false
			}
		}
	},
	computed: {
		hasValue () // возвращает true когда есть контент
		{
			return !!this.valueModel;
		},
		hasContented () // возвращает true когда есть контент или поле в фокусе
		{
			return this.hasValue || this.state.focused;
		},
	},
}


