import React, { useState } from 'react';
import { useFirestore } from '../firebase/config';
import { getDocs, query, collection, where, doc } from 'firebase/firestore';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; 
import { useNavigate } from 'react-router-dom';

function HAdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [hospitalID, setHospitalID] = useState('');
    const [Hadmin, setHAdmin] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Query the Admins collection
            const adminsCollection = collection(useFirestore, 'Workers');
            const adminsQuery = query(adminsCollection,
                where('hospitalID', '==', hospitalID),
                where('HAdmin', '==', Hadmin),
                where('password', '==', password)
            );

            const adminDocs = await getDocs(adminsQuery);

            if (adminDocs.docs.length > 0) {
                // Successful login
                console.log('Login successful');

                const HAdminDocID = adminDocs.docs[0].id; // Get Document ID

                sessionStorage.setItem('HAdminToken', HAdminDocID); 

                navigate('/hadmin') // Redirect to admin dashboard or appropriate route
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
                    <h1>Hospital Admin Login</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="hospitalID">Hospital ID</label>
                        <input type="text" id="hospitalID" name="hospitalNumber"  className="general-input" placeholder='Enter HospitalID' onChange={(text) => setHospitalID(text.target.value)} required />

                        <label htmlFor="adminID">Admin ID</label>
                        <input type="text" id="adminID" name="adminID"  className="general-input" placeholder='Enter AdminID' onChange={(text) => setHAdmin(text.target.value)} required />

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

export default HAdminLogin;
