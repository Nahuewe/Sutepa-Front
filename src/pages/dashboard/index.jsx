import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import EstadisticasDashboard from '@/components/partials/widget/chart/EstadisticasDashboard'
import RevenueBarChart from './RevenueBarChart'
import DonutChart from './DonutChart'
import { useAfiliadoStore } from '../../helpers'
import Loading from '@/components/Loading'
import { sutepaApi } from '@/api'

const Dashboard = () => {
  const { afiliados, startLoadingAfiliado } = useAfiliadoStore()
  const [isLoading, setIsLoading] = useState(true)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalSeccionales, setTotalSeccionales] = useState(0)

  const formatObject = (data) => {
    return data
  }

  const startSelectUsers = async () => {
    try {
      const response = await sutepaApi.get('/user')
      const { data } = response.data
      return formatObject(data)
    } catch (error) {
      console.log(error)
    }
  }

  const startSelectSeccionales = async () => {
    try {
      const response = await sutepaApi.get('/seccional')
      const { data } = response.data
      return formatObject(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await startSelectUsers()
      const seccionalesData = await startSelectSeccionales()

      setTotalUsers(usersData.length)
      setTotalSeccionales(seccionalesData.length)
      await startLoadingAfiliado()
      setIsLoading(false)
    }

    fetchData()
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
                <div className='flex items-center'>
                  <button className='bg-slate-300 dark:bg-slate-900 inline-block text-center px-6 py-2 rounded-lg'>
                    Exportar
                  </button>
                </div>
              </div>
            </Card>

            <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4'>
              <EstadisticasDashboard
                afiliados={afiliados}
                totalUsers={totalUsers}
                totalSeccionales={totalSeccionales}
              />
            </div>

            <div className='mt-4 grid sm:grid-cols-2 grid-cols-1 gap-4'>
              <DonutChart afiliados={afiliados} />
              <RevenueBarChart afiliados={afiliados} />
            </div>
          </div>
          )}
    </>
  )
}

export default Dashboard
