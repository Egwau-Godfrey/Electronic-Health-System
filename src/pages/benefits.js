import React from 'react';
import HomeNavbar from "../components/home_nav_bar";
import "../css/benefits.css";  // Import the CSS file for styling

function Benefits() {
    return (
        <>
            <div className="NavArea">
                <HomeNavbar />
            </div>

            <div className="BenefitsContainer">
                <h1>Benefits of Our Electronic Health System</h1>

                <p>
                    Our Electronic Health System is a crucial step towards revolutionizing healthcare in Uganda,
                    addressing critical challenges and bringing about numerous benefits for both healthcare
                    professionals and the people of the country.
                </p>

                <div className="benefit">
                    {/* Placeholder for vector image */}
                    <img src="/images/vector1.svg" alt="Enhanced Patient Care Icon" />

                    <h2>Enhanced Patient Care</h2>
                    <p>
                        By providing a unified platform for patient data management, doctors can access comprehensive
                        health records instantly, leading to more informed diagnoses, personalized treatments, and
                        ultimately improved patient outcomes.
                    </p>
                </div>

                <div className="benefit">
                    {/* Placeholder for vector image */}
                    <img src="/images/vector2.svg" alt="Efficient Collaboration Icon" />

                    <h2>Efficient Collaboration</h2>
                    <p>
                        The system fosters seamless communication and collaboration among healthcare providers.
                        Doctors, lab technicians, and administrators can work cohesively, ensuring a coordinated
                        approach to patient care and facilitating quick response to medical needs.
                    </p>
                </div>

                <div className="benefit">
                    {/* Placeholder for vector image */}
                    <img src="/images/vector3.svg" alt="Real-time Analytics Icon" />

                    <h2>Real-time Analytics for Informed Decision-Making</h2>
                    <p>
                        The integration of Google Charts allows for data visualization and analytics based on location.
                        This empowers healthcare professionals and administrators to detect disease prevalence,
                        analyze outbreaks, and make data-driven decisions to enhance public health strategies.
                    </p>
                </div>

                {/* Add more content as needed */}
            </div>
        </>
    );
}

export default Benefits;
