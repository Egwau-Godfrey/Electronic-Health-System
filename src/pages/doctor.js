// Doctors.js

import React, { useState, useEffect } from 'react';
import { useFirestore } from '../firebase/config';
import { collection, updateDoc, getDoc,getDocs, doc, addDoc } from 'firebase/firestore';
import MenuBar from '../components/doctorMenuBar';
import "../css/doctors.css";
import { colors } from '@mui/material';

// Custom hook to fetch doctor data
function useDoctorData() {
    const [doctorName, setDoctorName] = useState('');
    const [hospitalID, setHospitalID] = useState('');
    const [doctorID, setDoctorID] = useState('');

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const userToken = sessionStorage.getItem('userToken');
                const workersRef = collection(useFirestore, 'Workers');
                const snapshot = await getDoc(doc(workersRef, userToken));
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setDoctorName(`${data.fname} ${data.lname}`);
                    setHospitalID(data.hospitalID);
                    setDoctorID(data.doctorID);
                    sessionStorage.setItem('doctorID', data.doctorID);
                }
            } catch (error) {
                console.error('Error fetching doctor data', error);
            }
        };

        fetchDoctorData();
    }, []);

    return [doctorName, hospitalID, doctorID];
}

function Doctors() {
    const [doctorName, hospitalID, doctorID] = useDoctorData();
    const [selectedItem, setSelectedItem] = useState(null);

    return (
        <div>
            <MenuBar doctorName={doctorName} />
            <div className='container'>
                <div id='sidebar' className='sidebar'>
                    <div className='sidebar-item' onClick={() => setSelectedItem('patientInfo')}>
                        <a href="#">Patient Info</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('history')}>
                        <a href="#">History</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('addDiagnosis')}>
                        <a href="#">Add Diagnosis</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('LabTest')}>
                        <a href="#">Lab Test</a>
                    </div>
                </div>
                <div className='content'>
                    {selectedItem === 'patientInfo' && <PatientInfo />}
                    {selectedItem === 'history' && <History />}
                    {selectedItem === 'addDiagnosis' && <AddDiagnosis doctorName={doctorName} hospitalID={hospitalID} doctorID={doctorID} />}
                    {selectedItem === 'LabTest' && <LabTest />}
                </div>
            </div>
        </div>
    );
}


function PatientInfo() {
    const [docData, setDocData] = useState(JSON.parse(sessionStorage.getItem('docData')));
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            setDocData(JSON.parse(sessionStorage.getItem('docData')));
        }, 1000); // Check every second

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    if (!docData) {
        return <div>Search For Patient</div>;
    }

    const { dob, email, phone, fname, lname, patientID } = docData;

    return (
        <div className="patient-info-card">
            <h2>Patient Information</h2>
            <p><strong>PatientID:</strong> {patientID}</p>
            <p><strong>Name:</strong> {fname} {lname}</p>
            <p><strong>Date of Birth:</strong> {dob}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Phone:</strong> {phone}</p>
        </div>
    );
}

function History() {
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedPatientID = JSON.parse(sessionStorage.getItem('docFullName'));
        if (!storedPatientID) return;

        const fetchMedicalData = async () => {
            const patientId = storedPatientID;
            const patientRef = doc(useFirestore, 'patients', patientId);
            const medicalDataCollectionRef = collection(patientRef, 'medicalData');

            try {
                setLoading(true);
                const medicalDataSnapshot = await getDocs(medicalDataCollectionRef);
                const medicalData = medicalDataSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setPatientData(medicalData);
            } catch (error) {
                console.error('Error fetching medical data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedicalData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!patientData || patientData.length === 0) {
        return <div>No Medical Data Available</div>;
    }

    return (
        <div>
            {patientData.map((data, index) => (
                <MedicalRecordCard
                    key={index}
                    data={data}
                    showTime={true} // Flag to indicate whether to show time
                    showButtons={true} // Flag to indicate whether to show buttons
                />
                
            ))}
        </div>
    );
}


function MedicalRecordCard({ data, showTime, showButtons }) {
    const [recordData, setRecordData] = useState({
        diagnosis: data.diagnosis,
        doctorNotes: data.doctorNotes
    });
    const [expanded, setExpanded] = useState(false);
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        const currentlyLoggedInDoctorID = sessionStorage.getItem('doctorID');
        setEditable(currentlyLoggedInDoctorID === data.doctorID);
    }, [data.doctorID]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleTextareaClick = (event) => {
        event.stopPropagation();
    };

    const handleEdit = (field) => {
        const newValue = field === 'diagnosis' ? recordData.diagnosis : recordData.doctorNotes;
        const docID = JSON.parse(sessionStorage.getItem('docFullName'));
        const patientRef = doc(useFirestore, 'patients', docID);
        const recordRef = doc(patientRef, 'medicalData', data.id);

        updateDoc(recordRef, {
            [field]: newValue
        }).then(() => {
            console.log(`${field} updated successfully!`);
            alert(`${field} updated successfully!`);
        }).catch((error) => {
            console.error(`Error updating ${field}:`, error);
            alert(`Error updating ${field}!`);
        });
    };

    return (
        <div className={`medical-record-card ${expanded ? 'expanded' : ''}`} onClick={toggleExpanded}>
            <div className='medical-record-hidden'>
                {showTime && (
                    <>
                        <p>Date: {data.date.toDate().toLocaleString()} </p>
                        <p>Doctor Time Spent: {data.DoctortimeSpentInMinutes} Minutes and {data.DoctorRemainingSeconds} Seconds</p>
                        
                    </>
                )}
                <div className="diagnosisArea">
                    Diagnosis:
                    <textarea
                        className='diagnosisTextArea'
                        rows="1"
                        readOnly={!editable}
                        value={recordData.diagnosis}
                        onChange={e => setRecordData({ ...recordData, diagnosis: e.target.value })}
                    ></textarea>
                    {showButtons && (
                        <button id='editButton' disabled={!editable} onClick={() => handleEdit('diagnosis')}>Edit</button>
                    )}
                </div>
            </div>
            <div className="medical-record-details">
                <p><strong>Hospital ID:</strong> {data.hospitalID}</p>
                <p><strong>Doctor Name:</strong> {data.doctorName}</p>
                <p><strong>Doctor ID:</strong> {data.doctorID}</p>
                <div className="doctor-notes-container">
                    <label htmlFor="doctorNotes">Doctor's Notes:</label>
                    <div className="doctorNotesArea">
                        <textarea
                            className="hdoctorNotes"
                            name="doctorNotes"
                            rows="6"
                            cols="60"
                            readOnly={!editable}
                            value={recordData.doctorNotes}
                            onChange={e => setRecordData({ ...recordData, doctorNotes: e.target.value })}
                            onClick={handleTextareaClick}
                        ></textarea>
                        {showButtons && (
                            <button id='editButton' disabled={!editable} onClick={() => handleEdit('doctorNotes')}>Edit</button>
                        )}
                    </div>
                </div>
                <div>
                    {data.LabTechID && (
                        <>
                            <p><strong>Lab Test Date:</strong> {Date(data.LabTestdate)}</p>
                            <p><strong>Lab Technician ID:</strong> {data.LabTechID}</p>
                            <p><strong>Lab Tech Name:</strong> {data.LabTechName}</p>
                            <p><strong>Hospital ID:</strong> {data.hospitalID}</p>

                            <div className="doctor-notes-container">
                                <label htmlFor="doctorNotes">Lab Notes:</label>
                                <div className="doctorNotesArea">
                                    <textarea
                                        className="hdoctorNotes"
                                        name="doctorNotes"
                                        rows="6"
                                        cols="60"
                                        readOnly={true}
                                        value={data.LabTechNotes}
                                        //onChange={e => setRecordData({ ...recordData, doctorNotes: e.target.value })}
                                        onClick={handleTextareaClick}
                                    ></textarea>
                                    
                                </div>
                                <label htmlFor="doctorNotes">Lab Conclusion:</label>
                                <div className="doctorNotesArea">
                                    <textarea
                                        className="hdoctorNotes"
                                        name="doctorNotes"
                                        rows="2"
                                        cols="60"
                                        readOnly={true}
                                        value={data.conclusion}
                                        //onChange={e => setRecordData({ ...recordData, doctorNotes: e.target.value })}
                                        onClick={handleTextareaClick}
                                    ></textarea>
                                    
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}




function AddDiagnosis() {

    const [doctorNotes, setDoctorNotes] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [doctorName, hospitalID, doctorID] = useDoctorData();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const docData = JSON.parse(sessionStorage.getItem('docData'));
        const docID = JSON.parse(sessionStorage.getItem('docFullName'));
        const dataLoadTime = new Date(JSON.parse(sessionStorage.getItem('dataLoadTime')));
        console.log('The name is below');
        console.log(docID);
        if (!docData) {
            console.error('No patient data found in session storage');
            return;
        }
    
        const patientId = docID; // assuming the patient ID is stored in the name property
        const patientRef = doc(useFirestore, 'patients', patientId);
        const medicalDataCollectionRef = collection(patientRef, 'medicalData');
    
        const medicalDataSnapshot = await getDocs(medicalDataCollectionRef);
        const currentDate = new Date

        console.log('The doctor name and hospital ID is below');
        console.log(doctorName, hospitalID);
        console.log('The current date is below');

        const submitTime = new Date();

        const timeDifferenceMilliseconds = submitTime - dataLoadTime; // in milliseconds
        const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000); // in seconds
        const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60); // in minutes

        // To get the remaining seconds after the minutes have been subtracted
        const remainingSeconds = timeDifferenceSeconds % 60;

        if (medicalDataSnapshot.empty) {
            // The medicalData collection does not exist, create it
            const docRef = await addDoc(medicalDataCollectionRef, {
                date: currentDate,
                doctorName: doctorName,
                doctorID: doctorID,
                hospitalID: hospitalID,
                doctorNotes: doctorNotes,
                diagnosis: diagnosis,
                DoctortimeSpentInMinutes: timeDifferenceMinutes,
                DoctorRemainingSeconds: remainingSeconds,
                // add other fields here
            });
        } else {
            // The medicalData collection exists, add a new document to it
            const docRef = await addDoc(medicalDataCollectionRef, {
                date: currentDate,
                doctorName: doctorName,
                doctorID: doctorID,
                hospitalID: hospitalID,
                doctorNotes: doctorNotes,
                diagnosis: diagnosis,
                DoctortimeSpentInMinutes: timeDifferenceMinutes,
                DoctorRemainingSeconds: remainingSeconds,
                // add other fields here
            });
        }

        alert('Diagnosis added successfully in ' + timeDifferenceMinutes + ' minutes ' + remainingSeconds + ' seconds');
    
        // Clear the inputs
        setDoctorNotes('');
        setDiagnosis('');
    };

    return (
        <div className="diagnosis-form-container">
            <h2>Add Diagnosis</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <label htmlFor="doctorNotes">Doctor's Notes:</label>
                    <textarea id="doctorNotes" name="doctorNotes" rows="6" cols="60" value={doctorNotes} onChange={e => setDoctorNotes(e.target.value)}></textarea>
                </div>
                <div className="form-row">
                    <label htmlFor="diagnosis">Diagnosis:</label>
                    <input type="text" id="diagnosis" name="diagnosis" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} />
                </div>
                <div className="form-row-form-actions"> 
                    <input type="submit" value="Submit" className="button primary" />
                    <input type="reset" value="Clear" className="button" onClick={() => {setDoctorNotes(''); setDiagnosis('');}} /> 
                    <input type="submit" value="Request Test" className="button" /> 
                </div>
            </form>
        </div>
    );
}

function LabTest() {
    return (
        <div>
            {/* Your patient info goes here */}
            test
        </div>
    );
}

export default Doctors;
