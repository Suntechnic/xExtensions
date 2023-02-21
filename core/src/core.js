// экстеншены которые должны быть на всех страницах
import {loader as loaderVue} from 'x.vue.loader';

export const Core = {
    
}

window.addEventListener('load', ()=>{
    BX.ready(() => {
            loaderVue.init();
        });
});

