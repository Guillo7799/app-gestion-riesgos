import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText } from "lucide-react";

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
        t.activoNombre || "",
        t.riesgo || "",
        t.controlesPropuestos || "",
        t.responsable || "",
        t.riesgoResidual ?? "",
        t.fechaRegistro?.toDate().toLocaleDateString() || "",
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
        className="pdf-btn-red"
        title="Descargar PDF"
      >
        <span className="pdf-btn-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.828A2 2 0 0 0 19.414 8l-5.414-5.414A2 2 0 0 0 12.172 2H6zm6 1.414L18.586 10H13a1 1 0 0 1-1-1V3.414zM6 4h5v5a3 3 0 0 0 3 3h5v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4zm3 10v4h2v-1h-1v-1h1v-1h-1v-1h1v-1H9zm4 0v4h2v-1h-1v-1h1v-1h-1v-1h1v-1h-2z" />
          </svg>
          Generar PDF
        </span>
      </button>
    </div>
  );
}
