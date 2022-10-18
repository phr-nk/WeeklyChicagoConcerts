import React, { useEffect, useState } from "react";
import Day from "../day/day";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme, Typography } from "@mui/material";
import Select from "@mui/material/Select";
import CancelIcon from "@material-ui/icons/Cancel";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import InputLabel from "@mui/material/InputLabel";
import _without from "lodash/without";
import "./concertList.css";

import GenreSelect from "../genreSelect/genreSelect";
import { ControlPointDuplicate } from "@material-ui/icons";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
var daysObj = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};
const groupBy = (key) => (array) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

function splitGenres(shows) {
  var genresWhole = new Set();
  var genresObj = {};
  var returnedGenres = {};
  for (var i = 0; i < shows.length; i++) {
    var genres = shows[i].genres.split(",");
    for (var j = 0; j < genres.length; j++) {
      if (genres[j] != "") {
        genresWhole.add(genres[j]);
      }
    }
  }

  genresWhole.forEach((v) => {
    var genre = v;
    genresObj[genre] = [];
  });

  for (var y = 0; y < shows.length; y++) {
    var genres = shows[y].genres.split(",");
    for (var w = 0; w < genres.length; w++) {
      var genre = genres[w];
      if (genre != "") {
        //console.log(returnedGenres)
        genresObj[genre].push(shows[y]);
      }
    }
  }

  return genresObj;
}

function ConcertList(props) {
  const [artists, setArtists] = useState();
  const [venues, setVenues] = useState();
  const [genres, setGenres] = useState(["all"]);
  const [genreList, setGenreList] = useState(["all"]);
  const [genre, setGenre] = useState("all");
  const [selectedVenue, setVenue] = useState("all");
  const [selectedDay, setDay] = useState("all");
  const [selectedVariant, setVariant] = useState("outline");
  const [selectedColor, setColor] = useState("default");

  useEffect(() => {
    const g = splitGenres(props.data);
    const groupByDay = groupBy("dayOfWeek");
    const groupByVenue = groupBy("venue");
    const groupByGenres = groupBy("genres");
    const daysGrouped = groupByDay(props.data);
    const venuesGrouped = groupByVenue(props.data);
    // const genresGrouped = groupByGenres(genres);
    // console.log(g);
    setGenres(g);

    setVenues(venuesGrouped);
    orderData(daysGrouped);
  }, []);
  function formatDate(date) {
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    var yy = date.getFullYear();

    return [
      (mm > 9 ? "" : "0") + mm + "/",
      (dd > 9 ? "" : "0") + dd + "/" + yy,
    ].join("");
  }

  function getDateFromDay(day) {
    const current = new Date(props.date);
    const date = current.getDate() - current.getDay() + day; //1 = monday, 2 = tuesday, etc.
    const selectedDay = new Date(current.setDate(date));
    return selectedDay;
  }
  const handleClick = (chip) => () => {
    setVenue(chip);
    setDay(chip);
    setVariant("outline");
    setColor("warning");
  };
  const handleClickGenre = (chip) => () => {
    setGenre(chip);
    setDay(chip);
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

  const handleChange = (event) => {
    setGenreList((current) => [...event.target.value]);
  };
  const handleClose = (event) => {
    console.log("Closed");
  };
  const handleDelete = (e, value) => {
    e.preventDefault();
    console.log("clicked delete");
    setGenreList((current) => _without(current, value));
  };

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
          </div>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="multiple-chip-label">Genres</InputLabel>
            <Select
              multiple
              color="warning"
              label="Genres"
              variant="filled"
              MenuProps={MenuProps}
              value={genreList}
              onChange={handleChange}
              onClose={handleClose}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              IconComponent={KeyboardArrowDownIcon}
              renderValue={(selected) => (
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={value}
                      clickable
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                      onDelete={(e) => handleDelete(e, value)}
                      onClick={() => console.log("clicked chip")}
                    />
                  ))}
                </div>
              )}
            >
              <MenuItem value={"all"}>
                <Checkbox checked={genreList.includes("all")} />
                <ListItemText primary={"all"} />
              </MenuItem>
              {Object.entries(genres).map(([k, v]) => (
                <MenuItem value={k}>
                  <Checkbox checked={genreList.includes(k)} />
                  <ListItemText primary={k} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="concertList">
            <div className="venueContainer">
              {Object.entries(artists).map(([k, v]) => {
                if (selectedVenue === "all") {
                  return (
                    <Day
                      dateObj={getDateFromDay(daysObj[k])}
                      day={formatDate(getDateFromDay(daysObj[k]))}
                      date={props.date}
                      venue={k}
                      concerts={v}
                      genres={genreList}
                    />
                  );
                } else {
                  return (
                    <Day
                      dateObj={getDateFromDay(daysObj[k])}
                      day={formatDate(getDateFromDay(daysObj[k]))}
                      date={props.date}
                      venue={k}
                      concerts={returnConcertsForVenue(selectedVenue, v)}
                      genres={genreList}
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
