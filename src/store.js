import { useReducer, createContext } from "react";

export const ConcertContext = createContext();

const initialState = {
  events: [],
  date: new Date(),
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        events: [...state.events, action.payload],
      };
    case "UPDATE_ITEM":
      return {
        events: [...state.events],
        date: action.payload.date,
      };
    default:
      return {
        state,
      };
  }
};

export const ConcertContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ConcertContext.Provider value={[state, dispatch]}>
      {props.children}
    </ConcertContext.Provider>
  );
};
