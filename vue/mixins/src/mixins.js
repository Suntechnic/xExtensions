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

// миксин для поля ввода рабоюащий с v-model
// modelValue - входящее значение
// valueModel - значение с которым связывается внутреннее поле
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
