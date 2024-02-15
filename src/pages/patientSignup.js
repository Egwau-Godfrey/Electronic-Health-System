import React, { useState } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import { useFirestore } from '../firebase/config';
import { collection, setDoc, doc } from 'firebase/firestore';
import "../css/login.css";
import { auth, createUserWithEmailAndPassword } from '../firebase/config';

function PatientSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({  // State to store errors
    fname: '',
    lname: '',
    dob: '',
    phone: '',
    email: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Validation functions
  const validateName = (name) => {
    if (name.trim() === '') {
      return 'Name is required';
    }
    return '';
  };

  const validateDate = (dateStr) => {
    if (dateStr === '') {
      return 'Date of birth is required';
    }
    return '';
  };

  const validatePhone = (phoneNumber) => {
    if (phoneNumber.trim() === '') {
      return 'Phone number is required';
    }
    // Add more specific phone number validation if needed (regex)
    return '';
  };

  const validateEmail = (email) => {
    if (email.trim() === '') {
      return 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Invalid email format';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return '';
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Reset errors on each submission attempt
    setErrors({});

    // Perform all validations 
    const newErrors = {
      fname: validateName(fname),
      lname: validateName(lname),
      dob: validateDate(dob),
      phone: validatePhone(phone),
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors); // Update errors state

    // If there are any validation errors, stop submission
    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }

    try {
      const newUser = await createUserWithEmailAndPassword(auth, email, password);

      const userData = { fname, lname, dob, email, phone };
      await setDoc(doc(collection(useFirestore, 'patients'), newUser.user.uid), userData);

      console.log('Signup successful');
      alert("Signup Successful");

    } catch (error) {
      let errorMessage = 'Signup Failed. Unknown error.';

      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already exists in database.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak'; // Or provide the specific weakness
      } 

      alert(errorMessage);
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
              <input 
                type="text" 
                id="fname" 
                name="firstName" 
                className="general-input" 
                placeholder='Enter First Name' 
                onChange={(text) => setFname(text.target.value)} 
                required 
                autoComplete="given-name" // AutoComplete for first name
              />

              <label htmlFor="lname">Last Name</label>
              <input 
                type="text" 
                id="lname" 
                name="lastName" 
                className="general-input" 
                placeholder='Enter Last Name' 
                onChange={(text) => setLname(text.target.value)} 
                required 
                autoComplete="family-name" // AutoComplete for last name
              />

              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input 
                type="date" 
                id="dateOfBirth" 
                name="dateOfBirth" 
                className="general-input" 
                placeholder='Enter Date of Birth' 
                onChange = {(text) => setDob(text.target.value)} 
                required 
              /> 
              
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" // Use 'tel' for better formatting suggestions
                id="phone" 
                name="Phone" 
                className="general-input" 
                placeholder='Enter Phone Number' 
                onChange={(text) => setPhone(text.target.value)} 
                required 
                autoComplete="tel"  
              /> 

              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="Email" 
                className="general-input" 
                placeholder='Enter Email' 
                onChange={(text) => setEmail(text.target.value)} 
                required 
                autoComplete="email"
              /> 
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder='Enter password'
                onChange = {(text) => setPassword(text.target.value)}
                required
                autoComplete="current-password"
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
