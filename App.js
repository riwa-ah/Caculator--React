import './App.css';
import './styles.css';
import { useReducer } from 'react';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';

export const ACTIONS = {
  CHOOSE_OPERATION: 'choose-operation',
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) return { ...state, currOp: payload.digit, overwrite: false };
      if (payload.digit === "0" && state.currOp === "0") return state;
      if (payload.digit === "." && state.currOp.includes(".")) return state;
      return { ...state, currOp: `${state.currOp || ""}${payload.digit}` };

    case ACTIONS.CLEAR:
      return { currOp: null, prevOp: null, operation: null, overwrite: false };

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) return { ...state, currOp: null, overwrite: false };
      if (!state.currOp) return state;
      if (state.currOp.length === 1) return { ...state, currOp: null };
      return { ...state, currOp: state.currOp.slice(0, -1) };

    case ACTIONS.CHOOSE_OPERATION:
      if (!state.currOp && !state.prevOp) return state;
      if (!state.prevOp) return { ...state, operation: payload.operation, prevOp: state.currOp, currOp: null };
      return { ...state, prevOp: evaluate(state), operation: payload.operation, currOp: null };

    case ACTIONS.EVALUATE:
      if (!state.currOp || !state.prevOp || !state.operation) return state;
      return { ...state, currOp: evaluate(state), prevOp: null, operation: null, overwrite: true };

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
      {/* Output display */}
      <div className="output">
        <div className="prev-operand">{prevOp} {operation}</div>
        <div className="curr-operand">{currOp}</div>
      </div>

      {/* First row: AC, Del, / */}
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>Del</button>
      <OperationButton operation="/" dispatch={dispatch} />

      {/* 7,8,9,* */}
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />

      {/* 4,5,6,+ */}
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />

      {/* 1,2,3,- */}
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />

      {/* .,0,= */}
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
