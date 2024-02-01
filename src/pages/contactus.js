import React from 'react';
import HomeNavbar from "../components/home_nav_bar";
import GoogleMap from "../components/GoogleMap";
import "../css/contact.css";

function Contact() {
    return (
        <>
            <div className="NavArea">
                <HomeNavbar />
            </div>

            <div className="ContactContainer">
                <section className="contact-info-section">
                    <h1>Contact Us</h1>
                    <p>Feel free to reach out to us with any inquiries or feedback.</p>

                    <div className="contact-info">
                        <div>
                            <h3>Email</h3>
                            <p>ugandaEHRS@gmail.com</p>
                        </div>
                        <div>
                            <h3>Phone</h3>
                            <p>+256 356 7890 42</p>
                        </div> 
                        <div>
                            <h3>Address</h3>
                            <p>456 High Street, Mbarara, Uganda</p>
                        </div>
                    </div>
                </section>

                <section className="contact-form-section">
                    <h2>Send Us a Message</h2>
                    <form>
                        <label htmlFor="name">Your Name</label>
                        <input type="text" id="name" name="name" required />

                        <label htmlFor="email">Your Email</label>
                        <input type="email" id="email" name="email" required />

                        <label htmlFor="message">Your Message</label>
                        <textarea id="message" name="message" rows="4" required></textarea>

                        <button type="submit">Send Message</button>
                    </form>
                </section>

                <section className="map-section">
                    <h2>Our Location</h2>
                    <GoogleMap />
                </section>
            </div>
        </>
    );
}

export default Contact;
