/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { handleUser } from '@/store/user'
import { handleShowEdit, handleShowModal } from '@/store/layout'
import { sutepaApi } from '../api'

export const useUserStore = () => {
  const { users, paginate, activeUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const startLoadingUsers = async (page) => {
    try {
      const response = await sutepaApi.get(`/user?page=${page}`)
      const { data, meta } = response.data
      dispatch(handleUser({ data, meta }))
    } catch (error) {
      console.log(error)
    }
  }

  const startSavingUser = async (form) => {
    try {
      const response = await sutepaApi.post('/registrar', form)
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
      const response = await sutepaApi.put(`/user/${id}`, form)
      const { data } = response.data
      startLoadingUsers()
      dispatch(handleShowEdit())

      toast.success('Usuario actualizado con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  const startDeleteUser = async () => {
    try {
      const id = activeUser.id
      await sutepaApi.delete(`/user/${id}`)
      startLoadingUsers()

      const message = activeUser.estado === 'ACTIVO' ? 'Usuario dado de baja con éxito' : 'Usuario reactivado con éxito'
      toast.success(message)
    } catch (error) {
      toast.error('No se pudo realizar la operación')
    }
  }

  const startSearchUser = async (search, page = 1) => {
    try {
      const response = await sutepaApi.get(`/user/buscar/${search}?page=${page}`)
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
