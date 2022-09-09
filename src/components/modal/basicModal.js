import React, { useState, useEffect, createRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import MailChimp from "../subscribePopup/mailchimp";
import useMediaQuery from "@mui/material/useMediaQuery";
import { borderColor } from "@mui/system";

const style = {
  position: "absolute",
  display:"flex",
  flexDirection: "column",
  
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
var logo = require('../../assets/wcc_logo.png')
const mobileStyle = {
  position: "absolute",
  display:"flex",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
export default function BasicModal(props) {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const matches = useMediaQuery("(min-width:400px)");

  useEffect(() => {
    
  }, []);


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
            
              <Typography id="modal-modal-title" variant="h6" component="h2">
              Subscribe to recieve emails on upcoming Chicago concerts!
            </Typography>
            <MailChimp></MailChimp>
            <br></br>
            <Button style={{color: "#ed6c02", borderColor: "#ed6c02"}} variant="outlined" onClick={handleClose}>Close</Button>
          </Box>
        ) : (
          <Box sx={style}>
            <img src={logo} style={{width:250,height:250,justifySelf: "center",alignSelf: "center",}}></img>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Subscribe to recieve weekly emails on upcoming Chicago concerts!
            </Typography>
            <MailChimp></MailChimp>
            <br></br>
            <Button style={{color: "#ed6c02", borderColor: "#ed6c02"}}  variant="outlined" onClick={handleClose}>Close</Button>

          </Box>
        )}
        
      </Modal>
    </div>
  );
}
