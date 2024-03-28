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

import {iziToast} from 'x.izi';
export const IziToastApiNotifier = {
	methods: {
        iziToastNotify (response) {
            if (response.status == 'error') {
                for (let i in response.errors) {
                    let error = response.errors[i];
                    iziToast.error({
                            timeout: 0,
                            //title: 'Error',
                            message: error.message,
                        });
                }
            } else if (response.status == 'success') {
                if (response.data.message) {
                    if (typeof iziToast[response.data.message.type] == 'function') {
                        iziToast[response.data.message.type](response.data.message);
                    } else {
                        iziToast.show(response.data.message);
                    }
                }
            }
        }
    }
}
