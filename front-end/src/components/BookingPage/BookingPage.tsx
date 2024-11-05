import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookingPage.scss';
import dateIcon from '../../assets/icons/calendar_today_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';
import timeIcon from '../../assets/icons/schedule_35dp_FCAF00_FILL0_wght400_GRAD0_opsz40.png';
import hallIcon from '../../assets/icons/icon-cinema-fatter.png';
import { Container, Row } from 'react-bootstrap';

interface Seat {
  seat: {
    _id: string;
    seatNumber: number;
    rowNumber: number;
    hall: string;
  };
  isBooked: boolean;
  _id: string;
}

interface Movie {
  _id: string;
  title: string;
  year: number;
  length: number;
  description: string;
  genre: string[];
  distributor: string;
  productionCountries: string[];
  language: string;
  subtitles: string;
  director: string;
  actors: string[];
  poster: string;
  trailer: string;
  ageRestriction: number;
  imdbRating: number;
}

interface Showtime {
  _id: string;
  movie: {
    _id: string;
    title: string;
  };
  hall: {
    _id: string;
    hallName: string;
    seatsPerRow: number[];
  };
  date: string;
  time: string;
}

interface TicketType {
  _id: string;
  type: string;
  price: number;
}

interface BookingPageProps {
  showtimeId: string | undefined;
}

const calculateEndTime = (startTime: string, length: number): string => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const startDateTime = new Date();
  startDateTime.setHours(hours, minutes, 0);
  const endDateTime = new Date(startDateTime.getTime() + length * 60000);
  return endDateTime.toTimeString().slice(0, 5); 
};


const BookingPage: React.FC<BookingPageProps> = ({ showtimeId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [email, setEmail] = useState<string>('');
  const [ageConfirmation, setAgeConfirmation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<{ success: boolean; message?: string; bookingNumber?: string } | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketCounts, setTicketCounts] = useState<Record<string, number>>({});

  const ORDINARY_PRICE = 140;

  useEffect(() => {
    document.body.classList.add('hide-footer');
    return () => {
    document.body.classList.remove('hide-footer');
    };
  }, []);

  useEffect(() => {
    if (showtimeId) {
      fetchShowtimeDetails();
      fetchAvailableSeats();
      fetchTicketTypes();
    }
  }, [showtimeId]);

  useEffect(() => {
    const total = ticketTypes.reduce((sum, ticketType) => {
      return sum + (ticketCounts[ticketType.type] || 0) * ticketType.price;
    }, 0);
    setTotalAmount(total);
  }, [ticketCounts, ticketTypes]);

  const fetchShowtimeDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/showtime/${showtimeId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch showtime details');
      }
      setShowtime(data);
      await fetchMovieDetails(data.movie._id);
      await fetchAvailableSeats();
    } catch (err: any) {
      console.error('Error fetching showtime details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Jag hade problem med att få ut information om filmen från showtime objektet (vet inte varför) så denna hämtar och skapar direkt från filmobjektet
  const fetchMovieDetails = async (movieId: string) => {
    try {
      const response = await fetch(`/api/movie/${movieId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch movie details');
      }
      setMovie(data);
    } catch (err: any) {
      console.error('Error fetching movie details:', err);
      setError(err.message);
    }
  };

  const fetchAvailableSeats = async () => {
    try {
      const response = await fetch(`/api/showtime/${showtimeId}/seats`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch available seats');
      }
      setSeats(data.seats);
    } catch (err: any) {
      console.error('Error fetching available seats:', err);
      setError(err.message);
    }
  };

  const handleSeatClick = (seatId: string) => {
  const totalTickets = Object.values(ticketCounts).reduce((sum, count) => sum + count, 0);
  if (selectedSeats.includes(seatId)) {
    // If the seat is already selected, remove it
    setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
  } else if (selectedSeats.length < totalTickets) {
    // Add the seat only if the number of selected seats is less than the total ticket count
    setSelectedSeats((prev) => [...prev, seatId]);
  } else {
    alert('You have selected the maximum number of seats allowed.');
  }
};

  const groupSeatsByRow = (seats: Seat[]) => {
    return seats.reduce((acc, seat) => {
      const rowNumber = seat.seat.rowNumber;
      if (!acc[rowNumber]) {
        acc[rowNumber] = [];
      }
      acc[rowNumber].push(seat);
      return acc;
    }, {} as Record<number, Seat[]>);
  };

  const fetchTicketTypes = async () => {
    try {
      const response = await fetch('/api/ticket');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch ticket types');
      }
      setTicketTypes(data);
      // Initialize ticket counts
      const initialCounts: Record<string, number> = {};
      data.forEach((ticket: TicketType) => {
        initialCounts[ticket.type] = 0;
      });
      setTicketCounts(initialCounts);
    } catch (err: any) {
      console.error('Error fetching ticket types:', err);
      setError(err.message);
    }
  };

  const handleTicketCountChange = (ticketType: string, increment: boolean) => {
    setTicketCounts(prev => {
      const currentCount = prev[ticketType] || 0;
      const newCount = increment ? currentCount + 1 : Math.max(0, currentCount - 1);
      const updatedCounts = { ...prev, [ticketType]: newCount };
      
      // Beräkna totala antalet biljetter efter ändringen
      const totalNewTickets = Object.values(updatedCounts).reduce((sum, count) => sum + count, 0);
      
      // Om vi minskar antalet biljetter, ta bort det senast valda sätet
      if (!increment && totalNewTickets < selectedSeats.length) {
        setSelectedSeats(prev => prev.slice(0, -1)); // Ta bort det sista elementet i arrayen
      }
      
      return updatedCounts;
    });
  };

  const handleBooking = async () => {
  if (!email || selectedSeats.length === 0 || !ageConfirmation) {
    setError('Please select seats, enter your email, and confirm age');
    return;
  }

  try {
    const tickets = ticketTypes.map(ticketType => ({
      type: ticketType.type,
      quantity: ticketCounts[ticketType.type] || 0
    }));

    // Filter out only the selected seats
    const selectedSeatObjects = seats.filter(seat => selectedSeats.includes(seat._id));

    const response = await fetch('/api/user/bookings', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        showtimeId,
        selectedSeats: selectedSeatObjects.map(seat => seat.seat._id),
        email,
        tickets,
        totalAmount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create booking');
    }

    setBookingStatus({
      success: true,
      bookingNumber: data.booking.bookingNumber,
    });

    setShowModal(true); // Visa modalen med bokningsinformation
  } catch (err: any) {
    console.error('Error creating booking:', err);
    setBookingStatus({
      success: false,
      message: err.message,
    });
  }
};


  const closeModal = () => {
    setShowModal(false);
    navigate(`/booking-confirmation/${bookingStatus?.bookingNumber}`);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <Container className="g-0 p-0">
      <Row className="w-100 g-0">
        <div className="booking-information col-md-12 col-lg-8 g-0">

          {/* Section 1: Showtime Info */}
          <div className="booking-information-header col-12">
            <div className="booking-information-header__poster col-4">
              <div className="booking-information-header__poster-image">
                <img src={movie?.poster} alt={movie?.title} />
                </div>
              </div>
            <div className="booking-information-header-container col-8">
              <div className="booking-information-header__top">
              <h1>{movie?.title}</h1>
                <p>Tal: {movie?.language}, Undertexter: {movie?.subtitles}</p>
                <p>Genre: {movie?.genre.join(', ')}</p>
                <p>Speltid: {movie?.length} minuter</p>
              </div>
              <div className="booking-information-header__bottom">
                <p><img src={dateIcon} alt="date" />Datum: {showtime && new Date(showtime.date).toLocaleDateString()}</p>
                <p><img src={timeIcon} alt="time" />kl {showtime?.time} - {showtime && movie && calculateEndTime(showtime.time, movie.length)}</p>
                <p><img src={hallIcon} alt="hall" />Salong: {showtime?.hall.hallName}</p>
                </div>
            </div>
          </div>

          {/* Section 2: Ticket Selection */}
          <div className="ticket-counts">
            <div className="ticket-counts__tickets">
              {ticketTypes.map((ticketType) => (
                <div key={ticketType._id} className="ticket-counts__tickets__ticket">
                  <label>{ticketType.type} </label>
                  <div className="ticket-counts__tickets__ticket__button-container">
                    <button 
                      onClick={() => handleTicketCountChange(ticketType.type, false)}
                    >-</button>
                    <span className={(ticketCounts[ticketType.type] || 0) === 0 ? 'ticket-count-zero' : 'ticket-count-nonzero'}>
                      {ticketCounts[ticketType.type] || 0}
                    </span>
                    <button 
                      onClick={() => handleTicketCountChange(ticketType.type, true)}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Seat Selection */}
          <div className="booking-information-content col-12">
            <section className="screen-container">
                <article className="screen">Bioduk</article>
            </section>
            <div className="seat-grid col-12">
              {Object.entries(groupSeatsByRow(seats)).map(([rowNumber, rowSeats]) => (
                <div className="seat-row col-12" key={rowNumber}>
                  {rowSeats
                    .sort((a, b) => b.seat.seatNumber - a.seat.seatNumber) // Sort seats in descending order
                    .map((seat) => (
                      <button
                        key={seat._id}
                        onClick={() => !seat.isBooked && handleSeatClick(seat._id)}
                        className={`seat-button ${seat.isBooked ? 'unavailable' : (selectedSeats.includes(seat._id) ? 'selected' : '')}`}
                        disabled={seat.isBooked}
                      >
                        {seat.seat.seatNumber}
                      </button>
                    ))}
                </div>
              ))}
          </div>

          {/* Section 4: Contact Information */}
          <div className="contact-info">
            <h3>Biljettleverans</h3>
            <p>För att boka biljetter, ange din e-postadress.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
            />
          </div>

          {/* Section 5: Age Confirmation */}
          <div className="age-confirmation">
            <div className="age-confirmation-inner-box">
              <label>
                <div className="checkbox-container">
              <input
                type="checkbox"
                checked={ageConfirmation}
                onChange={() => setAgeConfirmation(!ageConfirmation)}
                  />
                </div>
                <div className="checkbox-label">
                  Jag är medveten om filmer kan ha åldersgränser. Barn som har fyllt 11 år får medfölja i vuxens sällskap. Ålder ska kunna styrkas med giltig legitimation.
                  </div>
              </label>
            </div>
          </div>
          <div className="book-button-container">
            <button className="book-button" onClick={handleBooking}>
              <h1>Köp biljett!</h1>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="booking-modal">
          <div className="modal-content">
            <h2>Bokningsbekräftelse</h2>
            {bookingStatus?.success ? (
              <>
                <p>Bokningen genomfördes</p>
                <p>Ditt bokningsnummer: {bookingStatus.bookingNumber}</p>
                <p>Information har skickats till angiven e-postadress</p>
                <button onClick={closeModal}>Stäng</button>
              </>
            ) : (
              <>
                <p>{bookingStatus?.message}</p>
                <button onClick={closeModal} type="button">Stäng</button>
              </>
            )}
          </div>
        </div>
        )}
        
      {/* Section 6: Total Amount - Aside */}
      <div className="total-amount-aside col-12 col-lg-4 p-0">
        <div className="total-amount col-12 col-lg-4">
          {ticketTypes.map((ticketType) => (
            <h3 key={ticketType._id}>
              <span>{ticketType.type}: {ticketCounts[ticketType.type] || 0} st</span>
              <span>{(ticketCounts[ticketType.type] || 0) * ticketType.price} kr</span>
            </h3>
          ))}

            <h3>
              <span>Ordinarie pris:</span>
              <span>
                {Object.values(ticketCounts).reduce(
                (sum, count) => sum + (count || 0) * ORDINARY_PRICE,
                0
              )} kr
              </span>
            </h3>

            <h3>
              <span>Totalt prisavdrag:</span>
              <span>
                {Object.values(ticketCounts).reduce(
                (sum, count) => sum + (count || 0) * ORDINARY_PRICE,
                0
              ) - totalAmount} kr
              </span>
            </h3>

            <h2>
              <span>Att betala:</span>
              <span>{totalAmount} KR</span>
            </h2>
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default BookingPage;
