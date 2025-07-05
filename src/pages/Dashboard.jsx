import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = async () => {
    await auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Panel</h2>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/dashboard/activos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Valoración de Activos
          </NavLink>
          <NavLink
            to="/dashboard/identificacion-riesgos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Identificación de Riesgos
          </NavLink>
          <NavLink
            to="/dashboard/tratamiento-riesgos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Tratamiento de Riesgos
          </NavLink>
          <NavLink
            to="/dashboard/listatratamientos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Lista de Tratamientos
          </NavLink>
          <NavLink
            to="/dashboard/observaciones"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Observaciones / Recomendaciones
          </NavLink>
        </nav>
        <button className="sidebar-logout" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
