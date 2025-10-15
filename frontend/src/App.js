import './App.css';
import VolunteerConnect from './pages/VolunteerConnect';
import InteractiveMapDashboard from './pages/interactive-map-dashboard';
import AuthPage from './pages/Signup';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationPage';
import {Routes, Route} from "react-router-dom";
import { AuthProvider } from './contexts/AuthProvider';
import Opportunities from './pages/Opportunities';
import Community from './pages/Community';

function App() {


  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path='/' element={<VolunteerConnect />}/>
        <Route path='/maps' element={<InteractiveMapDashboard />}/>
        <Route path='/signup' element={<AuthPage />}/>
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/profile' element={<ProfilePage/>} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/opportunities" element={<Opportunities/>} />
        <Route path="/community" element={<Community />} />
      </Routes>
    </AuthProvider>


    </>
  );
}

export default App;
