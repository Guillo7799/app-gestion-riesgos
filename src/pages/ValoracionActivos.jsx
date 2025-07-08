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
import Swal from "sweetalert2";

// Componente para la valoración y registro de activos
export default function ValoracionActivos() {
  // Estados para los campos del formulario de activos
  const [activo, setActivo] = useState(""); // Nombre del activo
  const [categoria, setCategoria] = useState(""); // Categoría del activo
  const [conf, setConf] = useState(1); // Confidencialidad
  const [inte, setInte] = useState(1); // Integridad
  const [disp, setDisp] = useState(1); // Disponibilidad
  // Estado para la lista de activos registrados
  const [activos, setActivos] = useState([]);
  // Estado para mostrar loading mientras se cargan los activos
  const [loading, setLoading] = useState(true);
  // Estados para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Función para obtener los activos desde Firestore
  const fetchActivos = async () => {
    setLoading(true);
    const snapshot = await getDocs(collection(db, "activos"));
    setActivos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  // Cargar activos al montar el componente
  useEffect(() => {
    fetchActivos();
  }, []);

  // Maneja el guardado de un nuevo activo
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!categoria) {
        Swal.fire({
          title: "Error",
          text: "Por favor selecciona una categoría.",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
      // Guarda el activo en Firestore
      await addDoc(collection(db, "activos"), {
        nombre: activo,
        categoria,
        confidencialidad: conf,
        integridad: inte,
        disponibilidad: disp,
        fechaRegistro: new Date(),
      });
      Swal.fire({
        title: "Éxito",
        text: "El activo fue registrado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      // Limpia los campos y recarga la lista
      setActivo("");
      setCategoria("");
      setConf(1);
      setInte(1);
      setDisp(1);
      fetchActivos();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error al registrar activo: " + err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Maneja el borrado de un activo
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este activo?")) return;
    await deleteDoc(doc(db, "activos", id));
    fetchActivos();
  };

  // Lógica de paginación para mostrar solo 5 activos por página
  const totalPages = Math.ceil(activos.length / itemsPerPage);
  const paginatedActivos = activos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="valoracion-layout">
      {/* Formulario para registrar un activo */}
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
      {/* Listado de activos registrados con paginación */}
      <div className="activos-list-panel">
        <h3>Activos registrados</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : activos.length === 0 ? (
          <p>No hay activos registrados.</p>
        ) : (
          <>
            <ul className="activos-list">
              {paginatedActivos.map((a) => (
                <li key={a.id} className="activo-item">
                  <div>
                    <strong>{a.nombre}</strong> ({a.categoria})
                    <div className="activo-detalles">
                      <span>Conf: {a.confidencialidad}</span> |{" "}
                      <span>Int: {a.integridad}</span> |{" "}
                      <span>Disp: {a.disponibilidad}</span>
                    </div>
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
