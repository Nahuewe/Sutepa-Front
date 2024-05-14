import React from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import useRtl from "@/hooks/useRtl";

const PuntoGiroNorteChart = () =>{
  const [isDark] = useDarkMode();
  const [isRtl] = useRtl();
  const series = [
    {
      name: "Punto Giro Norte",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
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
        "Plástico",
        "Neumáticos",
        "Aceite vegetal usado",
        "Metal",
        "Tela",
        "Eléctricos o Electrónicos",
        "Chatarra",
        "Tapitas",
        "Vidrio",
      ],
      labels: {
        style: {
          colors: isDark ? "#CBD5E1" : "#475569",
          fontFamily: "Inter",
        },
      },
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: true,
      },
    },

    fill: {
      opacity: 1,
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

  return (
    <div style={{ width: '70%', height: '100%' }}>
      <Chart options={options} series={series} type="bar" />
    </div>
  );
};

export default PuntoGiroNorteChart;
