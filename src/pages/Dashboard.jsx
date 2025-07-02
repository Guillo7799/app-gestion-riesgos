import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";

export default function Dashboard() {
  const navigate = useNavigate();

  const logout = () => {
    auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <h2>Panel Principal</h2>
      <button onClick={() => navigate("/activos")}>
        Valoración de Activos
      </button>
      <button onClick={logout}>Cerrar sesión</button>
      <button onClick={() => navigate("/identificacion-riesgos")}>
        Identificación de Riesgos
      </button>
      <button onClick={() => navigate("/tratamiento-riesgos")}>
        Tratamiento de Riesgos
      </button>
      <button onClick={() => navigate("/listatratamientos")}>
        Lista de Tratamientos
      </button>
    </div>
  );
}
