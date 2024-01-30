import React from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/about.css";  // Import the CSS file for styling

function About() {
    return (
        <>
            <div className="NavArea">
                <HomeNavbar />
            </div>

            <div className="AboutContainer">
                <h1>About Our Electronic Health System</h1>

                <div className="about-section">
                    <p>
                        Welcome to our Electronic Health System, a revolutionary platform designed to enhance healthcare 
                        accessibility and collaboration across Uganda. Our website serves as a centralized hub for managing 
                        patient information and facilitating efficient communication among healthcare professionals.
                    </p>
                </div>

                <div className="about-section">
                    {/* Placeholder for vector image */}
                    <img src="/images/vector2.svg" alt="Efficient Collaboration Icon" />

                    <h2>Our Mission</h2>
                    <p>
                        Our mission is to provide a unified solution that streamlines healthcare processes, ensuring 
                        quick and informed decision-making. By fostering collaboration and real-time analytics, we aim to 
                        contribute to the improvement of public health strategies and patient outcomes.
                    </p>
                </div>

                <div className="about-section">
                    {/* Placeholder for vector image */}
                    <img src="/images/vector3.svg" alt="Real-time Analytics Icon" />

                    <h2>Why We Exist</h2>
                    <p>
                        The existence of our Electronic Health System is rooted in the commitment to address challenges 
                        in the current healthcare landscape. We believe in leveraging technology to create a more connected 
                        and efficient healthcare ecosystem that benefits both medical professionals and the community.
                    </p>
                </div>

                {/* Add more content as needed */}
            </div>
        </>
    );
}

export default About;
