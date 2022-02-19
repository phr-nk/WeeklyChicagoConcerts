import React, { useEffect, useState } from "react";
import axios from "axios";
import Day from "../day/day";
import Spinner from "react-spinkit";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import {ThemeProvider, createTheme } from "@mui/material";
import "./concertList.css";


const theme = createTheme({
  palette: {
    primary: {
      main: "#ab000e",
    },
    
  },
});


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
  const [selectedVariant, setVariant] = useState("outline");
  const [selectedColor, setColor] = useState("default")

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
    setVariant("outline");
    setColor("warning")
  };

  function returnConcertsForVenue(venue, concerts) {
    var concertList = [];
    concerts.forEach((el) => {
      if (el.venue == venue) {
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
    return (
      <div>
        <div className="spinner">
          <Spinner name="double-bound" />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <ThemeProvider theme={theme}>
        <div className="venueChips">
          <Chip
            onClick={handleClick("all")}
            style={{ margin: "0.5rem" }}
            label="All"
            variant={selectedVenue == "all" && selectedVariant ? "filled" : "filled"}
            color={selectedVenue == "all" && selectedColor ? "warning": "default"}
         />
          {Object.entries(venues).map(([k, v]) => {
            return (
              <Chip
                onClick={handleClick(k)}
                style={{ margin: "0.5rem" }}
                label={k}
                variant={selectedVenue == k && selectedVariant ? "filled" : "filled"}
                color={selectedVenue == k && selectedColor ? "warning": "default"}
              />
            );
          })}
        </div>
        <div className="concertList">
          <div className="venueContainer">
            {Object.entries(artists).map(([k, v]) => {
              if (selectedVenue == "all") {
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
