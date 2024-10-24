import React from 'react';
import { Link } from 'react-router-dom';
import SearchIcon from '../../assets/icons/search_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';
import personIcon from '../../assets/icons/person_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';

import './Header.scss';
import Logo from '../../assets/img/logo-text-side.png';

const Header: React.FC = () => {
  return (
    <header className="header position-fixed">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-4">
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

          <div className="col-sm-4 text-center ">
            <Link to="/">
              <img src={Logo} width={200} alt="Logo" />
            </Link>
          </div>

          <div className="col-sm-4 d-flex justify-content-end">
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
