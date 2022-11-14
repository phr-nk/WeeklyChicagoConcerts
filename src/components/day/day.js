import React, { useEffect, useState, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./venue.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import lastDayOfWeek from "date-fns/lastDayOfWeek";

var Scroll = require("react-scroll");
var ElementScroll = Scroll.Element;

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
  const ref = useRef(null);

  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {}, []);

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
