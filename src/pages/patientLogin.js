import React, { useState } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; // Import the CSS file for styling

function PatientLogin() {
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
                    <h1>Patient Login</h1>
                    <form>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email"  className="general-input" placeholder='Enter Email' required />

                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder='Enter Password'
                                required
                            />
                            <span className="toggle-password" onClick={togglePasswordVisibility}>
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                        </div>

                        <button type="submit">Login</button>
                    </form>

                    <div className="login-options">
                        <p>Don't have an account? <a href="/register">Create one</a></p>
                        <p>or</p>
                        <button className="google-login">Login with Google</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PatientLogin;
