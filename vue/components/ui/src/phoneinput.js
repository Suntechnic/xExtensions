import {Input,InputContented} from 'x.vue.mixins';

export const PhoneInput = {
	mixins: [Input,InputContented],
	props: {
		classes: {
            type: String,
			default: ''
        },
		name: {
            type: String,
			default: ''
        },
        placeholder: {
            type: String,
			default: ''
        },
		error: {}
	},
	computed: {
		titleDisplaed ()
		{
			return this.title; // this.hasContented?this.title:'+7 (901) 234-56-78';
		}
	},
    methods: {
        format (val)
        {
			
			if (val == ''
					|| val == '+7 '
					|| val == '+7'
					|| val == '+'
				) return val;
			
            var emit = false;
			val = val
					.replace( /\D/g, '' ) // убираем все нечилас
					.slice(0,11) // обрезаем до 11 цифр
					.split( /(?=.)/ ); // преобразуем в массив
			if (val[0] != 7) val[0] = 7; // Заменяем первую цифру на 7
			if (val.length == 11) emit = true; // если цифр 11 поднимаем флаг эммиссии
			
			// форматирование
			var i = val.length - 1;
			if ( 0 <= i ) val.splice( 1, 0, ' (' );
			if ( 4 <= i ) val.splice( 5, 0, ') ' );
			if ( 7 <= i ) val.splice( 9, 0, '-' );
			if ( 9 <= i ) val.splice( 12, 0, '-' );

			// подоготовка
			var val = '+'+val.join('');
			
			return val;
        }
    },
	watch: {
		valueModel (val,oval)
        {
            if (typeof val != 'string') {
                this.valueModel = '';
                return;
            }
            
            let formatVal = this.format(val);
            if (val != formatVal) {
                this.valueModel = formatVal;
                return;
            }
            
            if (this.modelValue != val) this.$emit('update:modelValue', val);
        },
	},
	template: `
	<input
			type="text"
			v-model="valueModel"
			v-bind:name="name"
			v-bind:placeholder="placeholder"
			v-bind:class="classes"
			ref="input"
		/>
	`
}
