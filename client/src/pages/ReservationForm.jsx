import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import reservation from '../assets/reservation.jpg'

export default function ReservationForm() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedTable, setSelectedTable] = useState(null)
  const [availableTables, setAvailableTables] = useState([])
  const [loadingTables, setLoadingTables] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialOccasion: '',
    duration: 2,
    notes: '',
    guests: 1
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  // Get reservation data from navigation state
  const reservationData = location.state || {}

  // Initialize selected date and time from passed data
  React.useEffect(() => {
    if (reservationData.date) {
      setSelectedDate(reservationData.date)
    }
    if (reservationData.time) {
      setSelectedTime(reservationData.time)
    }
  }, [reservationData])

  // Fetch available tables when date and time are selected
  useEffect(() => {
    if (selectedDate && selectedTime) {
      fetchAvailableTables()
    } else {
      // Clear tables if no date/time selected
      setAvailableTables([])
    }
  }, [selectedDate, selectedTime])

  const fetchAvailableTables = async () => {
    setLoadingTables(true)
    console.log('Fetching tables for:', selectedDate, selectedTime)

    try {
      // Format date for API (YYYY-MM-DD)
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1
      const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(selectedDate).padStart(2, '0')}`
      
      // Convert time from "6:30 PM - 8:00 PM" to "18:30" format
      let formattedTime = '17:00'; // Default
      if (selectedTime) {
        const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1], 10);
          const minutes = timeMatch[2];
          const period = timeMatch[3];
          
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
          
          formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
        }
      }
      
      console.log('Checking availability for:', formattedDate, formattedTime);
      
      // Use the /available endpoint with date and time query parameters
      const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/tables/available?date=${formattedDate}&time=${encodeURIComponent(formattedTime)}`)

      console.log('Tables API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Tables data received:', data)
        let tables = data.data || []

        console.log('Available tables count:', tables.length)

        // Show only the available tables from the API
        setAvailableTables(tables)
        
        if (tables.length === 0) {
          console.log('⚠️ No tables available for this date/time')
        }
      } else {
        console.error('Failed to fetch tables, response not ok')
        setAvailableTables([])
      }
    } catch (error) {
      console.error('Error fetching tables:', error)
      setAvailableTables([])
    } finally {
      setLoadingTables(false)
    }
  }

  const showDefaultTables = () => {
    console.log('Showing default tables')
    const defaultTables = []
    for (let i = 1; i <= 10; i++) {
      defaultTables.push({
        id: `default_${i}`,
        table_number: i.toString(),
        capacity: 4,
        status: 'available'
      })
    }
    setAvailableTables(defaultTables)
  }

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]

  const timeSlots = [
    { time: '5:00 PM - 6:30 PM', available: true, label: '' },
    { time: '6:30 PM - 8:00 PM', available: true, label: '' }, 
    { time: '8:00 PM - 9:30 PM', available: true, label: '' }
  ]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  // Check if a date is in the past
  const isPastDate = (day, month, year) => {
    const today = new Date()
    const dateToCheck = new Date(year, month, day)
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return dateToCheck < todayStart
  }

  // Get date availability with proper past/today/future logic
  const getDateAvailability = (day, month, year) => {
    // Past dates are not available
    if (isPastDate(day, month, year)) {
      return 'past'
    }
    
    // Check if date is today
    const today = new Date()
    const isToday = (today.getDate() === day && 
                    today.getMonth() === month && 
                    today.getFullYear() === year)
    if (isToday) {
      return 'today'
    }
    
    // For future dates, check if fully booked
    // October 2025 has some fully booked dates for demo
    if (month === 9 && year === 2025) { // October is month 9 (0-indexed)
      const fullyBookedDates = [10, 17, 24, 31] // Some Thursdays in October 2025
      return fullyBookedDates.includes(day) ? 'fully-booked' : 'available'
    }
    
    // November 2025 has some fully booked dates
    if (month === 10 && year === 2025) { // November is month 10 (0-indexed)
      const fullyBookedDates = [5, 6, 7, 9, 10, 11]
      return fullyBookedDates.includes(day) ? 'fully-booked' : 'available'
    }
    
    // For other months, randomly assign some dates as fully booked
    const randomSeed = day + month + year
    return randomSeed % 7 === 0 ? 'fully-booked' : 'available'
  }

  const handleDateClick = (day) => {
    // Get month and year from passed data, default to September 2025
    const month = reservationData.month ? months.indexOf(reservationData.month) : 8
    const year = reservationData.year || 2025
    
    // Don't allow selecting past dates or fully booked dates
    const availability = getDateAvailability(day, month, year)
    if (availability === 'past' || availability === 'fully-booked' || availability === 'today') {
      return
    }
    setSelectedDate(day)
    console.log('Selected date:', day)
  }

  const handleTimeClick = (timeSlot) => {
    if (timeSlot.available) {
      setSelectedTime(timeSlot.time)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleDurationChange = (change) => {
    const newDuration = Math.max(1, Math.min(8, formData.duration + change))
    setFormData(prev => ({
      ...prev,
      duration: newDuration
    }))
  }

  const handleGuestsChange = (change) => {
    const newGuests = Math.max(1, Math.min(5, formData.guests + change))
    setFormData(prev => ({
      ...prev,
      guests: newGuests
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!selectedDate) {
      newErrors.date = 'Please select a date'
    }

    if (!selectedTime) {
      newErrors.time = 'Please select a time slot'
    }

    if (!selectedTable) {
      newErrors.table = 'Please select a table'
    }

    setErrors(newErrors)

    // Debug: Log current form state
    console.log('Form validation debug:', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      selectedDate,
      selectedTime,
      selectedTable,
      errors: newErrors
    })

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submission started');

    // Clear previous errors
    setErrors({});

    // Validate form
    const isValid = validateForm();
    console.log('Form validation result:', isValid);

    if (!isValid) {
      console.log('Form validation failed');
      return;
    }

    // Format date and time for the reservation data
    const month = reservationData.month ? months.indexOf(reservationData.month) + 1 : new Date().getMonth() + 1;
    const year = reservationData.year || new Date().getFullYear();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${selectedDate.toString().padStart(2, '0')}`;

    // Extract hour from time slot (e.g., "5:00 PM - 6:30 PM" -> "17:00")
    let formattedTime = '17:00'; // Default
    if (selectedTime) {
      const timeMatch = selectedTime.match(/(\d+):(\d+)\s*(AM|PM)/);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        const period = timeMatch[3];

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
    }

    // Prepare complete reservation data
    console.log('Selected table before sending:', selectedTable, 'Type:', typeof selectedTable);
    
    const reservationDataToSend = {
      customer_name: formData.name,
      phone: formData.phone,
      email: formData.email,
      table_id: selectedTable,
      occasion: formData.specialOccasion || null,
      number_of_guests: parseInt(formData.guests, 10),
      reservation_date: formattedDate,
      reservation_time: formattedTime,
      duration_hours: parseInt(formData.duration, 10),
      payment_amount: 0.00,
      payment_status: 'pending',
      status: 'pending',
      notes: formData.notes || null
    };

    console.log('Navigating to reservation upload with data:', reservationDataToSend);

    // Navigate to reservation upload page with form data
    navigate('/reservation-upload', {
      state: {
        reservationData: reservationDataToSend,
        selectedDate,
        selectedTime,
        selectedTable,
        formData
      }
    });
  }

  const renderCalendar = () => {
    // Get month and year from passed data, default to September 2025
    const month = reservationData.month ? months.indexOf(reservationData.month) : 8
    const year = reservationData.year || 2025
    
    const daysInMonth = getDaysInMonth(month, year)
    const firstDay = getFirstDayOfMonth(month, year)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate === day
      const today = new Date()
      const isToday = (today.getDate() === day && 
                      today.getMonth() === month && 
                      today.getFullYear() === year)
      const availability = getDateAvailability(day, month, year)
      const isFullyBooked = availability === 'fully-booked'
      const isPast = availability === 'past'
      
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${availability}`}
          onClick={() => handleDateClick(day)}
          style={{
            aspectRatio: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (isFullyBooked || isPast || isToday) ? 'not-allowed' : 'pointer',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s',
            background: isSelected ? '#dc2626' : 
                       isPast ? '#f5f5f5' :
                       isFullyBooked ? '#f97316' : 
                       isToday ? '#fef3c7' : '#fff',
            border: isSelected ? '1px solid #dc2626' : 
                   isPast ? '1px solid #d1d5db' :
                   isFullyBooked ? '1px solid #f97316' :
                   isToday ? '1px solid #f59e0b' : '1px solid #e2e8f0',
            color: isSelected ? '#fff' : 
                   isPast ? '#9ca3af' :
                   isFullyBooked ? '#fff' : 
                   isToday ? '#92400e' : '#000',
            transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            boxShadow: isSelected ? '0 4px 12px rgba(220, 38, 38, 0.3)' : 'none',
            opacity: (isFullyBooked || isPast) ? 0.6 : 1,
            textDecoration: isPast ? 'line-through' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isSelected && !isFullyBooked && !isPast && !isToday) {
              e.target.style.background = '#f3f4f6'
              e.target.style.borderColor = '#dc2626'
              e.target.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected && !isFullyBooked && !isPast && !isToday) {
              e.target.style.background = '#fff'
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.transform = 'scale(1)'
            }
          }}
        >
          {day}
        </div>
      )
    }

    return days
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-grow">
        {/* Error message display */}
        {errors.submit && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{errors.submit}</p>
          </div>
        )}
        <section
          style={{
            position: 'relative',
            background: `url(${reservation}) no-repeat center center/cover`,
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '56px 16px'
          }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom right, rgba(0,0,0,0.55), rgba(0,0,0,0.25))' }}></div>

          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 1200,
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
              border: '1px solid rgba(0,0,0,0.06)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{ 
              background: '#dc2626', 
              padding: '20px 24px', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                SISZUMGYUPSAL RESERVATION
              </h1>
              <button 
                onClick={() => navigate('/reservation-date')}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '16px', 
                  cursor: 'pointer', 
                  color: '#fff',
                  fontWeight: 600
                }}
              >
                Back
              </button>
            </div>

            <div style={{ padding: '32px' }}>
              <p style={{ textAlign: 'center', color: '#475569', marginBottom: 32, fontWeight: 600 }}>
                Click on any date you want to reserve, then choose your preferred dining time.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                {/* Left Side - Calendar */}
                <div>
                  {/* Calendar Header */}
                  <div style={{ 
                    background: '#dc2626', 
                    padding: '16px 20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderRadius: '8px 8px 0 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: '20px', color: '#fff' }}>📅</div>
                      <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>
                        {reservationData.month || 'SEPTEMBER'} {reservationData.year || 2025}
                      </h2>
                    </div>
                    <button 
                      onClick={() => navigate('/reservation-date')}
                      style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#fff' }}
                    >
                      ×
                    </button>
                  </div>

                  {/* Calendar */}
                  <div style={{ 
                    background: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px',
                    padding: '20px'
                  }}>
                    {/* Days of week */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: 8 }}>
                      {['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'].map(day => (
                        <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666', padding: '8px 4px' }}>
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    {/* Calendar Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                      {renderCalendar()}
                    </div>

                    {/* Selected Date Display */}
                    {selectedDate && (
                      <div style={{ 
                        background: '#f0f9ff', 
                        border: '1px solid #0ea5e9', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        marginTop: 20,
                        marginBottom: 16,
                        textAlign: 'center'
                      }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0369a1' }}>
                          Selected: {reservationData.month || 'SEPTEMBER'} {selectedDate}, {reservationData.year || 2025}
                        </p>
                      </div>
                    )}

                    {/* Date Availability Legend */}
                    <div style={{ marginTop: 20 }}>
                      <h4 style={{ marginBottom: 12, fontSize: '14px', fontWeight: 600, color: '#374151' }}>Date Availability:</h4>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 12, height: 12, backgroundColor: '#fef3c7', border: '1px solid #f59e0b', borderRadius: 2 }}></div>
                          <span style={{ fontSize: '12px', color: '#666' }}>Today</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 12, height: 12, backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 2 }}></div>
                          <span style={{ fontSize: '12px', color: '#666' }}>Available</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 12, height: 12, backgroundColor: '#f97316', borderRadius: 2 }}></div>
                          <span style={{ fontSize: '12px', color: '#666' }}>Fully Booked</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 12, height: 12, backgroundColor: '#f5f5f5', border: '1px solid #d1d5db', borderRadius: 2 }}></div>
                          <span style={{ fontSize: '12px', color: '#666' }}>Past</span>
                        </div>
                      </div>
                    </div>

                    {/* Selected Time Display */}
                    {selectedTime && (
                      <div style={{ 
                        background: '#f0fdf4', 
                        border: '1px solid #22c55e', 
                        borderRadius: '8px', 
                        padding: '12px', 
                        marginTop: 16,
                        marginBottom: 16,
                        textAlign: 'center'
                      }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
                          Selected Time: {selectedTime}
                        </p>
                      </div>
                    )}

                    {/* Time Slots */}
                    <div style={{ marginTop: 24 }}>
                      <h4 style={{ marginBottom: 12, fontSize: '14px', fontWeight: 600 }}>Select Time:</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {timeSlots.map((timeSlot, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedTime(timeSlot.time)}
                            disabled={!timeSlot.available}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0',
                              background: !timeSlot.available ? '#dc2626' : 
                                         selectedTime === timeSlot.time ? '#dc2626' : '#fff',
                              color: !timeSlot.available ? '#fff' : 
                                     selectedTime === timeSlot.time ? '#fff' : '#374151',
                              cursor: timeSlot.available ? 'pointer' : 'not-allowed',
                              fontWeight: 600,
                              transition: 'all 0.2s',
                              position: 'relative'
                            }}
                          >
                            {timeSlot.time}
                            {!timeSlot.available && (
                              <span style={{ 
                                position: 'absolute', 
                                right: '12px', 
                                fontSize: '10px', 
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                FULLY BOOKED
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Reservation Form */}
                <div>
                  <div style={{ 
                    background: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    padding: '24px'
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#6b7280', 
                      marginBottom: 24,
                      fontStyle: 'italic'
                    }}>
                      Note: Provide an active phone and email, or your reservation may be canceled.
                    </p>

                    <form onSubmit={handleSubmit}>
                      {/* Name */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          Name <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your name"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: `1px solid ${errors.name ? '#dc2626' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            fontSize: '14px',
                            transition: 'border-color 0.2s'
                          }}
                        />
                        {errors.name && (
                          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.name}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          Phone Number <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: `1px solid ${errors.phone ? '#dc2626' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            fontSize: '14px',
                            transition: 'border-color 0.2s'
                          }}
                        />
                        {errors.phone && (
                          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.phone}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          Email Address <span style={{ color: '#dc2626' }}>*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email address"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: `1px solid ${errors.email ? '#dc2626' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            fontSize: '14px',
                            transition: 'border-color 0.2s'
                          }}
                        />
                        {errors.email && (
                          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.email}</p>
                        )}
                      </div>

                      {/* Special Occasion */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          Special Occasion
                        </label>
                        <input
                          type="text"
                          name="specialOccasion"
                          value={formData.specialOccasion}
                          onChange={handleInputChange}
                          placeholder="E.g. Birthday, Anniversary, etc."
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '14px',
                            transition: 'border-color 0.2s'
                          }}
                        />
                      </div>

                      {/* Table Selection */}
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          Select Table
                        </label>

                        {!selectedDate || !selectedTime ? (
                          <div style={{
                            padding: '16px',
                            background: '#e0f2fe',
                            border: '1px solid #0ea5e9',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#0369a1'
                          }}>
                            Please select a date and time first to view available tables.
                          </div>
                        ) : loadingTables ? (
                          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            Loading available tables...
                          </div>
                        ) : availableTables.length > 0 ? (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                            {console.log('Rendering tables:', availableTables)}
                            {availableTables
                              .sort((a, b) => {
                                // Sort tables numerically by table_number
                                const numA = parseInt(a.table_number) || 0
                                const numB = parseInt(b.table_number) || 0
                                return numA - numB
                              })
                              .map((table, index) => (
                              <button
                                key={table.id || index}
                                type="button"
                                onClick={() => {
                                  console.log('Selecting table:', table)
                                  setSelectedTable(table.id)
                                }}
                                style={{
                                  padding: '16px 12px',
                                  border: `2px solid ${selectedTable === table.id ? '#dc2626' : '#e2e8f0'}`,
                                  borderRadius: '12px',
                                  background: selectedTable === table.id ? '#dc2626' : '#fff',
                                  color: selectedTable === table.id ? '#fff' : '#374151',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  transition: 'all 0.2s',
                                  textAlign: 'center',
                                  minHeight: '80px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                              >
                                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                  Table {table.table_number}
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div style={{
                            padding: '16px',
                            background: '#fef3c7',
                            border: '1px solid #f59e0b',
                            borderRadius: '8px',
                            textAlign: 'center',
                            color: '#92400e'
                          }}>
                            Unable to load tables. Please refresh the page or try again later.
                          </div>
                        )}
                        {errors.table && (
                          <p style={{ color: '#dc2626', fontSize: '12px', marginTop: 4 }}>{errors.table}</p>
                        )}
                      </div>

                      {/* Number of Guests */}
                      <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', marginBottom: 8, fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          Number of Guests
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                          <button
                            type="button"
                            onClick={() => handleGuestsChange(-1)}
                            style={{
                              width: '40px',
                              height: '40px',
                              border: '1px solid #e2e8f0',
                              background: '#fff',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: '#374151'
                            }}
                          >
                            -
                          </button>
                          <span style={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#374151',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>
                            {formData.guests}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGuestsChange(1)}
                            style={{
                              width: '40px',
                              height: '40px',
                              border: '1px solid #e2e8f0',
                              background: '#fff',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: '#374151'
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        style={{
                          width: '100%',
                          background: '#dc2626',
                          color: '#fff',
                          border: 'none',
                          padding: '14px 24px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                      >
                        Next
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}