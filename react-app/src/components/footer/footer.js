import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const [isLoginPage, setIsLoginPage] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoginPage(window.location.pathname === '/login');
    };

    // Call this once to set the initial state
    handleRouteChange();

    // Listen for changes
    return history.listen(handleRouteChange);
  }, [history]);

  return (
    <footer className="footer" hidden={!isLoginPage}>
      <div className="footer-container">
        <p className="connect-text">Let's Connect on LinkedIn!</p>
        <a href="https://www.linkedin.com/in/scarlettrobe/" target="_blank" rel="noreferrer">
          <img src="https://cdn.discordapp.com/attachments/1127856658593361931/1133005844917780581/Linkedin-logo-png.png" alt="LinkedIn Icon" className="linkedin-icon"/>
          <p className="user-name">Kimberly Harris</p>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
