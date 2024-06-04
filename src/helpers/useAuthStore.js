import { useSelector, useDispatch } from 'react-redux'
import { handleLogin, handleLogout, onChecking } from '../store/auth'
import { sutepaApi } from '../api'
import { toast } from 'react-toastify'

export const useAuthStore = () => {
  const { status, user, errorMessage } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const startLogin = async ({ username, password }) => {
    dispatch(onChecking())
    const message = 'Credenciales incorrectas.'

    try {
      const { data } = await sutepaApi.post('/login', { username, password })

      if (data.ok) {
        localStorage.setItem('token', data.token)
        dispatch(handleLogin({ nombre: data.nombre, apellido: data.apellido, seccional: data.seccional }))
      } else {
        dispatch(handleLogout(message))

        toast.error(message)
      }
    } catch (error) {
      dispatch(handleLogout(message))

      toast.error(message)
    }
  }

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token')
    if (!token) return dispatch(handleLogout())

    try {
      const { data } = await sutepaApi.get('/login/renew')

      localStorage.setItem('token', data.token)
      dispatch(handleLogin({ nombre: data.nombre, apellido: data.apellido, seccional: data.seccional }))
    } catch (error) {
      localStorage.clear()
      dispatch(handleLogout())
    }
  }

  const startLogout = () => {
    localStorage.clear()
    dispatch(handleLogout())
  }

  return {
    //* Propiedades
    status,
    user,
    errorMessage,

    //* Metodos
    startLogin,
    checkAuthToken,
    startLogout
  }
}
