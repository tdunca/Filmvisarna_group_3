import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ScheduleSection.scss';

interface Movie {
  title: string;
  year: number;
  length: number;
  poster: string;
}

interface Hall {
  hallName: string;
}

interface Showtime {
  _id: string;
  movie: Movie;
  hall: Hall;
  time: string;
}

interface ScheduleSectionProps {
  date: Date | null;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ date }) => {
  const [showtimes, setShowtimes] = useState<{ [key: string]: Showtime[] }>({});

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  useEffect(() => {
    // Räknar ut start- och slutdatum (dagens datum och två veckor framåt)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 14);

    // Formaterar datum till "YYYY-MM-DD" format för API-förfrågan
    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const fetchShowtimes = async () => {
      try {
        const response = await fetch(
          `/api/showtime/date-range?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}`
        );
        const data = await response.json();
        setShowtimes(data);
      } catch (error) {
        console.error('Failed to fetch showtimes:', error);
      }
    };

    fetchShowtimes();
  }, [date]);

   // Funktion för att beräkna sluttiden baserat på starttid och längd
  const calculateEndTime = (startTime: string, length: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes);
    const endDate = new Date(startDate.getTime() + length * 60000); // Längd i minuter till millisekunder
    return endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Funktion som genererar knappar för två veckor framåt
  const getDayLabel = (date: Date, index: number) => {
  const options: Intl.DateTimeFormatOptions = { weekday: 'long' };

  if (index === 0) return 'Idag'; // Första datumet är alltid "Idag"
  if (index === 1) return 'Imorgon'; // Andra datumet är alltid "Imorgon"

  // Annars returnera veckodag och datum (ex: "Söndag 20/10")
  return date.toLocaleDateString('sv-SE', options);
};

const dateRangeTwoWeeks = () => {
  const buttons = [];
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    buttons.push(
      <button
        key={i}
        className={selectedDate === currentDate.toISOString().split('T')[0] ? 'selected' : ''}
        onClick={() => handleDateClick(currentDate)}
      >
        <p>{getDayLabel(currentDate, i)}</p>
        <p>{currentDate.toLocaleDateString('sv-SE', { day: 'numeric', month: 'numeric' })}</p>
      </button>
    );
  }

  return buttons;
};

  const handleDateClick = (selectedDate: Date) => {
    // Spara det valda datumet i state
    setSelectedDate(selectedDate.toISOString().split('T')[0]);
  };

  return (
    <section className="schedule-section">
      <div className="schedule-section-title">
        <h2>{selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Välj ett datum'}</h2>
      </div>

      <div className="schedule-section-buttons">{dateRangeTwoWeeks()}</div>

      {selectedDate && showtimes[selectedDate] ? (
        <div>
          <h3>{new Date(selectedDate).toLocaleDateString()}</h3>
          {showtimes[selectedDate].map((showtime) => (
            <div key={showtime._id} className="schedule-section-showtime">
              <h4>{showtime.hall.hallName}</h4>
              <div className="schedule-section-showtime-info">
                <img src={showtime.movie.poster} alt={showtime.movie.title} />
                <div>
                  <h5>{showtime.movie.title} ({showtime.movie.year})</h5>
                  <p>{showtime.time} - {calculateEndTime(showtime.time, showtime.movie.length)} - {showtime.movie.length} min</p>
                  <Link to={`/booking/${showtime._id}`}>Boka</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Inga visningstillfällen tillgängliga för valt datum.</p>
      )}
    </section>
  );
};

export default ScheduleSection;
