import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import Swal from "sweetalert2";
import "../styles/Dashboard.css";

// Componente layout principal del dashboard
export default function Dashboard() {
  const navigate = useNavigate();

  // Maneja el cierre de sesión con confirmación
  const logout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estás seguro que deseas salir?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    await auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-layout">
      {/* Barra lateral de navegación */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Panel</h2>
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard/graficos"
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
        {/* Botón de cierre de sesión */}
        <button className="sidebar-logout" onClick={logout}>
          Cerrar sesión
        </button>
      </aside>
      {/* Contenido principal */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}
