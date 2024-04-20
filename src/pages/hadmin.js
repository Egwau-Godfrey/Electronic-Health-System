import HAMenuBar from "../components/hadminMenuBar";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFirestore } from '../firebase/config';
import { collection, updateDoc, where, getDoc,getDocs, doc, query, addDoc } from 'firebase/firestore';
import "../css/doctors.css";
import { Alert } from "@mui/material";
import { CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; // Add this import

// Custom hook to fetch doctor data
function useHospitalAdminData() {
    const [HAdminName, setHAdminName] = useState('');
    const [hospitalID, setHospitalID] = useState('');
    const [HAdminID, setHAdminID] = useState('');

    useEffect(() => {
        const fetchHAdminData = async () => {
            try {
                const userToken = sessionStorage.getItem('HAdminToken');
                const workersRef = collection(useFirestore, 'Workers');
                const snapshot = await getDoc(doc(workersRef, userToken));
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setHAdminName(`${data.fname} ${data.lname}`);
                    setHospitalID(data.hospitalID);
                    setHAdminID(data.HAdmin);
                    sessionStorage.setItem('HAdminID', data.HAdminID);
                }
            } catch (error) {
                console.error('Error fetching Admin data', error);
            }
        };

        fetchHAdminData();
    }, []);

    return [HAdminName, hospitalID, HAdminID];
}

function HAdmins() {

    const [HAdminName, hospitalID, HAdminID] = useHospitalAdminData();
    const [selectedItem, setSelectedItem] = useState('ViewEmployees');

    return(
        <div>
            <HAMenuBar HAName={HAdminName} HosID={hospitalID}/>
            <div className='container'>
                <div id='sidebar' className='sidebar'>
                    <div className='sidebar-item' onClick={() => setSelectedItem('ViewEmployees')}>
                        <a href="#">View Employee</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('AddEmployee')}>
                        <a href="#">Add Employee</a>
                    </div>
                    <div className='sidebar-item' onClick={() => setSelectedItem('Analytics')}>
                        <a href="#">Analytics</a>
                    </div>
                
                </div>
                <div className='content'>
                    {selectedItem === 'ViewEmployees' && <ViewEmployee hospitalID={hospitalID} />}
                    {selectedItem === 'AddEmployee' && <AddEmployee hospitalID={hospitalID} />}
                    {selectedItem === 'Analytics' && <Analytics />}
                </div>
            </div>
        </div>
    );

}

// ContentEditable component for controlled content editable
const ContentEditable = ({ value, onChange }) => {
    const handleBlur = (e) => {
        onChange(e.target.innerText);
    };

    return (
        <div
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );
};

function ViewEmployee({ hospitalID }) {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const workersRef = collection(useFirestore, 'Workers');
                const querySnapshot = await getDocs(
                    query(workersRef, where('hospitalID', '==', hospitalID), where('hospitalID', '>', ''))
                );
                const employeesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEmployees(employeesData);
            } catch (error) {
                console.error('Error fetching employees data', error);
            }
        };

        fetchEmployees();
    }, [useFirestore, hospitalID]);

    const handleUpdateEmployee = async (id, fieldName, value) => {
        try {
            const workerRef = doc(collection(useFirestore, 'Workers'), id);
            await updateDoc(workerRef, { [fieldName]: value });
            // Assuming here you want to refresh the data after updating
            // fetchEmployees();
            alert('Update to '+fieldName+' Successful');
        } catch (error) {
            console.error('Error updating employee data', error);
        }
    };


    return (
        <div>
            <h2>Employee List</h2>
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Position</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Password</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => {
                        //console.log(employee); // Debugging: Log each employee object
                        function checkPosition() {
                            if(employee.doctorID){
                                return 'Doctor';
                            } else if (employee.LabTechID) {
                                return "Lab Technician";
                            } else {
                                return "Hospital Admin";
                            }
                        };

                        return (
                            <tr key={employee.id}>
                                <td>
                                    <ContentEditable
                                        value={checkPosition()}
                                        onChange={(newValue) => handleUpdateEmployee(employee.id, 'fname', newValue)}
                                    />
                                </td>
                                <td>
                                    <ContentEditable
                                        value={employee.fname}
                                        onChange={(newValue) => handleUpdateEmployee(employee.id, 'fname', newValue)}
                                    />
                                </td>
                                <td>
                                    <ContentEditable
                                        value={employee.lname}
                                        onChange={(newValue) => handleUpdateEmployee(employee.id, 'lname', newValue)}
                                    />
                                </td>
                                <td>
                                    <ContentEditable
                                        value={employee.password}
                                        onChange={(newValue) => handleUpdateEmployee(employee.id, 'password', newValue)}
                                    />
                                </td>
                                
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}


function AddEmployee({ hospitalID }) {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        password: '',
        position: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const workersRef = collection(useFirestore, 'Workers');
            await addDoc(workersRef, {
                [formData.position]: formData.fname, // Dynamically set field based on position
                fname: formData.fname,
                lname: formData.lname,
                password: formData.password,
                hospitalID: hospitalID,
            });
            // Clear form data after saving
            setFormData({
                fname: '',
                lname: '',
                password: '',
                position: '',
            });
            alert("Successfuly Added");
            console.log("Employee added successfully!");
        } catch (error) {
            console.error('Error adding employee:', error);
        }
    };

    return (
        <div className="add-employee-container">
            <h2>Add Employee</h2>
            <form>
                <div className="form-row">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="fname"
                        value={formData.fname}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-row">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lname"
                        value={formData.lname}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-row">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-row">
                    <label>Position:</label>
                    <select
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Position</option>
                        <option value="doctorID">Doctor</option>
                        <option value="LabTechID">Lab Technician</option>
                        <option value="HAdminID">Hospital Admin</option>
                    </select>
                </div>
            </form>
            <button id="buttonprimary" className="button primary" onClick={handleSave}>Save</button>
        </div>
    );
}






function Analytics() {
  const [counts, setCounts] = useState({});
  const [countsByDoctor, setCountsByDoctor] = useState({});
  const [countsByLabTech, setCountsByLabTech] = useState({});
  const chartRef = useRef(null);
  const avgTimeChartRef = useRef(null);
  const avgLabTimeChartRef = useRef(null);

  useEffect(() => {
    const fetchPatientsAndMedicalData = async () => {
      try {
        const firestore = useFirestore;
        const patientsCollectionRef = collection(firestore, 'patients');
        const querySnapshot = await getDocs(patientsCollectionRef);

        const promises = querySnapshot.docs.map(async (doc) => {
          const medicalDataCollectionRef = collection(doc.ref, 'medicalData');
          const medicalDataQuerySnapshot = await getDocs(medicalDataCollectionRef);

          medicalDataQuerySnapshot.forEach((medicalDataDoc) => {
            const medicalData = medicalDataDoc.data();
            const diagnosis = medicalData.diagnosis;

            if (counts[diagnosis]) {
              counts[diagnosis] += 1;
            } else {
              counts[diagnosis] = 1;
            }
          });
        });

        await Promise.all(promises);
        setCounts({ ...counts });
      } catch (error) {
        console.error('Error fetching patients and medicalData:', error);
      }
    };

    fetchPatientsAndMedicalData();
  }, []);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const firestore = useFirestore;
        const patientsCollectionRef = collection(firestore, 'patients');
        const querySnapshot = await getDocs(patientsCollectionRef);

        const promises = querySnapshot.docs.map(async (doc) => {
          const medicalDataCollectionRef = collection(doc.ref, 'medicalData');
          const medicalDataQuerySnapshot = await getDocs(medicalDataCollectionRef);

          medicalDataQuerySnapshot.forEach((medicalDataDoc) => {
            const medicalData = medicalDataDoc.data();
            const doctor = medicalData.doctor;
            const diagnosis = medicalData.diagnosis;
            const timeSpent = medicalData.DoctortimeSpentInMinutes;
            const remainingSeconds = medicalData.DoctorRemainingSeconds;

            if (!countsByDoctor[doctor]) {
              countsByDoctor[doctor] = {};
            }

            if (!countsByDoctor[doctor][diagnosis]) {
              countsByDoctor[doctor][diagnosis] = {
                DoctortimeSpentInMinutes: 0,
                DoctorRemainingSeconds: 0,
              };
            }

            countsByDoctor[doctor][diagnosis].DoctortimeSpentInMinutes += timeSpent;
            countsByDoctor[doctor][diagnosis].DoctorRemainingSeconds += remainingSeconds;
          });
        });

        await Promise.all(promises);
        setCountsByDoctor({ ...countsByDoctor });
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, []);

  useEffect(() => {
    const fetchLabTechData = async () => {
      try {
        const firestore = useFirestore;
        const patientsCollectionRef = collection(firestore, 'patients');
        const querySnapshot = await getDocs(patientsCollectionRef);

        const promises = querySnapshot.docs.map(async (doc) => {
          const medicalDataCollectionRef = collection(doc.ref, 'medicalData');
          const medicalDataQuerySnapshot = await getDocs(medicalDataCollectionRef);

          medicalDataQuerySnapshot.forEach((medicalDataDoc) => {
            const medicalData = medicalDataDoc.data();
            const labTech = medicalData.labTech;
            const diagnosis = medicalData.diagnosis;

            if (medicalData.LabTechtimeSpentInMinutes && medicalData.LabTechRemainingSeconds) {
              if (!countsByLabTech[labTech]) {
                countsByLabTech[labTech] = {};
              }

              if (!countsByLabTech[labTech][diagnosis]) {
                countsByLabTech[labTech][diagnosis] = {
                  LabTechtimeSpentInMinutes: 0,
                  LabTechRemainingSeconds: 0,
                };
              }

              countsByLabTech[labTech][diagnosis].LabTechtimeSpentInMinutes += medicalData.LabTechtimeSpentInMinutes;
              countsByLabTech[labTech][diagnosis].LabTechRemainingSeconds += medicalData.LabTechRemainingSeconds;
            }
          });
        });

        await Promise.all(promises);
        setCountsByLabTech({ ...countsByLabTech });
      } catch (error) {
        console.error('Error fetching lab tech data:', error);
      }
    };

    fetchLabTechData();
  }, []);

  useEffect(() => {
    if (chartRef.current && chartRef.current.chartInstance) {
      chartRef.current.chartInstance.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(counts),
        datasets: [
          {
            label: 'Number of Cases',
            data: Object.values(counts),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'category',
          },
          y: {
            type: 'linear',
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    chartRef.current.chartInstance = chartInstance;
  }, [counts]);

  useEffect(() => {
    if (avgTimeChartRef.current && avgTimeChartRef.current.chartInstance) {
      avgTimeChartRef.current.chartInstance.destroy();
    }

    const avgTimeDatasets = [];

    const doctors = Object.keys(countsByDoctor);
    doctors.forEach((doctor) => {
      const doctorData = {
        label: doctor,
        data: [],
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        borderWidth: 1,
      };

      Object.keys(counts).forEach((disease) => {
        const timeSpent = countsByDoctor[doctor][disease]?.DoctortimeSpentInMinutes || 0;
        const remainingSeconds = countsByDoctor[doctor][disease]?.DoctorRemainingSeconds || 0;
        const totalTime = timeSpent * 60 + remainingSeconds;
        const avgTime = totalTime / counts[disease];
        doctorData.data.push(avgTime);
      });

      avgTimeDatasets.push(doctorData);
    });

    const ctx = avgTimeChartRef.current.getContext('2d');
    const avgTimeChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(counts),
        datasets: avgTimeDatasets,
      },
      options: {
        scales: {
          x: {
            type: 'category',
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Average Time (seconds)',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });

    avgTimeChartRef.current.chartInstance = avgTimeChartInstance;
  }, [counts, countsByDoctor]);

  useEffect(() => {
    if (avgLabTimeChartRef.current && avgLabTimeChartRef.current.chartInstance) {
      avgLabTimeChartRef.current.chartInstance.destroy();
    }
  
    const avgLabTimeDatasets = [];
  
    const labTechs = Object.keys(countsByLabTech);
    labTechs.forEach((labTech) => {
      const labTechData = {
        label: labTech,
        data: [],
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        borderWidth: 1,
      };
  
      Object.keys(counts).forEach((disease) => {
        if (countsByLabTech[labTech][disease]) {
          const timeSpent = countsByLabTech[labTech][disease].LabTechtimeSpentInMinutes;
          const remainingSeconds = countsByLabTech[labTech][disease].LabTechRemainingSeconds;
          const totalTime = timeSpent * 60 + remainingSeconds;
          const avgTime = totalTime / counts[disease];
          labTechData.data.push(avgTime);
        }
      });
  
      avgLabTimeDatasets.push(labTechData);
    });
  
    const ctx = avgLabTimeChartRef.current.getContext('2d');
    const avgLabTimeChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(counts),
        datasets: avgLabTimeDatasets,
      },
      options: {
        scales: {
          x: {
            type: 'category',
          },
          y: {
            type: 'linear',
            title: {
              display: true,
              text: 'Average Time (seconds)',
            },
          },
        },
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  
    avgLabTimeChartRef.current.chartInstance = avgLabTimeChartInstance;
  }, [counts, countsByLabTech]);

  Chart.register(CategoryScale, LinearScale);

  return (
    <div>
      <h2>Diagnosis Counts</h2>
      <ul>
        {Object.entries(counts).map(([diagnosis, count]) => (
          <li key={diagnosis}>{diagnosis}: {count}</li>
        ))}
      </ul>
      <br></br>
      <br></br>
      <br></br>
      <canvas ref={chartRef} />

      <br></br>
      <br></br>
      <br></br>

      <h2>Average Time to Diagnose by Doctor per Disease</h2>
      <canvas ref={avgTimeChartRef} />

      <br></br>
      <br></br>
      <br></br>

      <h2>Average Time to Carry Out Lab Tests by Lab Tech per Disease</h2>
      <canvas ref={avgLabTimeChartRef} />
    </div>
  );
}

export default Analytics;
