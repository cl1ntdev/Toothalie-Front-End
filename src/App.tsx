
import './App.css'
import LandingPage from './Pages/LandingPage'
import { Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/user/:id' /> {/* use LINK to navigate and then useParams to get the value */}
      </Routes>
    </>
  )
}


export default App
