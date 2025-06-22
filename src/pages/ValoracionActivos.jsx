import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function ValoracionActivos() {
  const [activo, setActivo] = useState("");
  const [conf, setConf] = useState(0);
  const [inte, setInte] = useState(0);
  const [disp, setDisp] = useState(0);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "activos"), {
        nombre: activo,
        confidencialidad: conf,
        integridad: inte,
        disponibilidad: disp,
      });
      alert("Activo guardado");
      setActivo("");
      setConf(0);
      setInte(0);
      setDisp(0);
    } catch (e) {
      alert("Error al guardar: " + e.message);
    }
  };

  return (
    <form onSubmit={handleSave}>
      <h2>Registro de Activos</h2>
      <input
        placeholder="Nombre del activo"
        value={activo}
        onChange={(e) => setActivo(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Confidencialidad (1-5)"
        value={conf}
        onChange={(e) => setConf(Number(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Integridad (1-5)"
        value={inte}
        onChange={(e) => setInte(Number(e.target.value))}
        required
      />
      <input
        type="number"
        placeholder="Disponibilidad (1-5)"
        value={disp}
        onChange={(e) => setDisp(Number(e.target.value))}
        required
      />
      <button type="submit">Guardar</button>
    </form>
  );
}
