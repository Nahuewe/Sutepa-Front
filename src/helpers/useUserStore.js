import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { handleUser, onAddNewUser, onDeleteUser, onUpdateUser } from '../store/user'
import { toast } from 'react-toastify'
import { hadleShowModal } from '../store/layout'

export const useUserStore = () => {
  const { users, activeUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const startLoadingUsers = async () => {
    try {
      const { data } = await sutepaApi.get('/auth')
      dispatch(handleUser(data.usuarios))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingUser = async ({ nombre, username, password, sucursalId }) => {
    try {
      const { data } = await sutepaApi.post('/auth/new', { nombre, username, password, sucursalId })
      dispatch(onAddNewUser(data.usuario))

      toast.success('Usuario agregado con exito')
    } catch (error) {
      toast.error('No se pudo agregar los datos')
    }
  }

  const startDeleteUser = async () => {
    try {
      const id = activeUser.id
      const { data } = await sutepaApi.delete(`/auth/delete/${id}`)
      dispatch(onDeleteUser(data.usuario))

      toast.success('Usuario desactivado con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operacion')
    }
  }

  const startUpdateUser = async ({ nombre, username, password, sucursalId }) => {
    try {
      const id = activeUser.id
      const { data } = await sutepaApi.put(`/auth/update/${id}`, { nombre, username, password, sucursalId })
      dispatch(onUpdateUser(data.usuario))
      dispatch(hadleShowModal(false))

      toast.success('Usuario actualizado con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  return {
    //* Propiedades
    users,
    activeUser,

    //* Metodos
    startLoadingUsers,
    startSavingUser,
    startDeleteUser,
    startUpdateUser
  }
}
