# xExtensions

Набора js расширений для Bitrix.

Расширения собраны с помощью [bitrix-cli](https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=43&LESSON_ID=12435).

## x.core

Основной скрипт - загружается и инициализариует loaderVue. Вызывает событие x.core:loaded. Можно использовать  его для инициализации своих скриптов вместо слушателей события *load*, jQuery.ready, BX.ready и т.п:
```js
// https://dev.1c-bitrix.ru/api_help/js_lib/kernel/castom_events/bx_addcustomevent.php
BX.addCustomEvent('x.core:loaded' , ()=>{
    // ваш код
});
```

## x.izi

Это просто обертка для библиотеки [IZITOAST](https://izitoast.marcelodolza.com/). Используете ее для сообщений т.п. как описано [тут](./izi/README.md).

## x.util

Набор простых утилит, в виде чистых функций. [Мануал тут](./util/README.md). 

## x.vue

Набор простых компонентов Vue и загрузчик для комопнентов. [Мануал тут](./vue/README.md). 

### Loader

Загружает компоненты Vue на страницы из Components. Так же может принимать другие хранилища компонентов и загружаеть компоненты из них. [Мануал тут](./vue/loader/README.md).

### Mixins

Простые миксины для компонентов Vue:

- Grammar - миксин с методами грамматики
- Input - миксин для работы с v-model
- InputContented - миксин добавляющие методы отслеживания состояния поля ввода

См. использование в Components и комментарии в коде

### Components

Простые компоненты Vue:

- PhoneInput - поле для ввода телефона с маской
- Selector - простой select с поиском