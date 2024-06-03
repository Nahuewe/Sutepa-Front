import React, { useMemo } from 'react'
import Icon from '@/components/ui/Icon'

const EstadisticasDashboard = ({ ingresos }) => {
  const countIngresosPorEstado = (data) => {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data:', data)
      return {}
    }
    const totals = {
      1: 0, // totales
      2: 0, // activos
      3: 0, // dados de baja
      4: 0 // promedio
    }

    data.forEach((item) => {
      const estadoId = item.estado // item.estado.id
      if (Object.prototype.hasOwnProperty.call(totals, estadoId)) {
        totals[estadoId]++
      }
    })

    return totals
  }

  const totalsByEstado = useMemo(() => countIngresosPorEstado(ingresos), [
    ingresos
  ])

  function exportarNombresEstados () {
    return {
      1: 'totales',
      2: 'activos',
      3: 'dados de baja',
      4: 'promedio'
    }
  }

  const nombresEstados = exportarNombresEstados()
  const statistics = []

  statistics.push(
    {
      title: `Afiliados ${nombresEstados[1]}`,
      count: totalsByEstado[1] || 0,
      bg: 'bg-info-500',
      text: 'text-info-500',
      icon: 'heroicons-solid:users'
    },
    {
      title: `Afiliados ${nombresEstados[2]}`,
      count: totalsByEstado[2] || 0,
      bg: 'bg-success-500',
      text: 'text-success-500',
      icon: 'heroicons-solid:check'
    },
    {
      title: `Afiliados ${nombresEstados[3]}`,
      count: totalsByEstado[3] || 0,
      bg: 'bg-red-500',
      text: 'text-red-500',
      icon: 'heroicons-solid:x-mark'
    },
    {
      title: `Edad ${nombresEstados[4]}`,
      count: totalsByEstado[4] || 0,
      bg: 'bg-warning-500',
      text: 'text-warning-500',
      icon: 'heroicons-outline:clock'
    }
  )

  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center`}
        >
          <div
            className={`${item.text} mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4 `}
          >
            <Icon icon={item.icon} />
          </div>
          <span className='block text-sm text-slate-600 font-medium dark:text-white mb-1'>
            {item.title}
          </span>
          <span className='block mb- text-2xl text-slate-900 dark:text-white font-medium'>
            {item.count}
          </span>
        </div>
      ))}
    </>
  )
}

export default EstadisticasDashboard
