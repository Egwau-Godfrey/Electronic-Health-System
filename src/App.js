import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/home';
import About from './pages/about';
import Contact from './pages/contactus';
import PatientLogin from './pages/patientLogin';
import DoctorLogin from './pages/doctorLogin';
import LabTechLogin from './pages/labtechLogin';
import HAdminLogin from './pages/hospitalAdminLogin';
import OAdminLogin from './pages/overralAdminLogin';
import Patients from './pages/patient';
import PatientSignup from './pages/patientSignup';
import Doctors from './pages/doctor';
import LabTech from './pages/labtech';
import HAdmins from './pages/hadmin';
import OAdmins from './pages/oadmin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/login/patient" element={<PatientLogin />} />
        <Route path="/login/doctor" element={<DoctorLogin />} />
        <Route path="/login/lab" element={<LabTechLogin />} />
        <Route path="/login/HAdmin" element={<HAdminLogin />} />
        <Route path="/login/OAdmin" element={<OAdminLogin />} />
        <Route path="/patient" element={<Patients />} />
        <Route path="/register" element={<PatientSignup />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/labtech" element={<LabTech />} />
        <Route path="/hadmin" element={<HAdmins />} />
        <Route path="/oadmin" element={<OAdmins />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
