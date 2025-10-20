import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
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
  const { user } = useSelector((state) => state.auth)

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

  if (user?.roles_id !== 1) {
    return (
      <div className='flex flex-col items-center justify-center h-[70vh] text-center'>
        <h1 className='text-3xl font-semibold text-red-600 mb-4'>Acceso Denegado</h1>
        <p className='text-gray-700 dark:text-gray-300'>
          No tienes permisos para ver esta sección.
        </p>
      </div>
    )
  }

  return (
    <div>
      <Card title='SUTEPA'>
        <div className='flex justify-between'>
          <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
        </div>
      </Card>

      <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4'>
        <EstadisticasDashboard afiliadosSinPaginar={afiliadosSinPaginar} usersSinPaginar={usersSinPaginar} seccionalesSinPaginar={seccionalesSinPaginar} isLoading={isLoading} />
      </div>

      <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
        <DonutChart afiliadosSinPaginar={afiliadosSinPaginar} isLoading={isLoading} />
        <RevenueBarChart afiliadosSinPaginar={afiliadosSinPaginar} isLoading={isLoading} />
      </div>
    </div>
  )
}

export default Dashboard
