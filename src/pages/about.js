import React, { useState, useEffect } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import { storage } from '../firebase/config.js'
import { ref, getDownloadURL } from 'firebase/storage';
import "../css/about.css";  // Import the CSS file for styling

function About() {
    const [vector2ImageURL, setVector2ImageURL] = useState('');
    const [vector3ImageURL, setVector3ImageURL] = useState('');

    useEffect(() => {
        const getImageURLs = async () => {
            try {
                const vector2ImageRef = ref(storage, 'vector2.svg');
                const vector3ImageRef = ref(storage, 'vector3.svg');
    
                const vector2URL = await getDownloadURL(vector2ImageRef);
                const vector3URL = await getDownloadURL(vector3ImageRef);

                setVector2ImageURL(vector2URL);
                setVector3ImageURL(vector3URL);
            } catch(error) {
                console.error('Error fetching image URLs from Firebase Storage', error);
                alert('Error Fetching Images')
            }
        };
        getImageURLs()
    }, []);

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
                    {/* Display image fetched from Firebase Storage */}
                    <img src={vector2ImageURL} alt="Efficient Collaboration Icon" />

                    <h2>Our Mission</h2>
                    <p>
                        Our mission is to provide a unified solution that streamlines healthcare processes, ensuring 
                        quick and informed decision-making. By fostering collaboration and real-time analytics, we aim to 
                        contribute to the improvement of public health strategies and patient outcomes.
                    </p>
                </div>

                <div className="about-section">
                    {/* Display image fetched from Firebase Storage */}
                    <img src={vector3ImageURL} alt="Real-time Analytics Icon" />

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
