import React, { useEffect } from 'react'
import { useAfiliadoStore, useSeccionalStore, useUserStore } from '@/helpers'
import Card from '@/components/ui/Card'
import EstadisticasDashboard from './EstadisticasDashboard'
import RevenueBarChart from './RevenueBarChart'
import DonutChart from './DonutChart'

const Dashboard = () => {
  const { afiliadosSinPaginar, startGetAfiliadosSinPaginar } = useAfiliadoStore()
  const { seccionalesSinPaginar, startGetSeccionalesSinPaginar } = useSeccionalStore()
  const { usersSinPaginar, startGerUsersSinPaginar } = useUserStore()

  useEffect(() => {
    const fetchData = async () => {
      await startGetAfiliadosSinPaginar()
      await startGetSeccionalesSinPaginar()
      await startGerUsersSinPaginar()
    }

    fetchData()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
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
    </>
  )
}

export default Dashboard
