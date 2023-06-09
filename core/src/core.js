import {loader as loaderVue} from 'x.vue.loader';

export const ControllersInstances = {};

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

export const ajax = {

    cache: {},
    runAction (action,config,cacheTTL) {
        cacheTTL = parseInt(cacheTTL) || 0;
        let promise = new Promise((resolve, reject) => {

                if (cacheTTL) {
                    let hash = BX.md5(action + JSON.stringify(config));

                    if (this.cache[hash]) {
                        resolve(JSON.parse(this.cache[hash]));
                        return;
                    }

                    BX.ajax.runAction(action, config).then((response) => {
                            this.cache[hash] = JSON.stringify(response);
                            setTimeout(()=>{
                                    delete this.cache[hash];
                                },cacheTTL*1000);
                            resolve(response);

                        }, reject);
                } else {
                    BX.ajax.runAction(action, config).then(resolve, reject);
                }
            })

        return promise;
    }
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