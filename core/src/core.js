import {loader as loaderVue} from 'x.vue.loader';

export const Core = {
    
}

console.time('x.core.load');
window.addEventListener('load', ()=>{
    BX.ready(() => {
            BX.onCustomEvent('x.core:loaded');
            console.timeEnd('x.core.load');

            loaderVue.init();

            BX.onCustomEvent('x.core:inited');
        });
});