import React, { useState, useEffect } from 'react';
import { getDoc, getDocs, where, query, collection } from 'firebase/firestore'; 
import { useFirestore } from '../firebase/config';
import '../css/menuBar.css'; // Updated CSS file path
import SearchIcon from '@mui/icons-material/Search'; 
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';  // Import for profile avatar
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

async function handleSearch(event) {
  const firestore = useFirestore;
  const searchTerm = event.target.value.trim();
  console.log( searchTerm);

  if (!searchTerm) {
      // Clear the previous document from sessionStorage
      sessionStorage.removeItem('docData');
      return;
  }

  const patientsRef = collection(firestore, "patients");
  const q = query(patientsRef, where("patientID", "==", searchTerm));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    console.log("Document data:", docSnap.data());

    // Clear the previous document from sessionStorage
    sessionStorage.removeItem('docData');
    sessionStorage.removeItem('docName');
    sessionStorage.removeItem('docFullName');

    // Store the new document data in sessionStorage
    
    sessionStorage.setItem('docData', JSON.stringify(docSnap.data()));
    sessionStorage.setItem('docName', JSON.stringify(searchTerm));
    sessionStorage.setItem('docFullName', JSON.stringify(docSnap.id));

    const dataLoadTime = new Date();

    sessionStorage.setItem('dataLoadTime', JSON.stringify(dataLoadTime));
  } else {
    console.log("No such document!");
  }
}

function MenuBar({ doctorName }) {
  
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // State to manage profile dropdown
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null); // State to manage notifications dropdown
  const profileOpen = Boolean(profileAnchorEl); // If profileAnchorEl exists, profile dropdown is open
  const notificationsOpen = Boolean(notificationsAnchorEl); // If notificationsAnchorEl exists, notifications dropdown is open
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationsMenuClose = (event, patientID) => {
    event.stopPropagation(); // Prevent click event propagation
  
    setNotificationsAnchorEl(null);
    if (patientID) {
      // Set the patientID into the search field
      const searchInput = document.getElementById("searchInput");
      if (searchInput) {
        // Set the patientID string as the input value
        searchInput.value = patientID;
        // Trigger the search action manually
        handleSearch({ target: { value: patientID } });
      }
    }
  };
  
  
  


  const handleLogOut = () => {
    setProfileAnchorEl(null);
    sessionStorage.clear();
    navigate("/login/lab");
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const firestore = useFirestore;
      const labTestFormRef = collection(firestore, 'LabTestForm');
      const currentTime = new Date();
      const oneDayAgo = new Date(currentTime.getTime() - (24 * 60 * 60 * 1000)); // 24 hours ago in milliseconds
  
      const q = query(labTestFormRef, where("DoctorSubmitRequestTime", ">=", oneDayAgo));
      const querySnapshot = await getDocs(q);
  
      let uniqueNotifications = {}; // Object to store unique notifications based on patientID
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const patientID = data.patientID;
        const notificationTime = data.DoctorSubmitRequestTime.toDate();
  
        // Check if notification for this patientID already exists
        if (!uniqueNotifications[patientID] || uniqueNotifications[patientID].DoctorSubmitRequestTime < notificationTime) {
          uniqueNotifications[patientID] = {
            id: doc.id,
            firstName: data.firstName,
            patientID: patientID,
            DoctorSubmitRequestTime: notificationTime,
          };
        }
      });
  
      // Convert uniqueNotifications object to an array
      const newNotifications = Object.values(uniqueNotifications);
  
      setNotifications(newNotifications);
      setNotificationsCount(newNotifications.length);
    };
  
    fetchNotifications();
  }, []);
  

  return (
    <nav className="menu-bar">
      <div className="brand-section">
        <span className="brand-logo">{/* Optional - Add your app's logo or title */}</span>
        <span className="doctor-name">{`Welcome, Dr. ${doctorName}`}</span>
      </div>

      <div className="search-section">
        <SearchIcon /> 
        <input id="searchInput" type="text" defaultValue={''} placeholder="Search for a patient..." onChange={handleSearch} />
      </div>

      <div className="actions-section">
        <button className="notification-button" onClick={handleNotificationsClick}>
          <NotificationsIcon />
          {notificationsCount > 0 && (
            <span className="notification-badge">{notificationsCount}</span>
          )}
        </button>
        <div>
          <Avatar
            alt={doctorName}
            onClick={handleProfileClick}
            sx={{ cursor: 'pointer' }} // Add pointer cursor
          />
          <Menu
            anchorEl={profileAnchorEl}
            open={profileOpen}
            onClose={handleProfileMenuClose}
          >
            
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </div>
        <Menu
          anchorEl={notificationsAnchorEl}
          open={notificationsOpen}
          onClose={handleNotificationsMenuClose}
        >
          {notifications.length > 0 && (
            notifications.map((notification) => (
              <MenuItem key={notification.id} onClick={(event) => handleNotificationsMenuClose(event, notification.patientID)}>
                <div className="notification-item">
                  <span className="notification-text">
                    {notification.firstName} ({notification.patientID}) - {notification.DoctorSubmitRequestTime.toLocaleString()}
                  </span>
                </div>
              </MenuItem>
            ))
          )}
        </Menu>

      </div>
    </nav>
  );
}

export default MenuBar;
