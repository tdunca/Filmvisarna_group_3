import React from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '../../assets/icons/search_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';
import personIcon from '../../assets/icons/person_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';

import './Header.scss';
import Logo from '../../assets/img/logo-text-side.png';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="container-fluid">
        <div className="row align-items-center flex-wrap">
          <div className="col-12 col-sm-4 d-flex justify-content-center justify-content-md-start mb-2 mb-md-0 flex-wrap">
            <Link to="/" className="nav-link">
              Idag
            </Link>
            <Link to="/" className="nav-link">
              Imorgon
            </Link>
            <Link to="/" className="nav-link">
              Senare
            </Link>
          </div>

          <div className="col-12 col-sm-4 text-center mb-2 mb-md-0">
            <Link to="/">
              <img src={Logo} width={200} alt="Logo" />
            </Link>
          </div>

          <div className="col-12 col-sm-4 d-flex justify-content-center justify-content-md-end flex-wrap">
            <Link to="/" className="search-img">
              <img
                src={SearchIcon}
                width={30}
                alt="Search"
                className="search-image"
              />
            </Link>
            <Link to="/" className="search-img">
              <img
                src={personIcon}
                width={30}
                alt="Login"
                className="person-image"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
