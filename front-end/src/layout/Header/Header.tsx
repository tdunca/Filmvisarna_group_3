import React from 'react';
import './Header.scss';
import Logo from '../../components/Logo/Logo';
import Button from '@mui/material/Button';
import SearchIcon from '../../assets/icons/search_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';
import LoginIcon from '../../assets/icons/person_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png'

const Header: React.FC = () => {
  return (
    <header>
      <div className="schedule-button-container">
        <Button
          variant="outlined"
          sx={{
            height: '80px',
            width: '80px',
            border: 'none',
            borderRight: '2px solid #fcaf00',
            color: '#fcaf00',
          }}
        >Idag</Button>
        <Button
          variant="outlined"
          sx={{
            height: '80px',
            width: '80px',
            border: 'none',
            borderRight: '2px solid #fcaf00',
            color: '#fcaf00',
          }}
        >Imorgon</Button>
        <Button
          variant="outlined"
          sx={{
            height: '80px',
            width: '80px',
            border: 'none',
            borderRight: '2px solid #fcaf00',
            color: '#fcaf00',
          }}
        >Senare</Button>
      </div>
      <div className='logo-container'>
        <Logo />
      </div>
      <div className="search-login-container">
        <Button
          variant="outlined"
          sx={{
            height: '80px',
            width: '80px',
            border: 'none',
            borderLeft: '2px solid #fcaf00',
            color: '#fcaf00',
          }}
        ><img src={SearchIcon} alt="Search" style={{ height: '40px', width: '40px' }} /></Button>
        <Button
          variant="outlined"
          sx={{
            height: '80px',
            width: '80px',
            border: 'none',
            borderLeft: '2px solid #fcaf00',
            color: '#fcaf00',
            display: 'flex',
            flexDirection: 'column',
          }}
        ><img src={LoginIcon} alt="Search" style={{ height: '40px', width: '40px'}}/>Login</Button>
      </div>
    </header>
  );
};

export default Header;