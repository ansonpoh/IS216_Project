import './App.css';
import VolunteerConnect from './components/VolunteerConnect';
import AuthPage from './components/Signup';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import {Routes, Route} from "react-router-dom";

function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<VolunteerConnect />}/>
      <Route path='/signup' element={<AuthPage />}/>
      <Route path='/about' element={<AboutPage/>} />
      <Route path='/profile' element={<ProfilePage/>} />
    
    </Routes>

    </>
  );
}

export default App;
