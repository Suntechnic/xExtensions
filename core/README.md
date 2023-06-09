# Core - ядро js

## Контроллеры

Контроллеры - способ работать с элементами страницы в jQuery-style в любых местах приложения.

Пример контроллера:
```js
class Header extends BX.X.Core.Controller {
    setStyle (style) {
        style = style || ''; 
        this.node.setAttribute('style',style);
    }
}

export {Header};
```

Пример использования контроллера:
```js
let header = new Header('header.header');
header.setStyle(styleHeader);
```

## Ajax

Кэширующий метод ajax runAction - просто замените BX.ajax.runAction на BX.X.ajax.runAction и добавьте третим параметром время кэша в секундах. 0 - не кэшировать.