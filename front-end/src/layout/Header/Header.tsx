import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchIcon from "../../assets/icons/search_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png";
import LoginIcon from "../../assets/icons/person_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png";
import ProfileIcon from "../../assets/icons/clarify_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png";
import { UserContext } from "../../UserContext";
import "./Header.scss";
import Logo from "../../assets/img/logo-text-side.png";
import LogoSmall from "../../assets/img/logo-no-text.png";
import LoginModal from "../../views/modals/LoginModal";
import LogoutIcon from "../../assets/icons/logout_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png";
import SearchBar from "../../components/SearchBar/SearchBar";

const Header: React.FC<{ onSelectDate: (daysAhead: number) => void }> = ({
  onSelectDate,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const navigate = useNavigate();
  const handleShow = () => {
    setModalType("login");
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const isBookingPage = location.pathname.startsWith("/booking/");
  console.log(user);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 576);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 576);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleLogout = () => {
    fetch("/api/auth/logout", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setUser(null);
          navigate("/");
          alert(data.message);
        } else if (data.error) {
          console.log(data.error);
        }
      });
  };
  return (
    <header className="container-fluid sticky-top p-0">
      <div className="row w-100">
        <nav className="schedule-button-container col-4">
          {!isBookingPage && (
            <>
              <button
                onClick={() => onSelectDate(0)}
                className="schedule-button-container__button col-4"
              >
                Idag
              </button>
              <button
                onClick={() => onSelectDate(1)}
                className="schedule-button-container__button col-4"
              >
                Imorgon
              </button>
              <button
                onClick={() => onSelectDate(2)}
                className="schedule-button-container__button col-4"
              >
                Senare
              </button>
            </>
          )}
        </nav>

        <div className="logo-container col-4 text-center">
          <div className="logo-img-wrapper col-12">
            <Link to="/" onClick={scrollToTop}>
              <img
                src={isSmallScreen ? LogoSmall : Logo}
                className="logo-img"
                alt="Logo"
              />
            </Link>
          </div>
        </div>

        <div className="search-login-container col-4 p-0">
          {/* SearchIcon visas alltid */}
          <div className="search-login-container__icon col-4">
            <button onClick={() => setIsSearchOpen(true)} type="button">
              <img src={SearchIcon} alt="Search" className="SearchIcon" />
            </button>
          </div>

          {/* Om användaren är inloggad, visa ProfileIcon och LogoutIcon */}
          {user ? (
            <>
              <div className="search-login-container__icon col-4">
                <Link to="/profile">
                  <img
                    src={ProfileIcon}
                    alt="Profile"
                    className="ProfileIcon"
                  />
                </Link>
              </div>
              <div className="search-login-container__icon col-4">
                <button onClick={handleLogout}>
                  <img src={LogoutIcon} alt="Logout" className="LogoutIcon" />
                </button>
              </div>
            </>
          ) : (
            // Om användaren inte är inloggad, visa bara LoginIcon
            <div className="search-login-container__icon col-4">
              <button onClick={handleShow} type="button">
                <img src={LoginIcon} alt="Login" className="LoginIcon" />
              </button>
            </div>
          )}
        </div>
      </div>
      <LoginModal
        show={showModal}
        setModalType={setModalType}
        type={modalType}
        handleClose={handleClose}
      />
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
