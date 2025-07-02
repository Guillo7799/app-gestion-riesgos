import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function IdentificacionRiesgos() {
  const [activos, setActivos] = useState([]);
  const [activoId, setActivoId] = useState("");
  const [amenaza, setAmenaza] = useState("");
  const [vulnerabilidad, setVulnerabilidad] = useState("");
  const [controles, setControles] = useState("");
  const [probabilidad, setProbabilidad] = useState(1);
  const [impacto, setImpacto] = useState(1);

  useEffect(() => {
    const fetchActivos = async () => {
      const activosSnapshot = await getDocs(collection(db, "activos"));
      const activosData = activosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivos(activosData);
    };
    fetchActivos();
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
    } catch (err) {
      alert("Error al guardar riesgo: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <h2>Identificación de Riesgos</h2>

      <select
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

      <input
        type="text"
        placeholder="Amenaza"
        value={amenaza}
        onChange={(e) => setAmenaza(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Vulnerabilidad"
        value={vulnerabilidad}
        onChange={(e) => setVulnerabilidad(e.target.value)}
        required
      />

      <textarea
        placeholder="Controles existentes"
        value={controles}
        onChange={(e) => setControles(e.target.value)}
        required
      />

      <label>
        Probabilidad (1-5)
        <input
          type="number"
          min={1}
          max={5}
          value={probabilidad}
          onChange={(e) => setProbabilidad(Number(e.target.value))}
        />
      </label>

      <label>
        Impacto (1-5)
        <input
          type="number"
          min={1}
          max={5}
          value={impacto}
          onChange={(e) => setImpacto(Number(e.target.value))}
        />
      </label>

      <p>
        <strong>Nivel de Riesgo:</strong> {calcularRiesgo()}
      </p>

      <button type="submit">Guardar riesgo</button>
    </form>
  );
}
