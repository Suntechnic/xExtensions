import {loader as loaderVue} from 'x.vue.loader';

export const ControllersInstances = {};
// BX.X.ControllersInstances - инстанцы контроллеров

export const core = {

    Controller: class {
        constructor (node,code,options) {

            // получаем ноду
            if (typeof node == 'string') {
                let selector = node;
                node = document.querySelector(selector);
                if (!node) console.error('Invalid selector',selector);
            }
            if (!node) {
                console.error('Invalid node for controller');
                return null;
            } 

            // если ноде уже назначен идентификатор контролера
            if (node.dataset?.controller && ControllersInstances[node.dataset.controller]) {
            return ControllersInstances[node.dataset.controller]; // возвращем его
            }

            // регистрируем контроллер этой ноды

            this.node = node; // назначаем ноду в контролер
            code = code || '';
            this.uid = code+'_'+(Math.floor(Math.random() * 10000000));
            while (ControllersInstances[this.uid]) {
                this.uid = code+'_'+(Math.floor(Math.random() * 10000000));
            }
            
            ControllersInstances[this.uid] = this;
            node.dataset.controller = this.uid;

            return this.init(options || {});
        }
        init () {}
    },

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