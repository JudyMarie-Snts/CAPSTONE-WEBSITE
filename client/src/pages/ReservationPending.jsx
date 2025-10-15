import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import Footer from '../components/Footer.jsx';
import reservation from '../assets/reservation.jpg';

export default function ReservationPending() {
  const location = useLocation();
  const { reservationId, reservationData } = location.state || {};

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <Nav />
      <div className="reservation-confirmed">
        <div className="reservation-confirmed__background">
          <img src={reservation} alt="Restaurant Background" className="reservation-confirmed__bg-image" />
          <div className="reservation-confirmed__overlay"></div>
        </div>

        <div className="reservation-confirmed__modal">
          <div className="reservation-confirmed__content">
            <h1 className="reservation-confirmed__title">RESERVATION SUBMITTED</h1>
            <p className="reservation-confirmed__subtitle">Your proof of payment was uploaded successfully.</p>

            <div className="reservation-confirmed__note" style={{ marginBottom: 20 }}>
              <p>
                Hi, Siszum! 
                    Thank you for your reservation, our staff will notify you by a text message to confirm your reservation.
              </p>
              <p style={{ marginTop: 8 }}>
                Reservation ID: <strong>{reservationId || 'N/A'}</strong>
              </p>
            </div>

            {reservationData && (
              <div className="reservation-confirmed__details" style={{ marginBottom: 20 }}>
                <div className="reservation-confirmed__section">
                  <h3 className="reservation-confirmed__section-title">Personal Information</h3>
                  <div className="reservation-confirmed__field">
                    <input type="text" value={reservationData.customer_name || 'N/A'} readOnly />
                  </div>
                  <div className="reservation-confirmed__field">
                    <input type="email" value={reservationData.email || 'N/A'} readOnly />
                  </div>
                  <div className="reservation-confirmed__field">
                    <input type="tel" value={reservationData.phone || 'N/A'} readOnly />
                  </div>
                </div>
                <div className="reservation-confirmed__section">
                  <h3 className="reservation-confirmed__section-title">Reservation Details</h3>
                  <div className="reservation-confirmed__field">
                    <input type="text" value={formatDate(reservationData.reservation_date)} readOnly />
                  </div>
                  <div className="reservation-confirmed__field">
                    <input type="text" value={reservationData.reservation_time || 'N/A'} readOnly />
                  </div>
                  <div className="reservation-confirmed__field">
                    <input type="text" value={`${reservationData.number_of_guests || 0} People`} readOnly />
                  </div>
                </div>
              </div>
            )}

            <Link to="/" className="reservation-confirmed__button">Back to Home Page</Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .reservation-confirmed {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .reservation-confirmed__background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .reservation-confirmed__bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .reservation-confirmed__overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
        }

        .reservation-confirmed__modal {
          position: relative;
          z-index: 10;
          background: white;
          border-radius: 12px;
          padding: 40px;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .reservation-confirmed__title {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 8px;
        }

        .reservation-confirmed__subtitle {
          text-align: center;
          font-size: 16px;
          color: #666;
          margin-bottom: 20px;
        }

        .reservation-confirmed__details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .reservation-confirmed__section-title {
          font-size: 14px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }

        .reservation-confirmed__field {
          margin-bottom: 12px;
        }

        .reservation-confirmed__field input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          background: #f9f9f9;
          color: #333;
        }

        .reservation-confirmed__note {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          font-size: 14px;
          line-height: 1.5;
        }

        .reservation-confirmed__note p {
          margin-bottom: 10px;
        }

        .reservation-confirmed__note p:last-child {
          margin-bottom: 0;
        }

        .reservation-confirmed__button {
          display: block;
          width: 100%;
          background: #d60000;
          color: white;
          text-align: center;
          padding: 15px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          transition: background 0.3s ease;
        }

        .reservation-confirmed__button:hover {
          background: #b50000;
        }

        @media (max-width: 768px) {
          .reservation-confirmed__modal {
            padding: 30px 20px;
            margin: 20px;
          }

          .reservation-confirmed__details {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .reservation-confirmed__title {
            font-size: 20px;
          }
        }
      `}</style>
      <Footer />
    </>
  );
}
