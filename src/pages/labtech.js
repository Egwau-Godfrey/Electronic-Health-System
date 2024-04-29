import React, { useState, useEffect } from 'react';
import { useFirestore } from '../firebase/config';
import { collection, updateDoc, getDoc,getDocs, doc, query, where, orderBy, addDoc } from 'firebase/firestore';
import MenuBar from '../components/LabTechMenuBar';
import "../css/doctors.css";
import moment from 'moment';
import LabTestOForm from './LabTestOForm';

// Custom hook to fetch doctor data
function useLabTechData() {
    const [LabTechName, setLabTechName] = useState('');
    const [hospitalID, setHospitalID] = useState('');
    const [LabTechID, setLabTechID] = useState('');

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const userToken = sessionStorage.getItem('labuserToken');
                const workersRef = collection(useFirestore, 'Workers');
                const snapshot = await getDoc(doc(workersRef, userToken));
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setLabTechName(`${data.fname} ${data.lname}`);
                    setHospitalID(data.hospitalID);
                    setLabTechID(data.LabTechID);
                    sessionStorage.setItem('LabTechID', data.LabTechID);
                }
            } catch (error) {
                console.error('Error fetching doctor data', error);
            }
        };

        fetchDoctorData();
    }, []);

    return [LabTechName, hospitalID, LabTechID];
}

var patientFormData = {};

function LabTech() {
    const [LabTechName, hospitalID, LabTechID] = useLabTechData();
    const [selectedItem, setSelectedItem] = useState('patientInfo');
    const [labTestFormDatas, setLabTestFormData] = useState([]);

    // useEffect(() => {
    //     const fetchLabTestFormData = async () => {
    //         try {
    //             const firestore = useFirestore;
    //             const labTestFormRef = collection(firestore, 'LabTestForm');
    //             const snapshot = await getDocs(labTestFormRef);
    //             const formData = snapshot.docs
    //                 .map(doc => ({ id: doc.id, ...doc.data() }))
    //                 .filter(data => data.patientID === patientFormData.patientID); // Filter by patientID
    //             setLabTestFormData(formData);
    //         } catch (error) {
    //             console.error('Error fetching lab test form data', error);
    //         }
    //     };
    
    //     fetchLabTestFormData();
    // }, [patientFormData]);

    useEffect(() => {
        const fetchLabTestFormData = async () => {
            try {
                const firestore = useFirestore;
                const labTestFormRef = collection(firestore, 'LabTestForm');
                const querySnapshot = await getDocs(query(
                    labTestFormRef, 
                    where("patientID", "==", patientFormData.patientID,
                    orderBy("DoctorSubmitRequestTime", "desc")
                )));
    
                //console.log("Query Snapshot", querySnapshot.docs);
    
                if (!querySnapshot.empty) {
                    const formData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    console.log("Mapped Form Data", formData);
                    setLabTestFormData(formData);
                    //console.log("Egwau For King", formData[0].DoctorSubmitRequestTime.toDate());
                } else {
                    console.log("No lab test form data found for patient ID:", patientFormData.patientID);
                }
            } catch (error) {
                console.error('Error fetching lab test form data', error);
            }
        };
        
        fetchLabTestFormData();
    }, [patientFormData]);
    
    
    //console.log("Egwau For King", labTestFormDatas);
    

    return (
        <div>
            <MenuBar LabTechName={LabTechName} />
            <div className='container'>
                <div id='sidebar' className='sidebar'>
                    <div className='sidebar-item' onClick={() => setSelectedItem('patientInfo')}>
                        <a href="#">Patient Info</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('history')}>
                        <a href="#">History</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('labtestform')}>
                        <a href="#">Lab Test Form</a>
                    </div>

                
                </div>
                <div className='content'>
                    {selectedItem === 'labtestform' && <LabTestOForm labTestFormData={labTestFormDatas} LabTechID={LabTechID}/>}
                    {selectedItem === 'patientInfo' && <PatientInfo />}
                    {selectedItem === 'history' && <History />}
                </div>
            </div>
        </div>
    );
}

function PatientInfo() {
    const [patientData, setpatientData] = useState(JSON.parse(sessionStorage.getItem('patientData')));
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setpatientData(JSON.parse(sessionStorage.getItem('patientData')));
      }, 1000); // Check every second
  
      // Clear interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
  
    if (!patientData) {
      return <div>Search For Patient</div>;
    }
  
    const { dob, email, phone, fname, lname, patientID } = patientData;
  
    // Convert dob Date object to formatted string
    const dobParsed = moment(dob, "MMMM DD, YYYY [at] h:mm:ss A UTCZ").utcOffset(0);
    const age = moment().diff(dobParsed, 'years');
  
    patientFormData = {'age':age, 'email':email, 'phone':phone, 'fname':fname, 'lname':lname, 'patientID':patientID};
    return (
      <div className="patient-info-card">
        <h2>Patient Information</h2>
        <p><strong>PatientID:</strong> {patientID}</p>
        <p><strong>Name:</strong> {fname} {lname}</p>
        <p><strong>Age:</strong> {age}</p>
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
        const currentlyLoggedInLatechID = sessionStorage.getItem('LabTechID');
        setEditable(currentlyLoggedInLatechID === data.LabTechID);
    }, [data.LabTechID]);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const handleTextareaClick = (event) => {
        event.stopPropagation();
    };


    const [labNotes, setLabNotes] = useState('');
    const [conclusion, setConclusion] = useState('');
    const [LabTechName, hospitalID, LabTechID] = useLabTechData();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const docData = JSON.parse(sessionStorage.getItem('patientData'));
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
        const medicalDataCollectionRef = doc(patientRef, 'medicalData', data.id);
    

        //const medicalDataSnapshot = await getDocs(medicalDataCollectionRef);
        const currentDate = new Date

        const submitTime = new Date();

        const timeDifferenceMilliseconds = submitTime - dataLoadTime; // in milliseconds
        const timeDifferenceSeconds = Math.floor(timeDifferenceMilliseconds / 1000); // in seconds
        const timeDifferenceMinutes = Math.floor(timeDifferenceSeconds / 60); // in minutes

        // To get the remaining seconds after the minutes have been subtracted
        const remainingSeconds = timeDifferenceSeconds % 60;

        await updateDoc(medicalDataCollectionRef, {
            LabTestdate: currentDate,
            LabTechName: LabTechName,
            LabTechID: LabTechID,
            hospitalID: hospitalID,
            LabTechNotes: labNotes,
            conclusion: conclusion,
            LabTechtimeSpentInMinutes: timeDifferenceMinutes,
            LabTechRemainingSeconds: remainingSeconds,
            // add other fields here
        });

        alert('LabTest added successfully in ' + timeDifferenceMinutes + ' minutes ' + remainingSeconds + ' seconds');
    
    };

    return (
        <div className={`medical-record-card ${expanded ? 'expanded' : ''}`} onClick={toggleExpanded}>
            <div className='medical-record-hidden'>
                {showTime && (
                    <>
                        {console.log(data.date.toDate().toLocaleString())}
                        <p>Date: {data.date.toDate().toLocaleString()} </p>

                        <p>LabTech Time Spent: {data.LabTechtimeSpentInMinutes} Minutes and {data.LabTechRemainingSeconds} Seconds</p>
                        {console.log(data.LabTechtimeSpentInMinutes)}
                        
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
                    
                </div>
            </div>
            <div className="medical-record-details">
                <p><strong>Hospital ID:</strong> {data.hospitalID}</p>
                <p><strong>Doctor Name:</strong> {data.LabTechName}</p>
                <p><strong>Doctor ID:</strong> {data.LabTechID}</p>
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
                       
                    </div>
                </div>
                <h2>Add Lab Analysis</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <label htmlFor="doctorNotes">Lab Notes:</label>
                        <textarea id="doctorNotes" name="doctorNotes" rows="6" cols="60" onChange={e => setLabNotes(e.target.value)} onClick={handleTextareaClick}></textarea>
                    </div>
                    <div className="form-row">
                        <label htmlFor="diagnosis">Conclusion:</label>
                        <input type="text" id="diagnosis" name="diagnosis" onChange={e => setConclusion(e.target.value)} onClick={handleTextareaClick}/>
                    </div>
                    <div className="form-row-form-actions"> 
                        <input type="submit" value="Submit" className="button primary" />
                        <input type="reset" value="Clear" className="button" onClick={() => {setLabNotes(''); setConclusion('');}} /> 
                    </div>
                </form>
            </div>
        </div>
    );
}




export default LabTech;