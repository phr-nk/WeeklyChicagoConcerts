import React, { useEffect, useState, useRef, useContext } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import BasicModal from "../modal/basicModal";
import AboutModal from "../modal/aboutModal";
import CalendarModal from "../modal/calendarModal";
import { ConcertContext } from "../../store";
const appbar = {
  backgroundColor: "wheat",
};

const settings = ["Subscribe", "About", "My Concert Calendar"];
var logo = require("../../assets/wcc_logo.png");
var logo2 = require("../../assets/wcc_logo_oval.png");

export default function MyAppBar() {
  const [state, dispatch] = useContext(ConcertContext);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showSubscribe, setShowSubscribe] = React.useState(state.showSubscribe);
  const [showAbout, setShowAbout] = React.useState(state.showAbout);
  const [showCalendar, setShowCalendar] = React.useState(state.showCalendar);

  const matches = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    setShowAbout(state.showAbout);
    setShowSubscribe(state.showSubscribe);
    setShowCalendar(state.showCalendar);
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    setShowAbout(false);
    setShowCalendar(false);
    setShowSubscribe(false);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const openModal = (event) => {
    var setting = event.currentTarget.innerHTML;
    console.log(setting);

    /* 
    switch (setting) {
      case "About":
        dispatch({
          type: "UPDATE_MODAL_ABOUT",
          payload: { showAbout: true },
        });
        setShowAbout(true);
        setShowSubscribe(false);
        setShowCalendar(false);
        setAnchorElUser(false);

        break;
      case "Subscribe":
        dispatch({
          type: "UPDATE_MODAL_SUBSCRIBE",
          payload: { showSubscribe: true },
        });
        setShowAbout(false);
        setShowSubscribe(true);
        setShowCalendar(false);
        setAnchorElUser(false);
        break;
      case "My Concert Calendar":
        dispatch({
          type: "UPDATE_MODAL_CALENDAR",
          payload: { showCalendar: true },
        });
        setShowAbout(false);
        setShowSubscribe(false);
        setShowCalendar(true);
        setAnchorElUser(false);
        break;
      default:
        setShowAbout(false);
        setShowSubscribe(false);
        setShowCalendar(false);
    }
    */

    if (setting == "About") {
      if (showAbout) {
        setShowAbout(false);
        setAnchorElUser(false);
      } else {
        setShowAbout(true);
        setAnchorElUser(false);
      }
    } else {
      setShowAbout(false);
      setAnchorElUser(false);
    }
    if (setting == "Subscribe") {
      if (showSubscribe) {
        setShowSubscribe(false);
        setAnchorElUser(false);
      } else {
        setShowSubscribe(true);
        setAnchorElUser(false);
      }
    } else {
      setShowSubscribe(false);
      setAnchorElUser(false);
    }
    if (setting == "My Concert Calendar") {
      if (showCalendar) {
        setShowCalendar(false);
        setAnchorElUser(false);
      } else {
        setShowCalendar(true);
        setAnchorElUser(false);
      }
    } else {
      setShowCalendar(false);
      setAnchorElUser(false);
    }
  };

  const closeModal = () => {
    setAnchorElUser(true);
    setShowSubscribe(false);
    setShowAbout(false);
  };

  console.log("About:" + showAbout);
  console.log("Subscribe:" + showSubscribe);
  console.log("Calendar:" + showCalendar);
  return (
    <Box sx={{ flexGrow: 1 }}>
      {showSubscribe ? <BasicModal open={showSubscribe} /> : null}
      {showCalendar ? <CalendarModal open={showCalendar} /> : null}
      {showAbout ? <AboutModal open={showAbout} /> : null}
      <AppBar position="static" sx={appbar} elevation={0}>
        <Toolbar>
          {!matches ? (
            <div>
              <IconButton
                size="large"
                edge="start"
                color="default"
                aria-label="menu"
                onClick={handleOpenUserMenu}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseNavMenu}>
                    <Typography onClick={openModal} textAlign="center">
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                color: "black",
              }}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseNavMenu}>
                  <Typography onClick={openModal}>{setting}</Typography>
                </MenuItem>
              ))}
            </div>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <Box sx={{ flexGrow: 0 }}>
            <img
              src={logo}
              alt="logo"
              style={{
                maxWidth: 70,
                marginTop: 3,
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
