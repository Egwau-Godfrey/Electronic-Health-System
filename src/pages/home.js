import React, { useState, useEffect } from 'react';
import HomeNavbar from "../components/home_nav_bar";
import { storage } from '../firebase/config.js'
import { ref, getDownloadURL } from 'firebase/storage';
import "../css/homepage.css";  // Import the CSS file for styling


function Homepage() {

    const [heroImageURL, setHeroImageURL] = useState('');
    const [patientCareImageURL, setPatientCareImageURL] = useState('');
    const [collaborationImageURL, setCollaborationImageURL] = useState('');
    const [analyticsImageURL, setAnalyticsImageURL] = useState('');

    useEffect(() => {
        const getImageURLs = async () => {
            try {
                const heroImageRef = ref(storage, 'image4.avif');
                const patientCareImageRef = ref(storage, 'image3.avif');
                const collaborationImageRef = ref(storage, 'image2.avif');
                const analyticsImageRef = ref(storage, 'image1.avif');
    
                const heroImageURL = await getDownloadURL(heroImageRef);
                const patientCareImageURL = await getDownloadURL(patientCareImageRef);
                const collaborationImageURL = await getDownloadURL(collaborationImageRef);
                const analyticsImageURL = await getDownloadURL(analyticsImageRef);

                setHeroImageURL(heroImageURL);
                setPatientCareImageURL(patientCareImageURL);
                setCollaborationImageURL(collaborationImageURL);
                setAnalyticsImageURL(analyticsImageURL);
            } catch(error) {
                console.error('Error fetching image URLs from Firebase Storage', error);
                alert('Error Fetching Images')
            }
        };
        getImageURLs()
    }, [])

    


    return (
        <>
            <div className="NavArea">
                <HomeNavbar />
            </div>
            <div className="HomepageContainer">
                <section className="hero-section">
                    {/* Placeholder for Hero Image/Illustration */}
                    <img
                        src={heroImageURL}
                        alt="Health System Illustration"
                        className="hero-image"
                    />
                    <div className="hero-content">
                        <h1>Revolutionizing Healthcare with Our Health Management System</h1>
                        <p>Enhancing accessibility, collaboration, and patient outcomes for a healthier nation.</p>
                    </div>
                </section>

                <section className="benefits-section">
                    <h2>Key Benefits</h2>
                    <div className="card-container">
                        {/* Card 1: Enhanced Patient Care */}
                        <div className="card">
                            {/* Image or Icon for Enhanced Patient Care */}
                            <img src={patientCareImageURL} alt="Patient Care Icon" />
                            <h3>Enhanced Patient Care</h3>
                            <p>
                                Access comprehensive health records instantly, leading to more informed diagnoses,
                                personalized treatments, and improved patient outcomes.
                            </p>
                        </div>

                        {/* Card 2: Efficient Collaboration */}
                        <div className="card">
                            {/* Image or Icon for Efficient Collaboration */}
                            <img src={collaborationImageURL} alt="Collaboration Icon" />
                            <h3>Efficient Collaboration</h3>
                            <p>
                                Facilitates seamless communication and collaboration among healthcare providers for a
                                coordinated approach to patient care.
                            </p>
                        </div>

                        {/* Card 3: Real-time Analytics */}
                        <div className="card">
                            {/* Image or Icon for Real-time Analytics */}
                            <img src={analyticsImageURL} alt="Analytics Icon" />
                            <h3>Real-time Analytics</h3>
                            <p>
                                Integration of Google Charts for data visualization allows for informed decisions based
                                on real-time data analytics.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Add more sections as needed */}
            </div>
        </>
    );
}

export default Homepage;
