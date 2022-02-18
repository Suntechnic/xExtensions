'use strict'
BX.ready(function(){
    // функция инициализации
    let initVue = (node) => {
            console.log('initVue', node);
            node = node || document
            node.querySelectorAll('[vue]').forEach((elm) => {
            
                    let datasetAttrs = '';
                    for (let name in elm.dataset) {
                        datasetAttrs = datasetAttrs+' '+name+'="'+elm.dataset[name]+'"';
                    }
                    let template = '<'+elm.getAttribute('vue')+datasetAttrs+'/>';
                    
                    if (typeof APP == 'object' && (APP?.config?.debug > 2)) console.log(
                            'load vue component',
                            elm.getAttribute('vue'),
                            elm.dataset
                        );
                    
                    BX.BitrixVue.createApp({
                            el: elm,
                            template: template
                        });
                })
        };
    
    // инициализация компонентов
    initVue();
    
    // внутреннее событие перестройки DOM
    BX.addCustomEvent('x.vue.loader:initVue' , initVue); //BX.onCustomEvent('x.vue.loader:initVue');
    
    // поддержка композита
    if (window.frameCacheVars !== undefined) {
        BX.addCustomEvent('onFrameDataReceived' , initVue);
    }
});
