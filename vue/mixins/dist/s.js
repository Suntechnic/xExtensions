this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports) {
	'use strict';

	var Grammar = {
	  methods: {
	    /*
	     * Склонение по числам
	    
	    this.declOfNum(val, [
	            'товар', // 1 товар
	            'товара', // 2 товара
	            'товаров' // 10 товаров
	        ]);
	    
	    */
	    declOfNum: function declOfNum(number, titles)
	    // declOfNum(val, ['товар','товара','товаров'])
	    {
	      var cases = [2, 0, 1, 1, 1, 2];
	      return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
	    }
	  }
	};

	// миксин для поля ввода рабоюащий с v-model
	// modelValue - входящее значение
	// valueModel - значение с которым связывается внутреннее поле
	var Input = {
	  props: {
	    modelValue: {
	      //type: String
	    }
	  },
	  emits: ['update:modelValue'],
	  data: function data() {
	    return {
	      valueModel: ''
	    };
	  },
	  created: function created() {
	    this.valueModel = this.modelValue;
	  },
	  watch: {
	    valueModel: function valueModel(val, oval) {
	      if (this.modelValue != val) this.$emit('update:modelValue', val);
	    },
	    modelValue: function modelValue(val, oval) {
	      if (this.valueModel != val) this.valueModel = val;
	    }
	  }
	};

	// миксин для поля ввода требующего контроля за содержимым
	var InputContented = {
	  data: function data() {
	    return {
	      state: {
	        focused: false
	      }
	    };
	  },
	  computed: {
	    hasValue: function hasValue()
	    // возвращает true когда есть контент
	    {
	      return !!this.valueModel;
	    },
	    hasContented: function hasContented()
	    // возвращает true когда есть контент или поле в фокусе
	    {
	      return this.hasValue || this.state.focused;
	    }
	  }
	};

	exports.Grammar = Grammar;
	exports.Input = Input;
	exports.InputContented = InputContented;

}((this.BX.X.Vue.Mixins = this.BX.X.Vue.Mixins || {})));
//# sourceMappingURL=s.js.map
