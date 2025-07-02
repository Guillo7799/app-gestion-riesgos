import { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc } from "firebase/firestore";

export default function ValoracionActivos() {
  const [activo, setActivo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [conf, setConf] = useState(1);
  const [inte, setInte] = useState(1);
  const [disp, setDisp] = useState(1);

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

      <select
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

      <input
        type="number"
        min={1}
        max={5}
        placeholder="Confidencialidad (1-5)"
        value={conf}
        onChange={(e) => setConf(Number(e.target.value))}
        required
      />
      <input
        type="number"
        min={1}
        max={5}
        placeholder="Integridad (1-5)"
        value={inte}
        onChange={(e) => setInte(Number(e.target.value))}
        required
      />
      <input
        type="number"
        min={1}
        max={5}
        placeholder="Disponibilidad (1-5)"
        value={disp}
        onChange={(e) => setDisp(Number(e.target.value))}
        required
      />

      <button type="submit">Guardar activo</button>
    </form>
  );
}
