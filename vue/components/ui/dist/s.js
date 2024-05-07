/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports,x_core,x_vue_mixins) {
    'use strict';

    var Selector = {
      inject: ['ioptions'],
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
        multiselect: {
          "default": false
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
      created: function created() {
        this.modelValue2valueModel();
      },
      watch: {
        valueModel: function valueModel(val, oval) {
          if (this.multiselect) {
            this.$emit('update:modelValue', this.valueModel);
          } else {
            var _this$valueModel;
            if (((_this$valueModel = this.valueModel) === null || _this$valueModel === void 0 ? void 0 : _this$valueModel.length) == 1) {
              this.$emit('update:modelValue', this.valueModel[0]);
            } else {
              this.$emit('update:modelValue', undefined);
            }
          }
        },
        modelValue: function modelValue(val, oval) {
          this.modelValue2valueModel();
        }
      },
      computed: {
        structure: function structure() {
          var structure = {
            options: [],
            map: {}
          };
          var options = this.options || this.ioptions;
          for (var i in options) {
            var option = {
              value: this.valuekey ? options[i][this.valuekey] : i,
              title: this.titlekey ? options[i][this.titlekey] : options[i]
              //option: this.options[i]
            };

            option.searcheble = option.title.toLowerCase();
            structure.map[option.value] = structure.options.length;
            structure.options.push(option);
          }
          return structure;
        },
        indexeselected: function indexeselected() {
          var indexeselected = [];
          if (this.structure.map) {
            for (var i in this.valueModel) {
              if (typeof this.structure.map[this.valueModel[i]] != 'undefined') indexeselected.push(this.structure.map[this.valueModel[i]]);
            }
            return indexeselected;
          }
        },
        optionselected: function optionselected() {
          var _this$structure$optio;
          var optionselected = [];
          if ((_this$structure$optio = this.structure.options) !== null && _this$structure$optio !== void 0 && _this$structure$optio.length && typeof this.indexeselected != 'undefined') {
            for (var i in this.indexeselected) {
              var index = this.indexeselected[i];
              optionselected.push(this.structure.options[index]);
            }
          }
          return optionselected;
        },
        titles: function titles() {
          var titles = [];
          for (var i in this.optionselected) {
            var option = this.optionselected[i];
            titles.push(option.title);
          }
          if (!titles.length && this.placeholder) titles.push(this.placeholder);
          return titles;
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
        modelValue2valueModel: function modelValue2valueModel() {
          this.valueModel = this.modelValue;
          if (typeof this.valueModel == 'undefined' || this.valueModel == null || !this.valueModel) {
            this.valueModel = [];
          } else if (babelHelpers["typeof"](this.valueModel) != 'object') {
            this.valueModel = [this.valueModel];
          }
        },
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
          if (this.multiselect) {
            for (var i in this.valueModel) {
              var oneVal = this.valueModel[i];
              if (oneVal == value) {
                this.valueModel.splice(i, 1);
                return;
              }
            }
            this.valueModel.push(value);
          } else {
            this.valueModel = [value];
            this.close();
          }
        }
      },
      template: /*vue-html*/"\n    <div class=\"selector\">\n        <input\n                v-if=\"name\"\n                v-bind:name=\"name\"\n                v-bind:value=\"valueModel\"\n                type=\"hidden\"\n            >\n        <div class=\"selector-display\" v-on:click=\"toggle\">{{titles.join(', ')}}</div>\n        <div class=\"selector-list\" v-if=\"state.open\">\n            <input v-if=\"view_search\" v-model=\"state.search\">\n            <span class=\"selector-unselect\" v-if=\"view_reset && option\" v-on:click=\"set('')\">\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u274C</span>\n            <ul>\n                <li\n                        v-for=\"option in orderedOptions[0]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:(valueModel && typeof valueModel == 'object' && valueModel.includes(option.value))}\"\n                    >{{option.title}}</li>\n                <li\n                        v-for=\"option in orderedOptions[1]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:(valueModel && typeof valueModel == 'object' && valueModel.includes(option.value))}\"\n                        class=\"selector-list-item_others\"\n                    >{{option.title}}</li>\n                <li\n                        v-for=\"option in orderedOptions[2]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:(valueModel && typeof valueModel == 'object' && valueModel.includes(option.value))}\"\n                        class=\"selector-list-item_rest\"\n                    >{{option.title}}</li>\n            </ul>\n        </div>\n    </div>\n\t"
    };

    /*
    <div
            vue="Toggler"
            data-value1="1" data-title1="Значение"
            data-value2="2" data-title2="Альтернативное значение"
            data-name="inputname"
            data-model-value="1"
        ></div>
    */

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
        },
        event: {
          type: String,
          "default": ''
        }
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
      watch: {
        valueModel: function valueModel(val, oval) {
          if (this.event) {
            var _BX;
            if ((_BX = BX) !== null && _BX !== void 0 && _BX.onCustomEvent) BX.onCustomEvent('x.vue.components.ui:Toggler:' + this.event, {
              value: this.valueModel
            });
          }
        }
      },
      template: "\n    <div \n            class=\"toggler\"\n            v-bind:class=\"{'alt_value':valueModel==value2}\"\n        >\n        <input\n                v-if=\"name\"\n                v-bind:name=\"name\"\n                v-bind:value=\"valueModel\"\n                type=\"hidden\"\n            >\n        <span class=\"toggler_label\" \n                v-bind:class=\"{'toggler_active_value':valueModel==value1}\" \n                v-on:click=\"toggle('CollectionsList')\"\n            >{{title1}}</span>\n        <div class=\"toggler_switch\" v-on:click=\"toggle\">\n            <span class=\"toggler_switch_slider\"></span>\n        </div>\n        <span class=\"toggler_label\"\n                v-bind:class=\"{'toggler_active_value':valueModel==value2}\" \n                v-on:click=\"toggle('TilesList')\"\n            >{{title2}}</span>\n    </div>\n\t"
    };

    var PhoneInput = {
      mixins: [x_vue_mixins.Input, x_vue_mixins.InputContented],
      props: {
        classes: {
          type: String,
          "default": ''
        },
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
      template: "\n\t<input\n\t\t\ttype=\"text\"\n\t\t\tv-model=\"valueModel\"\n\t\t\tv-bind:name=\"name\"\n\t\t\tv-bind:placeholder=\"placeholder\"\n\t\t\tv-bind:class=\"classes\"\n\t\t\tref=\"input\"\n\t\t/>\n\t"
    };

    /*
    <div vue="Tabs" data-classprefix="mytabs-">
        <script type="extension/settings" name="tabslist"><?=json_encode([
                ['slot'=>'tab1','name'=>'Таб 1'],
                ['slot'=>'tab2','name'=>'Таб 2']
            ]);?></script>
        <div vue-slot="content-tab1">Содержимое 1</div>
        <div vue-slot="content-tab2">Содержимое 2</div>
    </div>
    */
    var Tabs = {
      inject: ['tabslist'],
      props: {
        classprefix: {
          "default": ''
        },
        event: {
          type: String,
          "default": ''
        }
      },
      data: function data() {
        return {
          tabs: this.tabslist,
          slot: false
        };
      },
      created: function created() {
        this.slot = this.tabs[0].slot;
      },
      watch: {
        slot: function slot(val, oval) {
          if (this.event) {
            var _BX;
            if ((_BX = BX) !== null && _BX !== void 0 && _BX.onCustomEvent) BX.onCustomEvent('x.vue.components.ui:Tabs:' + this.event, {
              value: this.slot
            });
          }
        }
      },
      methods: {
        set: function set(name) {
          this.slot = name;
        }
      },
      template: "\n    <div v-bind:class=\"classprefix+'tabs'\">\n        <ul v-bind:class=\"classprefix+'tabs_labels'\">\n            <li \n                    v-for=\"tab in tabs\" \n                    v-bind:class=\"classprefix+'tabs_labels_item'+(slot==tab.slot?'active':'')\"\n                    v-on:click=\"set(tab.slot)\"\n                >\n                {{tab.name}}\n            </li>\n        </ul>\n\n        \n\n        <slot v-if=\"slot\" v-bind:name=\"'content-'+slot\"></slot>\n    </div>\n\t"
    };

    exports.Tabs = Tabs;
    exports.Selector = Selector;
    exports.PhoneInput = PhoneInput;
    exports.Toggler = Toggler;

}((this.BX.X.Vue.Components = this.BX.X.Vue.Components || {}),BX.X,BX.X.Vue.Mixins));
//# sourceMappingURL=s.js.map
