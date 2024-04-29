import OAMenuBar from "../components/oadminNav";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFirestore } from '../firebase/config';
import { collection, updateDoc, where, getDoc,getDocs, doc, query, addDoc } from 'firebase/firestore';
import "../css/doctors.css";
import { CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";


// Custom hook to fetch doctor data
function useOverralAdminData() {
    const [OAdminName, setOAdminName] = useState('');
    const [OAdminID, setOAdminID] = useState('');

    useEffect(() => {
        const fetchHAdminData = async () => {
            try {
                const userToken = sessionStorage.getItem('OAdmin');
                const workersRef = collection(useFirestore, 'Workers');
                const snapshot = await getDoc(doc(workersRef, userToken));
                if (snapshot.exists()) {
                    const data = snapshot.data();
                    setOAdminName(`${data.fname} ${data.lname}`);
                    setOAdminID(data.HAdmin);
                    sessionStorage.setItem('OAdminID', data.OAdminID);
                }
            } catch (error) {
                console.error('Error fetching Admin data', error);
            }
        };

        fetchHAdminData();
    }, []);

    return [OAdminName, OAdminID];
}

function OAdmins() {

    const [OAdminName, OAdminID] = useOverralAdminData();
    const [selectedItem, setSelectedItem] = useState('ViewEmployees');

    return(
        <div>
            <OAMenuBar HAName={OAdminName}/>
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
                    {selectedItem === 'ViewEmployees' && <ViewEmployee />}
                    {selectedItem === 'AddEmployee' && <AddEmployee />}
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

function ViewEmployee() {
    const [employees, setEmployees] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState({});

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const workersRef = collection(useFirestore, 'Workers');
                const querySnapshot = await getDocs(workersRef);
                const employeesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setEmployees(employeesData);
            } catch (error) {
                console.error('Error fetching employees data', error);
            }
        };

        fetchEmployees();
    }, [useFirestore]);

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
                            } else if(employee.HAdmin) {
                                return "Hospital Admin";
                            } else {
                                return "Overral Admin";
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
                                  {passwordVisible[employee.id] ? (
                                    <ContentEditable
                                      value={employee.password}
                                      onChange={newValue => handleUpdateEmployee(employee.id, 'password', newValue)}
                                    />
                                  ) : (
                                    <span>•••••••• </span>
                                  )}
                                  <button
                                    className="password-visibility-toggle"
                                    onClick={() => setPasswordVisible({ ...passwordVisible, [employee.id]: !passwordVisible[employee.id] })}
                                  >
                                    {passwordVisible[employee.id] ? (
                                      <EyeSlashIcon style={{ height: '16px' }} />
                                    ) : (
                                      <EyeIcon style={{ height: '16px' }} />
                                    )}
                                  </button>

                                </td>
                                
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}


function AddEmployee() {
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
                        <option value="HAdminID">Hospital Admin</option>
                        <option value="OAdminID">Overral Admin</option>
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
  const avgDoctorTimeByDiseaseChartRef = useRef(null);

  // Fetching diagnosis counts from Firestore

  useEffect(() => {
    const fetchPatientsAndMedicalData = async () => {
      try {
        // Access Firestore
        const firestore = useFirestore;
        const patientsCollectionRef = collection(firestore, 'patients');
        const querySnapshot = await getDocs(patientsCollectionRef);

        // Iterate through patient documents
        const promises = querySnapshot.docs.map(async (doc) => {
          const medicalDataCollectionRef = collection(doc.ref, 'medicalData');
          const medicalDataQuerySnapshot = await getDocs(medicalDataCollectionRef);

          // Iterate through medical data of each patient
          medicalDataQuerySnapshot.forEach((medicalDataDoc) => {
            const medicalData = medicalDataDoc.data();
            const diagnosis = medicalData.diagnosis;

            // Update diagnosis counts
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

  // Fetching doctor data and calculating average times
  
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

  // Fetching lab tech data and calculating average times

   // Fetching lab tech data and calculating average times

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


  // Render diagnosis counts chart

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

  // Render average time by doctor chart

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
        const avgTime = totalTime / counts[disease] / 60; // Convert to minutes
        doctorData.data.push(avgTime.toFixed(2)); // Round to 2 decimal places
      });
  
      avgTimeDatasets.push(doctorData);
    });
    console.log("King God, ", avgTimeDatasets);
  
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
              text: 'Average Time (minutes)',
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

  // Render average time by lab tech chart

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
          const avgTime = totalTime / counts[disease] / 60; // Convert to minutes
          labTechData.data.push(avgTime.toFixed(2)); // Round to 2 decimal places
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
              text: 'Average Time (minutes)',
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


//#####################################################
// Render average time per doctor chart

  const [avgDoctorTime, setAvgDoctorTime] = useState({});

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const firestore = useFirestore;
        const patientsCollectionRef = collection(firestore, 'patients');
        const querySnapshot = await getDocs(patientsCollectionRef);

        const doctorTimes = {};

        const promises = querySnapshot.docs.map(async (doc) => {
          const medicalDataCollectionRef = collection(doc.ref, 'medicalData');
          const medicalDataQuerySnapshot = await getDocs(medicalDataCollectionRef);

          medicalDataQuerySnapshot.forEach((medicalDataDoc) => {
            const medicalData = medicalDataDoc.data();
            const doctor = medicalData.doctorID;
            const timeSpent = medicalData.DoctortimeSpentInMinutes;
            const remainingSeconds = medicalData.DoctorRemainingSeconds;

            if (!doctorTimes[doctor]) {
              doctorTimes[doctor] = {
                totalTime: 0,
                count: 0,
              };
            }

            doctorTimes[doctor].totalTime += timeSpent * 60 + remainingSeconds;
            doctorTimes[doctor].count += 1;
          });
        });

        await Promise.all(promises);

        const avgTimes = {};
        Object.entries(doctorTimes).forEach(([doctor, { totalTime, count }]) => {
          avgTimes[doctor] = totalTime / count;
        });

        setCountsByDoctor({ ...countsByDoctor });
        setAvgDoctorTime(avgTimes);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, []);



  const avgDoctorTimeChartRef = useRef(null);

  useEffect(() => {
    if (avgDoctorTimeChartRef.current && avgDoctorTimeChartRef.current.chartInstance) {
      avgDoctorTimeChartRef.current.chartInstance.destroy();
    }

    const ctx = avgDoctorTimeChartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(avgDoctorTime),
        datasets: [
          {
            label: 'Average Time (minutes)',
            data: Object.values(avgDoctorTime).map(seconds => (seconds / 60).toFixed(2)), // Convert seconds to minutes
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
            title: {
              display: true,
              text: 'Average Time (minutes)', // Add y-axis label
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });

    avgDoctorTimeChartRef.current.chartInstance = chartInstance;
  }, [avgDoctorTime]);

//######################################################

  // Labtechnicitians chart
  const [avgLabTechTime, setAvgLabTechTime] = useState({});
  useEffect(() => {
    const fetchLabTechData = async () => {
      try {
        const firestore = useFirestore;
        const patientsCollectionRef = collection(firestore, 'patients');
        const querySnapshot = await getDocs(patientsCollectionRef);
  
        const labTechTimes = {};
  
        const promises = querySnapshot.docs.map(async (doc) => {
          const medicalDataCollectionRef = collection(doc.ref, 'medicalData');
          const medicalDataQuerySnapshot = await getDocs(medicalDataCollectionRef);
  
          medicalDataQuerySnapshot.forEach((medicalDataDoc) => {
            const medicalData = medicalDataDoc.data();
            const labTech = medicalData.LabTechID;
            const timeSpent = medicalData.LabTechtimeSpentInMinutes;
            const remainingSeconds = medicalData.LabTechRemainingSeconds;
  
            if (!labTechTimes[labTech]) {
              labTechTimes[labTech] = {
                totalTime: 0,
                count: 0,
              };
            }
  
            labTechTimes[labTech].totalTime += timeSpent * 60 + remainingSeconds;
            labTechTimes[labTech].count += 1;
          });
        });
  
        await Promise.all(promises);
  
        const avgTimes = {};
        Object.entries(labTechTimes).forEach(([labTech, { totalTime, count }]) => {
          avgTimes[labTech] = totalTime / count;
        });
  
        setAvgLabTechTime(avgTimes);
      } catch (error) {
        console.error('Error fetching lab tech data:', error);
      }
    };
  
    fetchLabTechData();
  }, []);

  const avgLabTechTimeChartRef = useRef(null);

useEffect(() => {
  if (avgLabTechTimeChartRef.current && avgLabTechTimeChartRef.current.chartInstance) {
    avgLabTechTimeChartRef.current.chartInstance.destroy();
  }

  const ctx = avgLabTechTimeChartRef.current.getContext('2d');
  const chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(avgLabTechTime),
      datasets: [
        {
          label: 'Average Time (minutes)',
          data: Object.values(avgLabTechTime).map(seconds => (seconds / 60).toFixed(2)),
          backgroundColor: 'rgba(192, 192, 75, 0.2)',
          borderColor: 'rgba(192, 192, 75, 1)',
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
          title: {
            display: true,
            text: 'Average Time (minutes)',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });

  avgLabTechTimeChartRef.current.chartInstance = chartInstance;
}, [avgLabTechTime]);


// End of LabTechnicians Chart



  //########################################
  

  const [selectedDisease, setSelectedDisease] = useState('');

  const handleDiseaseChange = (event) => {
    setSelectedDisease(event.target.value);
  };

  const [avgDoctorTimeByDisease, setAvgDoctorTimeByDisease] = useState({});

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const firestore = useFirestore;
        const patientsCollectionRef = collection(firestore, 'patients');
        const querySnapshot = await getDocs(patientsCollectionRef);

        const doctorTimes = {};

        const promises = querySnapshot.docs.map(async (doc) => {
          const medicalDataCollectionRef = collection(doc.ref, 'medicalData');
          const medicalDataQuerySnapshot = await getDocs(medicalDataCollectionRef);

          medicalDataQuerySnapshot.forEach((medicalDataDoc) => {
            const medicalData = medicalDataDoc.data();
            const doctor = medicalData.doctorID;
            const disease = medicalData.diagnosis;
            const timeSpent = medicalData.DoctortimeSpentInMinutes;
            const remainingSeconds = medicalData.DoctorRemainingSeconds;

            if (!doctorTimes[doctor]) {
              doctorTimes[doctor] = {};
            }

            if (!doctorTimes[doctor][disease]) {
              doctorTimes[doctor][disease] = {
                totalTime: 0,
                count: 0,
              };
            }

            doctorTimes[doctor][disease].totalTime += timeSpent * 60 + remainingSeconds;
            doctorTimes[doctor][disease].count += 1;
          });
        });

        await Promise.all(promises);

        const avgTimes = {};
        Object.entries(doctorTimes).forEach(([doctor, doctorData]) => {
          if (doctorData[selectedDisease]) {
            const totalTime = doctorData[selectedDisease].totalTime;
            const count = doctorData[selectedDisease].count;
            avgTimes[doctor] = totalTime / (60 * count);
          }
        });

        setAvgDoctorTimeByDisease(avgTimes);
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, [selectedDisease]);


  useEffect(() => {
    if (avgDoctorTimeByDiseaseChartRef.current && avgDoctorTimeByDiseaseChartRef.current.chartInstance) {
      avgDoctorTimeByDiseaseChartRef.current.chartInstance.destroy();
    }
  
    const avgTimeDatasets = [];
  
    const doctors = Object.keys(avgDoctorTimeByDisease);
    const labels = doctors.map((doctor) => doctor);
    const data = doctors.map((doctor) => avgDoctorTimeByDisease[doctor]);
  
    const ctx = avgDoctorTimeByDiseaseChartRef.current.getContext('2d');
    const avgTimeChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels, // Use the labels array for the x-axis
        datasets: [{
          label: 'Average Time (minutes)',
          data: data, // Use the data array for the y-axis
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }],
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
              text: 'Average Time (minutes)',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  
    avgDoctorTimeByDiseaseChartRef.current.chartInstance = avgTimeChartInstance;
  }, [avgDoctorTimeByDisease]);
  


  //#########################################

  Chart.register(CategoryScale, LinearScale);
  // JSX for rendering charts and data
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

      <div>
        <canvas ref={chartRef} />
      </div>

      <br></br>
      <br></br>
      <br></br>

      <div> 
        <h2>Average Time Each Doctor Spends on a Given Disease</h2> 
        <select onChange={handleDiseaseChange}> 
          <option value="">Select a disease</option> 
          {Object.keys(counts).map((disease) => ( <option key={disease} 
          value={disease}> {disease} </option> ))} 
        </select> 
        <canvas ref={avgDoctorTimeByDiseaseChartRef} /> 
      </div>
      

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

      <br></br>
      <br></br>
      <br></br>


      <div>
        <h2>Average Time Each Doctor Spends on a Patient</h2>
        <canvas ref={avgDoctorTimeChartRef} />
      </div>

      <br></br>
      <br></br>
      <br></br>

      <div>
        <h2>Average Time Each Lab Technician Spends on Patient Tests</h2>
        <canvas ref={avgLabTechTimeChartRef} />
      </div>

      <br></br>
      <br></br>
      <br></br>

      

    </div>
  );
}
export default OAdmins;