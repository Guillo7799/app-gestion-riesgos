import { useState } from "react";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Error al registrar: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>¡Crea tu cuenta!</h1>
        <p>
          Regístrate para comenzar a gestionar los riesgos de tu organización de
          forma segura y eficiente.
        </p>
      </div>
      <div className="login-right">
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
