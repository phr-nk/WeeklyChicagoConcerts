import React, { useEffect, useState } from "react";
import Day from "../day/day";
import Chip from "@mui/material/Chip";
import { ThemeProvider, createTheme } from "@mui/material";
import "./concertList.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ab000e",
    },
  },
});

var days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

function ConcertList(props) {
  const [artists, setArtists] = useState();
  const [venues, setVenues] = useState();
  const [selectedVenue, setVenue] = useState("all");
  const [selectedDay, setDay] = useState("all");
  const [selectedVariant, setVariant] = useState("outline");
  const [selectedColor, setColor] = useState("default");

  useEffect(() => {
    const groupByDay = groupBy("dayOfWeek");
    const groupByVenue = groupBy("venue");
    const daysGrouped = groupByDay(props.data);
    const venuesGrouped = groupByVenue(props.data);
    setVenues(venuesGrouped);
    orderData(daysGrouped);
  }, []);

  const handleClick = (chip) => () => {
    setVenue(chip);
    setDay(chip)
    setVariant("outline");
    setColor("warning");

  };

  function returnConcertsForVenue(venue, concerts) {
    var concertList = [];
    concerts.forEach((el) => {
      if (el.venue === venue) {
        concertList.push(el);
      }
    });
    return concertList;
  }
  function orderData(concerts) {
    var daysInOrder = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
    Object.entries(concerts).forEach(([k, v]) => {
      v.forEach((el) => {
        daysInOrder[k].push(el);
      });
    });
    setArtists(daysInOrder);
  }

  if (artists == null) {
    return <div></div>;
  } else {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <div className="venueChips">
          <Chip
              onClick={handleClick("all")}
              style={{ margin: "0.5rem" }}
              label="All"
              variant={
                selectedDay == "all" && selectedVariant ? "filled" : "filled"
              }
              color={
                selectedDay == "all" && selectedColor ? "warning" : "default"
              }
            />
            {Object.entries(days).map(([k, v]) => {
              return (
                <Chip
                  onClick={handleClick(v)}
                  style={{ margin: "0.5rem" }}
                  label={v}
                  variant={
                    selectedDay == v && selectedVariant ? "filled" : "filled"
                  }
                  color={
                    selectedDay == v && selectedColor ? "warning" : "default"
                  }
                />
              );
            })}
            <br></br>
            
          </div>
          <div className="concertList">
            <div className="venueContainer">
              {Object.entries(artists).map(([k, v]) => {
                if (selectedVenue === "all") {
                  return <Day date={props.date} venue={k} concerts={v} />;
                } else {
                  return (
                    <Day
                      date={props.date}
                      venue={k}
                      concerts={returnConcertsForVenue(selectedVenue, v)}
                    />
                  );
                }
              })}
            </div>
          </div>
        </ThemeProvider>
      </div>
    );
  }
}

export default ConcertList;
