import {loader as loaderVue} from 'x.vue.loader';

export const Core = {
    
}

console.time('realoader');
window.addEventListener('load', ()=>{
    BX.ready(() => {
            console.timeEnd('realoader');
            loaderVue.init();
            BX.onCustomEvent('x.core:loaded');
        });
});