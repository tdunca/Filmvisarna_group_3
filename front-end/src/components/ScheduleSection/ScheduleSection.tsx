import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ScheduleSection.scss';

interface Movie {
  title: string;
  year: number;
  length: number;
  poster: string;
  genre: string[];
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

  const groupShowtimesByHall = (showtimes: Showtime[]) => {
    const grouped: { [hallName: string]: Showtime[] } = {};
    showtimes.forEach((showtime) => {
      if (!grouped[showtime.hall.hallName]) {
        grouped[showtime.hall.hallName] = [];
      }
      grouped[showtime.hall.hallName].push(showtime);
    });
    return grouped;
  };


  return (
    <section className="schedule-section">
      <div className="schedule-section-title">
        <h2>{selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Välj ett datum'}</h2>
      </div>

      <div className="schedule-section-buttons">{dateRangeTwoWeeks()}</div>

      {selectedDate && showtimes[selectedDate] ? (
          <div className="schedule-columns container row">
          {Object.entries(groupShowtimesByHall(showtimes[selectedDate])).map(
            ([hallName, hallShowtimes]) => (
              <div key={hallName} className="schedule-column col-sm-12 col-md-12 col-lg-6">
                <h3>{hallName}</h3>
                {hallShowtimes.map((showtime) => (
                  <div key={showtime._id} className="schedule-section-showtime">
                    <Link to={`/booking/${showtime._id}`} className="link-no-decoration">
                      <div className="schedule-section-showtime-info">
                        <div className="schedule-section-showtime-info__time">
                          <p>{showtime.time} - <br/>{calculateEndTime(showtime.time, showtime.movie.length)}</p>
                          </div>
                      <div className="schedule-section-showtime-info-info__text">
                        <h5>{showtime.movie.title} ({showtime.movie.year})</h5>
                          <p> {showtime.movie.length} min</p>
                          <p> {showtime.movie.genre.join(', ')} </p>
                      </div>
                      <img src={showtime.movie.poster} alt={showtime.movie.title} />
                      </div>
                      </Link>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      ) : (
        <p>Inga visningstillfällen tillgängliga för valt datum.</p>
      )}
    </section>
  );
};

export default ScheduleSection;
