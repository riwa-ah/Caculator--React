import { Action } from "./App";

export default function Digit_button({ dispatch, digit }) {
  return (
    <button onClick={() => dispatch({ type: Action.Add_digit, payload: { digit } })}>
      {digit}
    </button>
  );
}
