let val = document.querySelector('#values');
let result = document.querySelector('#result');
let lastEntryIsOperator = false;

function appendToResult(value) {
  if (lastEntryIsOperator && isNaN(value)) {
    // If the last entry was an operator and the current entry is also an operator or not a number, do nothing
    return;
  }

  val.value += value;
  lastEntryIsOperator = isNaN(value) && value !== '.'; // Check if the last entry is an operator
}

function clearResult() {
  val.value = '';
  result.value = '';
  lastEntryIsOperator = false; // Reset operator flag when clearing the result
}

function calculateResult() {
  try {
    const expression = val.value;
    const finalResult = evalExpression(expression);
    result.value = finalResult;
  } catch (error) {
    val.value = 'Error';
  }
}

function backspace() {
  val.value = val.value.slice(0, -1);
  lastEntryIsOperator = isNaN(val.value.slice(-1)) && val.value.slice(-1) !== '.';
}

function evalExpression(expression) {
  const operators = ['*', '/', '+', '-', '^'];
  const values = [];
  const ops = [];
  let number = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (!isNaN(char) || char === '.') {
      number += char;
    } else if (operators.includes(char)) {
      values.push(Number(number));
      number = '';
      while (ops.length > 0 && precedence(ops[ops.length - 1], char)) {
        values.push(applyOperation(ops.pop(), values.pop(), values.pop()));
      }
      ops.push(char);
    }
  }

  values.push(Number(number));

  while (ops.length > 0) {
    values.push(applyOperation(ops.pop(), values.pop(), values.pop()));
  }

  return values[0];
}

function precedence(op1, op2) {
  if (op2 === '(' || op2 === ')') {
    return false;
  }
  return (op1 === '*' || op1 === '/') && (op2 === '+' || op2 === '-' || op2 === '^');
}

function applyOperation(operator, b, a) {
  switch (operator) {
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw 'Division by zero';
      return a / b;
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '^':
      return a ** b;
    default:
      return null;
  }
}