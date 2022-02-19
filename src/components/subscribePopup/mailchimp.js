
import React from 'react';
import MailchimpSubscribe from "react-mailchimp-subscribe";

const postUrl = "https://gmail.us20.list-manage.com/subscribe/post?u=" + process.env.REACT_APP_U + "&id=" + process.env.REACT_APP_ID;
                                                       

const SimpleForm = () => <MailchimpSubscribe url={postUrl}/>

const MailchimpFormContainer = props => {

    
  
    return (
        <div className="mc__form-container">
        <MailchimpSubscribe
            url={postUrl}
            render={({ subscribe, status, message }) => (
            <div>
                <SimpleForm onSubmitted={formData => subscribe(formData)} />
                {status === "sending" && <div style={{ color: "blue" }}>sending...</div>}
                {status === "error" && <div style={{ color: "red" }} >This email is already registered.</div>}
                {status === "success" && <div style={{ color: "green" }}>Subscribed!</div>}
             </div>
            )}
        />
    </div>
    );
};

export default MailchimpFormContainer;