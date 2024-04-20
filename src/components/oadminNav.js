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


function OAMenuBar({HAName}) {
  
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
    navigate("/login/OAdmin");
  };

  const OAdminID = sessionStorage.getItem('OAdmin');
  console.log(OAdminID);

  const [OAData, setOAData] = useState('');

  useEffect(() => {
      const fetchOAData = async () => {
          const OAdminRef = doc(useFirestore, 'Workers', OAdminID);
          const OAdminSnap = await getDoc(OAdminRef);

          if (OAdminSnap.exists()) {
              setOAData(OAdminSnap.data());
          } else {
              console.log("No such document!");
          }
      };

      fetchOAData();
  }, []);


  return (
    <nav className="menu-bar">
      <div className="brand-section">
        <span className="brand-logo">{/* Optional - Add your app's logo or title */}</span>
        <span className="patient-name">{`Welcome ${OAData.fname}`}</span>
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
            alt={HAName}  
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

export default OAMenuBar;
