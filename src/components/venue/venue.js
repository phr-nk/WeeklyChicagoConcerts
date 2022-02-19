import React, { useEffect, useState } from "react";
import "./venue.css";

function convertDate(date) {
  var date_parsed = Date.parse(date);

  var date_formated = new Date(date_parsed);
  
  return date_formated;
}

function getDateAfter7Days(date)
{
  var n_date = new Date(date);
  n_date.setDate(n_date.getDate() + 7);
  return n_date;
}
function Venue(props) {
  const [open, setOpen] = useState("true");
  const [symbol, setSymbol] = useState("-");

  useEffect(() => {}, []);

  function handleClick(event) {
    setOpen(!open);
    symbol === "+" ? setSymbol("-") : setSymbol("+");
  }

  return (
    <div className="venueBox">
      <div className="venueTitle">
        <div className="showConcerts" onClick={handleClick}>
          {symbol}
        </div>
        <h2 className="venueHeader">{props.venue}</h2>
      </div>
      {open
        ? props.concerts.map((item, index) => {
              if (convertDate(item.date) < getDateAfter7Days(convertDate(props.date)) && convertDate(item.date) > convertDate(props.date)) {
                return(
                <div className="venueItem">
                  <a className="concertLink" href={item.link}>
                    {item.name}
                  </a>
                  <p>{item.venue}</p>
                  <p>{item.date}</p>
                  <img className="concertImage" src={item.image}></img>
                </div>
                )
              }
          })
        : null}
    </div>
  );
}
export default Venue;