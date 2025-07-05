import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import Swal from "sweetalert2";
import "../styles/Observaciones.css";

export default function Observaciones() {
  const [riesgos, setRiesgos] = useState([]);
  const [riesgoId, setRiesgoId] = useState("");
  const [observacion, setObservacion] = useState("");
  const [listaObservaciones, setListaObservaciones] = useState([]);

  useEffect(() => {
    const fetchRiesgos = async () => {
      const snapshot = await getDocs(collection(db, "riesgos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRiesgos(data);
    };
    fetchRiesgos();
  }, []);

  useEffect(() => {
    const fetchObservaciones = async () => {
      const snapshot = await getDocs(collection(db, "observaciones"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setListaObservaciones(data);
    };
    fetchObservaciones();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!riesgoId || !observacion.trim()) {
      return Swal.fire("Error", "Completa todos los campos", "error");
    }

    const riesgo = riesgos.find((r) => r.id === riesgoId);

    try {
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
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar", "error");
    }
  };

  return (
    <div className="observaciones-wrapper">
      <h2>Comunicación y Consulta</h2>

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

      {listaObservaciones.length === 0 ? (
        <p>No hay observaciones registradas.</p>
      ) : (
        listaObservaciones.map((o) => (
          <div key={o.id} className="observacion-card">
            <p>
              <strong>{o.activo}</strong> — {o.riesgo}
            </p>
            <p>{o.texto}</p>
            <small>{o.fecha?.toDate().toLocaleDateString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
