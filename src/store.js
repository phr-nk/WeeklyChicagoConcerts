import { useReducer, createContext } from "react";

export const ConcertContext = createContext();

const initialState = {
  events: [],
  date: new Date(),
  showSubscribe: true,
  showAbout: false,
  showCalendar: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        events: [...state.events, action.payload],
        date: state.date,
        showSubscribe: state.showSubscribe,
        showAbout: state.showAbout,
        showCalendar: state.showCalendar,
      };
    case "UPDATE_ITEM":
      return {
        events: [...state.events],
        date: action.payload.date,
        showSubscribe: state.showSubscribe,
        showAbout: state.showAbout,
        showCalendar: state.showCalendar,
      };
    case "UPDATE_MODAL_SUBSCRIBE":
      return {
        events: [...state.events],
        date: state.date,
        showSubscribe: action.payload.showSubscribe,
        showAbout: state.showAbout,
        showCalendar: state.showCalendar,
      };
    case "UPDATE_MODAL_ABOUT":
      return {
        events: [...state.events],
        date: state.date,
        showSubscribe: state.showSubscribe,
        showAbout: action.payload.showAbout,
        showCalendar: state.showCalendar,
      };
    case "UPDATE_MODAL_CALENDAR":
      return {
        events: [...state.events],
        date: state.date,
        showSubscribe: state.showSubscribe,
        showAbout: state.showAbout,
        showCalendar: action.payload.showCalendar,
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
