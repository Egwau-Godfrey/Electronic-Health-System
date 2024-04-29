import React, { useState, useEffect } from 'react';
import "../css/labtest.css";
import { collection, addDoc, getDocs, query, where, getDoc } from 'firebase/firestore';
import { useFirestore } from '../firebase/config';

const diseases = [
'Hypertension', 'Gastritis', 'Malaria', 'Influenza', 
'Anemia', 'Gastroenteritis', 'Nausea', 'Flues', 
'Syphylis', 'Myocardial infarction'
];

function LabTestForm({patientData, doctorID}) {

    const [isOtherTestEditable, setIsOtherTestEditable] = useState(false);

    const [firstName, setFirstName] = useState(patientData.fname);
    const [lastName, setLastName] = useState(patientData.lname);
    const [age, setAge] = useState(patientData.age);
    const [selectedTests, setSelectedTests] = useState([]);
    const [notes, setNotes] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [requestedBy, setRequestedBy] = useState(doctorID);
    const [performedBy, setPerformedBy] = useState('');
    const [otherTest, setOther] = useState('');
    const [dateSubmitted, setDateSubmitted] = useState(new Date()); 


    // useEffect(() => {
    //     const fetchFormData = async () => {
    //         // Get Firestore instance
    //         const firestore = useFirestore;
    //         try {
    //             const workersRef = collection(firestore, 'LabTestForm');
    //             const q = query(workersRef, where('patientID', '==', patientData.patientID));
    //             const querySnapshot = await getDocs(q);
        
    //             // Iterate over each document in the query snapshot
    //             querySnapshot.forEach(docSnap => {
    //                 const data = docSnap.data();
    //                 //console.log("Document Data:", data);
        
    //                 // Check if LabTechID exists in the document data
    //                 if (data.hasOwnProperty('LabTechID')) {
    //                     // If LabTechID exists, update the state with the document data
    //                     setNotes(data.notes);
    //                     //console.log("King Egwau: ", data.notes);
    //                     setConclusion(data.conclusion);
    //                     setPerformedBy(data.LabTechID);
    //                     setSelectedTests(data.selectedTests);
    //                 }
    //             });
    //         } catch (error) {
    //             console.error('Error fetching document: ', error);
    //         }
    //     };
    //     fetchFormData();        
    // }, [patientData.patientID]);
    
    

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
    
        try {
            // Add the form data to the LabTestForm collection
            const docRef = await addDoc(collection(firestore, 'LabTestForm'), {
                patientID: patientData.patientID,
                firstName: firstName,
                lastName: lastName,
                age: age,
                selectedTests: selectedTests,
                otherTest: otherTest,
                notes: notes,
                conclusion: conclusion,
                requestedBy: requestedBy,
                performedBy: performedBy,
                doctorID: doctorID,
                DoctorSubmitRequestTime: dateSubmitted,
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

export default LabTestForm;