import {BitrixVue} from 'ui.vue3';

/*
* автозагрузка vue компонентов
* Загрузчик создает экземпляры приложений и помещает их в списки находящиеся в BX.X.Vue.Apps,
* именуя ключи как App{ИмяКорневогоКомпонента}
*
* Для создания слота монтирования на страниц необходимо создать тег вида:
* <div vue="ИмяКорневогоКомпонента" data-имяПропса="значениеПропса"></div>
* например для отбражения кнопок добавления товара 229353 в списки избранного и сравнения:
* <div vue="ListsButton" data-list="compare,favorites" data-productid="229353"></div>
*
* Если необходимо передать в компонент сложные данные, это можно сделать через инъекцию,
* для этого необходимо данные json поместить во внутрь слота, в токен script c name=КлючИнъекции
* Например для формы оформления заказа:

    <section class="order" vue="Order">
        <script type="application/json" name="initdata">
            {"ajaxUrl":"\/bitrix\/components\/bitrix\/sale.order.ajax\/ajax.php","hashBasket":"fda088cce0595233895f37519d3d68c5"}
        </script>
    </section>

*
* Данные будут доступны в компоненте, в инъекции с ключом name.
* В примере выше:

    inject: ['initdata'],
    created () {
            // переносим инициализационные данные
            this.hashBasket = this.initdata.hashBasket;
            this.arResult = this.initdata.arResult;
        },

*
* Нужно иметь ввиду что данный ключ не может быть root - такой ключ зарезервирован для инхъекции данных о корневом приложении
*
* Елси какие-то участки html-кода подгружены после события BX.ready, например по ajax,
* или созданы другим образом и содержат компоненты которые нужно инициализировать,
* то после их добавления необходимо вызвать событие x.vue.loader:initVue:

    BX.onCustomEvent('x.vue.loader:initVue');

* 
*/

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

