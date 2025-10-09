import './App.css';
import VolunteerConnect from './components/VolunteerConnect';
import {Routes, Route} from "react-router-dom";

function App() {


  return (
    <>
    <Routes>
      <Route path='/' element={<VolunteerConnect />}/>
    </Routes>

    </>
  );
}

export default App;
