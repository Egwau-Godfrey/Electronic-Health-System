import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './pages/home';
import Benefits from './pages/benefits';
import Contact from './pages/contactus';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/Benefits" element={<Benefits />} />
        <Route path="/Contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
