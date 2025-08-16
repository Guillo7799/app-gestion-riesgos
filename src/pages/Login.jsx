console.log("Auth Firebase:", auth);
import { useState } from "react";
import Footer from "../components/Footer";
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
      Swal.fire({
        title: "Error",
        text: "Error al iniciar sesión: " + error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="snowfall">
          {Array.from({ length: 40 }).map((_, i) => (
            <div className="snowflake" key={i}>
              ❄
            </div>
          ))}
        </div>
        <div className="login-left">
          <h1>¡Bienvenido!</h1>
          <p>
            Gestiona los riesgos de tu empresa de manera eficiente y segura. Ingresa a tu cuenta para comenzar.
          </p>
        </div>
        <div className="login-right">
          {/* Formulario de inicio de sesión */}
          <form onSubmit={handleLogin} className="login-form">
            <h2>Iniciar sesión</h2>
            <label htmlFor="login-email">Correo</label>
            <input
              id="login-email"
              type="email"
              placeholder="Correo"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="Contraseña"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Ingresar</button>
            <div className="login-register-link">
              <Link to="/register">¿No tienes cuenta? Regístrate</Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
