import React, { useState } from 'react';
import "../css/labtest.css";
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '../firebase/config';

const diseases = [
'Hypertension', 'Gastritis', 'Malaria', 'Influenza', 
'Anemia', 'Gastroenteritis', 'Nausea', 'Flues', 
'Syphylis', 'Myocardial infarction'
];

function LabTestOForm({labTestFormData, LabTechID}) {
    var labTestFormData = labTestFormData[0];
    console.log(labTestFormData);

    const [isOtherTestEditable, setIsOtherTestEditable] = useState(false);

    const [firstName, setFirstName] = useState(labTestFormData?.firstName || '');
    const [lastName, setLastName] = useState(labTestFormData?.lastName || '');
    const [age, setAge] = useState(labTestFormData?.age || '');
    const [selectedTests, setSelectedTests] = useState(labTestFormData?.selectedTests || []);
    const [notes, setNotes] = useState(labTestFormData?.notes || '');
    const [conclusion, setConclusion] = useState(labTestFormData?.conclusion || '');
    const [requestedBy, setRequestedBy] = useState(labTestFormData?.doctorID || '');
    const [performedBy, setPerformedBy] = useState(LabTechID);
    const [otherTest, setOther] = useState(labTestFormData?.otherTest || '');
    const [dateSubmitted, setDateSubmitted] = useState(new Date());
    const [DoctorSubmitRequestTime, setDoctorSubmitRequestTime] = useState(labTestFormData?.DoctorSubmitRequestTime.toDate() || '');




    const handleTestSelection = (test) => {


        if (selectedTests.includes(test)) {
        setSelectedTests(selectedTests.filter(t => t !== test));
        } else {
        setSelectedTests([...selectedTests, test]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Get Firestore instance
        const firestore = useFirestore;
        const patientRef = doc(firestore, 'LabTestForm', labTestFormData.id);
    
        //Handles time of the document
        const dataLoadTime = new Date(JSON.parse(sessionStorage.getItem('LabdataLoadTime')));

        const submitTime = new Date();

        const timeDifferenceMilliseconds = submitTime - dataLoadTime; // in milliseconds
        const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000); // in seconds
        const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60); // in minutes

        // To get the remaining seconds after the minutes have been subtracted
        const remainingSeconds = timeDifferenceSeconds % 60;

        try {
            // Add the form data to the LabTestForm collection
            await updateDoc(patientRef, {
                firstName: firstName,
                lastName: lastName,
                age: age,
                selectedTests: selectedTests,
                otherTest: otherTest,
                notes: notes,
                conclusion: conclusion,
                requestedBy: requestedBy,
                performedBy: performedBy,
                doctorID: labTestFormData.doctorID,
                LabTechID: LabTechID,
                LabTechSubmitTime: dateSubmitted,
                //Adds the the time spent on the patient
                LabTechtimeSpentInMinutes: timeDifferenceMinutes,
                LabTechRemainingSeconds: remainingSeconds,
            });
    
            // Log the success message and clear the form fields
            //console.log('Lab test form submitted successfully with ID: ', docRef.id);
            alert('Lab test form submitted successfully!');
            setFirstName('');
            setLastName('');
            setAge('');
            setSelectedTests([]);
            setOther('');
            setNotes('');
            setConclusion('');
            // You may want to handle clearing other form fields as well
        } catch (error) {
            console.error('Error adding document: ', error);
            alert('Error submitting lab test form. Please try again.');
        }
    };

    const handleOtherTestCheckboxChange = (e) => {
        setIsOtherTestEditable(e.target.checked);
    }

    return (
        <div className="lab-test-form">
        <h2>Lab Test Form</h2>

        <span>{DoctorSubmitRequestTime.toLocaleString()}</span>

        <br></br>
        <br></br>

        <form onSubmit={handleSubmit}>
            <div className="personal-info">
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    readOnly={true}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    readOnly={true}
                    />
                </div>
                <div className="form-group">
                    <label>Age:</label>
                    <input
                    type="text"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    readOnly={true}
                    />
                </div>
            </div>
            <div className="form-group">
                <label>Select Tests:</label>

                <div className="test-columns">
                    <div className="column">
                        {diseases.slice(0, 5).map((disease, index) => (
                            <div key={index} className="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        value={disease}
                                        checked={selectedTests.includes(disease)}
                                        onChange={() => handleTestSelection(disease)}
                                    />
                                    {disease}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="column">
                        {diseases.slice(5).map((disease, index) => (
                            <div key={index} className="checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        value={disease}
                                        checked={selectedTests.includes(disease)}
                                        onChange={() => handleTestSelection(disease)}
                                    />
                                    {disease}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            
            </div>

            <div className="form-group">
                <input  
                    type="checkbox"
                    checked={isOtherTestEditable}
                    onChange={handleOtherTestCheckboxChange}
                />
                <label>Other Test:</label>
                <textarea
                value={otherTest}
                onChange={(e) => setOther(e.target.value)}
                rows={6}
                readOnly={!isOtherTestEditable}
                />
            </div>

            <div className="form-group">
                <label>Lab Notes:</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={6}
                />
            </div>

            <div className="form-group">
                <label>Lab Conclusion:</label>
                <textarea
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    rows={6}
                />
            </div>

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
            <button type="submit">Submit</button>
        </form>
        </div>
    );
}

export default LabTestOForm;