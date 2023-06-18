export const Validator = {
    isEmail (email) {
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        return EMAIL_REGEXP.test(email);
    },
    isPositive (num) {
        return typeof num == 'number' && num > 0;
    },
    isInteger (num) {
        return typeof num == 'number' && Number.isInteger(num);
    },
    isPositiveInteger (num) {
        return this.isPositive(num) && this.isInteger(num);
    },
}

export const Grammar = {
    /*
    * Склонение по числам
    
    Grammar.declOfNum(val, [
            'товар', // 1 товар
            'товара', // 2 товара
            'товаров' // 10 товаров
        ]);
    
    */
    declOfNum (number, titles) // declOfNum(val, ['товар','товара','товаров'])
    {
        let cases = [2, 0, 1, 1, 1, 2];  
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
    },
}