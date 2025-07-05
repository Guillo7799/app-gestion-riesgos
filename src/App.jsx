import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import IdentificacionRiesgos from "./pages/IdentificacionRiesgos";
import TratamientoRiesgos from "./pages/TratamientoRiesgos";
import ListaTratamientos from "./pages/ListaTratamientos";
import ValoracionActivos from "./pages/ValoracionActivos";
import Observaciones from "./pages/Observaciones";
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
        {user && (
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<div>Bienvenido al Panel Principal</div>} />
            <Route path="activos" element={<ValoracionActivos />} />
            <Route
              path="identificacion-riesgos"
              element={<IdentificacionRiesgos />}
            />
            <Route
              path="tratamiento-riesgos"
              element={<TratamientoRiesgos />}
            />
            <Route path="listatratamientos" element={<ListaTratamientos />} />
            <Route path="observaciones" element={<Observaciones />} />
          </Route>
        )}
        {/* Redirección para rutas antiguas */}
        <Route path="/activos" element={<Navigate to="/dashboard/activos" />} />
        <Route
          path="/identificacion-riesgos"
          element={<Navigate to="/dashboard/identificacion-riesgos" />}
        />
        <Route
          path="/tratamiento-riesgos"
          element={<Navigate to="/dashboard/tratamiento-riesgos" />}
        />
        <Route
          path="/listatratamientos"
          element={<Navigate to="/dashboard/listatratamientos" />}
        />
        <Route
          path="/observaciones"
          element={<Navigate to="/dashboard/observaciones" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
