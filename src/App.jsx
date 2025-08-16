import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        {/* <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </Router>
  )
}

export default App
