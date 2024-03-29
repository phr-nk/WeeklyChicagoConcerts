import React, { useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { startOfMonth, format } from "date-fns";
import { ConcertContext } from "../../store";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { saveAs } from "file-saver";
import {
  MonthlyBody,
  MonthlyCalendar,
  MonthlyDay,
  MonthlyNav,
  DefaultMonthlyEventItem,
  WeeklyCalendar,
  WeeklyContainer,
  WeeklyDays,
  WeeklyBody,
  DefaultWeeklyEventItem,
} from "@zach.codes/react-calendar";
import "@zach.codes/react-calendar/dist/calendar-tailwind.css";
import "./calendarModal.css";

const ics = require("../../../node_modules/ics/dist");

function EventItem({ title, date, link, venue }) {
  return (
    <li className="rc-py-2">
      <div className="rc-flex rc-text-sm rc-flex-1 rc-justify-between">
        <a target="_blank" rel="noopener noreferrer" href={link}>
          <h3 className="rc-font-medium">
            {title} at {venue}
          </h3>{" "}
        </a>
        <p className="rc-text-gray-500">{date}</p>
      </div>
    </li>
  );
}

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  width: 1600,
  height: 900,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
const mediumScreenStyle = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -53%)",

  width: 900,
  height: 800,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
const mobileStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "95vw",
  height: "80vh",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BasicModal(props) {
  const [state, dispatch] = useContext(ConcertContext);
  const [open, setOpen] = React.useState(props.open);
  const [week, setWeek] = React.useState(state.date);
  const [month, setMonth] = React.useState(monthNames[week.getMonth()]);
  const [events, setEvents] = React.useState([]);
  const handleClose = () => {
    setOpen(false);
    dispatch({
      type: "UPDATE_MODAL_CALENDAR",
      payload: { showCalendar: false },
    });
  };
  const [currentMonth, setCurrentMonth] = React.useState(
    startOfMonth(state.date)
  );

  const matchesMobile = useMediaQuery("(min-width:480px)");
  const matchesMediumScreen = useMediaQuery("(min-width:1650px)");

  useEffect(() => {
    if (state.events.length > 0) {
      //This part should be refactored in the future to save on performance
      const objectsJSON = state.events.map((object) => JSON.stringify(object));
      const objectsJSONSet = new Set(objectsJSON);
      const uniqueJSONArray = Array.from(objectsJSONSet);
      const uniqueObjectsByContent = uniqueJSONArray.map((string) =>
        JSON.parse(string)
      );
      var unqiueWithDates = [];
      for (var i = 0; i < uniqueObjectsByContent.length; i++) {
        var dateObj = new Date(uniqueObjectsByContent[i].date);
        unqiueWithDates.push({
          title: uniqueObjectsByContent[i].title,
          date: dateObj,
          venue: uniqueObjectsByContent[i].venue,
          link: uniqueObjectsByContent[i].link,
          image: uniqueObjectsByContent[i].image,
        });
      }

      setEvents(unqiueWithDates);
    }
  }, []);

  function advanceWeek() {
    var weekAhead = new Date(week);
    weekAhead.setDate(week.getDate() + 7);
    setMonth(monthNames[weekAhead.getMonth()]);
    setWeek(weekAhead);
  }
  function backWeek() {
    var weekAhead = new Date(week);
    weekAhead.setDate(week.getDate() - 7);
    setMonth(monthNames[weekAhead.getMonth()]);
    setWeek(weekAhead);
  }
  function generateICS() {
    var icsEvents = [];
    for (var i = 0; i < events.length; i++) {
      var date = new Date(events[i].date);
      icsEvents.push({
        title: "Concert: " + events[i].title,
        description:
          events[i].title +
          " at " +
          events[i].venue +
          "\n\nLink:" +
          events[i].link,
        busyStatus: "BUSY",
        start: [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
        ],
        duration: { minutes: 90 },
        url: events[i].link,
        htmlContent:
          "<!DOCTYPE html><html><body><img src='" +
          events[i].image +
          "'><a href='" +
          events[i].link +
          "'><h2>" +
          events[i].title +
          "</h2></a></body></html>",
        location: events[i].venue,
      });
    }

    const { error, value } = ics.createEvents(icsEvents);

    if (error) {
      console.log(error);
      return;
    }
    var file = new File([value], { type: "text/plain;charset=utf-8" });
    saveAs(file, "concert_events.ics");
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {!matchesMobile ? (
          <Box sx={mobileStyle}>
            <WeeklyCalendar week={week}>
              <Typography style={{ textAlign: "center" }}>{month}</Typography>
              <div className="buttons">
                <Button
                  onClick={backWeek}
                  color="inherit"
                  variant="outlined"
                  endIcon={<ArrowBackIcon />}
                ></Button>
                {"  "}
                <Button
                  onClick={advanceWeek}
                  color="inherit"
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                ></Button>
              </div>
              <div>
                <Alert severity="info" style={{ marginBotton: "0.5rem" }}>
                  Get an iOS shortcut to quickly add events to your calendar on
                  iPhone:{" "}
                  <Link
                    href="https://routinehub.co/shortcut/7005/"
                    target="_blank"
                  >
                    {" "}
                    ICS To Calendar
                  </Link>
                </Alert>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                <Tooltip
                  title="This ICS file and be imported into any calendar software you
                  use."
                >
                  <Button
                    onClick={generateICS}
                    color="inherit"
                    variant="outlined"
                  >
                    Generate ICS file
                  </Button>
                </Tooltip>
              </div>

              <WeeklyContainer>
                <WeeklyDays />
                <WeeklyBody
                  events={events}
                  renderItem={({ item, showingFullWeek }) => (
                    <EventItem
                      key={item.date.toISOString()}
                      title={item.title}
                      venue={item.venue}
                      date={
                        showingFullWeek
                          ? format(item.date, "MMM do hh:mm:a")
                          : format(item.date, "hh:mm:a")
                      }
                    />
                  )}
                />
              </WeeklyContainer>
            </WeeklyCalendar>
          </Box>
        ) : matchesMediumScreen ? (
          <Box sx={style}>
            <MonthlyCalendar
              currentMonth={currentMonth}
              onCurrentMonthChange={(date) => setCurrentMonth(date)}
            >
              <MonthlyNav />
              <div className="icsFileContainer">
                <Tooltip
                  title="This ICS file and be imported into any calendar software you
                  use."
                >
                  <Button
                    className="icsButton"
                    onClick={generateICS}
                    color="inherit"
                    variant="outlined"
                  >
                    Generate ICS file
                  </Button>
                </Tooltip>
              </div>{" "}
              <br></br>
              <div style={{ height: 600 }}>
                <MonthlyBody events={events}>
                  <MonthlyDay
                    renderDay={(data) =>
                      data.map((item, index) => (
                        <EventItem
                          key={index}
                          title={item.title}
                          // Format the date here to be in the format you prefer
                          date={format(item.date, "hh:mm:a")}
                          link={item.link}
                          venue={item.venue}
                        />
                      ))
                    }
                  />
                </MonthlyBody>
              </div>
            </MonthlyCalendar>
          </Box>
        ) : (
          <Box sx={mediumScreenStyle}>
            <MonthlyCalendar
              currentMonth={currentMonth}
              onCurrentMonthChange={(date) => setCurrentMonth(date)}
            >
              <MonthlyNav />
              <div className="icsFileContainer">
                <Tooltip
                  title="This ICS file and be imported into any calendar software you
                  use."
                >
                  <Button
                    className="icsButton"
                    onClick={generateICS}
                    color="inherit"
                    variant="outlined"
                  >
                    Generate ICS file
                  </Button>
                </Tooltip>
              </div>{" "}
              <br></br>
              <div style={{ height: 600 }}>
                <MonthlyBody events={events}>
                  <MonthlyDay
                    renderDay={(data) =>
                      data.map((item, index) => (
                        <EventItem
                          key={index}
                          title={item.title}
                          // Format the date here to be in the format you prefer
                          date={format(item.date, "hh:mm:a")}
                          link={item.link}
                          venue={item.venue}
                        />
                      ))
                    }
                  />
                </MonthlyBody>
              </div>
            </MonthlyCalendar>
          </Box>
        )}
      </Modal>
    </div>
  );
}
