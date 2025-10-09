import './App.css';
import VolunteerConnect from './components/VolunteerConnect';
<<<<<<< HEAD
import InteractiveMapDashboard from './pages/interactive-map-dashboard';
=======
import AuthPage from './components/Signup';
>>>>>>> a61864286e19d5dc832bde334b155287b243f276
import {Routes, Route} from "react-router-dom";

function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<VolunteerConnect />}/>
<<<<<<< HEAD
      <Route path='/maps' element={<InteractiveMapDashboard />}/>
=======
      <Route path='/signup' element={<AuthPage />}/>
>>>>>>> a61864286e19d5dc832bde334b155287b243f276
    </Routes>

    </>
  );
}

export default App;
