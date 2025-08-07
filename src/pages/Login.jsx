console.log("Auth Firebase:", auth);
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import Swal from "sweetalert2";

// Componente para el inicio de sesión de usuarios
export default function Login() {
  // Estados para los campos del formulario
  const [email, setEmail] = useState(""); // Correo electrónico
  const [password, setPassword] = useState(""); // Contraseña
  const navigate = useNavigate();

  // Maneja el inicio de sesión con Firebase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      // Muestra alerta de error si falla el login
      Swal.fire({
        title: "Error",
        text: "Error al iniciar sesión: " + error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>Bienvenido</h1>
        <p>
          Inicia sesión para gestionar los riesgos de tu empresa de forma segura
          y eficiente.
        </p>
      </div>
      <div className="login-right">
        {/* Formulario de inicio de sesión */}
        <form onSubmit={handleLogin} className="login-form">
          <h2>Iniciar Sesión</h2>
          <input
            type="email"
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Iniciar sesión</button>
          <div className="login-register-link">
            <Link to="/register">Crear cuenta</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
