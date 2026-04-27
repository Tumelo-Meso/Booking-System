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
  FaSearch,
  FaUpload,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [previewZoom, setPreviewZoom] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [gallery, setGallery] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const fileRef = React.useRef();

const [galleryForm, setGalleryForm] = useState({
  title: "",
  category: "custom",
  description: "",
  image: null
});
const [preview, setPreview] = useState(null);

  // Sample booking data (In production, fetch from backend)
  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = JSON.parse(localStorage.getItem("token"))
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

      getGallery();
     getBookings()
  }, [navigate]);


  const handleDownloadImage = (url) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = "client-image.jpg"; // default name
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  async function getBookings() {
    
    let token = JSON.parse(localStorage.getItem("token"))|| null;

    if(!token) navigate("/admin/login")

    try {
      const response = await fetch("http://localhost:1010/admin/getBookings",{
          method:"GET",
          headers:{
            "Authorization":token
          }
      });

      const data = await response.json();

      if(!response.ok){
        setBookings("")
        setFilteredBookings("");

        return
      }

      console.log(data)
      setBookings(data);
      setFilteredBookings(data); 
    } catch (error) {
        console.error(error)      
    }

  }

  async function getGallery() {

    try {

      const response = await fetch("http://localhost:1010/getGallery",{

        method:"GET",
  
      });

      if(!response.ok) return setGallery(null)
      const data = await response.json();
      setGallery(data);


    } catch (err) {
      console.error(err);
    }
}
  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = bookings;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => booking.bookingInfo.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.bookingInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||   
        booking.bookingInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase())||
        booking.bookingInfo.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()) 
       
      );
    }
    
    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const handleLogout = () => {
    localStorage.removeItem("token");
   
    navigate("/admin/login");
  };
  const handleGalleryChange = (e) => {
  const { name, value } = e.target;

  setGalleryForm(prev => ({
    ...prev,
    [name]: value
  }));
};

  const handleGalleryImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  setGalleryForm(prev => ({
    ...prev,
    image: file
  }));

  setPreview(URL.createObjectURL(file));
};

  async function updateStatus(bookingId,newStatus){

    let token = JSON.parse(localStorage.getItem("token"))|| null;

  
    if(!bookingId|| !newStatus || token == null){

      return alert("Invalid request")
    }

    try {
      
      const response = await fetch("http://localhost:1010/admin/updateBookings",{

          method:"PUT",
          headers:{
              "Authorization":token,
              "Content-Type":"application/json"
          },

          body:JSON.stringify({
             bookingId,newStatus
          })
      })

      const data = await response.json();

      if(!response.ok) return alert(data.message)

      alert("Status updated");  
      
      setShowModal(false);
      getBookings();
    } catch (error) {
        console.error(error)
      
    }
  }

  const createGalleryItem = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"));

    const data = new FormData();
    data.append("title", galleryForm.title);
    data.append("category", galleryForm.category);
    data.append("description", galleryForm.description);
    data.append("image", galleryForm.image);

    const response = await fetch("http://localhost:1010/admin/createGallery", {
      method: "POST",
      headers: { Authorization: token },
      body: data
    });

    const result = await response.json();
    if (!response.ok) return alert(result.message);

    alert("Gallery item created");

    setShowGalleryModal(false);
    setGalleryForm({ title: "", category: "custom", description: "", image: null });
    setPreview(null);

    // ← ADD THIS: clears the browser's cached file so the input fires onChange again
    if (fileRef.current) fileRef.current.value = "";

    getGallery();
  } catch (err) {
    console.error(err);
  }
};
  

  const handleDeleteBooking = async(id) => {
    

      
       let token = JSON.parse(localStorage.getItem("token")) || null

       if( token == null){
          return navigate("/admin/login")
       }
       try {
          const response = await fetch(`http://localhost:1010/admin/deleteBooking/${id}`, {
          method: "DELETE",
          headers: { Authorization: token },

        });

          const data = await response.json();

          if(!response.ok) return alert(data.message);

          alert(data.message)

          getBookings();


       } catch (error) {
          console.error(error)
        
       }
  };  

  const getStatusBadge = (status) => {
    switch(status) {
      case "Pending":
        return <span className="status-badge pending"><FaSpinner /> Pending</span>;
      case "Confirmed":
        return <span className="status-badge confirmed"><FaCheckCircle /> Confirmed</span>;
      case "Completed":
        return <span className="status-badge completed"><FaCheckCircle /> Completed</span>;
      case "Cancelled":
        return <span className="status-badge cancelled"><FaTimesCircle /> Cancelled</span>;
      default:
        return <span className="status-badge pending">Unknown</span>;
    }
  };

  const handleDeleteGallery = async(id)=>{

       let token = JSON.parse(localStorage.getItem("token")) || null

       if( token == null){
          return navigate("/admin/login")
       }
       try {
          const response = await fetch(`http://localhost:1010/admin/deleteGallery/${id}`, {
          method: "DELETE",
          headers: { Authorization: token },

        });

          const data = await response.json();

          if(!response.ok) return alert(data.message);

          alert(data.message)

          getGallery();

       } catch (error) {
          console.error(error)
        
       }
  }
  


    const stats = {
      totalBookings: bookings.length,

      pendingBookings: bookings.length!=0? bookings.filter(
        b => b.bookingInfo?.status === "Pending"
      ).length:0,

      confirmedBookings:bookings.length!=0? bookings.filter(
        b => b.bookingInfo?.status === "Confirmed"
      ).length:0,

      completedBookings:bookings.length!=0? bookings.filter(
        b => b.bookingInfo?.status === "Completed"
      ).length:0
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


              {filteredBookings.length !=0?filteredBookings.slice(0, 5).map(booking => (
                <tr key={booking.bookingInfo.id}>
                  <td>{booking.bookingInfo.id}</td>
                  <td>{booking.bookingInfo.firstName}  { booking.bookingInfo.lastName}</td>
                  <td>{booking.bookingInfo.serviceType}</td>
                  <td>{booking.bookingInfo.preferredDate}</td>
                  <td>{getStatusBadge(booking.bookingInfo.status)}</td>
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
              )):"No bookings found"}
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
              placeholder="Search by name or email ..."
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
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        
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
            { filteredBookings!=0 ?filteredBookings.map(booking => (
              <tr key={booking.bookingInfo.id}>
                <td>{booking.bookingInfo.id}</td>
                <td>{booking.bookingInfo.firstName}  {booking.bookingInfo.lastName}</td>
                <td>
                  <div className="contact-info-cell">
                    <small>{booking.bookingInfo.emailAddress}</small>
                    <small>{booking.bookingInfo.phoneNumber}</small>
                  </div>
                </td>
                <td>{booking.bookingInfo.serviceType}</td>
                <td>{booking.bookingInfo.tattoSize}</td>
                <td>{booking.bookingInfo.tattoPlacement}</td>
                <td>
                  <div>
                    {booking.bookingInfo.preferredDate}
                    <br />
                    <small>{booking.bookingInfo.preferredTime}</small>
                  </div>
                </td>
                <td>{getStatusBadge(booking.bookingInfo.status)}</td>
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
                      onClick={() => handleDeleteBooking(booking.bookingInfo.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            )):"No bookings found"}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderGallery = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bookings-management"
  >
    <div className="bookings-header">
      <h3>Gallery Management </h3>

      <div className="filters">
       <button
  className="export-btn"
  onClick={() => setShowGalleryModal(true)}
>
  <FaUpload /> Add Image
</button>
      </div>
    </div>

    <div className="gallery-grid">

      {gallery !==null ? 
      
    
           gallery.map((img) => (
        <div key={img.id} className="gallery-card">
          <img src={img.imageUrl} alt={img.title} />

          <div className="gallery-overlay">
            <button
              className="action-btn delete-btn"
              onClick={() => handleDeleteGallery(img.id)}
            >
              <FaTrash />
            </button>
          </div>

          <div className="gallery-info">
            <p>{img.title}</p>
              <p>{img.description}</p>
            <small>{img.category}</small>
          </div>
        </div>
      ))

      : "No images found"
    }

   
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
            <li className={activeTab === "gallery" ? "active" : ""} onClick={() => setActiveTab("gallery")}>
              <FaUsers /> Gallery Management
            </li>
          </ul>
        </aside>

        <main className="main-content">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "bookings" && renderBookings()}
          {activeTab === "gallery" && renderGallery()}
        </main>
      </div>

          <AnimatePresence>
  {selectedImage && (
    <motion.div
      className="image-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setSelectedImage(null)}
    >
      <motion.img
        src={selectedImage}
        alt="zoomed"
        className="zoomed-image"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      />
    </motion.div>
  )}
</AnimatePresence>

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
                  <span>{selectedBooking.bookingInfo.id}</span>
                </div>
                <div className="detail-row">
                  <strong>Customer Name:</strong>
                  <span>{selectedBooking.bookingInfo.firstName} {selectedBooking.bookingInfo.lastName}</span>
                </div>
                <div className="detail-row">
                  <strong>Email:</strong>
                  <span>{selectedBooking.bookingInfo.emailAddress}</span>
                </div>
                <div className="detail-row">
                  <strong>Phone:</strong>
                  <span>{selectedBooking.bookingInfo.phoneNumber}</span>
                </div>
                <div className="detail-row">
                  <strong>Service:</strong>
                  <span>{selectedBooking.bookingInfo.serviceType}</span>
                </div>
                <div className="detail-row">
                  <strong>Size:</strong>
                  <span>{selectedBooking.bookingInfo.tattoSize}</span>
                </div>
                <div className="detail-row">
                  <strong>Placement:</strong>
                  <span>{selectedBooking.bookingInfo.tattoPlacement}</span>
                </div>
                <div className="detail-row">
                  <strong>Description:</strong>
                  <span>{selectedBooking.bookingInfo.tattoDescription}</span>
                </div>


                <div className="detail-row">
                  <strong>Preferred Date:</strong>
                  <span>{selectedBooking.bookingInfo.preferredDate} at {selectedBooking.bookingInfo.preferredTime}</span>
                </div>

        

                <div className="detail-row">
                  <strong>Addditonal Notes:</strong>
                  <span>{selectedBooking.bookingInfo.additionalNotes ==null ? "" : selectedBooking.bookingInfo.additionalNotes } </span>
                </div>
                

                
          
          
                <div className="detail-row">
                  <strong>Status:</strong>
                  <span id="statusView">

                    {selectedBooking.bookingInfo.status}
                  </span>
                </div>
              </div>

                                
        <div className="client-images-section">
          <h4>Client Uploaded Images</h4>

          <div className="client-images-grid">
            {selectedBooking.row2.map((img, index) => (
              <img
  key={index}
  src={img.imageUrl}  
  alt="client upload"
  className="client-image"
  onClick={() => setSelectedImage(img.imageUrl)}
/>
            ))}
          </div>
        </div>

              <div className="modal-actions">
                <select 
                  onChange={(e) => updateStatus(selectedBooking.bookingInfo.id, e.target.value)}
                  defaultValue={selectedBooking.bookingInfo.status}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button className="delete-modal-btn" onClick={() => handleDeleteBooking(selectedBooking.bookingInfo.id)}>
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

        <AnimatePresence>
  {previewZoom && preview && (
    <motion.div
      className="image-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setPreviewZoom(false)}
    >
      <motion.img
        src={preview}
        alt="zoomed preview"
        className="zoomed-image"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      />
    </motion.div>
  )}
</AnimatePresence>
      <AnimatePresence>
  {showGalleryModal && (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setShowGalleryModal(false)}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Add Gallery Image</h3>

        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={galleryForm.title}
            onChange={handleGalleryChange}
            placeholder="Enter title"
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={galleryForm.category}
            onChange={handleGalleryChange}
          >
            <option value="custom">Custom</option>
            <option value="fineLine">Fine Line</option>
            <option value="realism">Realism</option>
            <option value="sleeve">Sleeve</option>
            <option value="coverup">Cover-up</option>
            <option value="watercolor">Watercolor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={galleryForm.description}
            onChange={handleGalleryChange}
            placeholder="Enter description"
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <input
  type="file"
  ref={fileRef}
  onChange={handleGalleryImage}
/>
        </div>

       {preview && (
  <div className="image-preview-container">
    <img
      src={preview}
      alt="preview"
      className="image-preview-img"
      onClick={() => setPreviewZoom(true)}
    />
  </div>
)}

        <div className="modal-actions">
          <button className="save-btn" onClick={createGalleryItem}>
            Save
          </button>
          <button
            className="close-modal-btn"
            onClick={() => {setShowGalleryModal(false)


              setPreview(null);
    setGalleryForm({ title: "", category: "custom", description: "", image: null });
    if (fileRef.current) fileRef.current.value = ""; // ← ADD THIS
            }
              
            }
          >
            Cancel
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