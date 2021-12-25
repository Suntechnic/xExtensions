BX.ready(function(){
    
    // функция инициализации
    let initVue = () => {document.querySelectorAll('[vue]').forEach((elm) => {
            
            let datasetAttrs = '';
            for (let name in elm.dataset) {
                datasetAttrs = datasetAttrs+' '+name+'="'+elm.dataset[name]+'"';
            }
            let template = '<'+elm.getAttribute('vue')+datasetAttrs+'/>';
            
            if (APP?.config?.debug > 2) console.log(
                    'load vue component',
                    elm.getAttribute('vue'),
                    elm.dataset
                );
            
            BX.BitrixVue.createApp({
                    el: elm,
                    template: template
                });
        })};
    
    // инициализация компонентов
    initVue();
    
    // поддержка композита
    if (window.frameCacheVars !== undefined) {
        BX.addCustomEvent("onFrameDataReceived" , initVue);
    }
});
