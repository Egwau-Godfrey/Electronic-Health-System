import React, { useState } from 'react';
import { useFirestore } from '../firebase/config';
import { getDocs, query, collection, where, doc } from 'firebase/firestore';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; 
import { useNavigate } from 'react-router-dom';

function OAdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [OAdmin, setOAdmin] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Query the Admins collection (assuming overall admins here)
            const adminsCollection = collection(useFirestore, 'Workers');
            const adminsQuery = query(adminsCollection,
                where('OAdmin', '==', OAdmin),
                where('password', '==', password)
            );

            const adminDocs = await getDocs(adminsQuery);

            if (adminDocs.docs.length > 0) {
                // Successful login
                console.log('Login successful');

                const OAdminDocID = adminDocs.docs[0].id; // Get Document ID

                sessionStorage.setItem('userToken', OAdminDocID); 

                navigate('/oadmin') // Redirect to overall admin dashboard or appropriate route
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
                    <h1>Overall Admin Login</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="adminID">Admin ID</label>
                        <input type="text" id="adminID" name="adminID"  className="general-input" placeholder='Enter AdminID' onChange={(text) => setOAdmin(text.target.value)} required />

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

export default OAdminLogin;
