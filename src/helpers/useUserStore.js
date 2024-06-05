import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleUser, onAddNewUser, onUpdateUser } from '@/store/user'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { sutepaApi } from '../api'

export const useUserStore = () => {
  const { users, paginate, activeUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const startLoadingUsers = async (page) => {
    try {
      const response = await sutepaApi.get(`/usuarios?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleUser({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingUser = async (form) => {
    try {
      const response = await sutepaApi.post('/usuarios', form)
      // const { data } = response.data
      // dispatch(onAddNewUser(data))
      startLoadingUsers()
      dispatch(handleShowModal())

      toast.success('Usuario agregado con exito')
    } catch (error) {
      toast.error('No se pudo agregar los datos')
    }
  }

  const startUpdateUser = async (form) => {
    try {
      const id = activeUser.id
      const response = await sutepaApi.put(`/usuarios/${id}`, form)
      const { data } = response.data
      dispatch(onUpdateUser(data))
      dispatch(handleShowEdit())

      toast.success('Usuario actualizado con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  const startDeleteUser = async () => {
    try {
      const id = activeUser.id
      await sutepaApi.delete(`/usuarios/${id}`)
      startLoadingUsers()

      toast.success('Usuario desactivado con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operacion')
    }
  }

  const startSearchUser = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/usuarios/buscar/${search}?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleUser({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  return {
    //* Propiedades
    users,
    paginate,
    activeUser,

    //* Metodos
    startLoadingUsers,
    startSavingUser,
    startDeleteUser,
    startUpdateUser,
    startSearchUser
  }
}
