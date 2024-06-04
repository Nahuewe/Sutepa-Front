import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Textinput from '@/components/ui/Textinput'
import * as yup from 'yup'
import { SelectForm } from './'
import { sutepaApi } from '../../../api'

const roles = [
  { id: 1, nombre: 'ADMINISTRADOR' },
  { id: 2, nombre: 'DIRECTOR DE SECCION' },
  { id: 3, nombre: 'SOLO LECTURA' },
  { id: 4, nombre: 'SUBSIDIOS' }
]

const FormValidationSchema = yup
  .object({
    // nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    // username: yup.string().required('El username es requerido'),
    password: yup.string().required('La contraseña es requerida'),
    seccional_id: yup.string().notOneOf([''], 'Debe seleccionar una seccional'),
    roles_id: yup.string().notOneOf([''], 'Debe seleccionar un rol')
  })
  .required()

const FormValidationSchemaUpdate = yup
  .object({
    password: yup.string(),
    // nombre: yup.string().required('El nombre es requerido'),
    // username: yup.string().required('El usuario es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    seccional_id: yup.string().notOneOf([''], 'Debe seleccionar una seccional'),
    roles_id: yup.string().notOneOf([''], 'Debe seleccionar un rol')
  })
  .required()

export const UserForm = ({ activeUser = null, startFn }) => {
  const [seccional, setSeccional] = useState([])

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues: {
      nombre: activeUser?.nombre || '',
      apellido: activeUser?.apellido || '',
      username: activeUser?.username || '',
      seccional_id: activeUser?.seccional_id || '',
      role_id: activeUser?.role_id || ''
    },
    resolver: activeUser ? yupResolver(FormValidationSchemaUpdate) : yupResolver(FormValidationSchema)
  })

  const onSubmit = (data) => {
    startFn(data)
    reset({ username: '', nombre: '', apellido: '', password: '', seccional_id: '', roles_id: '' })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seccionalResponse] = await Promise.all([
          sutepaApi.get('seccional')
        ])
        setSeccional(seccionalResponse.data.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Textinput
          label='Nombre'
          type='text'
          register={register('nombre')}
          error={errors.nombre}
          placeholder='Nombre'
        />

        <Textinput
          label='Apellido'
          register={register('apellido')}
          type='text'
          error={errors.apellido}
          placeholder='Apellido'
        />

        <Textinput
          label='Usuario'
          register={register('username')}
          type='text'
          error={errors.username}
          placeholder='Usuario'
        />

        <Textinput
          name='password'
          label='Contraseña'
          type='password'
          register={register}
          error={errors.password}
          placeholder='Contraseña'
        />

        <Textinput
          name='correo'
          label='Correo Electronico'
          type='email'
          register={register}
          error={errors.correo}
          placeholder='Correo Electronico'
        />

        <Textinput
          name='telefono'
          label='Telefono'
          register={register}
          error={errors.telefono}
          placeholder='Telefono'
        />

        <SelectForm
          register={register('seccional_id')}
          title='Seccional'
          error={errors.seccional_id}
          options={seccional}
        />

        <SelectForm
          register={register('roles_id')}
          title='Rol'
          error={errors.roles_id}
          options={roles}
        />

        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-dark items-center text-center py-2 px-6 rounded-lg'>Guardar</button>
        </div>
      </form>
    </div>
  )
}
