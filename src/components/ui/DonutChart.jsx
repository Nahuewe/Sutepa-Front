import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import Card from "@/components/ui/Card";

const DonutChart = ({ height = 350 }) => {
  const [isDark] = useDarkMode();
  const [chartType, setChartType] = useState("active");

  function colorOpacity(color, opacity) {
    var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  useEffect(() => {
    setChartType("neutral");
  }, []);

  // Define los colores para los afiliados activos y dados de baja
  let activeColor = isDark ? "#747ffc" : "#0CE7FA";
  let inactiveColor = isDark ? "#FF7F7F" : "#f48f8f";

  const series = chartType === "active" ? [70, 30] : [30, 70]; // Cambia la serie basado en el tipo de gráfico seleccionado

  const options = {
    labels: ["Afiliados activos", "Afiliados dados de baja"],
    dataLabels: {
      enabled: false,
    },
    colors: [
      chartType === "active" ? activeColor : colorOpacity(activeColor, 0.10),
      chartType === "inactive" ? inactiveColor : colorOpacity(inactiveColor, 0.10),
    ],
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontFamily: "Inter",
      fontWeight: 400,
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "40%",
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Inter",
              color: isDark ? "#cbd5e1" : "#aa7",
            },
            value: {
              show: true,
              fontSize: "16px",
              fontFamily: "Inter",
              color: isDark ? "#ffffff" : "#000000",
              formatter(val) {
                return `${parseInt(val)}%`;
              },
            },
            total: {
              show: true,
              fontSize: "10px",
              color: isDark ? "#cbd5e1" : "#475569",
            },
          },
        },
      },
    },
  };

  return (
    <Card>
      <h4>Total de afiliados</h4>
      <p className="mt-2">Cantidad:</p>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", marginTop: "8px" }}>
        <button className={`btn btn-${chartType === "active" ? "primary" : "primary"}`} onClick={() => setChartType("active")}>Afiliados activos</button>
        <button className={`btn btn-${chartType === "inactive" ? "danger" : "danger"}`} onClick={() => setChartType("inactive")}>Afiliados dados de baja</button>
      </div>
      <Chart options={options} series={series} type="pie" height={height} />
    </Card>
  );
};

export default DonutChart;
