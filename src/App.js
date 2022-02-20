import logo from "./logo.svg";
import "./App.css";
import MyAppBar from "./components/appbar/appbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
import ConcertList from "./components/concertList/concertList";
import React, { useState, useEffect, createRef } from "react";
import BasicModal from "./components/modal/basicModal";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import { useScreenshot, createFileName } from "use-react-screenshot";
import html2canvas from "html2canvas";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from "@material-ui/styles";
import amber from "@material-ui/core/colors/amber";
const materialTheme = createTheme({
  palette: {
    primary: amber,
  },
});

function getMonday(d) {
  
  d = new Date(d);
  var day = d.getDay(), 
  diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));

}

function App(props) {
  const ref = createRef(null);
  const [date, setDate] = useState();
  const [dateObject, setDateObject] = useState();
  const [width, setWidth] = useState(300);
  const [image, takeScreenShot] = useScreenshot();
  useEffect(() => {
    var date = getMonday(new Date());
    var string_date = date.toDateString();
    setDate(string_date);
    setDateObject(date);
    console.log(date);
  }, []);
  function advanceWeek() {
    var weekAhead = new Date(dateObject);
    weekAhead.setDate(dateObject.getDate() + 7);
    setDateObject(weekAhead);
    setDate(weekAhead.toDateString());
  }
  function backWeek() {
    var weekAhead = new Date(dateObject);
    weekAhead.setDate(dateObject.getDate() - 7);
    setDateObject(weekAhead);
    setDate(weekAhead.toDateString());
  }
  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };
  function takePicture() {
    var node = document.getElementById("concertContent");
    takeScreenShot(node).then(download);
  }
  function takePicture2() {
    html2canvas(document.getElementById("concertContent"), {
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      useCORS: true,
    }).then((canvas) => {
      //document.body.appendChild(canvas);
      const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
      const a = document.createElement('a')
      a.setAttribute('download', 'upcoming-concerts-' + date +  '.png')
      a.setAttribute('href', image)
      a.click()
    });
  }
  return (
    <div id="app" className="App">
      <div className="content">
        <BasicModal />
        <MyAppBar></MyAppBar>
        <div id="pageTitle" className="pageTitle">
          <Typography  variant="h4" component="div">
            Concerts in Chicago for the week of {" "} 
            <span className="pageDate">
              {" "} {" "}
              <ThemeProvider theme={materialTheme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  
                  value={dateObject}
                  onChange={(newValue) => {
                    var date = getMonday(newValue)
                    setDateObject(newValue);
                    setDate(date.toDateString());
                  }}
                  renderInput={(params) => <TextField style={{marginTop:6, marginLeft:"0.5rem", color:amber}} color="warning" variant="standard" {...params} />}
                />
              </LocalizationProvider>
              </ThemeProvider>
            </span>
          </Typography>
          </div>
          <Button
            onClick={backWeek}
            color="inherit"
            variant="outlined"
            endIcon={<ArrowBackIcon />}
          >
            Previous Week{" "}
          </Button>
          <Button
            onClick={advanceWeek}
            color="inherit"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
          >
            Next Week
          </Button>
          <br></br>
          {" "}
          <br></br>
          <Button
            onClick={() => takePicture2()}
            color="inherit"
            variant="outlined"
            endIcon={<ArrowDownIcon />}
          >
            Download Picture
          </Button>
       
        <header id="concertContent" className="App-header">
          <ConcertList data={props.data} date={date}>
            {" "}
          </ConcertList>
        </header>
      </div>

      <footer className="footer">
        <Typography gutterBottom variant="h6" component="div">
          Designed and Developed by{" "}
          <Link href="https://www.frank-lenoci.me" color="inherit">
            Frank Lenoci
          </Link>
        </Typography>
      </footer>
    </div>
  );
}

export default App;
