import React, { useState, useEffect } from 'react';
import '../css/menuBar.css'; // Updated CSS file path
import SearchIcon from '@mui/icons-material/Search'; 
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';  // Import for profile avatar
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, getDocs, where, query, collection } from 'firebase/firestore';
import { useFirestore } from '../firebase/config';


function PatientMenuBar({ patientName }) {
  
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
    navigate("/login/patient");
  };

  const patientsID = sessionStorage.getItem('patientLogInfo');

  const [patientData, setPatientData] = useState('');

  useEffect(() => {
      const fetchPatientData = async () => {
          const patientRef = doc(useFirestore, 'patients', patientsID);
          const patientSnap = await getDoc(patientRef);

          if (patientSnap.exists()) {
              setPatientData(patientSnap.data());
          } else {
              console.log("No such document!");
          }
      };

      fetchPatientData();
  }, []);


  return (
    <nav className="menu-bar">
      <div className="brand-section">
        <span className="brand-logo">{/* Optional - Add your app's logo or title */}</span>
        <span className="patient-name">{`Welcome ${patientData.fname}`}</span>
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
            alt={patientName}  
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

export default PatientMenuBar;
