// src/pages/Inicio.jsx
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import ReportePDF from "../components/ReportePDF";
import Footer from "../components/Footer";
import "../styles/Inicio.css";
import Swal from "sweetalert2";

const COLORS = ["#0088FE", "#FFBB28", "#FF4444", "#00C49F"];

// Página de inicio del dashboard: muestra gráficos y acceso a reporte PDF
const Inicio = () => {
  // Estados para los datos de los gráficos
  const [riesgosData, setRiesgosData] = useState([]); // Distribución de riesgos
  const [estrategiasData, setEstrategiasData] = useState([]); // Estrategias de tratamiento

  // Estado para la evolución temporal de riesgos (ejemplo)
  const [riesgosTimeline, setRiesgosTimeline] = useState([
    { fecha: "Jun", riesgos: 5 },
    { fecha: "Jul", riesgos: 9 },
    { fecha: "Ago", riesgos: 7 },
    { fecha: "Sep", riesgos: 11 },
  ]);

  // Obtiene los datos de riesgos y estrategias desde Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "riesgos"));
        const niveles = { Bajo: 0, Medio: 0, Alto: 0 };
        // Clasifica los riesgos por nivel
        snap.docs.forEach((doc) => {
          const r = doc.data();
          const valor = Number(r.nivelRiesgo);
          if (valor <= 6) niveles.Bajo++;
          else if (valor <= 15) niveles.Medio++;
          else niveles.Alto++;
        });
        setRiesgosData(
          Object.entries(niveles).map(([name, value]) => ({ name, value }))
        );
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos de riesgos",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    const fetchEstrategias = async () => {
      try {
        const snap = await getDocs(collection(db, "tratamientos"));
        const estrategias = {
          mitigar: 0,
          aceptar: 0,
          transferir: 0,
          evitar: 0,
        };
        // Clasifica los tratamientos por estrategia
        snap.docs.forEach((doc) => {
          const tipo = doc.data().estrategia?.toLowerCase();
          if (estrategias[tipo] !== undefined) estrategias[tipo]++;
        });
        setEstrategiasData(
          Object.entries(estrategias).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
          }))
        );
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los datos de estrategias",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

    fetchData();
    fetchEstrategias();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header y botón de PDF */}
      <div className="dashboard-header-flex-rel">
        <h1 className="dashboard-title">Monitoreo y Supervisión</h1>
        <div className="pdf-btn-abs">
          <ReportePDF />
        </div>
      </div>

      {/* Gráficos de riesgos y estrategias */}
      <div className="charts-row">
        <div className="chart-box">
          <h2>Distribución de Niveles de Riesgo</h2>
          <PieChart width={350} height={300}>
            <Pie
              data={riesgosData}
              cx={175}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              dataKey="value"
            >
              {riesgosData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="chart-box">
          <h2>Estrategias de Tratamiento</h2>
          <PieChart width={350} height={300}>
            <Pie
              data={estrategiasData}
              cx={175}
              cy={150}
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={100}
              dataKey="value"
            >
              {estrategiasData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Gráficos adicionales: resumen y evolución */}
      <div className="charts-row">
        <div className="chart-box">
          <h2>Resumen General</h2>
          <BarChart
            width={350}
            height={300}
            data={[...riesgosData, ...estrategiasData]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        <div className="chart-box">
          <h2>Evolución de Riesgos</h2>
          <LineChart width={350} height={300} data={riesgosTimeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="riesgos" stroke="#00C49F" />
          </LineChart>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Inicio;
