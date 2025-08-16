import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import "../styles/Observaciones.css";
import Footer from "../components/Footer";

// Componente principal para registrar y mostrar observaciones/recomendaciones
export default function Observaciones() {
  // Estado para almacenar los riesgos disponibles
  const [riesgos, setRiesgos] = useState([]);
  // Estado para el riesgo seleccionado en el formulario
  const [riesgoId, setRiesgoId] = useState("");
  // Estado para el texto de la observación
  const [observacion, setObservacion] = useState("");
  // Estado para la lista de observaciones registradas
  const [listaObservaciones, setListaObservaciones] = useState([]);
  // Estado para la página actual de la paginación
  const [currentPage, setCurrentPage] = useState(1);
  // Cantidad de observaciones por página
  const itemsPerPage = 5;

  // Obtiene los riesgos desde Firestore al montar el componente
  useEffect(() => {
    const fetchRiesgos = async () => {
      const snapshot = await getDocs(collection(db, "riesgos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRiesgos(data);
    };
    fetchRiesgos();
  }, []);

  // Obtiene las observaciones desde Firestore al montar el componente
  // y expone la función para refrescar el listado tras guardar
  useEffect(() => {
    const fetchObservaciones = async () => {
      const snapshot = await getDocs(collection(db, "observaciones"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setListaObservaciones(data);
    };
    // Permite refrescar el listado tras guardar
    Observaciones.fetchObservaciones = fetchObservaciones;
    fetchObservaciones();
  }, []);

  // Maneja el envío del formulario para registrar una observación
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!riesgoId || !observacion.trim()) {
      return Swal.fire("Error", "Completa todos los campos", "error");
    }

    // Busca el riesgo seleccionado
    const riesgo = riesgos.find((r) => r.id === riesgoId);

    try {
      // Guarda la observación en Firestore
      await addDoc(collection(db, "observaciones"), {
        riesgoId,
        riesgo: riesgo?.amenaza || "",
        activo: riesgo?.activoNombre || "",
        texto: observacion,
        fecha: Timestamp.now(),
      });

      Swal.fire("Guardado", "Observación registrada", "success");
      setObservacion("");
      setRiesgoId("");
      // Refresca el listado automáticamente
      await Observaciones.fetchObservaciones();
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  // Lógica de paginación para mostrar solo 5 observaciones por página
  const totalPages = Math.ceil(listaObservaciones.length / itemsPerPage);
  const paginatedObservaciones = listaObservaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="observaciones-wrapper">
      <h2>Comunicación y Consulta</h2>

      {/* Formulario para registrar una observación */}
      <form onSubmit={handleSubmit} className="observacion-form">
        <div>
          <label>Selecciona un riesgo</label>
          <br></br>
          <br></br>
          <select
            value={riesgoId}
            className="riesgo-select"
            onChange={(e) => setRiesgoId(e.target.value)}
          >
            <option value="">-- Selecciona --</option>
            {riesgos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.activoNombre} - {r.amenaza}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Observación / Recomendación</label>
          <br></br>
          <br></br>
          <textarea
            rows="3"
            colums="50"
            placeholder="Escribe tu observación aquí..."
            className="observacion-textarea"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </div>

        <div className="save-section">
          <button type="submit">Guardar</button>
        </div>
      </form>

      <h3>Observaciones registradas</h3>

      {/* Listado paginado de observaciones */}
      {listaObservaciones.length === 0 ? (
        <p>No hay observaciones registradas.</p>
      ) : (
        <>
          {paginatedObservaciones.map((o) => (
            <div key={o.id} className="observacion-card">
              <p>
                <strong>{o.activo}</strong> — {o.riesgo}
              </p>
              <p>{o.texto}</p>
              <small>{o.fecha?.toDate().toLocaleDateString()}</small>
            </div>
          ))}
          {/* Controles de paginación */}
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
