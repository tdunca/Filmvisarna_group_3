import React from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '../../assets/icons/search_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';

import './Header.scss';
import Logo from '../../assets/img/logo-text-under.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row align-items-center flex-wrap">
          <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-start mb-2 mb-md-0 flex-wrap">
            <Link to="/" className="nav-link ">
              IDAG
            </Link>
            <Link to="/" className="nav-link">
              IMORGON
            </Link>
            <Link to="/" className="nav-link">
              SENARE
            </Link>
          </div>

          <div className="col-12 col-md-4 text-center mb-2 mb-md-0">
            <img src={Logo} width={100} alt="Logo" />
          </div>

          <div className="col-12 col-md-4 d-flex justify-content-center justify-content-md-end flex-wrap">
            <Link to="/" className="nav-link">
              <img src={SearchIcon} width={30} alt="Search" />
            </Link>
            <Link to="/" className="nav-link">
              LOGIN
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
