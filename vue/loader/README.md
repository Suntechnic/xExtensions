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


## Инъекции

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
или
```js
inject: ['itemslist'],
data () {
    return {
        items: this.itemslist
    }
},
```
:D

Нужно иметь ввиду что данный ключ не может быть root - такой ключ зарезервирован для инхъекции данных о корневом приложении


## Слоты

Для добавления слотов немобходимо использовать атрибут vue-slot:

```html
<div vue="ListsButton" data-list="compare,favorites" data-productid="229353">
    <div vue-slot="discount">Скидка 50%</div>
    <div vue-slot>Описание</div>
</div>
```
Имя слота необходимо передавать в этом атрибуте. Допускаются неименнованные слоты. Контетом слота будет содержимое элемента с атрибутом vie-slot


## Реинициализация

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
Есть два хранилища которые просматриваются в любом случае: BX.X.Vue.Components (хранилище компонентов X) и BX.App.Vue.Components (хранилище компонентов приложения).

Правила именования хранилищ:  
BX.{Vendor}.Vue.Components - для хранилищ расширений вендора
BX.{Vendor}.{Module|Component}.Vue.Components - для хранилищ расширений модулей или компонентов вендора  

## События

После завершения инициализации запускает событие 'x.vue.loader:inited' передавая в него список инициализированных приложений.
