import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../UserContext";
import { Navigate, useParams, useSearchParams } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import ProfileSettings from "../../../components/ProfileSettings/ProfileSettings";
import "./Profile.scss";

interface Ticket {
  type: string;
  quantity: number;
  price: number;
  _id: string;
}

interface Booking {
  _id: string;
  movie: {
    title: string;
    poster: string;
  };
  bookedAt: Array<{
    date: string;
    time: string;
  }>;
  hall: {
    hallName: string;
  };
  bookingNumber: string;
  tickets: Ticket[];
  totalAmount: number;
}

type ProfileProps = {
  showProfileSettings: boolean;
  setShowProfileSettings: React.Dispatch<React.SetStateAction<boolean>>;
};

const Profile: React.FC<ProfileProps> = ({
  showProfileSettings,
  setShowProfileSettings,
}) => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { user, setUser } = useContext(UserContext);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [currentBookings, setCurrentBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // if the url is /profile/update-info, show the profile settings modal
  const { path } = useParams();

  useEffect(() => {
    if (token) {
      validateToken(token);
    }
  }, [token]);
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);
  const validateToken = async (token: string) => {
    try {
      const response = await fetch(`/api/auth/verify-token?token=${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        throw new Error("Invalid token");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/user/bookings", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const today = new Date();
      // today.setHours(0, 0, 0, 0); // Nollställ tiden till midnatt

      setBookingHistory(
        data.filter((booking: Booking) => {
          const bookedDate = new Date(booking.bookedAt[0].date);
          bookedDate.setHours(
            parseInt(booking.bookedAt[0].time.split(":")[0]),
            parseInt(booking.bookedAt[0].time.split(":")[1]),
            0,
            0
          ); // Sätt tidskomponenten från booking.bookedAt[0].time
          return bookedDate < today;
        })
      );

      setCurrentBookings(
        data.filter((booking: Booking) => {
          const bookedDate = new Date(booking.bookedAt[0].date);
          bookedDate.setHours(
            parseInt(booking.bookedAt[0].time.split(":")[0]),
            parseInt(booking.bookedAt[0].time.split(":")[1]),
            0,
            0
          ); // Sätt tidskomponenten från booking.bookedAt[0].time
          return bookedDate >= today;
        })
      );
    } catch (err) {
      setError("Det gick inte att hämta bokningarna");
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/user/cancel-booking/${selectedBooking.bookingNumber}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Kunde inte avboka biljetten");
      }

      // Refresh bookings after successful cancellation
      await fetchBookings();
      setShowCancelModal(false);
      setSelectedBooking(null);
      setExpandedBooking(null);
    } catch (err) {
      setError("Det gick inte att avboka biljetten");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingClick = (booking: Booking) => {
    setExpandedBooking(expandedBooking === booking._id ? null : booking._id);
  };

  const handleShowCancelModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  // Använd denna med modalen för att visa formaterad datum med första bokstaven på veckodagen som stor bokstav.
  // const capitalizeFirstWord = (str: string) => {
  //   const words = str.split(" ");
  //   if (words.length > 0) {
  //     words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  //   }
  //   return words.join(" ");
  // };
  // Använd denna i modalen (Efter <p> Datum: {" "} ...) för att visa formaterat datum med första bokstaven på veckodagen som stor bokstav.
  // capitalizeFirstWord(
  //                   formatDateLabel(new Date(selectedBooking.bookedAt[0].date))
  //                 )}
  //               , kl. {selectedBooking.bookedAt[0].time}

  const formatDateLabel = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(date);
    bookingDate.setHours(0, 0, 0, 0);

    const formatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    } as const;

    if (bookingDate.getTime() === today.getTime()) {
      return `Idag ${today.toLocaleDateString("sv-SE", formatOptions)}`;
    } else if (
      bookingDate.getTime() ===
      today.getTime() + 24 * 60 * 60 * 1000
    ) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return `Imorgon ${tomorrow.toLocaleDateString("sv-SE", formatOptions)}`;
    } else {
      return bookingDate.toLocaleDateString("sv-SE", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <div className="profile-content">
      <div className="profile-settings-button-container">
        <Button
          className="profile-settings-button"
          onClick={() => setShowProfileSettings(true)}
        >
          <span className="profile-settings-button-text">
            Profilinställningar
          </span>
        </Button>
      </div>
      <h3>Välj biljett för avbokning</h3>
      <div className="accordion-container-wrapper">
        <Accordion className="p-3 g-0" alwaysOpen>
          <Accordion.Item className="accordion-item" eventKey="0">
            <Accordion.Header className="accordion-header">
              Bokningshistorik
            </Accordion.Header>
            <Accordion.Body className="accordion-body no-pointer">
              {bookingHistory.length > 0 ? (
                <div className="profile__column">
                  {bookingHistory.map((booking) => (
                    <div key={booking._id} className="profile__booking">
                      <div className="profile__booking-content">
                        <div className="profile__poster">
                          <img
                            src={booking.movie.poster}
                            alt={booking.movie.title}
                            className="profile__poster-image"
                          />
                        </div>
                        <div className="profile__info">
                          <h4 className="profile__title">
                            {booking.movie.title}
                          </h4>
                          <p className="profile__details">
                            {formatDateLabel(
                              new Date(booking.bookedAt[0].date)
                            )}
                            , kl.{booking.bookedAt[0].time}
                          </p>
                          <p className="profile__details">
                            {booking.hall.hallName}
                          </p>
                        </div>
                        <div className="profile__booking-number">
                          <p>#: {booking.bookingNumber}</p>
                        </div>
                        <div className="profile__booking-details">
                          <div className="profile__tickets">
                            <p>
                              <span>Antal biljetter:</span>
                              <span>
                                {booking.tickets.reduce(
                                  (sum: number, ticket: any) =>
                                    sum + ticket.quantity,
                                  0
                                )}
                              </span>
                            </p>
                            {booking.tickets.map((ticket) => (
                              <p key={ticket._id} className="profile__ticket">
                                {ticket.quantity} st {ticket.type}
                                <span className="profile__ticket__ticket-price">
                                  {ticket.price * ticket.quantity} kr
                                </span>
                              </p>
                            ))}
                            <p className="profile__total">
                              <span>Summa: </span>
                              <span>{booking.totalAmount} kr</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Inga tidigare bokningar</p>
              )}
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1">
            <Accordion.Header>Aktuella bokningar</Accordion.Header>
            <Accordion.Body>
              {currentBookings.length > 0 ? (
                <div className="profile__column">
                  {currentBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className={`profile__booking ${
                        expandedBooking === booking._id ? "expanded" : ""
                      }`}
                    >
                      <button
                        className="profile__booking-content"
                        onClick={() => handleBookingClick(booking)}
                      >
                        <div className="profile__poster">
                          <img
                            src={booking.movie.poster}
                            alt={booking.movie.title}
                            className="profile__poster-image"
                          />
                        </div>
                        <div className="profile__info">
                          <h4 className="profile__title">
                            {booking.movie.title}
                          </h4>
                          <p className="profile__details">
                            {formatDateLabel(
                              new Date(booking.bookedAt[0].date)
                            )}
                            , kl.{booking.bookedAt[0].time}
                          </p>
                          <p className="profile__details">
                            {booking.hall.hallName}
                          </p>
                        </div>
                        <div className="profile__booking-number">
                          <p>#: {booking.bookingNumber}</p>
                        </div>
                        <div className="profile__booking-details">
                          <div className="profile__tickets">
                            <p>
                              <span>Antal biljetter:</span>
                              <span>
                                {booking.tickets.reduce(
                                  (sum: number, ticket: any) =>
                                    sum + ticket.quantity,
                                  0
                                )}
                              </span>
                            </p>
                            {booking.tickets.map((ticket) => (
                              <p key={ticket._id} className="profile__ticket">
                                {ticket.quantity} st {ticket.type}
                                <span className="profile__ticket__ticket-price">
                                  {ticket.price * ticket.quantity} kr
                                </span>
                              </p>
                            ))}
                            <p className="profile__total">
                              <span>Summa: </span>
                              <span>{booking.totalAmount} kr</span>
                            </p>
                          </div>
                        </div>
                      </button>
                      {expandedBooking === booking._id && (
                        <button
                          className={`cancel-button ${
                            expandedBooking === booking._id ? "visible" : ""
                          }`}
                          onClick={() => handleShowCancelModal(booking)}
                        >
                          Avboka
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>Inga aktuella bokningar</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Avboka biljett</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <h5>Är du säker på att du vill avboka denna biljett?</h5>
              <p>Film: {selectedBooking.movie.title}</p>
              <p>
                Datum:{" "}
                {selectedBooking &&
                  new Date(
                    selectedBooking.bookedAt[0].date
                  ).toLocaleDateString()}
                , kl. {selectedBooking.bookedAt[0].time}
              </p>
              <p>Bokningsnummer: {selectedBooking.bookingNumber}</p>
              {error && <p className="error-message">{error}</p>}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="button-secondary"
            type="button"
            variant="secondary"
            onClick={() => setShowCancelModal(false)}
          >
            Avbryt
          </Button>
          <Button
            className="button-danger"
            variant="danger"
            onClick={handleCancelBooking}
            disabled={isLoading}
          >
            {isLoading ? "Avbokar..." : "Avboka"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showProfileSettings}
        onHide={() => setShowProfileSettings((prev) => !prev)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Profilinställningar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProfileSettings />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Profile;
