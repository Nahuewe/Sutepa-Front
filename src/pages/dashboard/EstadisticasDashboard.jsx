import { useMemo } from 'react'
import Icon from '@/components/ui/Icon'

const EstadisticasDashboard = ({
  afiliadosSinPaginar,
  usersSinPaginar,
  seccionalesSinPaginar,
  isLoading
}) => {
  const countAfiliadosPorEstado = (data) => {
    if (!Array.isArray(data)) {
      return {
        totales: 0,
        activos: 0,
        inactivos: 0
      }
    }

    return {
      totales: data.length,
      activos: data.filter(a => a.estado === 'ACTIVO').length,
      inactivos: data.filter(a => a.estado === 'INACTIVO').length
    }
  }

  const totalsByEstado = useMemo(
    () => countAfiliadosPorEstado(afiliadosSinPaginar || []),
    [afiliadosSinPaginar]
  )

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
      count: usersSinPaginar?.length || 0,
      bg: 'bg-success-500',
      text: 'text-success-500',
      icon: 'heroicons-solid:users'
    },
    {
      title: 'Total de Seccionales',
      count: seccionalesSinPaginar?.length || 0,
      bg: 'bg-warning-500',
      text: 'text-warning-500',
      icon: 'heroicons-solid:office-building'
    }
  ]

  if (isLoading) {
    return (
      <>
        {Array(3).fill(0).map((_, i) => (
          <div
            key={i}
            className='animate-pulse rounded-md p-4 bg-slate-200 dark:bg-slate-700 text-center'
          >
            <div className='mx-auto h-10 w-10 rounded-full bg-slate-500 dark:bg-slate-600 mb-4' />
            <div className='h-4 bg-slate-500 dark:bg-slate-600 rounded w-1/2 mx-auto mb-2' />
            <div className='h-6 bg-slate-500 dark:bg-slate-600 rounded w-1/3 mx-auto' />
          </div>
        ))}
      </>
    )
  }

  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} rounded-md p-4 bg-opacity-[0.15] dark:bg-opacity-50 text-center transition-all duration-300`}
        >
          <div
            className={`${item.text} mx-auto h-10 w-10 flex flex-col items-center justify-center rounded-full bg-white text-2xl mb-4`}
          >
            <Icon icon={item.icon} />
          </div>
          <span className='block text-sm text-slate-600 font-medium dark:text-white mb-1'>
            {item.title}
          </span>
          <span className='block text-2xl text-slate-900 dark:text-white font-medium'>
            {item.count}
          </span>
        </div>
      ))}
    </>
  )
}

export default EstadisticasDashboard
