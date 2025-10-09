import './App.css';
import VolunteerConnect from './components/VolunteerConnect';
import InteractiveMapDashboard from './pages/interactive-map-dashboard';
import AuthPage from './components/Signup';
import {Routes, Route} from "react-router-dom";

function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<VolunteerConnect />}/>
      <Route path='/maps' element={<InteractiveMapDashboard />}/>
      <Route path='/signup' element={<AuthPage />}/>
    </Routes>

    </>
  );
}

export default App;
