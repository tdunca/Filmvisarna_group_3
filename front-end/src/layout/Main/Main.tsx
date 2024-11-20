import React from "react";
import { Route, Routes } from "react-router-dom";
import Booking from "../../views/pages/Booking/Booking";
import Home from "../../views/pages/Home/Home";
import MovieInfo from "../../views/pages/MovieInfo/MovieInfo";
import About from "../../views/pages/About/About";
import AboutCinemas from "../../views/pages/AboutCinemas/AboutCinemas";
import Contact from "../../views/pages/Contact/Contact";
import Profile from "../../views/auth/Profile/Profile";
import ProtectedRoute from "../../ProtectedRoute";
import "./Main.scss";

interface MainProps {
  scheduleRef: React.RefObject<HTMLElement>;
  selectedDate: Date;
}

const Main: React.FC<MainProps> = ({ scheduleRef, selectedDate }) => {
  const [showProfileSettings, setShowProfileSettings] = React.useState(false);
  return (
    <main className="container-fluid g-0">
      <Routes>
        <Route
          path="/"
          element={
            <Home scheduleRef={scheduleRef} selectedDate={selectedDate} />
          }
        />
        {/* <Route path="/booking" element={<Booking />} /> */}
        <Route path="/booking/:showtimeId" element={<Booking />} />
        {/* <Route path="/movie-info" element={<MovieInfo scheduleRef={scheduleRef} selectedDate={selectedDate} />} /> */}
        <Route
          path="/movie-info/:id"
          element={
            <MovieInfo scheduleRef={scheduleRef} selectedDate={selectedDate} />
          }
        />
        <Route path="/about-us" element={<About />} />
        <Route path="/about-cinemas" element={<AboutCinemas />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={
                <Profile
                  showProfileSettings={showProfileSettings}
                  setShowProfileSettings={setShowProfileSettings}
                />
              }
            />
          }
        />
        <Route
          path="/profile/update-info"
          element={
            <ProtectedRoute
              element={
                <Profile
                  showProfileSettings={showProfileSettings}
                  setShowProfileSettings={setShowProfileSettings}
                />
              }
            />
          }
        />

        <Route
          path="*"
          element={
            <Home scheduleRef={scheduleRef} selectedDate={selectedDate} />
          }
        />
      </Routes>
    </main>
  );
};

export default Main;
