import React, { useMemo } from 'react'
import Icon from '@/components/ui/Icon'

const EstadisticasDashboard = ({ afiliadosSinPaginar, usersSinPaginar, seccionalesSinPaginar }) => {
  const countAfiliadosPorEstado = (data) => {
    if (!Array.isArray(data)) {
      return {
        totales: 0,
        activos: 0,
        inactivos: 0
      }
    }

    const totals = {
      totales: data.length,
      activos: data.filter(a => a.estado === 'ACTIVO').length,
      inactivos: data.filter(a => a.estado === 'INACTIVO').length
    }

    return totals
  }

  const totalsByEstado = useMemo(() => countAfiliadosPorEstado(afiliadosSinPaginar || []), [afiliadosSinPaginar])

  const statistics = [
    {
      title: 'Afiliados Totales',
      count: totalsByEstado.totales || 0,
      bg: 'bg-info-500',
      text: 'text-info-500',
      icon: 'heroicons-solid:user-group'
    },
    {
      title: 'Total de Usuarios',
      count: usersSinPaginar.length || 0,
      bg: 'bg-success-500',
      text: 'text-success-500',
      icon: 'heroicons-solid:users'
    },
    {
      title: 'Total de Seccionales',
      count: seccionalesSinPaginar.length || 0,
      bg: 'bg-warning-500',
      text: 'text-warning-500',
      icon: 'heroicons-solid:office-building'
    }
  ]

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
