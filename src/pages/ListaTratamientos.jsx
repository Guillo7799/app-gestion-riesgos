import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function ListaTratamientos() {
  const [tratamientos, setTratamientos] = useState([]);

  useEffect(() => {
    const fetchTratamientos = async () => {
      const snapshot = await getDocs(collection(db, "tratamientos"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTratamientos(data);
    };
    fetchTratamientos();
  }, []);

  return (
    <div>
      <h2>Tratamientos Registrados</h2>
      <table border="1" cellPadding={8}>
        <thead>
          <tr>
            <th>Activo</th>
            <th>Riesgo</th>
            <th>Estrategia</th>
            <th>Responsable</th>
            <th>Controles</th>
            <th>Riesgo Residual</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {tratamientos.length === 0 ? (
            <tr>
              <td colSpan="7">No hay tratamientos registrados.</td>
            </tr>
          ) : (
            tratamientos.map((t) => (
              <tr key={t.id}>
                <td>{t.activoNombre}</td>
                <td>{t.riesgo}</td>
                <td>{t.estrategia}</td>
                <td>{t.responsable}</td>
                <td>{t.controlesPropuestos}</td>
                <td>{t.riesgoResidual}</td>
                <td>
                  {new Date(
                    t.fechaRegistro?.seconds * 1000
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
