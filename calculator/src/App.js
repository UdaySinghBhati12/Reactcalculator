import React from "react";
import { useReducer } from "react";
import './App.css';
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
//create object of actions
export const ACTION = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose-operation",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate"

}
//reducer function with different cases of object
function reducer(state, { type, payload }) {
  switch (type) {
    //add digit case in action object
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentoperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentoperand === "0") return state
      if (payload.digit === "." && state.currentoperand.includes(".")) return state


      return {
        ...state,
        currentoperand: `${state.currentoperand || ""}${payload.digit}`,
      }
    case ACTION.CLEAR:
      return {}

    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentoperand: null,
        }
      }
      if (state.currentoperand == null) return state
      if (state.currentoperand.length === 1) {
        return {
        //These three dots are called the spread syntax or spread operator.
         //The spread syntax is a feature of ES6, and 
       //it's also used in React. Spread syntax allows you to deconstruct an array or object into separate variables.
          ...state,
          currentoperand: null
        }
      }
      return {
        ...state,
        currentoperand: state.currentoperand.slice(0, -1),
      }

    case ACTION.CHOOSE_OPERATION:
      if (state.currentoperand == null && state.previousoperand == null) {
        return state
      }
      if (state.currentoperand == null) {
        return {
          ...state,
          operation: payload.operation,
        }
      }
      if (state.previousoperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousoperand: state.currentoperand,
          currentoperand: null
        }
      }
      return {
        ...state,
        previousoperand: evaluate(state),
        operation: payload.operation,
        currentoperand: null,
      }


    case ACTION.EVALUATE:
      if (state.operation == null || state.currentoperand == null || state.previousoperand == null) {
        return state
      }

      return {
        ...state,
        previousoperand: null,
        operation: null,
        currentoperand: evaluate(state),
      }
  }
}

// for calculate the value
function evaluate({ currentoperand, previousoperand, operation }) {
  const prev = parseFloat(previousoperand)
  const current = parseFloat(currentoperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0, })
// compute decimal digit value
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`

}
function App() {

  const [{ currentoperand, previousoperand, operation }, dispatch] = useReducer(reducer, {})



  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousoperand)} {operation} </div>

        <div className="current-operand">{formatOperand(currentoperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTION.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}>DEL</button>
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <OperationButton operation="/" dispatch={dispatch} />
      <OperationButton operation="." dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTION.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
