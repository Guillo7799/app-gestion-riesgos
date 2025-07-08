import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Swal from "sweetalert2";
import "../styles/ListaTratamientos.css";

// Componente para mostrar la lista de tratamientos registrados
export default function ListaTratamientos() {
  // Estado para la lista de tratamientos
  const [tratamientos, setTratamientos] = useState([]);
  // Estado para la página actual de la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Elementos por página

  // Obtiene los tratamientos desde Firestore al montar el componente
  const fetchTratamientos = async () => {
    const snapshot = await getDocs(collection(db, "tratamientos"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTratamientos(data);
  };

  useEffect(() => {
    fetchTratamientos();
  }, []);

  // Maneja el borrado de un tratamiento
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Seguro que deseas borrar este tratamiento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteDoc(doc(db, "tratamientos", id));
      await fetchTratamientos();
      Swal.fire({
        title: "Eliminado",
        text: "Tratamiento eliminado correctamente.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el tratamiento.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // Lógica de paginación para mostrar solo 5 tratamientos por página
  const totalPages = Math.ceil(tratamientos.length / itemsPerPage);
  const paginatedTratamientos = tratamientos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="tratamientos-panel">
      <h2>Tratamientos Registrados</h2>
      {tratamientos.length === 0 ? (
        <div className="no-tratamientos">No hay tratamientos registrados.</div>
      ) : (
        <div className="tratamientos-list">
          {paginatedTratamientos.map((t) => (
            <div className="tratamiento-card" key={t.id}>
              <div className="tratamiento-header">
                <span className="tratamiento-activo">{t.activoNombre}</span>
                <span className="tratamiento-estrategia">{t.estrategia}</span>
              </div>
              <div className="tratamiento-body">
                <div>
                  <strong>Riesgo:</strong> {t.riesgo}
                </div>
                <div>
                  <strong>Responsable:</strong> {t.responsable}
                </div>
                <div>
                  <strong>Controles:</strong> {t.controlesPropuestos}
                </div>
                <div className="tratamiento-residual">
                  <strong>Riesgo Residual:</strong> {t.riesgoResidual}
                </div>
                <div className="tratamiento-fecha">
                  <strong>Fecha:</strong>{" "}
                  {t.fechaRegistro
                    ? new Date(
                        t.fechaRegistro.seconds * 1000
                      ).toLocaleDateString()
                    : "-"}
                </div>
              </div>
              {/* Botón para borrar tratamiento */}
              <button
                className="borrar-tratamiento"
                onClick={() => handleDelete(t.id)}
                title="Borrar tratamiento"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span>
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
