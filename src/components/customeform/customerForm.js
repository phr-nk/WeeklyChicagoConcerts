import React, {useState} from 'react';
import './mcFormStyles.scss';
import MailchimpSubscribe from "react-mailchimp-subscribe";

const CustomForm = ({ status, message, onValidated }) => {

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    return (
        <form className="mc__form">
        <h3 className="mc__title">Join our email list for future updates.</h3>
        <div className="mc__field-container">
          <input
            label="First Name"
            type="text"
            value={firstName}
            placeholder="Jane"
            isRequired
          />

          <input
            label="Last Name"
            type="text"
            value={lastName}
            placeholder="Doe"
            isRequired
          />

          <input
            label="Email"
            type="email"
            value={email}
            placeholder="your@email.com"
            isRequired
          />

        </div>

        <input
          label="subscribe"
          type="submit"
         
        />
      </form>
    );
};