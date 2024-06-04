/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { handleUser, onAddNewUser, onDeleteUser, onUpdateUser } from '../store/user'
import { toast } from 'react-toastify'
import { hadleShowModal } from '../store/layout'

export const useUserStore = () => {
  const { users, activeUser } = useSelector(state => state.user)
  const dispatch = useDispatch()

  // const startLoadingUsers = async () => {
  //   try {
  //     const { data } = await sutepaApi.get('/')
  //     dispatch(handleUser(data.usuarios))registrar
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const startSavingUser = async ({ nombre, apellido, username, password, seccional_id, roles_id, telefono, correo }) => {
    try {
      const { data } = await sutepaApi.post('/registrar', { nombre, apellido, username, password, seccional_id, roles_id, telefono, correo })
      dispatch(onAddNewUser(data.usuario))

      toast.success('Usuario agregado con exito')
    } catch (error) {
      toast.error('No se pudo agregar los datos')
    }
  }

  const startUpdateUser = async ({ nombre, apellido, username, password, seccional_id, roles_id, telefono, correo }) => {
    try {
      const id = activeUser.id
      const { data } = await sutepaApi.put(`/registrar/update/${id}`, { nombre, apellido, username, password, seccional_id, roles_id, telefono, correo })
      dispatch(onUpdateUser(data.usuario))
      dispatch(hadleShowModal(false))

      toast.success('Usuario actualizado con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  const startDeleteUser = async () => {
    try {
      const id = activeUser.id
      const { data } = await sutepaApi.delete(`/registrar/delete/${id}`)
      dispatch(onDeleteUser(data.usuario))

      toast.success('Usuario desactivado con exito')
    } catch (error) {
      toast.error('No se pudo realizar la operacion')
    }
  }

  return {
    //* Propiedades
    users,
    activeUser,

    //* Metodos
    startSavingUser,
    startDeleteUser,
    startUpdateUser
  }
}
