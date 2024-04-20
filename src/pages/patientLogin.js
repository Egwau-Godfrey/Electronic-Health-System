import React, { useState } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; // Import the CSS file for styling
import { auth, signInWithEmailAndPassword } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

function PatientLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Successful login, redirect or update state as needed
            console.log('Login successful!');
            sessionStorage.setItem('patientLogInfo', user.uid);
            navigate('/patient');
        } catch (error) {
            console.error('Login failed:', error);
        }
      };

    return (
        <>
            <div className="NavArea">
                <HomeNavbar />
            </div>
            <div className="CardContainer">
                <div className="Card">
                    <h1>Patient Login</h1>
                    <form onSubmit={handleLogin}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email"  className="general-input" placeholder='Enter Email' onChange = {(text) => setEmail(text.target.value)} required />

                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                onChange = {(text) => setPassword(text.target.value)}
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default PatientLogin;
