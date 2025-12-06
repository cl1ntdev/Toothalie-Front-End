
import './App.css'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from "react-router-dom";
import LoginPage from './Pages/Auth/LoginPage';
import  RegisterPage  from './Pages/Auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './Pages/Authenticated/UserDashboard';
import ToothalieAdmin from './Pages/Auth/ToothalieAdmin';
function App() {

  return (
    <>
      <Routes>
        {/* <Route path='/user/:id' element={<UserPage />} /> {/* use LINK to navigate and then useParams to get the value */} 
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/toothalieAdmin' element={<ToothalieAdmin />} />
       
       
        <Route path='/user' element={
          <ProtectedRoute>
            <UserDashboard />          
          </ProtectedRoute>
        } />
       
       
        {/*<Route path='/patient/:id' element={<PatientPanel />} />
        <Route path='/dentist/:id' element={<DentistPanel />} />*/}
      </Routes>
    </>
  )
}


export default App
