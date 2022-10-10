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
var daysObj = {"Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6, "Sunday": 7,  }
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
  function formatDate(date){
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    var yy = date.getFullYear()
  
    return [(mm>9 ? '' : '0') + mm + "/",
            (dd>9 ? '' : '0') + dd + "/" + yy
           ].join('');
  };
  
  function getDateFromDay(day) {
    const current = new Date(props.date);
    const date = current.getDate() -current.getDay() + day; //1 = monday, 2 = tuesday, etc.
    const selectedDay = new Date(current.setDate(date));
    return selectedDay;
  }
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
            {Object.entries(venues).map(([k, v]) => {
              return (
                <Chip
                  onClick={handleClick(k)}
                  style={{ margin: "0.5rem" }}
                  label={k}
                  variant={
                    selectedDay == k && selectedVariant ? "filled" : "filled"
                  }
                  color={
                    selectedDay == k && selectedColor ? "warning" : "default"
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
                  return <Day dateObj= {getDateFromDay(daysObj[k])} day={formatDate(getDateFromDay(daysObj[k]))} date={props.date} venue={k} concerts={v} />;
                } else {
                  return (
                    <Day
                    dateObj= {getDateFromDay(daysObj[k])}
                    day={formatDate(getDateFromDay(daysObj[k]))}
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
