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
import Swal from "sweetalert2";

// Sugerencias automáticas por tipo/categoría de activo
const SUGERENCIAS = {
  Router: {
    vulnerabilidades: [
      "Firmware sin parchear",
      "Puertos abiertos",
      "Malware en router",
      "Configuración por defecto",
    ],
    controles: [
      "Actualización regular de firmware",
      "Segmentación de red",
      "Control de acceso físico",
      "Configuración segura de dispositivos",
    ],
  },
  Infraestructura: {
    vulnerabilidades: [
      "Firmware sin actualizar",
      "Puertos abiertos innecesarios",
      "Configuración por defecto",
      "Acceso físico no controlado",
    ],
    controles: [
      "Actualización regular de firmware",
      "Segmentación de red",
      "Control de acceso físico",
      "Configuración segura de dispositivos",
    ],
  },
  "Personas - Legal": {
    vulnerabilidades: [
      "Ingeniería social (phishing)",
      "Contraseñas débiles",
      "Falta de formación en seguridad",
      "Acceso no autorizado a información",
    ],
    controles: [
      "Capacitación en ciberseguridad",
      "Políticas de contraseñas robustas",
      "Doble factor de autenticación",
      "Restricción de acceso según rol",
    ],
  },
  "Personas - Ventas": {
    vulnerabilidades: [
      "Ingeniería social (phishing)",
      "Contraseñas débiles",
      "Falta de formación en seguridad",
      "Acceso no autorizado a información",
    ],
    controles: [
      "Capacitación en ciberseguridad",
      "Políticas de contraseñas robustas",
      "Doble factor de autenticación",
      "Restricción de acceso según rol",
    ],
  },
  "Personas - Marketing": {
    vulnerabilidades: [
      "Ingeniería social (phishing)",
      "Contraseñas débiles",
      "Falta de formación en seguridad",
      "Acceso no autorizado a información",
    ],
    controles: [
      "Capacitación en ciberseguridad",
      "Políticas de contraseñas robustas",
      "Doble factor de autenticación",
      "Restricción de acceso según rol",
    ],
  },
  "Personas - IT": {
    vulnerabilidades: [
      "Ingeniería social (phishing)",
      "Contraseñas débiles",
      "Falta de formación en seguridad",
      "Acceso no autorizado a información",
    ],
    controles: [
      "Capacitación en ciberseguridad",
      "Políticas de contraseñas robustas",
      "Doble factor de autenticación",
      "Restricción de acceso según rol",
    ],
  },
  Aplicaciones: {
    vulnerabilidades: [
      "Inyección de código (SQL, XSS)",
      "Gestión inadecuada de sesiones",
      "Componentes desactualizados",
      "Exposición de datos sensibles",
    ],
    controles: [
      "Validación de entradas",
      "Actualización de dependencias",
      "Gestión segura de sesiones",
      "Cifrado de datos sensibles",
    ],
  },
  Información: {
    vulnerabilidades: [
      "Datos sin cifrar",
      "Acceso no autorizado",
      "Pérdida de información",
      "Copias de seguridad inexistentes",
    ],
    controles: [
      "Cifrado de información",
      "Políticas de acceso a datos",
      "Copias de seguridad periódicas",
      "Clasificación de la información",
    ],
  },
  Logística: {
    vulnerabilidades: [
      "Falta de trazabilidad",
      "Manipulación de inventario",
      "Acceso no autorizado a sistemas logísticos",
      "Robo de herramientas de transporte",
    ],
    controles: [
      "Registro y monitoreo de inventario",
      "Control de acceso a sistemas logísticos",
      "Evaluación de proveedores",
      "Aseguración de activos logísticos",
    ],
  },
};

// Componente para identificar y listar riesgos asociados a activos
export default function IdentificacionRiesgos() {
  // Estados para el formulario y la paginación
  const [activos, setActivos] = useState([]); // Lista de activos
  const [activoId, setActivoId] = useState(""); // Activo seleccionado
  const [amenaza, setAmenaza] = useState(""); // Amenaza
  const [vulnerabilidad, setVulnerabilidad] = useState(""); // Vulnerabilidad
  const [controles, setControles] = useState(""); // Controles existentes
  const [probabilidad, setProbabilidad] = useState(1); // Probabilidad
  const [impacto, setImpacto] = useState(1); // Impacto
  const [riesgos, setRiesgos] = useState([]); // Lista de riesgos registrados
  const [loading, setLoading] = useState(true); // Estado de carga
  const [vulnChips, setVulnChips] = useState([]); // Chips de vulnerabilidades sugeridas
  const [controlChips, setControlChips] = useState([]); // Chips de controles sugeridos
  const [currentPage, setCurrentPage] = useState(1); // Página actual para paginación
  const itemsPerPage = 5; // Elementos por página

  // Lógica de paginación para mostrar solo 5 riesgos por página
  const totalPages = Math.ceil(riesgos.length / itemsPerPage);
  const paginatedRiesgos = riesgos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Obtiene los activos y riesgos desde Firestore al montar el componente
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

  // Sugerencias automáticas de vulnerabilidades y controles según activo/categoría
  useEffect(() => {
    const activo = activos.find((a) => a.id === activoId);
    if (activo) {
      if (SUGERENCIAS[activo.nombre]) {
        setVulnChips(SUGERENCIAS[activo.nombre].vulnerabilidades);
        setControlChips(SUGERENCIAS[activo.nombre].controles);
      } else if (SUGERENCIAS[activo.categoria]) {
        setVulnChips(SUGERENCIAS[activo.categoria].vulnerabilidades);
        setControlChips(SUGERENCIAS[activo.categoria].controles);
      } else {
        setVulnChips([]);
        setControlChips([]);
      }
    } else {
      setVulnChips([]);
      setControlChips([]);
    }
  }, [activoId, activos]);

  // Calcula el nivel de riesgo
  const calcularRiesgo = () => probabilidad * impacto;

  // Maneja el guardado de un nuevo riesgo
  const handleSave = async (e) => {
    e.preventDefault();
    const activo = activos.find((a) => a.id === activoId);
    if (!activo) {
      Swal.fire({
        title: "Error",
        text: "Debes seleccionar un activo.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      await addDoc(collection(db, "riesgos"), {
        activoId,
        activoNombre: activo.nombre,
        amenaza,
        vulnerabilidad: [vulnerabilidad, ...vulnChips].filter(Boolean).join(", "),
        controlesExistentes: [controles, ...controlChips].filter(Boolean).join(", "),
        probabilidad,
        impacto,
        nivelRiesgo: calcularRiesgo(),
        fechaRegistro: new Date(),
      });
      Swal.fire({
        title: "Éxito",
        text: "Riesgo registrado correctamente.",
        icon: "success",
        confirmButtonText: "OK",
      });
      // Limpia los campos y recarga la lista
      setActivoId("");
      setAmenaza("");
      setVulnerabilidad("");
      setControles("");
      setVulnChips([]);
      setControlChips([]);
      setProbabilidad(1);
      setImpacto(1);
      fetchRiesgos();
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Error al guardar riesgo: " + err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Maneja el borrado de un riesgo
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este riesgo?")) return;
    await deleteDoc(doc(db, "riesgos", id));
    fetchRiesgos();
  };

  return (
    <div className="identificacion-layout">
      {/* Formulario para registrar un riesgo */}
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
          {/* Chips de vulnerabilidades sugeridas */}
          <div className="chips-container">
            {vulnChips.map((chip, idx) => (
              <span className="chip" key={chip}>
                {chip}
                <button
                  type="button"
                  onClick={() =>
                    setVulnChips(
                      vulnChips.filter((c, i) => i !== idx)
                    )
                  }
                  className="chip-x"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            id="vulnerabilidad"
            type="text"
            placeholder="Vulnerabilidad"
            value={vulnerabilidad}
            onChange={(e) => setVulnerabilidad(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="controles">Controles existentes</label>
          {/* Chips de controles sugeridos */}
          <div className="chips-container">
            {controlChips.map((chip, idx) => (
              <span className="chip" key={chip}>
                {chip}
                <button
                  type="button"
                  onClick={() =>
                    setControlChips(
                      controlChips.filter((c, i) => i !== idx)
                    )
                  }
                  className="chip-x"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <textarea
            id="controles"
            placeholder="Controles existentes"
            value={controles}
            onChange={(e) => setControles(e.target.value)}
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
      {/* Listado de riesgos registrados con paginación */}
      <div className="riesgos-list-panel">
        <h3>Riesgos registrados</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : riesgos.length === 0 ? (
          <p>No hay riesgos registrados.</p>
        ) : (
          <ul className="riesgos-list">
            {paginatedRiesgos.map((r) => (
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
                {/* Botón para borrar riesgo */}
                <button
                  className="borrar-riesgo"
                  onClick={() => handleDelete(r.id)}
                  title="Borrar riesgo"
                >
                  🗑️
                </button>
              </li>
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
