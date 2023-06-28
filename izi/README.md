[IZITOAST](https://izitoast.marcelodolza.com/)

```js
import {iziToast} from 'x.izi';
```

```js
BX.X.iziToast.show({
        timeout: 0,
        title: 'Просто сообщение',
        message: 'С обычным текстом'
    });
    
BX.X.iziToast.warning({
        timeout: 0,
        title: 'Внимание!',
        message: 'Это сообщение предупреждающее о чем-то',
    });

BX.X.iziToast.error({
        timeout: 0,
        title: 'Ошибка',
        message: 'Всё пошло совсем не так',
    });
    
BX.X.iziToast.success({
        timeout: 0,
        title: 'Спасибо',
        message: 'Всё хорошо',
    });
    
BX.X.iziToast.info({
        timeout: 20000,
        overlay: true,
        id: 'inputs',
        zindex: 999,
        title: 'Inputs',
        message: 'Examples',
        position: 'center',
        drag: false,
        inputs: [
            ['<input type="checkbox">', 'change', function (instance, toast, input, e) {
                console.info(input.checked);
            }],
            ['<input type="text">', 'keyup', function (instance, toast, input, e) {
                console.info(input.value);
            }, true],
            ['<input type="number">', 'keydown', function (instance, toast, input, e) {
                console.info(input.value);
            }],
        ]
    });
```


```js
BX.X.iziToast.settings({
        timeout: 10000,
        resetOnHover: true,
        icon: 'material-icons',
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        titleColor: 'red',
        onOpening: function(){
            console.log('callback abriu!');
        },
        onClosing: function(){
            console.log("callback fechou!");
        }
    });
```


```js
BX.X.iziToast.show({
        id: null, 
        class: '',
        title: '',
        titleColor: '',
        titleSize: '',
        titleLineHeight: '',
        message: '',
        messageColor: '',
        messageSize: '',
        messageLineHeight: '',
        backgroundColor: '',
        theme: 'light', // dark
        color: '', // blue, red, green, yellow
        icon: '',
        iconText: '',
        iconColor: '',
        iconUrl: null,
        image: '',
        imageWidth: 50,
        maxWidth: null,
        zindex: null,
        layout: 1,
        balloon: false,
        close: true,
        closeOnEscape: false,
        closeOnClick: false,
        displayMode: 0, // once, replace
        position: 'bottomRight', // bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter, center
        target: '',
        targetFirst: true,
        timeout: 5000,
        rtl: false,
        animateInside: true,
        drag: true,
        pauseOnHover: true,
        resetOnHover: false,
        progressBar: true,
        progressBarColor: '',
        progressBarEasing: 'linear',
        overlay: false,
        overlayClose: false,
        overlayColor: 'rgba(0, 0, 0, 0.6)',
        transitionIn: 'fadeInUp',
        transitionOut: 'fadeOut',
        transitionInMobile: 'fadeInUp',
        transitionOutMobile: 'fadeOutDown',
        buttons: {},
        inputs: {},
        onOpening: function () {},
        onOpened: function () {},
        onClosing: function () {},
        onClosed: function () {}
    });
```
