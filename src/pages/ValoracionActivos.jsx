import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "../styles/ValoracionActivos.css";

export default function ValoracionActivos() {
  const [activo, setActivo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [conf, setConf] = useState(1);
  const [inte, setInte] = useState(1);
  const [disp, setDisp] = useState(1);
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivos = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "activos"));
    setActivos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  useEffect(() => {
    fetchActivos();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!categoria) {
        alert("Por favor selecciona una categoría.");
        return;
      }

      await addDoc(collection(db, "activos"), {
        nombre: activo,
        categoria,
        confidencialidad: conf,
        integridad: inte,
        disponibilidad: disp,
        fechaRegistro: new Date(),
      });

      alert("Activo guardado correctamente");
      setActivo("");
      setCategoria("");
      setConf(1);
      setInte(1);
      setDisp(1);
      fetchActivos();
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este activo?")) return;
    await deleteDoc(doc(db, "activos", id));
    fetchActivos();
  };

  return (
    <div className="valoracion-layout">
      <form onSubmit={handleSave} className="valoracion-form">
        <h2>Registro de Activos</h2>
        <div className="form-group">
          <label htmlFor="nombre-activo">Nombre del activo</label>
          <input
            id="nombre-activo"
            placeholder="Nombre del activo"
            value={activo}
            onChange={(e) => setActivo(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="">-- Selecciona categoría --</option>
            <option value="Infraestructura">Infraestructura</option>
            <option value="Personas - Legal">Personas - Legal</option>
            <option value="Personas - Ventas">Personas - Ventas</option>
            <option value="Personas - Marketing">Personas - Marketing</option>
            <option value="Personas - IT">Personas - IT</option>
            <option value="Aplicaciones">Aplicaciones</option>
            <option value="Información">Información</option>
            <option value="Logística">Logística</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="confidencialidad">Confidencialidad (1-5)</label>
          <input
            id="confidencialidad"
            type="number"
            min={1}
            max={5}
            value={conf}
            onChange={(e) => setConf(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="integridad">Integridad (1-5)</label>
          <input
            id="integridad"
            type="number"
            min={1}
            max={5}
            value={inte}
            onChange={(e) => setInte(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="disponibilidad">Disponibilidad (1-5)</label>
          <input
            id="disponibilidad"
            type="number"
            min={1}
            max={5}
            value={disp}
            onChange={(e) => setDisp(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Guardar activo</button>
      </form>
      <div className="activos-list-panel">
        <h3>Activos registrados</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : activos.length === 0 ? (
          <p>No hay activos registrados.</p>
        ) : (
          <ul className="activos-list">
            {activos.map((a) => (
              <li key={a.id} className="activo-item">
                <div>
                  <strong>{a.nombre}</strong>{" "}
                  <span className="categoria">({a.categoria})</span>
                </div>
                <button
                  className="borrar-activo"
                  onClick={() => handleDelete(a.id)}
                  title="Borrar activo"
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
