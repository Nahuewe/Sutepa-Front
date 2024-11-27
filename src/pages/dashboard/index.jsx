import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'
import EstadisticasDashboard from './EstadisticasDashboard'
import RevenueBarChart from './RevenueBarChart'
import DonutChart from './DonutChart'
import useEstadisticasData from '../../helpers/useEstadisticasData'

const Dashboard = () => {
  const { userAll, seccionalAll, estadisticas } = useEstadisticasData()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userAll.length && seccionalAll.length && estadisticas.length) {
      setIsLoading(false)
    }
  }, [userAll, seccionalAll, estadisticas])

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <Card title='SUTEPA'>
              <div className='flex justify-between'>
                <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
              </div>
            </Card>

            <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4'>
              <EstadisticasDashboard
                estadisticas={estadisticas}
                userAll={userAll}
                seccionalAll={seccionalAll}
              />
            </div>

            <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
              <DonutChart estadisticas={estadisticas} />
              <RevenueBarChart estadisticas={estadisticas} />
            </div>
          </div>
          )}
    </>
  )
}

export default Dashboard
