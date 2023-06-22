/* eslint-disable */
this.BX = this.BX || {};
this.BX.X = this.BX.X || {};
(function (exports) {
    'use strict';

    var Validator = {
      isEmail: function isEmail(email) {
        var EMAIL_REGEXP = /^(((?:(?![\t-\r "\(\),\.:-<>@\[\]\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])[\s\S])+(\.(?:(?![\t-\r "\(\),\.:-<>@\[\]\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])[\s\S])+)*)|("(?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+"))@(((?:(?![\t-\r "\(\),\.:-<>@\[\]\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])[\s\S])+\.)+(?:(?![\t-\r "\(\),\.:-<>@\[\]\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])[\s\S]){2,})$/i;
        return EMAIL_REGEXP.test(email);
      },
      isPositive: function isPositive(num) {
        return typeof num == 'number' && num > 0;
      },
      isInteger: function isInteger(num) {
        return typeof num == 'number' && Number.isInteger(num);
      },
      isPositiveInteger: function isPositiveInteger(num) {
        return this.isPositive(num) && this.isInteger(num);
      }
    };
    var Grammar = {
      /*
      * Склонение по числам
      
      Grammar.declOfNum(val, [
              'товар', // 1 товар
              'товара', // 2 товара
              'товаров' // 10 товаров
          ]);
      
      */
      declOfNum: function declOfNum(number, titles)
      // declOfNum(val, ['товар','товара','товаров'])
      {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]];
      }
    };

    exports.Validator = Validator;
    exports.Grammar = Grammar;

}((this.BX.X.Util = this.BX.X.Util || {})));
//# sourceMappingURL=s.js.map
