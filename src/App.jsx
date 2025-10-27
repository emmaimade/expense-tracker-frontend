import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import LandingPage from './components/pages/LandingPage';
import Dashboard from './components/pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword/>} /> */}
        <Route path="/dashboard" element={<Dashboard />} /> 
      </Routes>
    </Router>
  )
}

export default App
