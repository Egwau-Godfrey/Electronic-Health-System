import React, { useState } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; // Import the CSS file for styling

function HAdminLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [hospitalID, setHospitalID] = useState('');
    const [adminID, setAdminID] = useState('');
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {

        try {

        } catch(error) {
            alert("Failed to Login");
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
                        <input type="text" id="adminID" name="adminID"  className="general-input" placeholder='Enter AdminID' onChange={(text) => setAdminID(text.target.value)} required />

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
