import React, { useRef } from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import useRtl from "@/hooks/useRtl";
import Card from "@/components/ui/Card";
import * as htmlToImage from 'html-to-image';

const RevenueBarChart = ({ height = 400 }) => {
  const chartRef = useRef(null);
  const [isDark] = useDarkMode();
  const [isRtl] = useRtl();
  const series = [
    {
      name: "Masculino",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Femenino",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "No informa",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: "rounded",
        columnWidth: "45%",
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontFamily: "Inter",
      offsetY: -30,
      markers: {
        width: 8,
        height: 8,
        offsetY: -1,
        offsetX: -5,
        radius: 12,
      },
      labels: {
        colors: isDark ? "#CBD5E1" : "#475569",
      },
      itemMargin: {
        horizontal: 18,
        vertical: 0,
      },
    },
    title: {
      text: "Afiliados Activos Por Seccional",
      align: "left",

      offsetX: isRtl ? "0%" : 0,
      offsetY: 13,
      floating: false,
      style: {
        fontSize: "20px",
        fontWeight: "500",
        fontFamily: "Inter",
        color: isDark ? "#fff" : "#0f172a",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    yaxis: {
      opposite: isRtl ? true : false,
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
    },
    xaxis: {
      categories: [
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
      ],
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    colors: ["#4669FA", "#0CE7FA", "#FA916B"],
    grid: {
      show: true,
      borderColor: isDark ? "#334155" : "#E2E8F0",
      strokeDashArray: 10,
      position: "back",
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: "bottom",
            offsetY: 8,
            horizontalAlign: "center",
          },
          plotOptions: {
            bar: {
              columnWidth: "80%",
            },
          },
        },
      },
    ],
  };

  const downloadChart = () => {
    if (chartRef.current) {
      htmlToImage.toPng(chartRef.current)
        .then(function (dataUrl) {
          var link = document.createElement('a');
          link.download = 'AfiliadosActivos.png';
          link.href = dataUrl;
          link.click();
        });
    }
  };

  return (
    <Card>
      <div ref={chartRef}>
        <Chart options={options} series={series} type="bar" height={height} />
      </div>
      <button className="btn btn-dark" onClick={downloadChart}>Descargar</button>
    </Card>
  );
};

export default RevenueBarChart;
