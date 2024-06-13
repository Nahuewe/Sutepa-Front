import React, { useMemo } from 'react'
import Icon from '@/components/ui/Icon'

const EstadisticasAfiliados = ({ afiliados }) => {
  const countAfiliadosPorEstado = (data) => {
    return {
      activos: data.filter(a => a.estado === 'ACTIVO').length,
      inactivos: data.filter(a => a.estado === 'INACTIVO').length,
      pendiente: data.filter(a => a.estado === 'PENDIENTE').length
    }
  }

  const totalsByEstado = useMemo(() => countAfiliadosPorEstado(afiliados), [afiliados])

  const statistics = [
    {
      title: 'Afiliados Activos',
      count: totalsByEstado.activos || 0,
      bg: 'bg-success-500',
      text: 'text-success-500',
      icon: 'heroicons-solid:user-group'
    },
    {
      title: 'Afiliados Inactivos',
      count: totalsByEstado.inactivos || 0,
      bg: 'bg-danger-500',
      text: 'text-danger-500',
      icon: 'heroicons-solid:user-remove'
    },
    {
      title: 'Afiliados Pendientes',
      count: totalsByEstado.pendiente || 0,
      bg: 'bg-warning-500',
      text: 'text-warning-500',
      icon: 'heroicons-solid:clock'
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

export default EstadisticasAfiliados
