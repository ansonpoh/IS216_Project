import './App.css';
import VolunteerConnect from './pages/VolunteerConnect';
import InteractiveMapDashboard from './pages/interactive-map-dashboard';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationPage';
import {Routes, Route} from "react-router-dom";
import { AuthProvider } from './contexts/AuthProvider';
import Opportunities from './pages/Opportunities';
import Community from './pages/Forum/ForumPage';
// import LoginSignup from './pages/SignupAlt';
import RoleSelect from './pages/RoleSelect';
import OrganiserAuth from './pages/OrganiserAuth';
import VolunteerAuth from './pages/VolunteerAuth';
import OrganiserDashboard from './pages/OrganiserDashboard';
import OrganiserCreateForm from "./pages/OrganiserCreateForm"


function App() {


  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path='/' element={<VolunteerConnect />}/>
        <Route path='/maps' element={<InteractiveMapDashboard />}/>
        {/* <Route path='/signup' element={<LoginSignup/>}/> */}
        <Route path='/about' element={<AboutPage/>} />
        <Route path='/profile' element={<ProfilePage/>} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/opportunities" element={<Opportunities/>} />
        <Route path="/community" element={<Community />} />
        <Route path='/choose-role' element={<RoleSelect />} />
        <Route path="/organiser/auth" element={<OrganiserAuth />} />
        <Route path="/volunteer/auth" element={<VolunteerAuth />} />
        <Route path="/organiser/dashboard" element={<OrganiserDashboard />} />
        <Route path="/organiser/opportunities/new" element={<OrganiserCreateForm/>} />


      </Routes>
    </AuthProvider>


    </>
  );
}

export default App;
