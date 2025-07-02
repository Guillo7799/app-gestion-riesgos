import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "../styles/TratamientoRiesgos.css";
import Swal from "sweetalert2";

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

      //alert("Tratamiento guardado correctamente");
      Swal.fire({
        title: "Éxito",
        text: "Tratamiento guardado correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });
      setRiesgoId("");
      setEstrategia("");
      setControlesPropuestos("");
      setResponsable("");
    } catch (err) {
      //alert("Error al guardar tratamiento: " + err.message);
      Swal.fire({
        title: "Error",
        text: "Error al guardar tratamiento: " + err.message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tratamiento-form">
      <h2>Tratamiento del Riesgo</h2>
      <div className="form-group">
        <label htmlFor="riesgo-select">Riesgo</label>
        <select
          id="riesgo-select"
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
      </div>
      <div className="form-group">
        <label htmlFor="estrategia">Estrategia</label>
        <select
          id="estrategia"
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
      </div>
      <div className="form-group">
        <label htmlFor="controlesPropuestos">Controles propuestos</label>
        <textarea
          id="controlesPropuestos"
          placeholder="Controles propuestos (puedes usar controles ISO 27002)"
          value={controlesPropuestos}
          onChange={(e) => setControlesPropuestos(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="responsable">Responsable</label>
        <input
          id="responsable"
          type="text"
          placeholder="Responsable"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          required
        />
      </div>
      <h4>Evaluación de Riesgo Residual</h4>
      <div className="form-group-inline">
        <div>
          <label htmlFor="resProbabilidad">Probabilidad residual (1-5)</label>
          <input
            id="resProbabilidad"
            type="number"
            min={1}
            max={5}
            value={resProbabilidad}
            onChange={(e) => setResProbabilidad(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="resImpacto">Impacto residual (1-5)</label>
          <input
            id="resImpacto"
            type="number"
            min={1}
            max={5}
            value={resImpacto}
            onChange={(e) => setResImpacto(Number(e.target.value))}
            required
          />
        </div>
      </div>
      <div className="nivel-riesgo">
        <strong>Nivel de riesgo residual:</strong>{" "}
        {resProbabilidad * resImpacto}
      </div>
      <button type="submit">Guardar tratamiento</button>
    </form>
  );
}
