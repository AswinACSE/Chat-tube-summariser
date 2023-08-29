import React, { useState } from 'react';
import axios from 'axios';

function Help() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/send-email', {
        email,
        subject,
        message
      });

      if (response.status === 200) {
        setEmailSent(true); // Set emailSent state to true after successful send
      } else {
        console.error('Email sending failed');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className='help-page'>
    <div className="help-form">
      
      {emailSent ? (
        <p>Your message has been sent. Thank you!</p>
      ) : (
        <div className="contact-right">
          <form onSubmit={handleSubmit}>
            
            <input
              type="text"
              value={subject}
              placeholder="Your Name"
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            
            <input
              type="email"
              value={email}
              placeholder="Your Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <textarea
              value={message}
              rows="6"
              placeholder="Your Message"
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn2">Send</button>
          </form>
        </div>
      )}
    </div>
    </div>
  );
}

export default Help;
