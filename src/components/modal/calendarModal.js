import React, { useEffect, useContext } from "react";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { startOfMonth, format } from "date-fns";
import { ConcertContext } from "../../store";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  const [open, setOpen] = React.useState(true);
  const [week, setWeek] = React.useState(new Date());
  const [month, setMonth] = React.useState(monthNames[week.getMonth()]);
  const [state] = useContext(ConcertContext);
  const [events, setEvents] = React.useState([]);
  const handleClose = () => setOpen(false);
  const [currentMonth, setCurrentMonth] = React.useState(
    startOfMonth(new Date())
  );

  const matches = useMediaQuery("(min-width:480px)");

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
        });
      }

      setEvents(unqiueWithDates);
    }
  }, []);

  function advanceWeek() {
    var weekAhead = new Date(week);
    weekAhead.setDate(week.getDate() + 7);
    setMonth(monthNames[week.getMonth()]);
    setWeek(weekAhead);
  }
  function backWeek() {
    var weekAhead = new Date(week);
    weekAhead.setDate(week.getDate() - 7);
    setMonth(monthNames[week.getMonth()]);
    setWeek(weekAhead);
  }

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {!matches ? (
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
              <WeeklyContainer>
                <WeeklyDays />
                <WeeklyBody
                  events={events}
                  renderItem={({ item, showingFullWeek }) => (
                    <DefaultWeeklyEventItem
                      key={item.date.toISOString()}
                      title={item.title}
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
        ) : (
          <Box sx={style}>
            <MonthlyCalendar
              currentMonth={currentMonth}
              onCurrentMonthChange={(date) => setCurrentMonth(date)}
            >
              <MonthlyNav />
              <div style={{ height: 600 }}>
                <MonthlyBody events={events}>
                  <MonthlyDay
                    renderDay={(data) =>
                      data.map((item, index) => (
                        <DefaultMonthlyEventItem
                          key={index}
                          title={item.title}
                          // Format the date here to be in the format you prefer
                          date={format(item.date, "hh:mm:a")}
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
