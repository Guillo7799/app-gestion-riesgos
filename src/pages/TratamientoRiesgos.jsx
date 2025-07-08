import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "../styles/TratamientoRiesgos.css";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";

// Componente para registrar y tratar riesgos identificados
export default function TratamientoRiesgos() {
  // Estados para el formulario y la paginación
  const [riesgos, setRiesgos] = useState([]); // Lista de riesgos disponibles
  const [riesgoId, setRiesgoId] = useState(""); // Riesgo seleccionado
  const [estrategia, setEstrategia] = useState(""); // Estrategia de tratamiento
  const [controlesPropuestos, setControlesPropuestos] = useState(""); // Controles propuestos
  const [responsable, setResponsable] = useState(""); // Correo del responsable
  const [resProbabilidad, setResProbabilidad] = useState(1); // Probabilidad residual
  const [resImpacto, setResImpacto] = useState(1); // Impacto residual
  const [currentPage, setCurrentPage] = useState(1); // Página actual para paginación
  const itemsPerPage = 5; // Elementos por página

  // Obtiene los riesgos desde Firestore al montar el componente
  useEffect(() => {
    const fetchRiesgos = async () => {
      const snapshot = await getDocs(collection(db, "riesgos"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRiesgos(data);
    };
    fetchRiesgos();
  }, []);

  // Maneja el envío del formulario para guardar tratamiento y enviar correo
  const handleSubmit = async (e) => {
    e.preventDefault();
    const riesgo = riesgos.find((r) => r.id === riesgoId);
    if (!riesgo) return alert("Selecciona un riesgo");

    try {
      // Guarda el tratamiento en Firestore
      await addDoc(collection(db, "tratamientos"), {
        riesgoId,
        riesgo: riesgo.amenaza,
        activoNombre: riesgo.activoNombre,
        estrategia,
        controlesPropuestos,
        responsable,
        fechaRegistro: new Date(),
        riesgoResidual: resProbabilidad * resImpacto,
        resProbabilidad,
        resImpacto,
      });

      // Enviar email al responsable usando EmailJS
      const templateParams = {
        to_email: responsable,
        riesgo: riesgo.amenaza,
        activo: riesgo.activoNombre,
        estrategia,
        controles: controlesPropuestos,
        nivel_residual: resProbabilidad * resImpacto,
      };
      // Reemplaza estos valores con los tuyos de EmailJS
      await emailjs.send(
        "service_bn1m75g",
        "template_7c9rmir",
        templateParams,
        "cL7BTaypmH4qYdDN_"
      );

      Swal.fire({
        title: "Éxito",
        text: "Tratamiento guardado y correo enviado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      // Limpia los campos del formulario
      setRiesgoId("");
      setEstrategia("");
      setControlesPropuestos("");
      setResponsable("");
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error al guardar tratamiento o enviar correo: " + err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Lógica de paginación para mostrar solo 5 riesgos por página en el selector
  const totalPages = Math.ceil(riesgos.length / itemsPerPage);
  const paginatedRiesgos = riesgos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <form onSubmit={handleSubmit} className="tratamiento-form">
      <h2>Tratamiento del Riesgo</h2>
      <div className="form-group">
        <label htmlFor="riesgo-select">Riesgo</label>
        <select
          id="riesgo-select"
          value={riesgoId}
          onChange={(e) => setRiesgoId(e.target.value)}
          required
        >
          <option value="">-- Selecciona un riesgo --</option>
          {paginatedRiesgos.map((r) => (
            <option key={r.id} value={r.id}>
              {r.activoNombre} - {r.amenaza}
            </option>
          ))}
        </select>
        {/* Controles de paginación para el selector de riesgos */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="estrategia">Estrategia</label>
        <select
          id="estrategia"
          value={estrategia}
          onChange={(e) => setEstrategia(e.target.value)}
          required
        >
          <option value="">-- Selecciona estrategia --</option>
          <option value="Mitigar">Mitigar</option>
          <option value="Transferir">Transferir</option>
          <option value="Aceptar">Aceptar</option>
          <option value="Evitar">Evitar</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="controlesPropuestos">Controles propuestos</label>
        <textarea
          id="controlesPropuestos"
          placeholder="Controles propuestos (puedes usar controles ISO 27002)"
          value={controlesPropuestos}
          onChange={(e) => setControlesPropuestos(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="responsable">Responsable</label>
        <input
          id="responsable"
          type="email"
          placeholder="Correo del responsable"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          required
        />
      </div>
      <h4>Evaluación de Riesgo Residual</h4>
      <div className="form-group-inline">
        <div>
          <label htmlFor="resProbabilidad">Probabilidad residual (1-5)</label>
          <input
            id="resProbabilidad"
            type="number"
            min={1}
            max={5}
            value={resProbabilidad}
            onChange={(e) => setResProbabilidad(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="resImpacto">Impacto residual (1-5)</label>
          <input
            id="resImpacto"
            type="number"
            min={1}
            max={5}
            value={resImpacto}
            onChange={(e) => setResImpacto(Number(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="nivel-riesgo">
        <strong>Nivel de riesgo residual:</strong>{" "}
        {resProbabilidad * resImpacto}
      </div>
      <button type="submit">Guardar tratamiento</button>
    </form>
  );
}
