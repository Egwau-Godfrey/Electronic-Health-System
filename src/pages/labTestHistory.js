import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useFirestore } from '../firebase/config';
import LabTestHistoryForm from './LabTestHistoryForm';

function LabTestHistory({ patientData }) {
  const [labTestForms, setLabTestForms] = useState([]);
  //console.log("I am who ia m", patientData);

  useEffect(() => {
    const fetchLabTestForms = async () => {
      // Get Firestore instance
      const firestore = useFirestore;

      try {
        const workersRef = collection(firestore, 'LabTestForm');
        const q = query(workersRef, where('patientID', '==', patientData.patientID));
        const querySnapshot = await getDocs(q);

        const forms = [];

        // Iterate over each document in the query snapshot
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          forms.push(data);
        });

        setLabTestForms(forms);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };

    fetchLabTestForms();
  }, [patientData.patientID]);

  return (
    <div className="lab-test-history">
      <h2>Lab Test History</h2>
      {labTestForms.map((form) => (
        <LabTestHistoryForm
          key={form.id}
          patientData={patientData}
          doctorID={form.doctorID}
          formData={form}
        />
        
      ))}
    </div>
  );
}

export default LabTestHistory;
