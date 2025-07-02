import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../styles/IdentificacionRiesgos.css";

export default function IdentificacionRiesgos() {
  const [activos, setActivos] = useState([]);
  const [activoId, setActivoId] = useState("");
  const [amenaza, setAmenaza] = useState("");
  const [vulnerabilidad, setVulnerabilidad] = useState("");
  const [controles, setControles] = useState("");
  const [probabilidad, setProbabilidad] = useState(1);
  const [impacto, setImpacto] = useState(1);
  const [riesgos, setRiesgos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivos = async () => {
    const activosSnapshot = await getDocs(collection(db, "activos"));
    const activosData = activosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setActivos(activosData);
  };

  const fetchRiesgos = async () => {
    setLoading(true);
    const riesgosSnapshot = await getDocs(collection(db, "riesgos"));
    setRiesgos(
      riesgosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchActivos();
    fetchRiesgos();
  }, []);

  const calcularRiesgo = () => probabilidad * impacto;

  const handleSave = async (e) => {
    e.preventDefault();
    const activo = activos.find((a) => a.id === activoId);
    if (!activo) return alert("Debes seleccionar un activo.");

    try {
      await addDoc(collection(db, "riesgos"), {
        activoId,
        activoNombre: activo.nombre,
        amenaza,
        vulnerabilidad,
        controlesExistentes: controles,
        probabilidad,
        impacto,
        nivelRiesgo: calcularRiesgo(),
        fechaRegistro: new Date(),
      });
      alert("Riesgo registrado correctamente.");
      setActivoId("");
      setAmenaza("");
      setVulnerabilidad("");
      setControles("");
      setProbabilidad(1);
      setImpacto(1);
      fetchRiesgos();
    } catch (err) {
      alert("Error al guardar riesgo: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este riesgo?")) return;
    await deleteDoc(doc(db, "riesgos", id));
    fetchRiesgos();
  };

  return (
    <div className="identificacion-layout">
      <form onSubmit={handleSave} className="identificacion-form">
        <h2>Identificación de Riesgos</h2>
        <div className="form-group">
          <label htmlFor="activo-select">Activo</label>
          <select
            id="activo-select"
            value={activoId}
            onChange={(e) => setActivoId(e.target.value)}
            required
          >
            <option value="">-- Selecciona un activo --</option>
            {activos.map((activo) => (
              <option key={activo.id} value={activo.id}>
                {activo.nombre} ({activo.categoria})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amenaza">Amenaza</label>
          <input
            id="amenaza"
            type="text"
            placeholder="Amenaza"
            value={amenaza}
            onChange={(e) => setAmenaza(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="vulnerabilidad">Vulnerabilidad</label>
          <input
            id="vulnerabilidad"
            type="text"
            placeholder="Vulnerabilidad"
            value={vulnerabilidad}
            onChange={(e) => setVulnerabilidad(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="controles">Controles existentes</label>
          <textarea
            id="controles"
            placeholder="Controles existentes"
            value={controles}
            onChange={(e) => setControles(e.target.value)}
            required
          />
        </div>
        <div className="form-group-inline">
          <div>
            <label htmlFor="probabilidad">Probabilidad (1-5)</label>
            <input
              id="probabilidad"
              type="number"
              min={1}
              max={5}
              value={probabilidad}
              onChange={(e) => setProbabilidad(Number(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="impacto">Impacto (1-5)</label>
            <input
              id="impacto"
              type="number"
              min={1}
              max={5}
              value={impacto}
              onChange={(e) => setImpacto(Number(e.target.value))}
              required
            />
          </div>
        </div>
        <div className="nivel-riesgo">
          <strong>Nivel de Riesgo:</strong> {calcularRiesgo()}
        </div>
        <button type="submit">Guardar riesgo</button>
      </form>
      <div className="riesgos-list-panel">
        <h3>Riesgos registrados</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : riesgos.length === 0 ? (
          <p>No hay riesgos registrados.</p>
        ) : (
          <ul className="riesgos-list">
            {riesgos.map((r) => (
              <li key={r.id} className="riesgo-item">
                <div>
                  <strong>{r.activoNombre}</strong> - {r.amenaza}{" "}
                  <span className="categoria">({r.vulnerabilidad})</span>
                  <div className="riesgo-detalles">
                    <span>Prob: {r.probabilidad}</span> |{" "}
                    <span>Imp: {r.impacto}</span> |{" "}
                    <span>Riesgo: {r.nivelRiesgo}</span>
                  </div>
                </div>
                <button
                  className="borrar-riesgo"
                  onClick={() => handleDelete(r.id)}
                  title="Borrar riesgo"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
