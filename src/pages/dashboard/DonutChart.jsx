import { useEffect, useState, useRef } from 'react'
import Chart from 'react-apexcharts'
import Card from '@/components/ui/Card'
import useDarkMode from '@/hooks/useDarkMode'

const DonutChart = ({ afiliadosSinPaginar, isLoading, height = 350 }) => {
  const [isDark] = useDarkMode()
  const [chartType, setChartType] = useState('active')
  const [series, setSeries] = useState([0, 0, 0])
  const [totalAfiliados, setTotalAfiliados] = useState(0)
  const chartRef = useRef(null)

  useEffect(() => {
    if (afiliadosSinPaginar && !isLoading) {
      const activeCount = afiliadosSinPaginar.filter(a => a.estado === 'ACTIVO').length
      const inactiveCount = afiliadosSinPaginar.filter(a => a.estado === 'INACTIVO').length
      const pendingCount = afiliadosSinPaginar.filter(a => a.estado === 'PENDIENTE').length
      setSeries([activeCount, inactiveCount, pendingCount])
      setTotalAfiliados(activeCount + inactiveCount + pendingCount)
    }
  }, [afiliadosSinPaginar, isLoading])

  const activeColor = '#747ffc'
  const inactiveColor = '#FF7F7F'
  const pendingColor = '#f59f00'

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

  if (isLoading) {
    return (
      <div>
        <Card>
          <div className='animate-pulse flex flex-col items-center justify-center h-[350px]'>
            <div className='h-6 w-48 bg-slate-500 dark:bg-slate-600 mb-4 rounded' />
            <div className='h-64 w-full bg-slate-400 dark:bg-slate-700 rounded' />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <Card>
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
              className={`px-4 py-2 rounded-md transition ${chartType === 'pending' ? 'bg-yellow-400 text-white' : 'bg-gray-300 text-gray-800'}`}
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
