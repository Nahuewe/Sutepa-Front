import React, { useEffect, useState } from 'react'
import { useAfiliadoStore } from '@/helpers'
import { sutepaApi } from '@/api'
import Card from '@/components/ui/Card'
import Loading from '@/components/Loading'
import EstadisticasDashboard from './EstadisticasDashboard'
import RevenueBarChart from './RevenueBarChart'
import DonutChart from './DonutChart'

const Dashboard = () => {
  const { afiliadosSinPaginar, startLoadingAfiliado, startGetAfiliadosSinPaginar } = useAfiliadoStore()
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
      await startGetAfiliadosSinPaginar()
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
              </div>
            </Card>

            <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-4'>
              <EstadisticasDashboard
                afiliadosSinPaginar={afiliadosSinPaginar}
                totalUsers={totalUsers}
                totalSeccionales={totalSeccionales}
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
