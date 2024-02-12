import React, { useState } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/login.css"; // Import the CSS file for styling
import { auth, createUserWithEmailAndPassword, storage } from '../firebase/config';

function PatientSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [dob, setDob] = useState(''); // Date of Birth
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {

    try {

    } catch(error) {
        alert("Signup Failed");
        console.log("Signup Failed", error);
    }
  }

  return (
    <>
      <div className="NavArea">
        <HomeNavbar />
      </div>
      <div className="CardContainer">
        <div className="Card">
          <h1>Sign Up</h1>
          <form onSubmit={handleSignup}>
            <label htmlFor="fname">First Name</label>
            <input type="text" id="fname" name="firstName" className="general-input" placeholder='Enter First Name' required />

            <label htmlFor="lname">Last Name</label>
            <input type="text" id="lname" name="lastName" className="general-input" placeholder='Enter Last Name' required />

            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input type="date" id="dateOfBirth" name="dateOfBirth" className="general-input" placeholder='Enter Date of Birth' required />

            <label htmlFor="phone">Phone Number</label>
            <input type="phone" id="phone" name="Phone" className="general-input" placeholder='Enter Phone Number' required />

            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="Email" className="general-input" placeholder='Enter Email' required />

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
