import React from 'react';
import { Link } from 'react-router-dom';
// import './Footer.css';
import Logo from '../../assets/img/logo-text-side.png';
import facebookIcon from '../../assets/icons/socialmedia-facebook-gul.png';
import instagramIcon from '../../assets/icons/socialmedia-instagram-gul.png';
import XIcon from '../../assets/icons/socialmedia-x-gul.png';
import youtubeIcon from '../../assets/icons/socialmedia-youtube-gul.png';

import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row text-light">
          <div className="col-md-3">
            <h5>Om oss</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/about-us">Om oss</Link>
              </li>
              <li>
                <Link to="/contact-us">Kontakta oss</Link>
              </li>
              <li>
                <Link to="/about-cinemas">Våra biografer</Link>
              </li>
            </ul>
          </div>

          <div className="col md-3">
            <h5>Öppettider</h5>
            <ul className="list-unstyled">
              <li>Måndag - Torsdag: 08:00 - 01:00</li>
              <li>Fredag - Lördag: 08:00 - 03:00</li>
              <li>Söndag: 10:00 - 01:00</li>
            </ul>
          </div>

          <div className="col-md-3">
            <h5>Adress:</h5>
            <p>Smågatan 5, Småstad</p>
          </div>

          <div className="col-md-3 text-center">
            <h5>Sociala medier</h5>
            <div className="social-media-links">
              <a title="facebook" href="www.facebook.com">
                <img src={facebookIcon} alt="" />
              </a>
              <a title="instagram" href="www.instagram.com">
                <img src={instagramIcon} alt="" />
              </a>
              <a title="X" href="www.x.com">
                <img src={XIcon} alt="" />
              </a>
              <a title="youtube" href="#">
                <img src={youtubeIcon} alt="" />
              </a>
            </div>
          </div>

          <div className="row justify-content-center mt-4">
            <div className="col-md-12">
              <img src={Logo} width={200} alt="Logo" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
