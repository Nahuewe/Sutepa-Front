import React, { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './helpers/useAuthStore'
import { Seccionales, Users, Localidades, Agencias } from './pages'
import { Create, Afiliado, ShowAfiliado } from './pages/afiliados'
import Layout from './layout/Layout'
import Login from './pages/auth/Login'
import Error from './pages/404'
import Loading from '@/components/Loading'
const Dashboard = lazy(() => import('./pages/dashboard'))

function App () {
  const { status, checkAuthToken } = useAuthStore()

  useEffect(() => {
    checkAuthToken()
  }, [])

  if (status === 'checking') {
    return (
      <Loading />
    )
  }

  return (
    <main className='App relative'>
      <Routes>
        {
          (status === 'not-authenticated')
            ? (
              <>
                {/* Login */}
                <Route path='/login' element={<Login />} />
                <Route path='/*' element={<Navigate to='/login' />} />
              </>
              )
            : (
              <>
                <Route path='/' element={<Navigate to='/afiliados' />} />

                <Route path='/*' element={<Layout />}>
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='*' element={<Navigate to='/404' />} />

                  {/* Nuevas Rutas */}
                  <Route path='usuarios' element={<Users />} />
                  <Route path='seccionales' element={<Seccionales />} />
                  <Route path='localidades' element={<Localidades />} />
                  <Route path='agencias' element={<Agencias />} />

                  {/* Afiliados */}
                  <Route path='afiliados' element={<Afiliado />} />
                  <Route path='afiliados/crear' element={<Create />} />
                  <Route path='afiliados/editar/:id' element={<Create />} />
                  <Route path='afiliados/ver/:id' element={<ShowAfiliado />} />
                </Route>

                <Route path='/404' element={<Error />} />
              </>
              )
        }
      </Routes>
    </main>
  )
}

export default App
