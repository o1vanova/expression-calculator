function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    if(!validateBrackets(expr)) {
        throw new Error("ExpressionError: Brackets must be paired");
    } else {
        //remove all spaces
        let str = expr.replace(/ /ig, '');
        let result = calculateExpressionInBrackets(str);
        console.log(result) 
        return result;
    }    
}

function validateBrackets (expr) {
    let brackets = expr.match(/[()]/ig);
    let result = !brackets ? 0 : brackets.reduce((sum, current) => {
        if(current === '(') {
            sum++;
        } else {
            sum--;
        }
        return sum;
    }, 0);
    return result === 0;
}

function calculateExpressionInBrackets(expr) {
    if(/[()]/ig.test(expr)) {
        //console.log("bingo")

        let start = expr.indexOf('(');
        let end = expr.indexOf(')');
        let len = end - start;
        let next = expr.substr(start + 1, len - 1).indexOf('(');
        //console.log(start + ' ' + end + ' ' + next + ' ' + expr.substr(start + 1, len - 1));

        while(next > -1) {
            next++;
            start += next;
            len = end - start;

            next = expr.substr(start + 1, len).indexOf('(');
        }
        let str = expr.substr(start + 1, len - 1);
        
        let result = calculateExpression(str);
        let newStr = `${expr.substr(0, start)}${result}${expr.substr(end + 1)}`;
        //console.log(expr + " -> " + newStr)
        return calculateExpressionInBrackets(newStr);        
    } else {
        return calculateExpression(expr);
    }
}

function calculateExpression(expr) {
    //console.log("expr: " + expr);
    
    let isNumber = true;
    let numbers = [];
    let types = [];
    let  i = 0;
    let arr = expr.split('');
    let num = '';
    while(i < arr.length) {
        if(isNumber) {
            if(num.length === 0 || (!/[+-\/\*]/.test(arr[i]) || arr[i] === '.' || arr[i - 1] === 'e')) {
                num += arr[i];
                i++;
            } else { 
                isNumber = false;
            }

        } else {
            numbers.push(num);    
            num = '';

            types.push(arr[i])
            isNumber = true; 
            i++;   
        }
    }
    numbers.push(num);
    //console.log(numbers);console.log(types);

    if (numbers.length === 2) {
        return calculate(numbers[0], numbers[1], types[0]);
    } else {

        let newExpr = "";
        let part = "";
        if(/[+-]/.test(types[0]) && /[\/\*]/.test(types[1])) {
            part = `${numbers[0]}${types[0]}`;
            let i = 1;
            newExpr = numbers[i];
            
            while(i < types.length && /[\/\*]/.test(types[i])) {
                newExpr += `${types[i]}${numbers[i + 1]}`;
                i++;
            }
        }
        else {
            newExpr = `${numbers[0]}${types[0]}${numbers[1]}`;

        }
        let result = calculateExpression(newExpr);
        let index = part.length + newExpr.length;
        return calculateExpression(`${part}${result}${expr.substr(index, expr.length)}`);
    }
}

function calculate(x, y, type) {
    let left = Number(x);
    let right = Number(y);
    
    switch(type) {
        case '-' : {
            return left - right;
        }
        case '+' : {
            return left + right;
        }
        case '-' : {
            return left - right;
        }
        case '*' : {
            return left * right;
        }
        case '/' : {
            if(right === 0) {
                throw new Error("TypeError: Devision by zero.");
            } else {
                return left / right;
            }
        }
    }
}

module.exports = {
    expressionCalculator
}