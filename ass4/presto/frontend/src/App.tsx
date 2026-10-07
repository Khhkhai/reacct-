import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { StarterPage } from './pages/StarterPage';
import { PresentationPage } from './pages/PresentationPage';
import { Slide } from './components/Slide';
import { PreviewPage } from './pages/PreviewPage';

function App() {
  const navigate = useNavigate();
  const fn = (token: string) => {
    localStorage.setItem('token', token);
    navigate('/dashboard')
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<StarterPage />} />
        <Route path="/login" element={<LoginPage successCallBack={fn}/>} />
        <Route path="/register" element={<RegisterPage successCallBack={fn}/>} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/presentation/:id" element={<PresentationPage />}>
          <Route index element={<Navigate to="slide/0" replace />} />
          <Route path="slide/:slideIndex" element={<Slide />} />
        </Route>
        <Route path="/preview/:id/slide/:slideIndex" element={<PreviewPage />} />

      </Routes>
    </>
  )
}

export default App
