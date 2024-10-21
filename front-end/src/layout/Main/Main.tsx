import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Booking from '../../views/pages/Booking/Booking';
import Home from '../../views/pages/Home/Home';
import MovieInfo from '../../views/pages/MovieInfo/MovieInfo';
import About from '../../views/pages/About/About';
import AboutCinemas from '../../views/pages/AboutCinemas/AboutCinemas';
import Contact from '../../views/pages/Contact/Contact';
import './Main.scss';

const Main: React.FC = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/booking/:showtimeId" element={<Booking />} />
        <Route path="/movie-info" element={<MovieInfo />} />
        <Route path="/movie-info/:id" element={<MovieInfo />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/about-cinemas" element={<AboutCinemas />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </main>
  );
};

export default Main;