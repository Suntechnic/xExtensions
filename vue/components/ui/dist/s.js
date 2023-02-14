this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports,x_vue_mixins) {
    'use strict';

    var Selector = {
      mixins: [x_vue_mixins.Input],
      name: 'Selector',
      props: {
        options: {},
        valuekey: {},
        titlekey: {},
        name: {},
        placeholder: {
          "default": ''
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
      template: "\n    <div class=\"selector\">\n        <input\n                v-if=\"name\"\n                v-bind:name=\"name\"\n                v-bind:value=\"valueModel\"\n                type=\"hidden\"\n            >\n        <div class=\"selector-display\" v-on:click=\"toggle\">{{title}}</div>\n        <div class=\"selector-list\" v-if=\"state.open\">\n            <input v-model=\"state.search\">\n            <span class=\"selector-unselect\" v-if=\"option\" v-on:click=\"set('')\">\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u274C</span>\n            <ul>\n                <li\n                        v-for=\"option in orderedOptions[0]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:valueModel==option.value}\"\n                    >{{option.title}}</li>\n                <li\n                        v-for=\"option in orderedOptions[1]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:valueModel==option.value}\"\n                        class=\"selector-list-item_others\"\n                    >{{option.title}}</li>\n                <li\n                        v-for=\"option in orderedOptions[2]\"\n                        v-bind:key=\"'o_'+option.value\"\n                        v-on:click=\"set(option.value)\"\n                        v-bind:class=\"{active:valueModel==option.value}\"\n                        class=\"selector-list-item_rest\"\n                    >{{option.title}}</li>\n            </ul>\n        </div>\n    </div>\n\t"
    };

    exports.Selector = Selector;

}((this.BX.X.Vue.Components = this.BX.X.Vue.Components || {}),BX.X.Vue.Mixins));
//# sourceMappingURL=s.js.map
