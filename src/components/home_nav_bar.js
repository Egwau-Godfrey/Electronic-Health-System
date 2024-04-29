import React from 'react';
import "../css/homenavbar.css";

function HomeNavbar() {
    return (
        <>
            <div className="Navbar">
                <ul className="logo">
                    <a href="/home">HMS</a>
                </ul>
                <ul className="Navigation">
                    <li><a href="/home">Home</a></li>
                    <li><a href="/About">About</a></li>
                    <li><a href="/Contact">Contact Us</a></li>
                    <li className="dropdown">
                        {/* <a href="/login" className="dropbtn" >Login</a> */}
                        <p>Login</p>
                        <div className="dropdown-content">
                            <a href="/login/patient">Patient</a>
                            <a href="/login/doctor">Doctor</a>
                            <a href="/login/lab">Lab Technician</a>
                            <a href="/login/HAdmin">Hospital Admin</a>
                            <a href="/login/OAdmin">Overall Admin</a>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default HomeNavbar;
