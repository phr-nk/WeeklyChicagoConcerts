import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./venue.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import lastDayOfWeek from 'date-fns/lastDayOfWeek'

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
  const [open, setOpen] = useState("true");
  const [symbol, setSymbol] = useState("-");

  const matches = useMediaQuery("(min-width:400px)");

  useEffect(() => {}, []);

  function handleClick(event) {
    setOpen(!open);
    symbol === "+" ? setSymbol("-") : setSymbol("+");
  }


  return (
    <div className="venueBox">
      <div className="venueTitle">
        <div className="showConcerts" onClick={handleClick}></div>
        <Typography align="center" gutterBottom variant="h5">
          {props.venue}
        </Typography>
      </div>
      {open ? (
        props.concerts.map((item, index) => {
          console.log(convertDate(item.date)) 
          if (
            convertDate(item.date) <=
              lastDayOfWeek(convertDate(props.date), { weekStartsOn: 1 })&&
            convertDate(item.date) >= getFirstDayOfWeek(convertDate(props.date)) 
          ) {
            if (matches) {

              return (
                <Card
                  sx={{ maxWidth: "20vw", maxHeight: "50vh" }}
                  style={{ backgroundColor: "wheat", marginBottom: "1rem" }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt="concert image"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <a className="concertLink" href={item.link}>
                        {item.name}
                      </a>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.venue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {convertDate(item.date).toDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              );
            } else {
              return (
                <Card
                  sx={{ width: "70vw", height: "45vh" }}
                  style={{ backgroundColor: "wheat", marginBottom: "1rem" }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt="concert image"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      <a className="concertLink" href={item.link}>
                        {item.name}
                      </a>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.venue}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {convertDate(item.date).toDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              );
            }
          }
        })
      ) : (
        <Typography variant="h4" color="text.secondary">
          No concerts
        </Typography>
      )}
    </div>
  );
}
export default Day;
