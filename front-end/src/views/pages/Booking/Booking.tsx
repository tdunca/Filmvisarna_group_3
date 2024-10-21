import React from 'react';
import { useParams } from 'react-router-dom';
import BookingPage from '../../../components/BookingPage/BookingPage';
import './Booking.css';

const Booking: React.FC = () => {
  const { showtimeId } = useParams();

  return (
    <div className="booking-page">
      <BookingPage showtimeId={showtimeId} />
    </div>
  );
};

export default Booking;