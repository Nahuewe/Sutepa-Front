import React, { useEffect, useState } from 'react'
import { useAfiliadoStore, useSeccionalStore, useUserStore } from '@/helpers'
import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'
import EstadisticasDashboard from './EstadisticasDashboard'
import RevenueBarChart from './RevenueBarChart'
import DonutChart from './DonutChart'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { afiliadosSinPaginar, startGetAfiliadosSinPaginar } = useAfiliadoStore()
  const { seccionalesSinPaginar, startGetSeccionalesSinPaginar } = useSeccionalStore()
  const { usersSinPaginar, startGerUsersSinPaginar } = useUserStore()

  useEffect(() => {
    const fetchData = async () => {
      await startGetAfiliadosSinPaginar()
      await startGetSeccionalesSinPaginar()
      await startGerUsersSinPaginar()
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
                afiliadosSinPaginar={afiliadosSinPaginar}
                usersSinPaginar={usersSinPaginar}
                seccionalesSinPaginar={seccionalesSinPaginar}
              />
            </div>

            <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
              <DonutChart afiliadosSinPaginar={afiliadosSinPaginar} />
              <RevenueBarChart afiliadosSinPaginar={afiliadosSinPaginar} />
            </div>
          </div>
          )}
    </>
  )
}

export default Dashboard
