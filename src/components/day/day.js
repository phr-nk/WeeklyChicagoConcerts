import React, { useEffect, useState, useRef, useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./venue.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import lastDayOfWeek from "date-fns/lastDayOfWeek";
import { ConcertContext } from "../../store";
import { v4 as uuidv4 } from "uuid";

var Scroll = require("react-scroll");
var ElementScroll = Scroll.Element;

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

function convertDate(date) {
  var date_parsed = Date.parse(date);

  var date_formated = new Date(date_parsed);

  return date_formated;
}

function getFirstDayOfWeek(d) {
  // 👇️ clone date object, so we don't mutate it
  const date = new Date(d);
  const day = date.getDay(); // 👉️ get day of week

  // 👇️ day of month - day of week (-6 if Sunday), otherwise +1
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);

  return new Date(date.setDate(diff));
}

function Day(props) {
  const [open, setOpen] = useState(true);
  const [symbol, setSymbol] = useState("-");
  const [state, dispatch] = useContext(ConcertContext);
  const ref = useRef(null);

  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {}, []);

  const addConcertToContext = (event, title, date, time) => {
    var date = dateTime(time, date);

    if (title != "") {
      dispatch({
        type: "ADD_ITEM",
        payload: { title, date },
      });
    }
  };

  const dateTime = (time, date) => {
    var result = time.replace(/doors:|show:|/gi, "").trim();

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
    var date_parsed = Date.parse(date);

    var new_date = new Date(date_parsed + parseDaytime(result));
    return new_date;
  };
  var currentDate = new Date();
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <div className="venueBox">
      <div className="venueTitle">
        <div className="showConcerts" onClick={handleClick}>
          {" "}
        </div>
        <ElementScroll name={props.venue} />
        <Typography ref={ref} align="center" gutterBottom variant="h5">
          {props.venue}
        </Typography>

        {props.dateObj.getDate() == currentDate.getDate() &&
        props.dateObj.getMonth() == currentDate.getMonth() &&
        props.dateObj.getFullYear() == currentDate.getFullYear() ? (
          <p
            style={{
              color: "#ed6c02",
              textAlign: "center",
            }}
          >
            <strong>{props.day}</strong>
          </p>
        ) : (
          <p style={{ textAlign: "center" }}>{props.day}</p>
        )}
      </div>
      {props.concerts.map((item, index) => {
        if (
          new Date(item.date) <=
            lastDayOfWeek(convertDate(props.date), { weekStartsOn: 1 }) &&
          new Date(item.date) >= getFirstDayOfWeek(convertDate(props.date))
        ) {
          var genreArray = item.genres.split(",");
          if (
            props.genres.includes("all") ||
            props.genres.some((item) => genreArray.includes(item))
          ) {
            if (matches) {
              return (
                <Card
                  sx={{ maxWidth: "12vw" }}
                  style={{ backgroundColor: "wheat", marginBottom: "1rem" }}
                >
                  <a
                    className="concertLink"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt="concert image"
                    />
                  </a>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <a
                        className="concertLink"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.venue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {convertDate(item.date).toDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.time}
                    </Typography>
                    <br></br>
                    <Typography variant="body2" color="text.secondary">
                      {item.genres ? (
                        <div>
                          <b>Genres:</b> {item.genres}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </Typography>
                    <br></br>
                    <Button
                      onClick={(e) =>
                        addConcertToContext(e, item.name, item.date, item.time)
                      }
                      color="inherit"
                      variant="outlined"
                    >
                      Add Concert to Calendar
                    </Button>
                  </CardContent>
                </Card>
              );
            } else {
              return (
                <Card
                  sx={{ width: "70vw" }}
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    backgroundColor: "wheat",
                    marginBottom: "1rem",
                  }}
                >
                  <a
                    className="concertLink"
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.image}
                      alt="concert image"
                    />
                  </a>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <a
                        className="concertLink"
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.name}
                      </a>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.venue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {convertDate(item.date).toDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.genres ? (
                        <div>
                          <b>Genres:</b> {item.genres}
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </Typography>
                    <br></br>
                    <Button
                      onClick={(e) =>
                        addConcertToContext(e, item.name, item.date, item.time)
                      }
                      color="inherit"
                      variant="outlined"
                    >
                      Add Concert to Calendar
                    </Button>
                  </CardContent>
                </Card>
              );
            }
          }
        }
      })}
    </div>
  );
}
export default Day;
