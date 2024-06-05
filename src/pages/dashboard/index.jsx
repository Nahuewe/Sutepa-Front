/* eslint-disable no-template-curly-in-string */
import Card from '@/components/ui/Card'
import EstadisticasDashboard from '@/components/partials/widget/chart/EstadisticasDashboard'
import RevenueBarChart from './RevenueBarChart'
import DonutChart from './DonutChart'
import { useEffect } from 'react'
import { useAfiliadoStore } from '../../helpers'

const Dashboard = () => {
  const { afiliados, startLoadingAfiliado } = useAfiliadoStore()

  useEffect(() => {
    startLoadingAfiliado()
  }, [])

  return (
    <div>
      <Card title='SUTEPA'>
        <div className='flex justify-between'>
          <p className='text-lg mx-0 my-auto hidden md:flex'>Dashboard</p>
          <div className='flex items-center'>
            <button className='bg-slate-300 dark:bg-slate-900 inline-block text-center px-6 py-2 rounded-lg'>
              Exportar
            </button>
          </div>
        </div>
      </Card>

      <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-4'>
        <EstadisticasDashboard afiliados={afiliados} />
      </div>

      <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
        <DonutChart />
        <RevenueBarChart />
      </div>
    </div>
  )
}

export default Dashboard
