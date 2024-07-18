import React, { useEffect, useState, useRef } from 'react'
import Chart from 'react-apexcharts'
import useDarkMode from '@/hooks/useDarkMode'
import Card from '@/components/ui/Card'
import * as htmlToImage from 'html-to-image'

const DonutChart = ({ afiliadosSinPaginar, height = 350 }) => {
  const [isDark] = useDarkMode()
  const [chartType, setChartType] = useState('active')
  const [series, setSeries] = useState([0, 0, 0])
  const [totalAfiliados, setTotalAfiliados] = useState(0)
  const chartRef = useRef(null)

  useEffect(() => {
    if (afiliadosSinPaginar) {
      const activeCount = afiliadosSinPaginar.filter(a => a.estado === 'ACTIVO').length
      const inactiveCount = afiliadosSinPaginar.filter(a => a.estado === 'INACTIVO').length
      const pendingCount = afiliadosSinPaginar.filter(a => a.estado === 'PENDIENTE').length
      setSeries([activeCount, inactiveCount, pendingCount])
      const total = activeCount + inactiveCount + pendingCount
      setTotalAfiliados(total)
    }
  }, [afiliadosSinPaginar])

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
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'Inter',
      fontWeight: 400,
      show: false
    },
    plotOptions: {
      pie: {
        donut: {
          size: '40%',
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Inter',
              color: isDark ? '#cbd5e1' : '#aa7'
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'Inter',
              color: isDark ? '#ffffff' : '#000000',
              formatter (val) {
                return `${parseInt(val)}`
              }
            },
            total: {
              show: true,
              fontSize: '10px',
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
      <div className={`flex justify-end ${isDark ? 'dark' : ''}`}>
        <button className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} onClick={downloadChart}>Descargar</button>
      </div>
      <h4>Total de afiliados</h4>
      <p className='mt-2'>Cantidad: {totalAfiliados}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '8px', marginTop: '8px' }}>
        <button className={`btn ${chartType === 'active' ? 'btn-primary' : ''}`} style={{ backgroundColor: activeColor, padding: '8px' }} onClick={() => setChartType('active')}>Afiliados activos</button>
        <button className={`btn ${chartType === 'inactive' ? 'btn-danger' : ''}`} style={{ backgroundColor: inactiveColor, padding: '8px' }} onClick={() => setChartType('inactive')}>Afiliados dados de baja</button>
        <button className={`btn ${chartType === 'pending' ? 'btn-warning' : ''}`} style={{ backgroundColor: pendingColor, padding: '8px' }} onClick={() => setChartType('pending')}>Afiliados pendientes</button>
      </div>
      <div ref={chartRef}>
        <Chart options={options} series={series} type='pie' height={height} />
      </div>
    </Card>
  )
}

export default DonutChart
