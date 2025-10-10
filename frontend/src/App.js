import './App.css';
import VolunteerConnect from './components/VolunteerConnect';
import InteractiveMapDashboard from './pages/interactive-map-dashboard';
import AuthPage from './components/Signup';
import AboutPage from './components/AboutPage';
import ProfilePage from './components/ProfilePage';
import NotificationsPage from './components/NotificationPage';
import {Routes, Route} from "react-router-dom";
import { AuthProvider } from './contexts/AuthProvider';

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
    
      </Routes>
    </AuthProvider>


    </>
  );
}

export default App;
