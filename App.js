import './App.css';
import './styles.css';
import { useReducer } from 'react';
import Digit_button from './Digit_button';
import Operation_button from './Operation_button';

export const Action = {
  Choose_Op: 'choose-op',
  Add_digit: 'add-digit',
  Clear: 'clear',
  Delete_digit: 'delete-digit',
  Evaluate: 'evaluate',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case Action.Add_digit:
      if (state.overwrite) return { ...state, currOp: payload.digit, overwrite: false };
      if (payload.digit === "0" && state.currOp === "0") return state;
      if (payload.digit === "." && state.currOp?.includes(".")) return state;
      return { ...state, currOp: `${state.currOp || ""}${payload.digit}` };

    case Action.Clear:
      return { currOp: null, prevOp: null, operation: null, overwrite: false };

    case Action.Delete_digit:
      if (state.overwrite) return { ...state, currOp: null, overwrite: false };
      if (!state.currOp) return state;
      if (state.currOp.length === 1) return { ...state, currOp: null };
      return { ...state, currOp: state.currOp.slice(0, -1) };

    case Action.Choose_Op:
      if (!state.currOp && !state.prevOp) return state;
      if (!state.prevOp)
        return { ...state, operation: payload.operation, prevOp: state.currOp, currOp: null };
      return { ...state, prevOp: evaluate(state), operation: payload.operation, currOp: null };

    case Action.Evaluate:
      if (!state.currOp || !state.prevOp || !state.operation) return state;
      return {
        ...state,
        currOp: evaluate(state),
        prevOp: null,
        operation: null,
        overwrite: true,
      };

    default:
      return state;
  }
}

function evaluate({ currOp, prevOp, operation }) {
  const prev = parseFloat(prevOp);
  const curr = parseFloat(currOp);
  if (isNaN(prev) || isNaN(curr)) return "";

  switch (operation) {
    case "+": return (prev + curr).toString();
    case "-": return (prev - curr).toString();
    case "*": return (prev * curr).toString();
    case "/": return curr === 0 ? "ERROR" : (prev / curr).toString();
    default: return "";
  }
}

function App() {
  const [{ currOp, prevOp, operation }, dispatch] = useReducer(reducer, {
    currOp: null,
    prevOp: null,
    operation: null,
    overwrite: false,
  });

  return (
    <div className="calculator">

      <div className="output">
        <div className="prev-operand">{prevOp} {operation}</div>
        <div className="curr-operand">{currOp}</div>
      </div>

      <button className="span-two" onClick={() => dispatch({ type: Action.Clear })}>AC</button>
      <button onClick={() => dispatch({ type: Action.Delete_digit })}>Del</button>
      <Operation_button operation="/" dispatch={dispatch} />

      <Digit_button digit="7" dispatch={dispatch} />
      <Digit_button digit="8" dispatch={dispatch} />
      <Digit_button digit="9" dispatch={dispatch} />
      <Operation_button operation="*" dispatch={dispatch} />

      <Digit_button digit="4" dispatch={dispatch} />
      <Digit_button digit="5" dispatch={dispatch} />
      <Digit_button digit="6" dispatch={dispatch} />
      <Operation_button operation="+" dispatch={dispatch} />

      <Digit_button digit="1" dispatch={dispatch} />
      <Digit_button digit="2" dispatch={dispatch} />
      <Digit_button digit="3" dispatch={dispatch} />
      <Operation_button operation="-" dispatch={dispatch} />

      <Digit_button digit="." dispatch={dispatch} />
      <Digit_button digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: Action.Evaluate })}>=</button>
    </div>
  );
}

export default App;
