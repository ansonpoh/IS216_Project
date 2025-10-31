import './App.css';
import VolunteerConnect from './pages/VolunteerConnect';
import InteractiveMapDashboard from './pages/InteractiveMap/InteractiveMapDashboard.jsx';
import NotificationsPage from './pages/Volunteer/NotificationPage.js';
import {Routes, Route, useLocation} from "react-router-dom";
import { AuthProvider } from './contexts/AuthProvider';
import Opportunities from './pages/Opportunities';
import Community from './pages/Forum/ForumPage';
import NewDiscussion from './pages/Forum/component/NewDiscussion'; 
import RoleSelect from './pages/Signup/RoleSelect.jsx';
import OrganiserAuth from './pages/Signup/OrganiserAuth.js';
import VolunteerAuth from './pages/Signup/VolunteerAuth.js';
import OrganiserDashboard from './pages/Organisers/OrganiserDashboard.jsx';
import OrganiserCreateForm from "./pages/Organisers/OrganiserCreateForm.jsx"
import VolunteerProfile from "./pages/Volunteer/VolunteerProfile.jsx";
import VolunteerDashboard from "./pages/Volunteer/VolunteerDashboard.jsx";

//transition wrapper
import {AnimatePresence} from "framer-motion";

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <AuthProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* AI Landing Page */}
            <Route path="/" element={<VolunteerConnect />} />
            
            {/* Forum Page */}
            <Route path="/community/*" element={<Community />} />
            <Route path="/community/new" element={<NewDiscussion />} />
            
            {/* Map Page */}
            <Route path="/map" element={<InteractiveMapDashboard />} />
            
            {/* Opportunities Page */}
            <Route path="/opportunities" element={<Opportunities />} />
            
            {/* Notifications Page */}
            <Route path="/notifications" element={<NotificationsPage />} />
            
            {/* Choose Role Page */}
            <Route path="/choose-role" element={<RoleSelect />} />
            
            {/* Organiser Auth Page */}
            <Route path="/organiser/auth" element={<OrganiserAuth />} />
            
            {/* Volunteer Auth Page */}
            <Route path="/volunteer/auth" element={<VolunteerAuth />} />
            
            {/* Organiser Dashboard Page */}
            <Route path="/organiser/dashboard" element={<OrganiserDashboard />} />
            
            {/* Organiser Create Form Page */}
            <Route path="/organiser/opportunities/new" element={<OrganiserCreateForm />} />
            
            {/* Volunteer Profile Page */}
            <Route path="/VolunteerProfile" element={<VolunteerProfile />} />
            
            {/* Volunteer Dashboard Page */}
            <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />

          </Routes>
        </AnimatePresence>
      </AuthProvider>
    </div>
  );
}

export default App;
