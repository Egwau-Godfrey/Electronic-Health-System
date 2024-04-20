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
  const [anchorEl, setAnchorEl] = useState(null); // State to manage dropdown
  const open = Boolean(anchorEl); // If anchorEl exists, dropdown is open
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    setAnchorEl(null);
    sessionStorage.clear();
    navigate("/login/doctor");
  };

  useEffect(() => {
    // TODO: Fetch notifications logic with updates to 'notificationsCount'
  }, []);

  return (
    <nav className="menu-bar">
      <div className="brand-section">
        <span className="brand-logo">{/* Optional - Add your app's logo or title */}</span>
        <span className="doctor-name">{`Welcome, Dr. ${doctorName}`}</span>
      </div>

      <div className="search-section">
        <SearchIcon /> 
        <input type="text" defaultValue={''} placeholder="Search for a patient..." onChange={handleSearch} />
      </div>

      <div className="actions-section">
        <button className="notification-button">
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
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>View Profile</MenuItem>
            {/* Add more options like Settings here if needed */}
            <MenuItem onClick={handleLogOut}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </nav>
  );
}

export default MenuBar;
