import React from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const postUrl =
  "https://gmail.us20.list-manage.com/subscribe/post?u=" +
  process.env.REACT_APP_U +
  "&id=" +
  process.env.REACT_APP_ID;

const SimpleForm = () => <MailchimpSubscribe url={postUrl} />;

const MailChimpCustomForm = () => (
  <MailchimpSubscribe
    url={postUrl}
    render={({ subscribe, status, message }) => (
      <CustomForm
        status={status}
        message={message}
        onValidated={(formData) => subscribe(formData)}
      />
    )}
  />
);

const CustomForm = ({ status, message, onValidated }) => {
  const [email, setEmail] = React.useState("");
  const submit = () =>
    email &&
    email.indexOf("@") > -1 &&
    onValidated({
      EMAIL: email,
    });
  const handleChange = (event) => {
    setEmail(event.target.value);
  };
  return (
    <div
      style={{
        borderRadius: 2,
        display: "inline-block",
      }}
    >
      {status === "sending" && <div style={{ color: "blue" }}>sending...</div>}
      {status === "error" && (
        <div
          style={{ color: "red" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      {status === "success" && (
        <div
          style={{ color: "green" }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      )}
      <br />
      <TextField
        fullWidth
        color="warning"
        style={{}}
        onChange={handleChange}
        type="email"
        placeholder="Your email"
      />

      <Button
        style={{ marginTop: "0.5rem", float: "right", width: "100%" }}
        color="warning"
        variant="contained"
        onClick={submit}
      >
        Submit
      </Button>
    </div>
  );
};

const MailchimpFormContainer = (props) => {
  return (
    <div>
      <MailchimpSubscribe
        url={postUrl}
        render={({ subscribe, status, message }) => (
          <CustomForm
            status={status}
            message={message}
            onValidated={(formData) => subscribe(formData)}
          />
        )}
      />
    </div>
  );
};

export default MailchimpFormContainer;
