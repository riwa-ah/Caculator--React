import { Action } from "./App";

export default function Operation_button({ dispatch, operation }) {
  return (
    <button onClick={() => dispatch({ type: Action.Choose_Op, payload: { operation } })}>
      {operation}
    </button>
  );
}
