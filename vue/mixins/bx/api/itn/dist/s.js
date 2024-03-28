/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
this.BX.X.Vue = this.BX.X.Vue || {};
(function (exports,x_izi) {
    'use strict';

    /**
     * Миксин уведомления через iziToast
     * обрабатываем и выводит сообщения из ответов api
     * стандарта x:
     * 
    {
        "status": "success",
        "data": {
            "debug": {
                "email": "madzhugin@yandex.ru"
            },
            "code": 0,
            "message": {
                "type": "info",
                "title": "",
                "text": "Вы успешно подписаны на рассылку",
                "note": ""
            }
        },
        "errors": []
    }
     */
    var IziToastApiNotifier = {
      methods: {
        iziToastNotify: function iziToastNotify(response) {
          if (response.status == 'error') {
            for (var i in response.errors) {
              var error = response.errors[i];
              x_izi.iziToast.error({
                timeout: 0,
                //title: 'Error',
                message: error.message
              });
            }
          } else if (response.status == 'success') {
            if (response.data.message) {
              if (typeof x_izi.iziToast[response.data.message.type] == 'function') {
                x_izi.iziToast[response.data.message.type](response.data.message);
              } else {
                x_izi.iziToast.show(response.data.message);
              }
            }
          }
        }
      }
    };

    exports.IziToastApiNotifier = IziToastApiNotifier;

}((this.BX.X.Vue.Mixins = this.BX.X.Vue.Mixins || {}),BX.X));
//# sourceMappingURL=s.js.map
