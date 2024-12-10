import React, { useEffect, useState, useRef } from 'react'
import Chart from 'react-apexcharts'
import useDarkMode from '@/hooks/useDarkMode'
import Card from '@/components/ui/Card'
// import * as htmlToImage from 'html-to-image'

const DonutChart = ({ estadisticas, height = 350 }) => {
  const [isDark] = useDarkMode()
  const [chartType, setChartType] = useState('active')
  const [series, setSeries] = useState([0, 0])
  const [totalAfiliados, setTotalAfiliados] = useState(0)
  const chartRef = useRef(null)

  useEffect(() => {
    if (estadisticas) {
      const activeCount = estadisticas.filter(a => a.estado === 'ACTIVO').length
      const inactiveCount = estadisticas.filter(a => a.estado === 'INACTIVO').length
      const pendingCount = estadisticas.filter(a => a.estado === 'PENDIENTE').length
      setSeries([activeCount, inactiveCount, pendingCount])
      setTotalAfiliados(activeCount + inactiveCount + pendingCount)
    }
  }, [estadisticas])

  const activeColor = '#747ffc'
  const inactiveColor = '#FF7F7F'
  const pendingColor = '#cf8701'

  const options = {
    labels: ['Activos', 'Inactivos', 'Pendientes'],
    dataLabels: { enabled: false },
    colors: [
      chartType === 'active' ? activeColor : colorOpacity(activeColor, 0.5),
      chartType === 'inactive' ? inactiveColor : colorOpacity(inactiveColor, 0.5),
      chartType === 'pending' ? pendingColor : colorOpacity(pendingColor, 0.5)
    ],
    legend: { position: 'bottom', fontSize: '12px', show: false },
    plotOptions: {
      pie: {
        donut: {
          size: '40%',
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 'bold',
              color: isDark ? '#ffffff' : '#000000',
              formatter (val) { return `${parseInt(val)}` }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontWeight: 'bold',
              color: isDark ? '#cbd5e1' : '#475569'
            }
          }
        }
      }
    },
    animate: { enabled: true, easing: 'easeinout', speed: 800 }
  }

  function colorOpacity (color, opacity) {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
    return color + _opacity.toString(16).toUpperCase()
  }

  // const downloadChart = () => {
  //   if (chartRef.current) {
  //     htmlToImage.toPng(chartRef.current).then(function (dataUrl) {
  //       const link = document.createElement('a')
  //       link.download = 'afiliadosTotales.png'
  //       link.href = dataUrl
  //       link.click()
  //     })
  //   }
  // }

  return (
    <div className='p-y4'>
      <Card>
        {/* <div className={`flex justify-end ${isDark ? 'dark' : ''}`}>
          <button className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} onClick={downloadChart}>Descargar</button>
        </div> */}
        <div ref={chartRef}>
          <h4 className='text-lg font-semibold'>{`Afiliados Totales: ${totalAfiliados}`}</h4>
          <div className='flex justify-center mt-4 mb-4 space-x-4'>
            <button
              className={`px-4 py-2 rounded-md transition ${chartType === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'}`}
              onClick={() => setChartType('active')}
            >
              Afiliados activos
            </button>
            <button
              className={`px-4 py-2 rounded-md transition ${chartType === 'inactive' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-800'}`}
              onClick={() => setChartType('inactive')}
            >
              Afiliados dados de baja
            </button>
            <button
              className={`px-4 py-2 rounded-md transition ${chartType === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-800'}`}
              onClick={() => setChartType('pending')}
            >
              Afiliados pendientes
            </button>
          </div>
          <div>
            <Chart options={options} series={series} type='donut' height={height} />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DonutChart
