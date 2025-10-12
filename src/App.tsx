
import './App.css'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from "react-router-dom";
import LoginPage from './Pages/Auth/LoginPage';
import  RegisterPage  from './Pages/Auth/RegisterPage';
import UserPage from './Pages/Authenticated/UserPage';
import PatientPanel from './Pages/Authenticated/Panes/PatientPane/Patient';
function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        {/* <Route path='/user/:id' element={<UserPage />} /> {/* use LINK to navigate and then useParams to get the value */} */}
        <Route path='/patient/:id' element={<PatientPanel />} />
      </Routes>
    </>
  )
}


export default App
