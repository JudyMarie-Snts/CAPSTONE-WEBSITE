import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import reservation from '../assets/reservation.jpg'

export default function ReservationDate() {
  // Get current date dynamically
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState('5:00 PM - 6:30 PM')
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()) // Current month (0-indexed)
  const [currentYear, setCurrentYear] = useState(today.getFullYear()) // Current year
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false)
  const [hoverTimeout, setHoverTimeout] = useState(null)
  const navigate = useNavigate()
  const [fullyBookedDates, setFullyBookedDates] = useState([])
  React.useEffect(() => {
    fetchFullyBookedDates()
  }, [currentMonth, currentYear])
  
  const fetchFullyBookedDates = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/reservations/fully-booked-dates?year=${currentYear}&month=${currentMonth + 1}`)
      
      if (response.ok) {
        const data = await response.json()
        setFullyBookedDates(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching fully booked dates:', error)
    }
  }

  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ]

  const timeSlots = [
    '5:00 PM - 6:30 PM',
    '6:30 PM - 8:00 PM', 
    '8:00 PM - 9:30 PM'
  ]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  // Check if a date is in the past
  const isPastDate = (day, month, year) => {
    const dateToCheck = new Date(year, month, day)
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return dateToCheck < todayStart
  }

  // Mock availability data - some dates are fully booked
  const getDateAvailability = (day, month, year) => {
    // Past dates are not available
    if (isPastDate(day, month, year)) {
      return 'past'
    }
    
    // Check if date is today
    const isToday = (today.getDate() === day && 
                    today.getMonth() === month && 
                    today.getFullYear() === year)
    if (isToday) {
      return 'today'
    }
    
    // Example: Mock some random fully booked dates
    // In a real app, this would fetch from the backend API
    const randomSeed = day + month + year
    return randomSeed % 7 === 0 ? 'fully-booked' : 'available'
  }

  const handleDateClick = (day) => {
    // Don't allow selecting past dates, today, or fully booked dates
    const availability = getDateAvailability(day, currentMonth, currentYear)
    if (availability === 'past' || availability === 'today' || availability === 'fully-booked') {
      return
    }
    setSelectedDate(day)
    console.log('Selected date:', day)
  }

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      navigate('/reservation-form', { 
        state: { 
          date: selectedDate, 
          month: months[currentMonth], 
          year: currentYear, 
          time: selectedTime 
        } 
      })
    }
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
    setSelectedDate(null) // Clear selection when changing month
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
    setSelectedDate(null) // Clear selection when changing month
  }

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setShowMonthYearPicker(true)
  }

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowMonthYearPicker(false)
    }, 150) // Small delay to prevent flickering
    setHoverTimeout(timeout)
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate === day
      const isToday = (today.getDate() === day && 
                      today.getMonth() === currentMonth && 
                      today.getFullYear() === currentYear)
      const availability = getDateAvailability(day, currentMonth, currentYear)
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
            cursor: (isFullyBooked || isPast) ? 'not-allowed' : 'pointer',
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
            if (!isSelected && !isFullyBooked && !isPast) {
              e.target.style.background = '#f3f4f6'
              e.target.style.borderColor = '#dc2626'
              e.target.style.transform = 'scale(1.05)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected && !isFullyBooked && !isPast) {
              e.target.style.background = isToday ? '#fef3c7' : '#fff'
              e.target.style.borderColor = isToday ? '#f59e0b' : '#e2e8f0'
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
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
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
              maxWidth: 600,
              background: '#ffffff',
              borderRadius: 16,
              boxShadow: '0 18px 50px rgba(0,0,0,0.35)',
              border: '1px solid rgba(0,0,0,0.06)',
              overflow: 'visible'
            }}
          >
            {/* Header with Navigation */}
            <div 
              style={{ 
                background: '#dc2626', 
                padding: '16px 20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                position: 'relative'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12, 
                  cursor: 'pointer',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                }}
              >
                <div style={{ fontSize: '20px', color: '#fff' }}>📅</div>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>{months[currentMonth]} {currentYear}</h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={() => navigate('/reservation')}
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#fff' }}
                >
                  ×
                </button>
                <button 
                  onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                  style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#fff' }}
                >
                  ▼
                </button>
              </div>

              {/* Month/Year Picker */}
              {showMonthYearPicker && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  right: 0, 
                  background: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '0 0 8px 8px',
                  padding: '16px',
                  zIndex: 10,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                {/* Navigation Arrows */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <button 
                    onClick={handlePrevMonth}
                    style={{ 
                      background: '#f3f4f6', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e5e7eb'
                      e.target.style.borderColor = '#d1d5db'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6'
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={handleNextMonth}
                    style={{ 
                      background: '#f3f4f6', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '6px',
                      padding: '6px 10px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#374151',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#e5e7eb'
                      e.target.style.borderColor = '#d1d5db'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#f3f4f6'
                      e.target.style.borderColor = '#e2e8f0'
                    }}
                  >
                    Next →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* Month Picker */}
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Month</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                      {months.map((month, index) => (
                        <button
                          key={month}
                          onClick={() => {
                            setCurrentMonth(index)
                            setShowMonthYearPicker(false)
                            setSelectedDate(null)
                          }}
                          style={{
                            padding: '8px 4px',
                            border: '1px solid #e2e8f0',
                            background: currentMonth === index ? '#dc2626' : '#fff',
                            color: currentMonth === index ? '#fff' : '#000',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: currentMonth === index ? 600 : 400,
                            transition: 'all 0.2s'
                          }}
                        >
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Year Picker */}
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600 }}>Year</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', maxHeight: '200px', overflowY: 'auto', padding: '4px' }}>
                      {Array.from({ length: 200 }, (_, i) => 1900 + i).map(year => (
                        <button
                          key={year}
                          onClick={() => {
                            setCurrentYear(year)
                            setShowMonthYearPicker(false)
                            setSelectedDate(null)
                          }}
                          style={{
                            padding: '6px 4px',
                            border: '1px solid #e2e8f0',
                            background: currentYear === year ? '#dc2626' : '#fff',
                            color: currentYear === year ? '#fff' : '#000',
                            borderRadius: '4px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            fontWeight: currentYear === year ? 600 : 400,
                            transition: 'all 0.2s',
                            minHeight: '28px'
                          }}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                </div>
              )}
            </div>

            <div style={{ padding: 28 }}>
              <p style={{ textAlign: 'center', color: '#475569', marginBottom: 24, fontWeight: 600 }}>
                Click on any date you want to reserve, then choose your preferred dining time.
              </p>


              {/* Calendar Grid */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: 8 }}>
                  {['SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT'].map(day => (
                    <div key={day} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666', padding: '8px 4px' }}>
                      {day}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {renderCalendar()}
                </div>
              </div>

              {/* Legend */}
              <div style={{ marginBottom: 24 }}>
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

              {/* Selected Date Display */}
              {selectedDate && (
                <div style={{ 
                  background: '#f0f9ff', 
                  border: '1px solid #0ea5e9', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  marginBottom: 24,
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#0369a1' }}>
                    Selected: {months[currentMonth]} {selectedDate}, {currentYear}
                  </p>
                </div>
              )}

              {/* Selected Time Display */}
              {selectedTime && (
                <div style={{ 
                  background: '#f0fdf4', 
                  border: '1px solid #22c55e', 
                  borderRadius: '8px', 
                  padding: '12px', 
                  marginBottom: 24,
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#15803d' }}>
                    Selected Time: {selectedTime}
                  </p>
                </div>
              )}

              {/* Time Slots */}
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ marginBottom: 12, fontSize: '14px', fontWeight: 600 }}>Select Time:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {timeSlots.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        background: selectedTime === time ? '#dc2626' : '#fff',
                        color: selectedTime === time ? '#fff' : '#000',
                        cursor: 'pointer',
                        fontWeight: 600,
                        transition: 'all 0.2s'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  disabled={!selectedDate || !selectedTime}
                  style={{
                    background: selectedDate && selectedTime ? 'linear-gradient(135deg, #dc2626, #ef4444)' : '#ccc',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    fontWeight: 700,
                    cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
