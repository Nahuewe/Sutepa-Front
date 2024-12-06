import React, { useEffect, useState, useRef } from 'react'
import Chart from 'react-apexcharts'
import useDarkMode from '@/hooks/useDarkMode'
import Card from '@/components/ui/Card'
import * as htmlToImage from 'html-to-image'

const DonutChart = ({ estadisticas, height = 350 }) => {
  const [isDark] = useDarkMode()
  const [chartType, setChartType] = useState('active')
  const [series, setSeries] = useState([0, 0, 0])
  const [totalAfiliados, setTotalAfiliados] = useState(0)
  const chartRef = useRef(null)

  useEffect(() => {
    if (estadisticas && estadisticas.length > 0) {
      const activeCount = estadisticas.filter(a => a.estado === 'ACTIVO').length
      const inactiveCount = estadisticas.filter(a => a.estado === 'INACTIVO').length
      const pendingCount = estadisticas.filter(a => a.estado === 'PENDIENTE').length
      setSeries([activeCount, inactiveCount, pendingCount])
      const total = activeCount + inactiveCount + pendingCount
      setTotalAfiliados(total)
    }
  }, [estadisticas])

  const activeColor = isDark ? '#747ffc' : '#0CE7FA'
  const inactiveColor = isDark ? '#FF7F7F' : '#f48f8f'
  const pendingColor = isDark ? '#cf8701' : '#FFD700'

  const options = {
    labels: ['Afiliados activos', 'Afiliados dados de baja', 'Afiliados pendientes'],
    dataLabels: {
      enabled: false
    },
    colors: [
      chartType === 'active' ? activeColor : colorOpacity(activeColor, 0.10),
      chartType === 'inactive' ? inactiveColor : colorOpacity(inactiveColor, 0.10),
      chartType === 'pending' ? pendingColor : colorOpacity(pendingColor, 0.10)
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
    animate: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  }

  function colorOpacity (color, opacity) {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
    return color + _opacity.toString(16).toUpperCase()
  }

  const downloadChart = () => {
    if (chartRef.current) {
      htmlToImage.toPng(chartRef.current)
        .then(function (dataUrl) {
          const link = document.createElement('a')
          link.download = 'AfiliadosTotales.png'
          link.href = dataUrl
          link.click()
        })
    }
  }

  return (
    <Card>
      <div ref={chartRef} className='p-4'>
        <div className={`flex justify-end ${isDark ? 'dark' : ''}`}>
          <button className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} onClick={downloadChart}>Descargar</button>
        </div>
        <h4 className='text-lg font-semibold'>{`Total de Alumnos: ${totalAfiliados}`}</h4>
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
        {/* <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '8px', marginTop: '8px' }}>
        <button className={`btn ${chartType === 'active' ? 'btn-primary' : ''}`} style={{ backgroundColor: activeColor, padding: '8px' }} onClick={() => setChartType('active')}>Afiliados activos</button>
        <button className={`btn ${chartType === 'inactive' ? 'btn-danger' : ''}`} style={{ backgroundColor: inactiveColor, padding: '8px' }} onClick={() => setChartType('inactive')}>Afiliados dados de baja</button>
        <button className={`btn ${chartType === 'pending' ? 'btn-warning' : ''}`} style={{ backgroundColor: pendingColor, padding: '8px' }} onClick={() => setChartType('pending')}>Afiliados pendientes</button>
        </div> */}
        <Chart options={options} series={series} type='pie' height={height} />
      </div>
    </Card>
  )
}

export default DonutChart
