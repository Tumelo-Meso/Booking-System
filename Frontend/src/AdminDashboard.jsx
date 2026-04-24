import React, { useState, useEffect } from "react";
import "./css/AdminDashboard.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaTachometerAlt,
  FaSignOutAlt,
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEye,
  FaTrash,
  FaDownload,
  FaFilter,
  FaSearch
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Sample booking data (In production, fetch from backend)
  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = JSON.parse(localStorage.getItem("token"))
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    // Load admin data
    const storedAdmin = localStorage.getItem("adminSession") || sessionStorage.getItem("adminData");
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }

    // Sample bookings data
    const sampleBookings = [
      {
        id: "BK001",
        customerName: "John Doe",
        email: "john@example.com",
        phone: "+27 123 456 789",
        service: "Custom Tattoo",
        size: "Medium (4-6 inches)",
        placement: "Arm",
        description: "Geometric lion design with mandala elements",
        preferredDate: "2024-03-20",
        preferredTime: "2:00 PM",
        status: "pending",
        createdAt: "2024-03-15T10:30:00",
        referenceImages: []
      },
      {
        id: "BK002",
        customerName: "Jane Smith",
        email: "jane@example.com",
        phone: "+27 987 654 321",
        service: "Fine Line",
        size: "Small (2-3 inches)",
        placement: "Wrist",
        description: "Minimalist moon phase tattoo",
        preferredDate: "2024-03-22",
        preferredTime: "11:00 AM",
        status: "confirmed",
        createdAt: "2024-03-16T14:15:00",
        referenceImages: []
      },
      {
        id: "BK003",
        customerName: "Mike Johnson",
        email: "mike@example.com",
        phone: "+27 456 789 123",
        service: "Realism",
        size: "Large (7-10 inches)",
        placement: "Chest",
        description: "Realistic portrait of a wolf",
        preferredDate: "2024-03-25",
        preferredTime: "3:00 PM",
        status: "completed",
        createdAt: "2024-03-10T09:45:00",
        referenceImages: []
      }
    ];

    setBookings(sampleBookings);
    setFilteredBookings(sampleBookings);
  }, [navigate]);

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = bookings;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminData");
    navigate("/admin/login");
  };

  const handleUpdateStatus = (bookingId, newStatus) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      )
    );
    setShowModal(false);
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      setShowModal(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return <span className="status-badge pending"><FaSpinner /> Pending</span>;
      case "confirmed":
        return <span className="status-badge confirmed"><FaCheckCircle /> Confirmed</span>;
      case "completed":
        return <span className="status-badge completed"><FaCheckCircle /> Completed</span>;
      case "cancelled":
        return <span className="status-badge cancelled"><FaTimesCircle /> Cancelled</span>;
      default:
        return <span className="status-badge pending">Unknown</span>;
    }
  };

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === "pending").length,
    confirmedBookings: bookings.filter(b => b.status === "confirmed").length,
    completedBookings: bookings.filter(b => b.status === "completed").length
  };

  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-overview"
    >
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaCalendarAlt />
          </div>
          <div className="stat-info">
            <h3>{stats.totalBookings}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaSpinner />
          </div>
          <div className="stat-info">
            <h3>{stats.pendingBookings}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon confirmed">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.confirmedBookings}</h3>
            <p>Confirmed</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon completed">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.completedBookings}</h3>
            <p>Completed</p>
          </div>
        </div>
      </div>

      <div className="recent-bookings">
        <h3>Recent Bookings</h3>
        <div className="bookings-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.slice(0, 5).map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.service}</td>
                  <td>{booking.preferredDate}</td>
                  <td>{getStatusBadge(booking.status)}</td>
                  <td>
                    <button 
                      className="action-btn view-btn"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  const renderBookings = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bookings-management"
    >
      <div className="bookings-header">
        <h3>All Bookings</h3>
        <div className="filters">
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="export-btn">
            <FaDownload /> Export
          </button>
        </div>
      </div>

      <div className="bookings-table full-width">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Contact</th>
              <th>Service</th>
              <th>Size</th>
              <th>Placement</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.customerName}</td>
                <td>
                  <div className="contact-info-cell">
                    <small>{booking.email}</small>
                    <small>{booking.phone}</small>
                  </div>
                </td>
                <td>{booking.service}</td>
                <td>{booking.size}</td>
                <td>{booking.placement}</td>
                <td>
                  <div>
                    {booking.preferredDate}
                    <br />
                    <small>{booking.preferredTime}</small>
                  </div>
                </td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn view-btn"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowModal(true);
                      }}
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteBooking(booking.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="nav-brand">
          <FaTachometerAlt />
          <h2>Pure Ink Co.   |   Admin Panel</h2>
        </div>
        
        <div className="nav-user">
          <FaUserCircle className="user-icon" />
          <div className="user-info">
            <span>{adminData?.email || "admin@pureink.com"}</span>
            <small>Administrator</small>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <ul>
            <li className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}>
              <FaTachometerAlt /> Overview
            </li>
            <li className={activeTab === "bookings" ? "active" : ""} onClick={() => setActiveTab("bookings")}>
              <FaCalendarAlt /> Bookings
            </li>
            <li className={activeTab === "customers" ? "active" : ""} onClick={() => setActiveTab("customers")}>
              <FaUsers /> Customers
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "bookings" && renderBookings()}
          {activeTab === "customers" && renderBookings()}
        </main>
      </div>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {showModal && selectedBooking && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Booking Details</h3>
              <div className="modal-details">
                <div className="detail-row">
                  <strong>Booking ID:</strong>
                  <span>{selectedBooking.id}</span>
                </div>
                <div className="detail-row">
                  <strong>Customer Name:</strong>
                  <span>{selectedBooking.customerName}</span>
                </div>
                <div className="detail-row">
                  <strong>Email:</strong>
                  <span>{selectedBooking.email}</span>
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong>
                  <span>{selectedBooking.phone}</span>
                </div>
                <div className="detail-row">
                  <strong>Service:</strong>
                  <span>{selectedBooking.service}</span>
                </div>
                <div className="detail-row">
                  <strong>Size:</strong>
                  <span>{selectedBooking.size}</span>
                </div>
                <div className="detail-row">
                  <strong>Placement:</strong>
                  <span>{selectedBooking.placement}</span>
                </div>
                <div className="detail-row">
                  <strong>Description:</strong>
                  <span>{selectedBooking.description}</span>
                </div>
                <div className="detail-row">
                  <strong>Preferred Date:</strong>
                  <span>{selectedBooking.preferredDate} at {selectedBooking.preferredTime}</span>
                </div>
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span>{getStatusBadge(selectedBooking.status)}</span>
                </div>
              </div>

              <div className="modal-actions">
                <select 
                  onChange={(e) => handleUpdateStatus(selectedBooking.id, e.target.value)}
                  defaultValue={selectedBooking.status}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="delete-modal-btn" onClick={() => handleDeleteBooking(selectedBooking.id)}>
                  Delete Booking
                </button>
                <button className="close-modal-btn" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;