import './App.css';
import VolunteerConnect from './components/VolunteerConnect';
import InteractiveMapDashboard from './pages/interactive-map-dashboard';
import {Routes, Route} from "react-router-dom";

function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<VolunteerConnect />}/>
      <Route path='/maps' element={<InteractiveMapDashboard />}/>
    </Routes>

    </>
  );
}

export default App;
