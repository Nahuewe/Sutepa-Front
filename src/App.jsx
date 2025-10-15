import { lazy, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './helpers/useAuthStore'
import Layout from './layout/Layout'
import { Seccionales, Users, Localidades, Agencias, Credencial } from './pages'
import Error from './pages/404'
import { Create, Afiliado, ShowAfiliado } from './pages/afiliados'
import Login from './pages/auth/Login'
import Loading from '@/components/Loading'
import 'react-toastify/dist/ReactToastify.css'
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
        <Route path='credencial' element={<Credencial />} />

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
