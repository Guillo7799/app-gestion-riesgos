import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function TratamientoRiesgos() {
  const [riesgos, setRiesgos] = useState([]);
  const [riesgoId, setRiesgoId] = useState("");
  const [estrategia, setEstrategia] = useState("");
  const [controlesPropuestos, setControlesPropuestos] = useState("");
  const [responsable, setResponsable] = useState("");
  const [resProbabilidad, setResProbabilidad] = useState(1);
  const [resImpacto, setResImpacto] = useState(1);

  useEffect(() => {
    const fetchRiesgos = async () => {
      const snapshot = await getDocs(collection(db, "riesgos"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRiesgos(data);
    };
    fetchRiesgos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const riesgo = riesgos.find((r) => r.id === riesgoId);
    if (!riesgo) return alert("Selecciona un riesgo");

    try {
      await addDoc(collection(db, "tratamientos"), {
        riesgoId,
        riesgo: riesgo.amenaza,
        activoNombre: riesgo.activoNombre,
        estrategia,
        controlesPropuestos,
        responsable,
        fechaRegistro: new Date(),
        riesgoResidual: resProbabilidad * resImpacto,
        resProbabilidad,
        resImpacto,
      });

      alert("Tratamiento guardado correctamente");
      setRiesgoId("");
      setEstrategia("");
      setControlesPropuestos("");
      setResponsable("");
    } catch (err) {
      alert("Error al guardar tratamiento: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Tratamiento del Riesgo</h2>

      <select
        value={riesgoId}
        onChange={(e) => setRiesgoId(e.target.value)}
        required
      >
        <option value="">-- Selecciona un riesgo --</option>
        {riesgos.map((r) => (
          <option key={r.id} value={r.id}>
            {r.activoNombre} - {r.amenaza}
          </option>
        ))}
      </select>

      <select
        value={estrategia}
        onChange={(e) => setEstrategia(e.target.value)}
        required
      >
        <option value="">-- Selecciona estrategia --</option>
        <option value="Mitigar">Mitigar</option>
        <option value="Transferir">Transferir</option>
        <option value="Aceptar">Aceptar</option>
        <option value="Evitar">Evitar</option>
      </select>

      <textarea
        placeholder="Controles propuestos (puedes usar controles ISO 27002)"
        value={controlesPropuestos}
        onChange={(e) => setControlesPropuestos(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Responsable"
        value={responsable}
        onChange={(e) => setResponsable(e.target.value)}
        required
      />

      <h4>Evaluación de Riesgo Residual</h4>
      <label>
        Probabilidad residual (1-5)
        <input
          type="number"
          min={1}
          max={5}
          value={resProbabilidad}
          onChange={(e) => setResProbabilidad(Number(e.target.value))}
          required
        />
      </label>

      <label>
        Impacto residual (1-5)
        <input
          type="number"
          min={1}
          max={5}
          value={resImpacto}
          onChange={(e) => setResImpacto(Number(e.target.value))}
          required
        />
      </label>

      <p>
        <strong>Nivel de riesgo residual:</strong>{" "}
        {resProbabilidad * resImpacto}
      </p>

      <button type="submit">Guardar tratamiento</button>
    </form>
  );
}
