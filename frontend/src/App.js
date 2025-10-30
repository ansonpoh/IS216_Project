import './App.css';
import VolunteerConnect from './pages/VolunteerConnect';
import InteractiveMapDashboard from './pages/Interactive Map/index.jsx';
// import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/Volunteer/ProfilePage.js';
import NotificationsPage from './pages/Volunteer/NotificationPage.js';
import {Routes, Route} from "react-router-dom";
import { AuthProvider } from './contexts/AuthProvider';
import Opportunities from './pages/Opportunities';
import Community from './pages/Forum/ForumPage';
import NewDiscussion from './pages/Forum/component/NewDiscussion'; 
// changed code
// import LoginSignup from './pages/SignupAlt';
import RoleSelect from './pages/Signup/RoleSelect.jsx';
import OrganiserAuth from './pages/Signup/OrganiserAuth.js';
import VolunteerAuth from './pages/Signup/VolunteerAuth.js';
import OrganiserDashboard from './pages/Organisers/OrganiserDashboard.jsx';
import OrganiserCreateForm from "./pages/Organisers/OrganiserCreateForm.jsx"
import VolunteerProfile from "./pages/Volunteer/VolunteerProfile.jsx";
import VolunteerDashboard from "./pages/Volunteer/VolunteerDashboard.jsx";



function App() {

  return (
    <>
    <AuthProvider>
      <Routes>
        <Route path='/' element={<VolunteerConnect />}/>
        <Route path='/maps' element={<InteractiveMapDashboard />}/>
        {/* <Route path='/signup' element={<LoginSignup/>}/> */}
        {/* <Route path='/about' element={<AboutPage/>} /> */}
        {/* <Route path='/profile' element={<ProfilePage/>} /> */}
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/opportunities" element={<Opportunities/>} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/new-discussion" element={<NewDiscussion />} /> 
        <Route path='/choose-role' element={<RoleSelect />} />
        <Route path="/organiser/auth" element={<OrganiserAuth />} />
        <Route path="/volunteer/auth" element={<VolunteerAuth />} />
        <Route path="/organiser/dashboard" element={<OrganiserDashboard />} />
        <Route path="/organiser/opportunities/new" element={<OrganiserCreateForm/>} />
        <Route path='/VolunteerProfile' element={<VolunteerProfile/>} />
        <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />



      </Routes>
    </AuthProvider>


    </>
  );
}

export default App;
