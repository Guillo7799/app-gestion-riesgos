import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import "../styles/ListaTratamientos.css";

export default function ListaTratamientos() {
  const [tratamientos, setTratamientos] = useState([]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas borrar este tratamiento?")) return;
    await deleteDoc(doc(db, "tratamientos", id));
    fetchTratamientos();
  };

  return (
    <div className="tratamientos-panel">
      <h2>Tratamientos Registrados</h2>
      {tratamientos.length === 0 ? (
        <div className="no-tratamientos">No hay tratamientos registrados.</div>
      ) : (
        <div className="tratamientos-list">
          {tratamientos.map((t) => (
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
    </div>
  );
}
