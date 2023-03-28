import {BitrixVue} from 'ui.vue3';

// функция инициализации
export const loader = {
    componentstores: [],
    store: false,
    
    addComponentStore (store)  {
        for (let i in loader.componentstores) {
            if (loader.componentstores[i] == store) return;
        }
        loader.componentstores.push(store);
        console.log('addComponentStore', loader.componentstores);
    },
    
    addStore (store)  {
        loader.store = store;
    },


    init: BX.debounce((node) =>  {
        console.log('initVue', node);
        
        node = node || document
        node.querySelectorAll('[vue]').forEach((elm) => {
            
                let ComponentName = elm.getAttribute('vue');
                
                let AppName = 'App'+ComponentName;
                if (typeof BX.X.Vue.Apps == 'undefined') BX.X.Vue.Apps = {};
                if (typeof BX.X.Vue.Apps[AppName] == 'undefined') BX.X.Vue.Apps[AppName] = [];
                
                // поиск компонента
                let component = false;
                for (let i in loader.componentstores) {
                    let componentstore = loader.componentstores[i];
                    if (typeof componentstore[ComponentName] == 'object') {
                        component = componentstore[ComponentName];
                        break;
                    }
                }
                if (!component 
                        && BX.App?.Vue?.Components 
                        && BX.App.Vue.Components[ComponentName]
                    ) { // если компонента нет - возможно это компонент приложения
                    component = BX.App.Vue.Components[ComponentName];
                }
                if (!component 
                        && BX.X.Vue.Components 
                        && BX.X.Vue.Components[ComponentName]
                    ) { // если компонента нет - возможно это собственный компонент
                    component = BX.X.Vue.Components[ComponentName];
                }
                
                // если компонент нашли
                if (component) {
                    let datasetAttrs = '';
                    for (let name in elm.dataset) {
                        datasetAttrs = datasetAttrs+' '+name+'="'+elm.dataset[name]+'"';
                    }
                    let template = '<'+ComponentName+datasetAttrs+'/>';
                    
                    const components = {};
                    
                    components[ComponentName] = component;
                    const application = BitrixVue.createApp({
                            name: AppName,
                            components: components,
                            template: template
                        });

                    if (loader.store) application.use(loader.store);
                    
                    // предоставляем данные json
                    let jsonElms = elm.querySelectorAll('[type="extension/settings"][name]');
                    jsonElms.forEach((jsonElm)=>{
                            application.provide(jsonElm.getAttribute('name'),JSON.parse(jsonElm.innerText));
                        });
                    
                    // предоставляем данные о приложении
                    application.provide('root',{
                            'application': application,
                            'name': AppName,
                            'index': BX.X.Vue.Apps[AppName].length
                        });
                
                    
                    // удаляем для избежания повторного монтирования
                    elm.removeAttribute('vue');
                    if (!elm.getAttribute('vue')) {
                        application.mount(elm);
                        BX.X.Vue.Apps[AppName].push(application);
                    } else {
                        console.error('ERROR premounted!');
                    }
                    
                    
                    
                } else console.error('Component '+ComponentName+' not exists');
            })
    }, 200)
}


// внутреннее событие перестройки DOM
BX.addCustomEvent('x.vue.loader:initVue', loader.init); //BX.onCustomEvent('x.vue.loader:initVue');

// поддержка композита
if (window.frameCacheVars !== undefined) {
    BX.addCustomEvent('onFrameDataReceived', loader.init);
}


// GO

