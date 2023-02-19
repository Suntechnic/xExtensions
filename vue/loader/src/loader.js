import {BitrixVue} from 'ui.vue3';

// функция инициализации
export const loader = {
    componentstores: [],
    
    addComponentStore (store)  {
        loader.componentstores.push(store);
    },
    
    init (node)  {
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
                    let componentstore = this.componentstores[i];
                    if (typeof componentstore[ComponentName] == 'object') {
                        component = componentstore[ComponentName];
                        break;
                    }
                }
                if (!component && BX.X.Vue.Components) { // если компонента нет - возможно это собственный компонент
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
                    
                    //application.use(store);
                    
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
    }
}


// внутреннее событие перестройки DOM
BX.addCustomEvent('x.vue.loader:initVue', loader.init); //BX.onCustomEvent('x.vue.loader:initVue');

// поддержка композита
if (window.frameCacheVars !== undefined) {
    BX.addCustomEvent('onFrameDataReceived', loader.init);
}

