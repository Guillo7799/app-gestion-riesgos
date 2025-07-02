import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IdentificacionRiesgos from "./pages/IdentificacionRiesgos";
import TratamientoRiesgos from "./pages/TratamientoRiesgos";
import ValoracionActivos from "./pages/ValoracionActivos";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setCheckingAuth(false);
    });
    return () => unsub();
  }, []);

  if (checkingAuth) return <p>Cargando...</p>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/activos"
          element={user ? <ValoracionActivos /> : <Navigate to="/" />}
        />
        <Route
          path="/identificacion-riesgos"
          element={<IdentificacionRiesgos />}
        />
        <Route path="/tratamiento-riesgos" element={<TratamientoRiesgos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
