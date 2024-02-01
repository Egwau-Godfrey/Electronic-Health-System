// doctorLogin.js

import React, { useState } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; // Import the CSS file for styling

function PatientSignup() {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <div className="NavArea">
                <HomeNavbar />
            </div>
            <div className="CardContainer">
                <div className="Card">
                    <h1>Sign Up</h1>
                    <form>
                        <label htmlFor="fname">First Name</label>
                        <input type="text" id="fname" name="firstName"  className="general-input" placeholder='Enter First Name' required />

                        <label htmlFor="lname">Last Name</label>
                        <input type="text" id="fname" name="lastName"  className="general-input" placeholder='Enter Last Name' required />

                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="Email"  className="general-input" placeholder='Enter Email' required />
                        
                        <label htmlFor="phone">Phone Number</label>
                        <input type="phone" id="phone" name="Phone"  className="general-input" placeholder='Enter Phone Number' required />
                        
                        <label htmlFor="uname">Username</label>
                        <input type="text" id="uname" name="userName"  className="general-input" placeholder='Enter User Name' required />
                        
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder='Enter password'
                                required
                            />
                            <span className="toggle-password" onClick={togglePasswordVisibility}>
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>

                        <button type="submit">Register</button>
                    </form>

                </div>
            </div>
        </>
    );
}

export default PatientSignup;
