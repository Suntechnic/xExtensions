this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports,x_core,x_vue_mixins) {
    'use strict';

    var Selector = {
      mixins: [x_vue_mixins.Input],
      name: 'Selector',
      props: {
        options: {},
        valuekey: {},
        // ключ значения в объекте option списка options - если не указан - то ключ в options
        titlekey: {},
        // ключ title
        name: {},
        // имя поля
        placeholder: {
          "default": ''
        },
        view_search: {
          "default": true
        },
        view_reset: {
          "default": true
        }
      },
      data: function data() {
        return {
          state: {
            search: '',
            open: false
          }
        };
      },
      computed: {
        structure: function structure() {
          var structure = {
            options: [],
            map: {}
          };
          for (var i in this.options) {
            var option = {
              value: this.valuekey ? this.options[i][this.valuekey] : i,
              title: this.titlekey ? this.options[i][this.titlekey] : this.options[i]
              //option: this.options[i]
            };

            option.searcheble = option.title.toLowerCase();
            structure.map[option.value] = structure.options.length;
            structure.options.push(option);
          }
          return structure;
        },
        index: function index() {
          if (this.structure.map) return this.structure.map[this.valueModel];
        },
        option: function option() {
          var _this$structure$optio;
          if ((_this$structure$optio = this.structure.options) !== null && _this$structure$optio !== void 0 && _this$structure$optio.length && typeof this.index != 'undefined') return this.structure.options[this.index];
        },
        title: function title() {
          if (this.option) return this.option.title;
          return this.placeholder;
        },
        orderedOptions: function orderedOptions() {
          var ordered = [[], [], []];
          if (this.state.search) {
            var search = this.state.search.toLowerCase();
            for (var i in this.structure.options) {
              var option = this.structure.options[i];
              var pos = option.searcheble.indexOf(search);
              if (pos == 0) {
                ordered[0].push(option);
              } else if (pos > 0) {
                ordered[1].push(option);
              } else {
                ordered[2].push(option);
              }
            }
          } else {
            ordered[0] = this.structure.options;
          }
          return ordered;
        }
      },
      methods: {
        open: function open() {
          this.state.open = true;
        },
        close: function close() {
          this.state.open = false;
        },
        toggle: function toggle() {
          this.state.open = !this.state.open;
        },
        set: function set(value) {
          this.valueModel = value;
          this.close();
        }
      },
      template: "\n    <div class=\"selector\">\n        <input\n                v-if=\"name\"\n                v-bind:name=\"name\"\n                v-bind:value=\"valueModel\"\n                type=\"hidden\"\n            >\n        <div class=\"selector-display\" v-on:click=\"toggle\">{{title}}</div>\n        <div class=\"selector-list\" v-if=\"state.open\">\n            <input v-if=\"view_search && option\" v-model=\"state.search\">\n            <span class=\"selector-unselect\" v-if=\"view_reset && option\" v-on:click=\"set('')\">\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u274C</span>\n            <ul>\n                <li\n                        v-for=\"option in orderedOptions[0]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:valueModel==option.value}\"\n                    >{{option.title}}</li>\n                <li\n                        v-for=\"option in orderedOptions[1]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:valueModel==option.value}\"\n                        class=\"selector-list-item_others\"\n                    >{{option.title}}</li>\n                <li\n                        v-for=\"option in orderedOptions[2]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:valueModel==option.value}\"\n                        class=\"selector-list-item_rest\"\n                    >{{option.title}}</li>\n            </ul>\n        </div>\n    </div>\n\t"
    };

    var Toggler = {
      mixins: [x_vue_mixins.Input],
      props: {
        value1: {
          type: String
        },
        value2: {
          type: String
        },
        title1: {
          type: String,
          "default": ''
        },
        title2: {
          type: String,
          "default": ''
        },
        name: {
          type: String,
          "default": ''
        }
      },
      data: function data() {
        return {};
      },
      methods: {
        toggle: function toggle(val) {
          if (val == this.value1 || val == this.value2) {
            this.valueModel = val;
          } else if (this.valueModel == this.value1) {
            this.valueModel = this.value2;
          } else {
            this.valueModel = this.value1;
          }
        }
      },
      template: "\n    <div \n            class=\"toggler\"\n            v-bind:class=\"{'alt_value':valueModel==value2}\"\n        >\n        <input\n                v-if=\"name\"\n                v-bind:name=\"name\"\n                v-bind:value=\"valueModel\"\n                type=\"hidden\"\n            >\n        <span class=\"toggler_label\" \n                v-bind:class=\"{'toggler_active_value':valueModel==value1}\" \n                v-on:click=\"toggle('CollectionsList')\"\n            >{{title1}}</span>\n        <div class=\"toggler_switch\" v-on:click=\"toggle\">\n            <span class=\"toggler_switch_slider\"></span>\n        </div>\n        <span class=\"toggler_label\"\n                v-bind:class=\"{'toggler_active_value':valueModel==value2}\" \n                v-on:click=\"toggle('TilesList')\"\n            >{{title2}}</span>\n    </div>\n\t"
    };

    var PhoneInput = {
      mixins: [x_vue_mixins.Input, x_vue_mixins.InputContented],
      props: {
        name: {
          type: String,
          "default": ''
        },
        placeholder: {
          type: String,
          "default": ''
        },
        error: {}
      },
      computed: {
        titleDisplaed: function titleDisplaed() {
          return this.title; // this.hasContented?this.title:'+7 (901) 234-56-78';
        }
      },

      methods: {
        format: function format(val) {
          if (val == '' || val == '+7 ' || val == '+7' || val == '+') return val;
          val = val.replace(/\D/g, '') // убираем все нечилас
          .slice(0, 11) // обрезаем до 11 цифр
          .split(/(?=.)/); // преобразуем в массив
          if (val[0] != 7) val[0] = 7; // Заменяем первую цифру на 7
          if (val.length == 11) ; // если цифр 11 поднимаем флаг эммиссии

          // форматирование
          var i = val.length - 1;
          if (0 <= i) val.splice(1, 0, ' (');
          if (4 <= i) val.splice(5, 0, ') ');
          if (7 <= i) val.splice(9, 0, '-');
          if (9 <= i) val.splice(12, 0, '-');

          // подоготовка
          var val = '+' + val.join('');
          return val;
        }
      },
      watch: {
        valueModel: function valueModel(val, oval) {
          if (typeof val != 'string') {
            this.valueModel = '';
            return;
          }
          var formatVal = this.format(val);
          if (val != formatVal) {
            this.valueModel = formatVal;
            return;
          }
          if (this.modelValue != val) this.$emit('update:modelValue', val);
        }
      },
      template: "\n    <span>\n        <input\n\t\t\t\ttype=\"text\"\n\t\t\t\tv-model=\"valueModel\"\n\t\t\t\tv-bind:name=\"name\"\n                v-bind:placeholder=\"placeholder\"\n\t\t\t\tref=\"input\"\n\t\t\t>\n    </span>\n\t"
    };

    exports.Selector = Selector;
    exports.PhoneInput = PhoneInput;
    exports.Toggler = Toggler;

}((this.BX.X.Vue.Components = this.BX.X.Vue.Components || {}),BX.X,BX.X.Vue.Mixins));
//# sourceMappingURL=s.js.map
