import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Nav from "../components/Nav.jsx";
import Footer from "../components/Footer.jsx";
import reservation from "../assets/reservation.jpg";
import gcash from "../assets/gcash.png";

export default function ReservationUpload() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSavingReservation, setIsSavingReservation] = useState(false);
  const [reservationId, setReservationId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const reservationData = location.state?.reservationData || {};

  // Auto-save reservation when component mounts
  useEffect(() => {
    if (reservationData && Object.keys(reservationData).length > 0 && !isSavingReservation && !reservationId) {
      console.log('Starting reservation save process...');
      handleSaveReservation();
    }
  }, [reservationData, isSavingReservation, reservationId]);

  const handleSaveReservation = async () => {
    if (isSavingReservation) return;

    setIsSavingReservation(true);
    setErrors({});

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // Get user token
        const userDataStr = localStorage.getItem('user');
        if (!userDataStr) {
          throw new Error('No user session found');
        }

        const userData = JSON.parse(userDataStr);
        const token = userData?.token ||
                      userData?.data?.token ||
                      (userData?.data?.data && userData.data.data.token);

        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Handle customer creation/lookup
        let customerId = null;
        try {
          // First try to find existing customer
          const customerResponse = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/customers?email=${encodeURIComponent(reservationData.email)}&limit=1`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            if (customerData.data && customerData.data.length > 0) {
              customerId = customerData.data[0].id;
              console.log('Found existing customer:', customerId);
            }
          }

          // If no existing customer, create new one
          if (!customerId) {
            console.log('Creating new customer...');
            const newCustomerData = {
              first_name: reservationData.customer_name.split(' ')[0] || reservationData.customer_name,
              last_name: reservationData.customer_name.split(' ').slice(1).join(' ') || '',
              email: reservationData.email,
              phone: reservationData.phone,
              date_of_birth: null,
              address: null,
              city: null,
              country: 'Philippines',
              is_active: 1
            };

            const createCustomerResponse = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/customers`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(newCustomerData)
            });

            const customerResult = await createCustomerResponse.json();

            if (createCustomerResponse.ok && customerResult.success) {
              customerId = customerResult.data?.id;
              console.log('Created new customer:', customerId);
            } else {
              console.error('Customer creation failed:', customerResult);
              // If customer creation fails due to email already exists, try to find it again
              if (customerResult.message?.includes('Email already exists')) {
                const retryResponse = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/customers?email=${encodeURIComponent(reservationData.email)}&limit=1`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  if (retryData.data && retryData.data.length > 0) {
                    customerId = retryData.data[0].id;
                    console.log('Found existing customer on retry:', customerId);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error handling customer:', error);
          // Continue without customer_id if customer operations fail
        }

        // Prepare reservation data with customer_id if available
        // Parse table_id - handle both numeric IDs and string IDs like "default_2"
        console.log('Original table_id from reservationData:', reservationData.table_id, 'Type:', typeof reservationData.table_id);
        
        let parsedTableId = 1; // Default fallback
        if (reservationData.table_id) {
          if (typeof reservationData.table_id === 'number') {
            parsedTableId = reservationData.table_id;
          } else {
            // Extract number from strings like "default_2", "temp_5", or just "2"
            const match = String(reservationData.table_id).match(/\d+/);
            parsedTableId = match ? parseInt(match[0]) : 1;
          }
        }
        
        console.log('Parsed table_id:', parsedTableId);
        
        const reservationDataToSend = {
          ...reservationData,
          customer_id: customerId || null,
          // Fix data types for backend validation
          table_id: parsedTableId,
          number_of_guests: parseInt(reservationData.number_of_guests) || 1,
          duration_hours: parseInt(reservationData.duration_hours) || 2,
          payment_amount: parseFloat(reservationData.payment_amount) || 0
        };

        console.log('Sending reservation data:', reservationDataToSend);
        console.log('Data types check:', {
          table_id: typeof reservationDataToSend.table_id,
          number_of_guests: typeof reservationDataToSend.number_of_guests,
          duration_hours: typeof reservationDataToSend.duration_hours,
          payment_amount: typeof reservationDataToSend.payment_amount
        });

        // Submit reservation with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/reservations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reservationDataToSend),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          const responseData = await response.json();

          if (!response.ok) {
            console.error('Reservation creation failed:', responseData);
            throw new Error(responseData.message || `Failed to create reservation. Status: ${response.status}`);
          }

          console.log('Reservation saved successfully:', responseData);
          console.log('Reservation ID from response:', responseData.data?.id);
          const resId = responseData.data?.id;
          if (resId) {
            setReservationId(resId);
            console.log('Reservation ID set to:', resId);
          } else {
            console.error('No reservation ID in response!');
          }
          setIsSavingReservation(false);
          return; // Success, exit retry loop

        } catch (error) {
          clearTimeout(timeoutId);
          if (error.name === 'AbortError') {
            throw new Error('Request timeout - please try again');
          }
          throw error;
        }

      } catch (error) {
        console.error(`Reservation save attempt ${retryCount + 1} failed:`, error);
        retryCount++;

        if (retryCount >= maxRetries) {
          setErrors({
            reservation: error.message || 'Failed to save reservation after multiple attempts. Please try again.'
          });
          return;
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }

    setIsSavingReservation(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setErrors((prev) => ({ ...prev, file: "" }));
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    const fileInput = document.getElementById("file-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    const formatted = value
      .replace(/\D/g, "")
      .replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
    setPhoneNumber(formatted);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!uploadedFile) newErrors.file = "Please upload proof of payment";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!reservationId) {
      setErrors({ submit: "Reservation not saved yet. Please wait." });
      return;
    }

    setIsUploading(true);

    try {
      // Get user token
      const userDataStr = localStorage.getItem('user');
      if (!userDataStr) {
        throw new Error('No user session found');
      }

      const userData = JSON.parse(userDataStr);
      const token = userData?.token ||
                    userData?.data?.token ||
                    (userData?.data?.data && userData.data.data.token);

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Upload proof of payment via multipart form-data
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const uploadResponse = await fetch(`${import.meta.env.VITE_POS_BASE_URL || 'http://localhost:5000'}/api/reservations/${reservationId}/payment-proof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || `Failed to upload proof. Status: ${uploadResponse.status}`);
      }

      // Navigate to pending review page
      navigate("/reservation-pending", {
        state: {
          ...reservationData,
          phoneNumber,
          uploadedFile: uploadedFile.name,
          paymentStatus: "pending_review",
          reservationId,
        },
      });

    } catch (error) {
      console.error('Payment update error:', error);
      setErrors({
        submit: error.message || 'Failed to upload proof. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Nav />
      <main style={{ paddingTop: 90 }}>
        <section
          style={{
            background:
              `url(${reservation}) no-repeat center/cover`,
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "56px 16px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom right, rgba(0,0,0,0.55), rgba(0,0,0,0.25))",
            }}
          ></div>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              maxWidth: 600,
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                background: "#dc2626",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#fff" }}>
                SISZUMGYUPSAL RESERVATION
              </h1>
              <button
                onClick={() => navigate("/reservation-form")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                Back
              </button>
            </div>

            <div style={{ padding: "32px" }}>
              {/* Reservation Saved Message */}
              {isSavingReservation && (
                <div style={{
                  background: "#d1fae5",
                  border: "1px solid #10b981",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      border: "2px solid #10b981",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }}></div>
                    <span style={{ color: "#059669", fontWeight: 600 }}>
                      Saving your reservation...
                    </span>
                  </div>
                </div>
              )}

              {errors.reservation && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #ef4444",
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "center"
                }}>
                  <p style={{ color: "#dc2626", margin: 0 }}>
                    {errors.reservation}
                  </p>
                </div>
              )}
              <div
                style={{
                  background: "#f8f9fa",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ 
                  textAlign: "center",
                  marginBottom: "20px",
                  position: "relative"
                }}>
                  <div style={{
                    position: "relative",
                    display: "inline-block",
                    padding: "16px",
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    marginBottom: "20px"
                  }}>
                    <img
                      src={gcash}
                      alt="GCash QR"
                      style={{
                        width: "180px",
                        height: "180px",
                        borderRadius: "8px",
                        border: "1px solid #f0f0f0"
                      }}
                    />
                    <div style={{
                      position: "absolute",
                      top: "-8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#dc2626",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "4px 16px",
                      borderRadius: "20px",
                      whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)"
                    }}>
                      DOWN PAYMENT: ₱100.00
                    </div>
                  </div>
                  
                  <button
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                      color: "#fff",
                      border: "none",
                      padding: "12px 32px",
                      borderRadius: "30px",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(220, 38, 38, 0.25)",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      margin: "0 auto"
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.35)";
                      e.currentTarget.querySelector('.scan-shine').style.transform = 'translateX(100%) rotate(15deg)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(220, 38, 38, 0.25)";
                      e.currentTarget.querySelector('.scan-shine').style.transform = 'translateX(-100%) rotate(15deg)';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C15.73 20 18.84 17.45 19.73 14H17.65C16.83 16.33 14.61 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C13.66 6 15.14 6.69 16.22 7.78L13 11H20V4L17.65 6.35Z" fill="currentColor"/>
                    </svg>
                    SCAN ME
                    <span className="scan-shine" style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateX(-100%) rotate(15deg)',
                      transition: 'transform 0.6s ease',
                      pointerEvents: 'none'
                    }}></span>
                  </button>
                </div>
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#6b7280",
                    margin: 0,
                  }}
                >
                  To secure your reservation, kindly send a{" "}
                  <strong>P100 down payment</strong> through GCash.
                </p>
              </div>

              {/* Proof of Payment */}
              <div style={{ marginBottom: "24px" }}>
                <h3>Proof of Payment</h3>
                <div
                  style={{
                    border: `2px dashed ${errors.file ? "#dc2626" : "#d1d5db"}`,
                    borderRadius: "8px",
                    padding: "24px",
                    textAlign: "center",
                    background: "#f9fafb",
                  }}
                >
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  {!uploadedFile ? (
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        }
                        style={{
                          background: "#f97316",
                          color: "#fff",
                          border: "none",
                          padding: "12px 24px",
                          borderRadius: "8px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Upload Here
                      </button>
                      <p style={{ fontSize: "12px", color: "#6b7280" }}>
                        Upload screenshot of your GCash payment
                      </p>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "12px",
                      }}
                    >
                      <span>{uploadedFile.name}</span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        style={{
                          background: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
                {errors.file && (
                  <p style={{ color: "#dc2626", fontSize: "12px" }}>
                    {errors.file}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isUploading || isSavingReservation}
                style={{
                  width: "100%",
                  background: isUploading || isSavingReservation ? "#9ca3af" : "#dc2626",
                  color: "#fff",
                  padding: "14px 24px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 700,
                  cursor: isUploading || isSavingReservation ? "not-allowed" : "pointer",
                }}
              >
                {isSavingReservation
                  ? "Saving Reservation..."
                  : isUploading
                    ? "Processing..."
                    : "COMPLETE RESERVATION"}
              </button>

              {errors.submit && (
                <p style={{ color: "#dc2626", fontSize: "12px", textAlign: "center", marginTop: "8px" }}>
                  {errors.submit}
                </p>
              )}

              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
