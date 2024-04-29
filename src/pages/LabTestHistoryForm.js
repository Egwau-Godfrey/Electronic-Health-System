import React, { useState } from 'react';
import "../css/labtest.css";

function LabTestForm({ patientData, doctorID, formData }) {
  const [selectedTests, setSelectedTests] = useState(formData.selectedTests || []);
  const [notes, setNotes] = useState(formData.notes || '');
  const [conclusion, setConclusion] = useState(formData.conclusion || '');
  const [requestedBy, setRequestedBy] = useState(doctorID);
  const [performedBy, setPerformedBy] = useState(formData.performedBy || '');
  const [labTechSubmitTime, setlabTechSubmitTime] = useState(formData?.LabTechSubmitTime.toDate()); // Add this line
  // ...

  return (
    <div className="lab-test-form">
      <h2> Lab Test Form</h2>

      <span>{labTechSubmitTime.toLocaleString()}</span>
      <br></br>
      <br></br>
      <form>
        {/* ... */}
        <div className="personal-info">
          <div className="form-group">
            <label>First Name:</label>
            <input type="text" value={patientData.fname} readOnly={true} />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input type="text" value={patientData.lname} readOnly={true} />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input type="text" value={patientData.age} readOnly={true} />
          </div>
        </div>
        {/* ... */}
        <div className="form-group">
          <label>Select Tests:</label>
          {/* Render the selected tests as read-only checkboxes */}
          {selectedTests.map((test, index) => (
            <div key={index} className="checkbox">
              <label>
                <input type="checkbox" checked={true} readOnly={true} />
                {test}
              </label>
            </div>
          ))}
        </div>
        {/* ... */}
        <div className="form-group">
          <label>Lab Notes:</label>
          <textarea value={notes} readOnly={true} rows={6} />
        </div>
        <div className="form-group">
          <label>Lab Conclusion:</label>
          <textarea value={conclusion} readOnly={true} rows={6} />
        </div>
        {/* ... */}

        <div className="footer">
            <div className="form-group">
                <label>Requested By:</label>
                <input
                type="text"
                value={requestedBy}
                readOnly={true}
                onChange={(e) => setRequestedBy(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Performed By:</label>
                <input
                type="text"
                value={performedBy}
                readOnly={true}
                onChange={(e) => setPerformedBy(e.target.value)}
                />
            </div>
        </div>
      </form>
    </div>
  );
}

export default LabTestForm;
