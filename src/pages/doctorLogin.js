// doctorLogin.js

import React, { useState } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; // Import the CSS file for styling
import { useFirestore } from '../firebase/config';
import { getDocs, getDoc, where, query, collection } from 'firebase/firestore';

function DoctorLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [hospitalID, setHospitalID] = useState('');
    const [doctorID, setDoctorID] = useState('');
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
          // Create a query for the worker 
          const workerQuery = query(
            collection(useFirestore, 'Workers'), 
            where('doctorID', '==', doctorID) // Filter by the entered doctorID
          );
    
          const workerQuerySnapshot = await getDocs(workerQuery);
           
          console.log("Hello");
          console.log(workerQuerySnapshot);

          if (workerQuerySnapshot.empty) {
            alert('Doctor not found');
            return; 
          }
    
          // Assuming only one doctor should match the doctorID
          workerQuerySnapshot.forEach((doc) => {
            console.log(doc.id, '=>', doc.data());
            });
          const workerDoc = workerQuerySnapshot.docs[0]; // Get the matching document
          const workerData = workerDoc.data();

          
    
          // Fetch the referenced hospital data
          const hospitalDocRef = workerData.hospitalID;
          const hospitalDocSnapshot = await getDoc(hospitalDocRef);
    
          if (hospitalDocSnapshot.exists()) {
            // Validate credentials (with correct hospital ID)
            if (hospitalDocSnapshot.id === hospitalID && workerData.password === password) {
              console.log('Login Successful');
              alert("Login Successful");
              // ... Handle successful login 
            } else {
              alert('Incorrect credentials');
            }
          } else {
            alert('Hospital not found');
          }
    
        } catch (error) {
          alert('Failed to Login');
          console.error('Login Failed', error);
        }
      }

    return (
        <>
            <div className="NavArea">
                <HomeNavbar />
            </div>
            <div className="CardContainer">
                <div className="Card">
                    <h1>Doctor Login</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="hospitalID">Hospital ID</label>
                        <input type="text" id="hospitalID" name="hospitalNumber"  className="general-input" placeholder='Enter HospitalID' onChange={(text) => setHospitalID(text.target.value)} required />

                        <label htmlFor="doctorID">Doctor ID</label>
                        <input type="text" id="doctorID" name="doctorID"  className="general-input" placeholder='Enter DoctorID' onChange={(text) => setDoctorID(text.target.value.trim)} required />

                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder='Enter Password'
                                onChange={(text) => setPassword(text.target.value)}
                                required
                            />
                            <span className="toggle-password" onClick={togglePasswordVisibility}>
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>

                        <button type="submit">Login</button>
                    </form>

                </div>
            </div>
        </>
    );
}

export default DoctorLogin;
