import logo from "./logo.svg";
import "./App.css";
import MyAppBar from "./components/appbar/appbar";
import Typography from "@mui/material/Typography";
import { ConcertContext } from "./store.js";
import Link from "@mui/material/Link";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import ConcertList from "./components/concertList/concertList";
import React, { useState, useEffect, useContext } from "react";
import BasicModal from "./components/modal/basicModal";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowDownIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpIcon from '@mui/icons-material/ArrowUpward';
import { useScreenshot, createFileName } from "use-react-screenshot";
import html2canvas from "html2canvas";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@material-ui/styles";
import amber from "@material-ui/core/colors/amber";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as Scroll from "react-scroll";
import waves from "./assets/layered-yellow-wavesV3.svg";

var LinkScroll = Scroll.Link;


var days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

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

function vh(v) {
  var h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
  return (v * h) / 100;
}

function App(props) {
  const [state, dispatch] = useContext(ConcertContext);
  const [date, setDate] = useState();
  const [dateObject, setDateObject] = useState();
  const[isSticky, setIsSticky] = useState(false);
  const [buttonText, setButtonText] = useState("Take me to the current day")
  const [buttonStyle, setButtonStyle] = useState()
  const [width, setWidth] = useState(300);
  const [image, takeScreenShot] = useScreenshot();

  const matches = useMediaQuery("(min-width:600px)");
 
  useEffect(() => {
    var date = getMonday(new Date());
    var string_date = date.toDateString();
    setDate(string_date);
    setDateObject(date);


    //track scroll height
    document.addEventListener("scroll", (e) => {
      if (window.scrollY > window.outerHeight - vh(15)){
        setIsSticky(true) 
      
      }else{
        setIsSticky(false);
       
      } 
    });
    

  }, []);
  function advanceWeek() {
    var weekAhead = new Date(dateObject);
    weekAhead.setDate(dateObject.getDate() + 7);
    setDateObject(weekAhead);

    setDate(weekAhead.toDateString());
    dispatch({
      type: "UPDATE_ITEM",
      payload: { date: weekAhead },
    });
  }
  function backWeek() {
    var weekAhead = new Date(dateObject);
    weekAhead.setDate(dateObject.getDate() - 7);
    setDateObject(weekAhead);
    setDate(weekAhead.toDateString());
    dispatch({
      type: "UPDATE_ITEM",
      payload: { date: weekAhead },
    });
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
    html2canvas(document.getElementById("app"), {
      logging: true,
      letterRendering: 1,
      allowTaint: false,
      backgroundColor: "#f2bd44",
      useCORS: true,
    }).then((canvas) => {
      //document.body.appendChild(canvas);
      const image = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const a = document.createElement("a");
      a.setAttribute("download", "upcoming-concerts-" + date + ".png");
      a.setAttribute("href", image);
      a.click();
    });
  }

  return (
    <div id="app" className="App">
      {matches ? (
        <div
          className="content"
          style={{
            backgroundImage: `url(${waves})`,
            backgroundSize: "100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <BasicModal />
          <MyAppBar></MyAppBar>
          <div id="pageTitle" className="pageTitle">
            <Typography variant="h4" component="div">
              Concerts in Chicago for the week of{" "}
              <span className="pageDate">
                {" "}
                <ThemeProvider theme={materialTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dateObject}
                      onChange={(newValue) => {
                        var date = getMonday(newValue);
                        setDateObject(new Date(newValue));
                        setDate(date.toDateString());
                      }}
                      renderInput={(params) => (
                        <TextField
                          style={{
                            marginTop: 6,
                            marginLeft: "0.5rem",
                            color: amber,
                          }}
                          color="warning"
                          variant="standard"
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </ThemeProvider>
              </span>
            </Typography>
          </div>
          <div>
            <Button
              onClick={backWeek}
              color="inherit"
              variant="outlined"
              endIcon={<ArrowBackIcon />}
            >
              Previous Week
            </Button>
            {"  "}
            <Button
              onClick={advanceWeek}
              color="inherit"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
            >
              Next Week
            </Button>
          </div>
          <br></br>
          {matches ? (
          <Button
                onClick={() => takePicture2()}
                color="inherit"
                variant="outlined"
                endIcon={<ArrowDownIcon />}
              >
                Download Picture
              </Button>
          ) : !isSticky ? (
                <Button
                  color="inherit"
                  variant="outlined"
                  endIcon={<ArrowDownIcon />}

                >
                  <LinkScroll
                    activeClass="active"
                    to={days[new Date().getDay()]}
                    spy={true}
                    smooth={true}
                    
                  >
                Take me to the current day
                  </LinkScroll>
                </Button>
                ) : (
                <div style={{position:"-webkit-sticky", position:"sticky", top:0, zIndex:1000}}>
                <Button
                  color="warning"
                  variant="contained"
                  endIcon={<ArrowUpIcon />}
                  style={buttonStyle}
                >
                  <LinkScroll
                    activeClass="active"
                    to={"main-appbar"}
                    spy={true}
                    smooth={true}
                    
                  >
                 Take me back to the top
                  </LinkScroll>
                </Button>
                </div>
                )}
          <header id="concertContent" className="App-header">
            <ConcertList date={date}> </ConcertList>
          </header>
        </div>
      ) : (
        <div
          className="content"
          style={{
            backgroundImage: `url(${waves})`,
            backgroundSize: "950%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <BasicModal />
          <MyAppBar></MyAppBar>
          <div id="pageTitle" className="pageTitle">
            <Typography variant="h4" component="div">
              Concerts in Chicago for the week of{" "}
              <span className="pageDate">
                {" "}
                <ThemeProvider theme={materialTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dateObject}
                      onChange={(newValue) => {
                        var date = getMonday(newValue);
                        setDateObject(new Date(newValue));
                        setDate(date.toDateString());
                      }}
                      renderInput={(params) => (
                        <TextField
                          style={{
                            marginTop: 6,
                            marginLeft: "0.5rem",
                            color: amber,
                          }}
                          color="warning"
                          variant="standard"
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                </ThemeProvider>
              </span>
            </Typography>
          </div>
          <div>
            <Button
              onClick={backWeek}
              color="inherit"
              variant="outlined"
              endIcon={<ArrowBackIcon />}
            >
              Previous Week
            </Button>
            {"  "}
            <Button
              onClick={advanceWeek}
              color="inherit"
              variant="outlined"
              endIcon={<ArrowForwardIcon />}
            >
              Next Week
            </Button>
          </div>
          <br></br>
          {matches ? (
          <Button
                onClick={() => takePicture2()}
                color="inherit"
                variant="outlined"
                endIcon={<ArrowDownIcon />}
              >
                Download Picture
              </Button>
          ) : !isSticky ? (
                <Button
                  color="inherit"
                  variant="outlined"
                  endIcon={<ArrowDownIcon />}

                >
                  <LinkScroll
                    activeClass="active"
                    to={days[new Date().getDay()]}
                    spy={true}
                    smooth={true}
                    
                  >
                Take me to the current day
                  </LinkScroll>
                </Button>
                ) : (
                  <div style={{position:"-webkit-sticky", position:"sticky", top:0, zIndex:1000}}>
                <Button
                 color="warning"
                  variant="contained"
                  endIcon={<ArrowUpIcon />}
                  style={buttonStyle}
                >
                  <LinkScroll
                    activeClass="active"
                    to={"main-appbar"}
                    spy={true}
                    smooth={true}
                    
                  >
                 Take me back to the top
                  </LinkScroll>
                </Button>
                </div>
                )}
              
          <header id="concertContent" className="App-header">
            <ConcertList date={date}> </ConcertList>
          </header>
        </div>
      )}
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
