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
    },
    
    addStore (store)  {
        loader.store = store;
    },


    delete (name,i) {
        if (BX.X.Vue.Apps[name]?.length) {
            if (typeof i != 'undefined') {
                if (BX.X.Vue.Apps[name][i]) {
                    BX.X.Vue.Apps[name][i].unmount();
                    delete(BX.X.Vue.Apps[name][i]);
                }
            } else {
                for (let i in BX.X.Vue.Apps[name]) {
                    loader.delete('name',i);
                }
            }
        }
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

                    let template = '<'+ComponentName+datasetAttrs+'>';
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // поддержка слотов
                    let slotElms = elm.querySelectorAll('[vue-slot]');
                    slotElms.forEach((slotElm)=>{
                            let slotName = slotElm.getAttribute('vue-slot');
                            let slotContent = slotElm.innerHTML;
                            if (slotName) {
                                slotContent = '<template v-slot:'+slotName+'>'+slotContent+'</template>';
                            }
                            template = template + slotContent;
                        });
                    // поддержка слотов
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    template = template + '</'+ComponentName+'>';
                    
                    const components = {};
                    
                    components[ComponentName] = component;
                    const application = BitrixVue.createApp({
                            name: AppName,
                            components: components,
                            template: template
                        });

                    if (loader.store) application.use(loader.store);
                    
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    // поддержка индекций

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
                        
                    // поддержка индекций
                    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                
                    
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

