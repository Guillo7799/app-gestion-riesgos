import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportePDF() {
  const [tratamientos, setTratamientos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "tratamientos"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTratamientos(data);
    };
    fetchData();
  }, []);

  const generarPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Reporte de Tratamientos de Riesgo", 20, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Activo",
          "Riesgo",
          "Controles",
          "Responsable",
          "R. Residual",
          "Fecha",
        ],
      ],
      body: tratamientos.map((t) => [
        t.activo || "",
        t.riesgo || "",
        t.controles || "",
        t.responsable || "",
        t.riesgoResidual ?? "",
        t.fecha?.toDate().toLocaleDateString() || "",
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [100, 108, 255],
        textColor: [255, 255, 255],
      },
    });

    doc.save("reporte_tratamientos.pdf");
  };

  return (
    <div className="text-center my-8">
      <button
        onClick={generarPDF}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-xl shadow transition"
      >
        Generar Reporte
      </button>
    </div>
  );
}
