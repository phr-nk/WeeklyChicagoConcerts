import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Day from "../day/day";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import TextField from "@mui/material/TextField";
import ListSubheader from "@mui/material/ListSubheader";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import { ThemeProvider, createTheme, Typography } from "@mui/material";
import Select from "@mui/material/Select";
import CancelIcon from "@material-ui/icons/Cancel";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";
import InputLabel from "@mui/material/InputLabel";
import { data as testData } from "../../assets/test-concerts";
import _without from "lodash/without";
import useMediaQuery from "@mui/material/useMediaQuery";
import Spinner from "react-spinkit";
import "./concertList.css";
import GenreSelect from "../genreSelect/genreSelect";
import { ControlPointDuplicate } from "@material-ui/icons";

const url = "https://chicagoconcertapi.onrender.com/concerts";
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
function parseDaytime(time) {
  var hours;
  var minutes;
  if (time.indexOf(":") > 0) {
    [hours, minutes] = time
      .substr(0, time.length - 2)
      .split(":")
      .map(Number);
  } else {
    hours = Number(time.substr(0, time.length - 2));
    minutes = Number("0");
  }

  if (time.toLowerCase().includes("pm") && hours !== 12) hours += 12;
  {
    return 1000 /*ms*/ * 60 /*s*/ * (hours * 60 + minutes);
  }
}
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
  genresWhole = [...genresWhole].sort();
  genresWhole.forEach((v) => {
    var genre = v;
    genresObj[genre] = [];
  });

  for (var y = 0; y < shows.length; y++) {
    var genres = shows[y].genres.split(",");
    for (var w = 0; w < genres.length; w++) {
      var genre = genres[w];
      if (genre != "") {
        genresObj[genre].push(shows[y]);
      }
    }
  }

  return genresObj;
}

const containsText = (text, searchText) =>
  text.toLowerCase().indexOf(searchText.toLowerCase()) > -1;

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
  const [searchText, setSearchText] = useState("");
  const [searchConcertText, setSearchConcertText] = useState("");
  const [data, setData] = useState("");
  const [filteredArtists, setFilteredArtists] = useState({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });
  const [longLoad, setLongLoad] = useState(false);

  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const groupByDay = groupBy("dayOfWeek");
    const groupByVenue = groupBy("venue");
    const groupByGenres = groupBy("genres");

    fetchData().then((res) => {
      setData(testData);
      const daysGrouped = groupByDay(res);
      const venuesGrouped = groupByVenue(res);
      const g = splitGenres(res);

      setGenres(g);
      setVenues(venuesGrouped);
      orderData(daysGrouped);
    });
  }, []);

  async function fetchData() {
    try {
      const res = await axios(url);
      const json = await res.data;

      return json;
    } catch (err) {
      console.log("Error: " + err);
    }
  }
  const displayedOptions = Object.keys(genres).filter((option) =>
    containsText(option, searchText)
  );

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
        //Add regex date object to use to sort the dates

        /*  
            This regex should be done when creating the API so we don't have to do it here
        */

        var element = el;
        var result = el.time.replace(/doors:|show:|/gi, "").trim();

        if (result.indexOf("|") > 0) {
          var result_array = result.split("|");

          result = result_array[0].replace(/\s/gi, "");
        } else if (result.indexOf("/") > 0) {
          var result_array = result.split("/");
          result = result_array[0].replace(/\s/gi, "");
        } else if (result.indexOf("//") > 0) {
          var result_array = result.split("//");
          result = result_array[0].replace(/\s/gi, "");
        }
        var date_parsed = Date.parse(el.date);
        var new_date = new Date(date_parsed + parseDaytime(result));

        element.dateObject = new_date;
        if (element.dayOfWeek != null) {
          daysInOrder[k].push(element);
        }
      });
    });

    //Sort the shows by date
    Object.entries(concerts).forEach(([k, v]) => {
      var sort_v = v.sort((a, b) => b.dateObject - a.dateObject);
      daysInOrder[k] = sort_v.reverse();
    });

    setArtists(daysInOrder);
  }

  const handlefilterConcerts = (event) => {
    setSearchConcertText(event);
    var filteredList = filteredArtists;

    Object.entries(artists).forEach((q) => {
      var filt = q[1].filter((x) => {
        if (event != "") {
          return x.name.toLowerCase().includes(event.toLowerCase());
        }
      });

      if (filt.length !== 0) {
        var day = filt[0].dayOfWeek;
        filteredList[day] = filt;
      } else {
        filteredList[q[0]] = [];
      }
    });

    setFilteredArtists(filteredList);
  };

  const handleChange = (event) => {
    setGenreList((current) => [...event.target.value]);
  };
  const handleClose = (event) => {
    setSearchText("");
  };
  const handleDelete = (e, value) => {
    e.preventDefault();
    setGenreList((current) => _without(current, value));
  };

  if (artists == null && longLoad == false) {
    return (
      <div className="spinner">
        <div>
          <Spinner fadeIn="none" name="double-bound" />
          <br></br>
          <p className="loadText">
            Waking up the server.....please continue to wait
          </p>
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
          <FormControl sx={{ minWidth: 120, maxWidth: 800 }}>
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
                      style={{ margin: "0.2rem" }}
                      deleteIcon={
                        <CancelIcon
                          onMouseDown={(event) => event.stopPropagation()}
                        />
                      }
                      onDelete={(e) => handleDelete(e, value)}
                    />
                  ))}
                </div>
              )}
            >
              <ListSubheader>
                <TextField
                  size="small"
                  // Autofocus on textfield
                  autoFocus
                  placeholder="Type to search..."
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Escape") {
                      // Prevents autoselecting item while typing (default Select behaviour)
                      e.stopPropagation();
                    }
                  }}
                />
              </ListSubheader>
              <MenuItem value={"all"}>
                <Checkbox checked={genreList.includes("all")} />
                <ListItemText primary={"all"} />
              </MenuItem>

              {displayedOptions.map((option, i) => (
                <MenuItem key={i} value={option}>
                  <Checkbox checked={genreList.includes(option)} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <br></br>
          {!matches ? (
            <TextField
              label="Search for a Concert"
              variant="standard"
              margin="dense"
              size="large"
              onChange={(e) => handlefilterConcerts(e.target.value)}
            ></TextField>
          ) : (
            <TextField
              label="Search for a Concert"
              style={{ width: "40vw" }}
              variant="standard"
              margin="dense"
              size="large"
              onChange={(e) => handlefilterConcerts(e.target.value)}
            ></TextField>
          )}

          <div className="concertList">
            {data != "" ? (
              <div className="venueContainer">
                {searchConcertText == ""
                  ? Object.entries(artists).map(([k, v]) => {
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
                    })
                  : Object.entries(filteredArtists).map(([k, v]) => {
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
            ) : (
              <div className="spinner">
                <Spinner fadeIn="none" name="double-bound" />
              </div>
            )}
          </div>
        </ThemeProvider>
      </div>
    );
  }
}

export default ConcertList;
