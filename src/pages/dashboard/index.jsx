import { useEffect, useState } from 'react'
import DonutChart from './DonutChart'
import EstadisticasDashboard from './EstadisticasDashboard'
import RevenueBarChart from './RevenueBarChart'
import Card from '@/components/ui/Card'
import { useAfiliadoStore, useSeccionalStore, useUserStore } from '@/helpers'

const Dashboard = () => {
  const { afiliadosSinPaginar, startGetAfiliadosSinPaginar } = useAfiliadoStore()
  const { seccionalesSinPaginar, startGetSeccionalesSinPaginar } = useSeccionalStore()
  const { usersSinPaginar, startGerUsersSinPaginar } = useUserStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      await Promise.all([
        startGetAfiliadosSinPaginar(),
        startGetSeccionalesSinPaginar(),
        startGerUsersSinPaginar()
      ])
      setIsLoading(false)
    }

    fetchData()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
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
          isLoading={isLoading}
        />
      </div>

      <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
        <DonutChart afiliadosSinPaginar={afiliadosSinPaginar} isLoading={isLoading} />
        <RevenueBarChart afiliadosSinPaginar={afiliadosSinPaginar} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default Dashboard
