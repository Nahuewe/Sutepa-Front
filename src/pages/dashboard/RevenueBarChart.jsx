import { useRef, useState, useEffect } from 'react'
import Chart from 'react-apexcharts'
import { getTipoDependencias } from '../../constant/datos-id'
import Card from '@/components/ui/Card'
import useDarkMode from '@/hooks/useDarkMode'
import useRtl from '@/hooks/useRtl'

const RevenueBarChart = ({ afiliadosSinPaginar, isLoading, height = 345 }) => {
  const chartRef = useRef(null)
  const [isDark] = useDarkMode()
  const [isRtl] = useRtl()
  const [series, setSeries] = useState([])
  const [totalData, setTotalData] = useState(0)
  const [activeSeries, setActiveSeries] = useState({})
  const [groupByDependencia, setGroupByDependencia] = useState(false)

  const generateColor = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
    let color = '#'
    for (let i = 0; i < 3; i++) color += ('00' + ((hash >> (i * 8)) & 0xFF).toString(16)).slice(-2)
    return color
  }

  const getBrightness = (hex) => {
    const rgb = parseInt(hex.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = rgb & 0xff
    return (r * 299 + g * 587 + b * 114) / 1000
  }

  const getTextColor = (backgroundColor) => getBrightness(backgroundColor) > 128 ? '#000000' : '#FFFFFF'

  useEffect(() => {
    if (afiliadosSinPaginar) {
      const seccionales = {}

      afiliadosSinPaginar.forEach(afiliado => {
        const seccional = afiliado.seccional || 'Seccional no Asignada'
        const estado = afiliado.estado || 'INACTIVO'

        if (afiliado.seccional_id === 22) {
          const dependencia = afiliado.dependencia_id
          const dependenciaNombre = getTipoDependencias(dependencia)
          if (!dependenciaNombre) return

          if (!seccionales[seccional]) seccionales[seccional] = { ACTIVO: 0, INACTIVO: 0, dependencias: {} }
          if (!seccionales[seccional].dependencias[dependenciaNombre]) seccionales[seccional].dependencias[dependenciaNombre] = { ACTIVO: 0, INACTIVO: 0 }
          seccionales[seccional].dependencias[dependenciaNombre][estado] += 1
        }

        if (!seccionales[seccional]) seccionales[seccional] = { ACTIVO: 0, INACTIVO: 0 }
        seccionales[seccional][estado] += 1
      })

      const totalAfiliados = afiliadosSinPaginar.length

      const seriesData = groupByDependencia
        ? Object.keys(seccionales).map(seccional => {
          const seccionalData = seccionales[seccional]
          const dependenciaData = seccionalData.dependencias
            ? Object.keys(seccionalData.dependencias).map(dependencia => ({
              name: dependencia,
              data: [
                { x: 'ACTIVO', y: seccionalData.dependencias[dependencia].ACTIVO },
                { x: 'INACTIVO', y: seccionalData.dependencias[dependencia].INACTIVO }
              ],
              color: generateColor(dependencia)
            }))
            : []
          return dependenciaData
        }).flat()
        : Object.keys(seccionales).map(seccional => {
          const seccionalData = seccionales[seccional]
          const dependenciaData = seccionalData.dependencias
            ? Object.keys(seccionalData.dependencias).map(dependencia => ({
              name: dependencia,
              data: [
                { x: 'ACTIVO', y: seccionalData.dependencias[dependencia].ACTIVO },
                { x: 'INACTIVO', y: seccionalData.dependencias[dependencia].INACTIVO }
              ],
              color: generateColor(dependencia)
            }))
            : []

          return [
            { name: seccional, data: [{ x: 'ACTIVO', y: seccionalData.ACTIVO }, { x: 'INACTIVO', y: seccionalData.INACTIVO }], color: generateColor(seccional) },
            ...dependenciaData
          ]
        }).flat()

      setSeries(seriesData)
      setTotalData(totalAfiliados)

      const initialActiveSeries = {}
      seriesData.forEach(serie => { initialActiveSeries[serie.name] = false })
      setActiveSeries(initialActiveSeries)
    }
  }, [afiliadosSinPaginar, groupByDependencia])

  const handleSeriesToggle = (serie) => {
    setActiveSeries(prev => ({ ...prev, [serie.name]: !prev[serie.name] }))
  }

  const handleToggleGroup = () => setGroupByDependencia(prev => !prev)

  const options = {
    chart: {
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '90%'
      }
    },
    title: {
      text: groupByDependencia ? 'Afiliados por Dependencia' : 'Afiliados por Seccional',
      align: 'left',
      offsetX: isRtl ? '0%' : 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: '20px',
        fontWeight: '500',
        fontFamily: 'Inter',
        color: isDark ? '#fff' : '#0f172a'
      }
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: [isDark ? '#fefefe' : '#fefefe']
      },
      formatter: function (val, opts) {
        return `${val}`
      },
      offsetX: 0,
      offsetY: 0
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    yaxis: {
      opposite: !!isRtl,
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter'
        }
      }
    },
    xaxis: {
      categories: ['ACTIVOS', 'INACTIVOS'],
      labels: {
        style: {
          colors: isDark ? '#CBD5E1' : '#475569',
          fontFamily: 'Inter'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' afiliados'
        }
      },
      theme: isDark ? 'dark' : 'light'
    },
    legend: {
      labels: {
        colors: isDark ? '#ffffff' : '#808080'
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10
      }
    },
    colors: series.map(serie => serie.color),
    grid: {
      show: true,
      borderColor: isDark ? '#334155' : '#E2E8F0',
      strokeDashArray: 10,
      position: 'back'
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          legend: {
            position: 'bottom',
            offsetY: 8,
            horizontalAlign: 'center'
          },
          plotOptions: {
            bar: {
              dataLabels: {
                position: 'center'
              }
            }
          }
        }
      }
    ]
  }
  const filteredSeries = series.filter(serie => activeSeries[serie.name])

  if (isLoading) {
    return (
      <div>
        <Card>
          <div className='animate-pulse flex flex-col items-center justify-center h-[345px]'>
            <div className='h-6 w-48 bg-slate-500 dark:bg-slate-600 mb-4 rounded' />
            <div className='h-64 w-full bg-slate-400 dark:bg-slate-700 rounded' />
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <div ref={chartRef}>
        <Chart options={options} series={filteredSeries} type='bar' height={height} />
        <div className={`btn ${isDark ? 'btn-dark' : 'btn-light'}`} style={{ textAlign: 'center' }}>
          Total de Afiliados: {totalData}
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {totalData > 0 && (
          <button onClick={handleToggleGroup} className='btn px-6 py-2 mx-2 my-2 rounded-lg transition duration-300 ease-in-out text-white bg-[#3a56c6] hover:bg-[#435190]'>
            {groupByDependencia ? 'Ver por Seccional' : 'Ver por Dependencia'}
          </button>
        )}

        {series
          .filter(serie => {
            const esDependencia = afiliadosSinPaginar.some(
              a => a.seccional_id === 22 && getTipoDependencias(a.dependencia_id) === serie.name
            )
            return groupByDependencia ? esDependencia : !esDependencia
          })
          .map(serie => {
            const serieColor = serie.color
            const textColor = getTextColor(serieColor)
            return (
              <button
                key={serie.name}
                className='btn px-6 py-2 mx-2 my-2 rounded-lg transition duration-300 ease-in-out'
                style={{
                  backgroundColor: activeSeries[serie.name] ? serieColor : '#E5E7EB',
                  color: activeSeries[serie.name] ? textColor : '#374151'
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = serieColor; e.target.style.color = '#fff' }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = activeSeries[serie.name] ? serieColor : '#E5E7EB'; e.target.style.color = activeSeries[serie.name] ? textColor : '#374151' }}
                onClick={() => handleSeriesToggle(serie)}
              >
                {serie.name}
              </button>
            )
          })}
      </div>
    </Card>
  )
}

export default RevenueBarChart
