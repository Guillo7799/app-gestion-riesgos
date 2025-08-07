import { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import Swal from "sweetalert2";

// Componente para registrar un nuevo usuario
export default function Register() {
  // Estados para los campos del formulario
  const [email, setEmail] = useState(""); // Correo electrónico
  const [password, setPassword] = useState(""); // Contraseña
  const navigate = useNavigate();

  // Maneja el registro de usuario con Firebase Auth
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
      Swal.fire({
        title: "Éxito",
        text: "Usuario registrado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      // Muestra alerta de error si falla el registro
      Swal.fire({
        title: "Error",
        text: "Error al registrar el usuario" + error.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="snowfall">
        {Array.from({ length: 40 }).map((_, i) => (
          <div className="snowflake" key={i}>
            ❄
          </div>
        ))}
      </div>
      <div className="login-left">
        <h1>¡Crea tu cuenta!</h1>
        <p>
          Solo necesitas registrarte en la herramienta que necesita tu empresa
          para gestionar los riesgos de manera eficiente y segura. Accede a tu
          cuenta para comenzar.
        </p>
      </div>
      <div className="login-right">
        {/* Formulario de registro */}
        <form onSubmit={handleRegister} className="login-form">
          <h2>Registro</h2>
          <label htmlFor="register-email">Correo</label>
          <input
            id="register-email"
            type="email"
            placeholder="Correo"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="register-password">Contraseña</label>
          <input
            id="register-password"
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Registrarse</button>
          <div className="login-register-link">
            <Link to="/">Iniciar sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
