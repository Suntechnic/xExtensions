/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
(function (exports,ui_vue3) {
    'use strict';

    // функция инициализации
    var loader = {
      componentstores: [],
      store: false,
      addComponentStore: function addComponentStore(store) {
        for (var i in loader.componentstores) {
          if (loader.componentstores[i] == store) return;
        }
        loader.componentstores.push(store);
      },
      addStore: function addStore(store) {
        loader.store = store;
      },
      "delete": function _delete(name, i) {
        var _BX$X$Vue$Apps$name;
        if ((_BX$X$Vue$Apps$name = BX.X.Vue.Apps[name]) !== null && _BX$X$Vue$Apps$name !== void 0 && _BX$X$Vue$Apps$name.length) {
          if (typeof i != 'undefined') {
            if (BX.X.Vue.Apps[name][i]) {
              BX.X.Vue.Apps[name][i].unmount();
              delete BX.X.Vue.Apps[name][i];
            }
          } else {
            for (var _i in BX.X.Vue.Apps[name]) {
              loader["delete"]('name', _i);
            }
          }
        }
      },
      init: BX.debounce(function (node) {
        console.log('initVue', node);
        node = node || document;
        var applicationsInRound = []; // список для события
        node.querySelectorAll('[vue]').forEach(function (elm) {
          var _BX$App, _BX$App$Vue;
          var ComponentName = elm.getAttribute('vue');
          var AppName = 'App' + ComponentName;
          if (typeof BX.X.Vue.Apps == 'undefined') BX.X.Vue.Apps = {};
          if (typeof BX.X.Vue.Apps[AppName] == 'undefined') BX.X.Vue.Apps[AppName] = [];

          // поиск компонента
          var component = false;
          for (var i in loader.componentstores) {
            var componentstore = loader.componentstores[i];
            if (babelHelpers["typeof"](componentstore[ComponentName]) == 'object') {
              component = componentstore[ComponentName];
              break;
            }
          }
          if (!component && (_BX$App = BX.App) !== null && _BX$App !== void 0 && (_BX$App$Vue = _BX$App.Vue) !== null && _BX$App$Vue !== void 0 && _BX$App$Vue.Components && BX.App.Vue.Components[ComponentName]) {
            // если компонента нет - возможно это компонент приложения
            component = BX.App.Vue.Components[ComponentName];
          }
          if (!component && BX.X.Vue.Components && BX.X.Vue.Components[ComponentName]) {
            // если компонента нет - возможно это собственный компонент
            component = BX.X.Vue.Components[ComponentName];
          }

          // если компонент нашли
          if (component) {
            var datasetAttrs = '';
            for (var name in elm.dataset) {
              datasetAttrs = datasetAttrs + ' ' + name + '="' + elm.dataset[name] + '"';
            }
            var template = '<' + ComponentName + datasetAttrs + '>';
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // поддержка слотов
            var slotElms = elm.querySelectorAll('[vue-slot]');
            slotElms.forEach(function (slotElm) {
              var slotName = slotElm.getAttribute('vue-slot');
              var slotContent = slotElm.innerHTML;
              if (slotName) {
                slotContent = '<template v-slot:' + slotName + '>' + slotContent + '</template>';
              }
              template = template + slotContent;
            });
            // поддержка слотов
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            template = template + '</' + ComponentName + '>';
            var components = {};
            components[ComponentName] = component;
            var application = ui_vue3.BitrixVue.createApp({
              name: AppName,
              components: components,
              template: template
            });
            if (loader.store) application.use(loader.store);

            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            // поддержка индекций

            // предоставляем данные json
            var jsonElms = elm.querySelectorAll('[type="extension/settings"][name]');
            jsonElms.forEach(function (jsonElm) {
              application.provide(jsonElm.getAttribute('name'), JSON.parse(jsonElm.innerText));
            });

            // предоставляем данные о приложении
            application.provide('root', {
              'application': application,
              'name': AppName,
              'index': BX.X.Vue.Apps[AppName].length
            });

            // поддержка инъекций
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

            // удаляем для избежания повторного монтирования
            elm.removeAttribute('vue');
            if (!elm.getAttribute('vue')) {
              application.mount(elm);
              applicationsInRound.push(application);
              BX.X.Vue.Apps[AppName].push(application);
            } else {
              console.error('ERROR premounted!');
            }
          } else console.error('Component ' + ComponentName + ' not exists');
        });
        BX.onCustomEvent('x.vue.loader:inited', {
          applications: applicationsInRound,
          node: node
        });
      }, 200)
    };

    // внутреннее событие перестройки DOM
    BX.addCustomEvent('x.vue.loader:initVue', loader.init); //BX.onCustomEvent('x.vue.loader:initVue');

    // поддержка композита
    if (window.frameCacheVars !== undefined) {
      BX.addCustomEvent('onFrameDataReceived', loader.init);
    }

    // GO

    exports.loader = loader;

}((this.BX.X.Vue = this.BX.X.Vue || {}),BX.Vue3));
//# sourceMappingURL=s.js.map
