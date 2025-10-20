import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './utils/testConnection.js' // Test backend connection on startup
import App from './App.jsx'
import Feedback from './pages/Feedback.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import SuccessNewPassword from './pages/SuccessNewPassword.jsx'
import ResetPasswordReservation from './pages/ResetPasswordReservation.jsx'
import SuccessNewPasswordReservation from './pages/SuccessNewPasswordReservation.jsx'
import FeedbackForm from './pages/FeedbackForm.jsx'
import FeedbackSubmitted from './pages/FeedbackSubmitted.jsx'
import Refilling from './pages/Refilling.jsx'
import RefillRequest from './pages/RefillRequest.jsx'
import RefillRequestSubmitted from './pages/RefillRequestSubmitted.jsx'
import Promos from './pages/Promos.jsx'
import SideDishes from './pages/SideDishes.jsx'
import UnlimitedMenu from './pages/UnlimitedMenu.jsx'
import AlaCarteMenu from './pages/AlaCarteMenu.jsx'
import FeaturedMenu from './pages/FeaturedMenu.jsx'
import TimesUp from './pages/TimesUp.jsx'
import Reservation from './pages/Reservation.jsx'
import Signup from './pages/Signup.jsx'
import LoginReservation from './pages/LoginReservation.jsx'
import ReservationDate from './pages/ReservationDate.jsx'
import ReservationForm from './pages/ReservationForm.jsx'
import ReservationUpload from './pages/ReservationUpload.jsx'
import ReservationConfirmed from './pages/ReservationConfirmed.jsx'
import ReservationPending from './pages/ReservationPending.jsx'
import TestEnv from './pages/TestEnv.jsx'
import NotFound from './pages/NotFound.jsx'
import './styles.css'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/feedback', element: <Feedback /> },
  { path: '/feedback-form', element: <FeedbackForm /> },
  { path: '/feedback-submitted', element: <FeedbackSubmitted /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/reset-success', element: <SuccessNewPassword /> },
  { path: '/promos', element: <Promos /> },
  { path: '/sidedish', element: <SideDishes /> },
  { path: '/unlimited', element: <UnlimitedMenu /> },
  { path: '/alacarte', element: <AlaCarteMenu /> },
  { path: '/featuremenu', element: <FeaturedMenu /> },
  { path: '/refilling', element: <Refilling /> },
  { path: '/refill-request', element: <RefillRequest /> },
  { path: '/refill-request-submitted', element: <RefillRequestSubmitted /> },
  { path: '/signup', element: <Signup /> },
  { path: '/reservation', element: <Reservation /> },
  { path: '/login-reservation', element: <LoginReservation /> },
  { path: '/loginReservation', element: <LoginReservation /> },
  { path: '/reset-reservation', element: <ResetPasswordReservation /> },
  { path: '/resetReservation', element: <ResetPasswordReservation /> },
  { path: '/success-new-password-reservation', element: <SuccessNewPasswordReservation /> },
  { path: '/reservation-date', element: <ReservationDate /> },
  { path: '/reservationDate', element: <ReservationDate /> },
  { path: '/reservation-form', element: <ReservationForm /> },
  { path: '/reservationForm', element: <ReservationForm /> },
  { path: '/reservation-upload', element: <ReservationUpload /> },
  { path: '/reservationUpload', element: <ReservationUpload /> },
  { path: '/reservation-confirmed', element: <ReservationConfirmed /> },
  { path: '/reservationConfirmed', element: <ReservationConfirmed /> },
  { path: '/reservation-pending', element: <ReservationPending /> },
  { path: '/reservationPending', element: <ReservationPending /> },
  { path: '/timesup', element: <TimesUp /> },
  { path: '/test-env', element: <TestEnv /> },
  { path: '*', element: <NotFound /> },
])

const root = createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router} />)


