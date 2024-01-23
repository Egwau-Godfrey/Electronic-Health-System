// GoogleMap.js
import React from 'react';

function GoogleMap() {
  return (
    <div className="google-map">
      <iframe
        title="Google Map"
        width="100%"
        height="400"
        frameBorder="0"
        style={{ border: 0 }}
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5957854679323!2d30.659793874076847!3d-0.6051487352591307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19d91ba6f7a7f84b%3A0x7a295ca429293cdf!2sMbarara%20-%20Masaka%20Rd%2C%20Mbarara!5e0!3m2!1sen!2sug!4v1706011060180!5m2!1sen!2sug"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default GoogleMap;
