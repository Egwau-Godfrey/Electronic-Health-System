import PatientMenuBar from "../components/patientsNavbar";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, getDocs, where, query, collection } from 'firebase/firestore';
import { useFirestore } from '../firebase/config';
import "../css/doctors.css";

function Patients() {
    const [selectedItem, setSelectedItem] = useState('patientInfo');

    return(
        <div>
            <PatientMenuBar/>

            <div className='container'>
                <div id='sidebar' className='sidebar'>
                    <div className='sidebar-item' onClick={() => setSelectedItem('patientInfo')}>
                        <a href="#">Patient Info</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('history')}>
                        <a href="#">History</a>
                    </div>
                </div>
                <div className='content'>
                    {selectedItem === 'patientInfo' && <PatientInfo />}
                    {selectedItem === 'history' && <History />}
                </div>
            </div>
        </div>
    );
}

const patientsID = sessionStorage.getItem('patientLogInfo');
 
function PatientInfo() {

    const [patientData, setPatientData] = useState('');

    useEffect(() => {
        const fetchPatientData = async () => {
            const patientRef = doc(useFirestore, 'patients', patientsID);
            const patientSnap = await getDoc(patientRef);

            if (patientSnap.exists()) {
                setPatientData(patientSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchPatientData();
    }, [useFirestore, patientsID]);

    if (!patientData) {
        return <div>Search For Patient</div>;
    }

    const { dob, email, phone, fname, lname, patientID } = patientData;
    

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
        const storedPatientID = sessionStorage.getItem('patientLogInfo');
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

    console.log(patientData);

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
                />
                
            ))}
        </div>
    );
}


function MedicalRecordCard({ data, showTime }) {
    const [recordData, setRecordData] = useState({
        diagnosis: data.diagnosis,
        doctorNotes: data.doctorNotes
    });
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleTextareaClick = (event) => {
        event.stopPropagation();
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
                        readOnly={true}
                        value={recordData.diagnosis}
                        onChange={e => setRecordData({ ...recordData, diagnosis: e.target.value })}
                    ></textarea>
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
                            readOnly={true}
                            value={recordData.doctorNotes}
                            onChange={e => setRecordData({ ...recordData, doctorNotes: e.target.value })}
                            onClick={handleTextareaClick}
                        ></textarea>
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
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}



export default Patients;