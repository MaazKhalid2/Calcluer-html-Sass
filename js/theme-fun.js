    /* Inspired by https://freshman.tech/calculator/ tutorial */
const display = document.querySelector('.calculator__top--display');

const calculator = {
  displayValue: '0',
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

// if key is a number
function inputDigit(digit) {
    // if it's after an operator or after a previous value of 0, displayValue is digit
    // if it's after zero , the new value displayed is digit or previousValue + digit 
        if (
            calculator.operator == 'smile' ||
            calculator.operator == 'punchline' ||
            calculator.operator == 'arrow' ||
            calculator.operator == 'square'
        ) {
            calculator.displayValue = '';
            calculator.operator = null
        }
        if (
            calculator.waitingForSecondOperand || 
            calculator.displayValue == '0'
        ) {
            calculator.displayValue = digit;
            calculator.waitingForSecondOperand = false;
        } else {
            calculator.displayValue = calculator.displayValue + digit;
        }
}

// if key is a dot,displayValue is the previous value + dot if it doesn't contain a dot already.
function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// if key is an operator
function handleOperator(nextOperator) {
 const inputValue = parseFloat(calculator.displayValue);
    // if punchline or smile keys
    if (isNaN(inputValue)) {
        return;
    }
    
    // if there was already an operator clicked and we click on another operator : we update the calculator operator property
    if (calculator.operator && calculator.waitingForSecondOperand)  {
    calculator.operator = nextOperator;
    return;
  }
    // if there is no firstOperand and inputValue is not NaN, firstOperand is inputValue
    // else firstOperand is the result of calculate function and we can update the screen
  if (calculator.firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (calculator.operator) {
    const result = calculate(calculator.firstOperand, inputValue, calculator.operator);
            /* we use a .toFixed method because in a computer, with a binary representation of numbers, 0,1 is a rounded number to the nearest number in that format which result in an error (for example if you add 0,1 + 0,2 you should have 0,3000000000000004). We use .toFixed with 7 for precision.
            */
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = result;
  }
  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}


function calculate(firstOperand, secondOperand, operator) {
    if (operator == '+') {
    return firstOperand + secondOperand;
  } else if (operator == '-') {
    return firstOperand - secondOperand;
  } else if (operator == '*') {
    return firstOperand * secondOperand;
  } else if (operator == '/') {
    return firstOperand / secondOperand;
  }
    // if operator is =
  return secondOperand;
}

function handleSquareRoot() {
    if (isNaN(calculator.displayValue)) {
        return;
    }
    calculator.displayValue = Math.sqrt(parseFloat(calculator.displayValue));
    calculator.operator = 'square';
}

function resetCalculator() {
        calculator.displayValue = '0';
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

function handleSmileKeys(value) {
    switch (value) {
        case "f":
            calculator.displayValue = "Front inspired by Canon";
            break;
        case "b":
            calculator.displayValue = "Back inspired by Freshman";
            break;
        case "?":
            calculator.displayValue = "CLick on any key !";
            break;
    }
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = 'smile';
}

function handlePunchline(value) {
    calculator.displayValue = value;
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = 'punchline';
}

// update screen
function updateDisplay() {
  display.value = calculator.displayValue;
}

function colorDisplay() {
    display.classList.toggle('on');
}

function handleArrow(emoji) {
    calculator.displayValue = emoji;
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = 'arrow';
}

updateDisplay();

const keys = document.querySelector('.calculator__bottom');
keys.addEventListener('click', (event) => {
  const { target } = event;
  if (!target.matches('button')) {
    return;
  }
        
        switch (target.dataset.action) {
            case 'operator':
                handleOperator(target.value);
                break;
            case 'decimal':
                inputDecimal(target.value);
                break;
            case 'squareRoot':
                handleSquareRoot();
                break;
            case 'smile':
                handleSmileKeys(target.value);
                break;
            case 'punchline':
                handlePunchline(target.value);
                break;
            case 'color':
                colorDisplay();
                break;
            case 'arrow':
                handleArrow(target.value);
                break;
            case 'clear':
                resetCalculator();
                break;
            default:
                if (Number.isInteger(parseFloat(target.value))) {
                    inputDigit(target.value);
                }
        }
  updateDisplay();
});