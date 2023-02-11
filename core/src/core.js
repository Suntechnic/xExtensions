// экстеншены которые должны быть на всех страницах
import {init as initVue} from 'x.vue.loader';

export const Core = {
    
}

window.addEventListener('load', ()=>{
    BX.ready(() => {
            initVue();
        });
});

