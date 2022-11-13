import * as React from "react";
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
import { ReactComponent as ReactLogo } from "../../assets/layered-yellow-waves.svg";
import "./appbar.css";

const appbar = {
  backgroundColor: "wheat",
};
const appbar2 = {
  backgroundColor: "white",

  "--mask":
    "radial-gradient(142.44px at 50% calc(100% - 191.75px),#000 99%,#0000 101%) calc(50% - 130px) 0/260px 100%,radial-gradient(142.44px at 50% calc(100% + 126.75px),#0000 99%,#000 101%) 50% calc(100% - 65px)/260px 100% repeat-x;",
  "-webkit-mask": "var(--mask);mask: var(--mask);",
};

const settings = ["Subscribe", "About"];
var logo = require("../../assets/wcc_logo.png");
var logo2 = require("../../assets/wcc_logo_oval.png");
var waves = require("../../assets/layered-yellow-waves.svg");
export default function MyAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [showSubscribe, setShowSubscribe] = React.useState(false);
  const [showAbout, setShowAbout] = React.useState(false);
  const matches = useMediaQuery("(min-width:600px)");
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const openModal = (event) => {
    var setting = event.currentTarget.innerHTML;
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
  };
  const closeModal = () => {
    setAnchorElUser(true);
    setShowSubscribe(false);
    setShowAbout(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {showSubscribe ? <BasicModal /> : null}
      {showAbout ? <AboutModal /> : null}
      <AppBar position="static" sx={appbar}>
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
            <img src={logo} alt="logo" style={{ maxWidth: 70, marginTop: 3 }} />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
