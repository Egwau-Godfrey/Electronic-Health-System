// doctorLogin.js

import React, { useState } from 'react';
import { useFirestore } from '../firebase/config';
import { getDocs, query, collection, where, doc } from 'firebase/firestore';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css";
import { useNavigate } from 'react-router-dom';

function DoctorLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [hospitalID, setHospitalID] = useState('');
    const [doctorID, setDoctorID] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            // Query the Workers collection
            const workersCollection = collection(useFirestore, 'Workers');
            const workersQuery = query(workersCollection,
                where('hospitalID', '==', hospitalID),
                where('doctorID', '==', doctorID),
                where('password', '==', password)
            );

            // Get the matching documents
            const workerDocs = await getDocs(workersQuery);

            // Check if any matching documents exist
            if (workerDocs.docs.length > 0) {
                // Successful login, you can redirect or perform other actions here
                console.log('Login successful');

                const WorkerDocID = workerDocs.docs[0].id;
                
                sessionStorage.setItem('userToken', WorkerDocID);

                navigate('/doctors')
                
            } else {
                // Invalid credentials
                alert('Invalid credentials');
                console.log('Login failed: Invalid credentials');
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
                        <input type="text" id="hospitalID" name="hospitalNumber" className="general-input" placeholder='Enter HospitalID' onChange={(text) => setHospitalID(text.target.value)} required />

                        <label htmlFor="doctorID">Doctor ID</label>
                        <input type="text" id="doctorID" name="doctorID" className="general-input" placeholder='Enter DoctorID' onChange={(text) => setDoctorID(text.target.value)} required />

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
                                {showPassword ? '🙈' : '👁️'}
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
