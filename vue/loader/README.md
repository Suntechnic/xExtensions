# Автозагрузка vue компонентов

Загрузчик создает экземпляры приложений и помещает их в списки находящиеся в BX.X.Vue.Apps,
именуя ключи как App{ИмяКорневогоКомпонента}

Для создания слота монтирования на страниц необходимо создать тег вида:
```html
<div vue="ИмяКорневогоКомпонента" data-имяПропса="значениеПропса"></div>
```

например для отбражения кнопок добавления товара 229353 в списки избранного и сравнения:

```html
<div vue="ListsButton" data-list="compare,favorites" data-productid="229353"></div>
```
Если необходимо передать в компонент сложные данные, это можно сделать через инъекцию,
для этого необходимо данные json поместить во внутрь слота, в токен script c name=КлючИнъекции
Например для формы оформления заказа:


```html
<section class="order" vue="Order">
    <script type="extension/settings" name="initdata">
        {"ajaxUrl":"\/bitrix\/components\/bitrix\/sale.order.ajax\/ajax.php","hashBasket":"fda088cce0595233895f37519d3d68c5"}
    </script>
</section>
```

Данные будут доступны в компоненте, в инъекции с ключом name.
В примере выше:
```js
inject: ['initdata'],
created () {
        // переносим инициализационные данные
        this.hashBasket = this.initdata.hashBasket;
        this.arResult = this.initdata.arResult;
    },
```

Нужно иметь ввиду что данный ключ не может быть root - такой ключ зарезервирован для инхъекции данных о корневом приложении

Если какие-то участки html-кода подгружены после события BX.ready, например по ajax,
или созданы другим образом и содержат компоненты которые нужно инициализировать,
то после их добавления необходимо вызвать событие x.vue.loader:initVue:
```js
BX.onCustomEvent('x.vue.loader:initVue');
```

Добавления других хранилищ компонентов
```js
window.addEventListener('load', ()=>{
        BX.ready(() => {
                loaderVue.addComponentStore(BX.TN.Vue.Components); // добавляем новое пространство с компонентами
                loaderVue.init(); // вызываем повторную инициализацию
            });
    });
```