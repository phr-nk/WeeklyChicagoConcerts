import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ConcertContext } from "../../store";
import { Link } from "@mui/material";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
var logo = require("../../assets/wcc_logo.png");
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
  const [open, setOpen] = React.useState(props.open);
  const [state, dispatch] = useContext(ConcertContext);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    dispatch({
      type: "UPDATE_MODAL_ABOUT",
      payload: { showAbout: false },
    });
  };

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
            <Typography variant="h6" component="h2">
              This website was created by{" "}
              <Link href="https://www.frank-lenoci.me">Frank Lenoci</Link>,
              mostly for the purpose of learning, but to also make a tool that
              could be used by others to simply find concerts at some of my
              favorite Chicago music venues.
            </Typography>
            <br></br>
            <Typography variant="h6" component="h2">
              Some of the tools used to build this site were React for the
              front-end, Material UI for the style components, and Render.com
              for hosting.
            </Typography>
            <br></br>
            <Typography variant="h6" component="h2">
              This project also relies heavily on the API (application
              programming interface) I made in a previous project.
            </Typography>
            <br></br>
            <Typography variant="h6" component="h2">
              You can find out more about that project{" "}
              <Link href="https://github.com/phr-nk/ChicagoConcertsAPI">
                here
              </Link>
              .
            </Typography>
          </Box>
        ) : (
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              This website was created by{" "}
              <Link href="https://www.frank-lenoci.me">Frank Lenoci</Link>,
              mostly for the purpose of learning, but to also make a tool that
              could be used by others to simply find concerts at some of my
              favorite Chicago music venues.
            </Typography>
            <br></br>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Some of the tools used to build this site were React for the
              front-end, Material UI for the style components, and Render.com
              for hosting.
            </Typography>
            <br></br>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              This project also relies heavily on the API (application
              programming interface) I made in a previous project.
            </Typography>
            <br></br>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              You can find out more about that project{" "}
              <Link href="https://github.com/phr-nk/ChicagoConcertsAPI">
                here
              </Link>
              .
            </Typography>
          </Box>
        )}
      </Modal>
    </div>
  );
}
