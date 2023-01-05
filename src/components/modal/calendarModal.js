import React, { useState, useEffect, createRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "@mui/material";
import { subHours, startOfMonth, format } from "date-fns";
import {
  MonthlyBody,
  MonthlyCalendar,
  MonthlyDay,
  MonthlyNav,
  DefaultMonthlyEventItem,
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

  width: 950,
  height: 900,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
const mobileStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "75vw",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
export default function BasicModal(props) {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentMonth, setCurrentMonth] = React.useState(
    startOfMonth(new Date())
  );

  const matches = useMediaQuery("(min-width:480px)");

  useEffect(() => {}, []);

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
            <MonthlyCalendar
              currentMonth={currentMonth}
              onCurrentMonthChange={(date) => setCurrentMonth(date)}
            >
              <MonthlyNav />
              <MonthlyBody
                events={[
                  { title: "Call John", date: subHours(new Date(), 2) },
                  { title: "Call John", date: subHours(new Date(), 1) },
                  { title: "Meeting with Bob", date: new Date() },
                ]}
                renderDay={(data) =>
                  data.map((item, index) => (
                    <DefaultMonthlyEventItem
                      key={index}
                      title={item.title}
                      date={item.date}
                    />
                  ))
                }
              />
            </MonthlyCalendar>
          </Box>
        ) : (
          <Box sx={style}>
            <MonthlyCalendar
              currentMonth={currentMonth}
              onCurrentMonthChange={(date) => setCurrentMonth(date)}
            >
              <MonthlyNav />
              <div style={{ height: 600 }}>
                <MonthlyBody
                  events={[
                    { title: "Call John", date: subHours(new Date(), 2) },
                    { title: "Call John", date: subHours(new Date(), 1) },
                    { title: "Meeting with Bob", date: new Date() },
                  ]}
                >
                  <MonthlyDay
                    renderDay={(data) =>
                      data.map((item, index) => (
                        <DefaultMonthlyEventItem
                          key={index}
                          title={item.title}
                          // Format the date here to be in the format you prefer
                          date={format(item.date, "k:mm")}
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
