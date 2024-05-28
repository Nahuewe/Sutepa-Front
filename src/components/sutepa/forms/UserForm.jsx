import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Textinput from '@/components/ui/Textinput'
import * as yup from 'yup'
import { SelectForm } from './'
import { useSucursalStore } from '@/helpers'

const roles = [
  { id: 1, nombre: 'ADMINISTRADOR' },
  { id: 2, nombre: 'DIRECTOR DE SECCION' },
  { id: 3, nombre: 'SOLO LECTURA' },
  { id: 4, nombre: 'SUBSIDIOS' }
]

const FormValidationSchema = yup
  .object({
    password: yup.string().required('La contraseña es requerida'),
    nombre: yup.string().required('El nombre es requerido'),
    username: yup.string().required('El usuario es requerido'),
    seccional_id: yup.string().notOneOf([''], 'Debe seleccionar una opción'),
    role: yup.string().notOneOf([''], 'Debe seleccionar un rol')
  })
  .required()

const FormValidationSchemaUpdate = yup
  .object({
    password: yup.string(),
    nombre: yup.string().required('El nombre es requerido'),
    username: yup.string().required('El usuario es requerido'),
    seccional_id: yup.string().notOneOf([''], 'Debe seleccionar una opción'),
    role_id: yup.string().notOneOf([''], 'Debe seleccionar un rol')
  })
  .required()

export const UserForm = ({ activeUser = null, startFn }) => {
  const { sucursales, startLoadingSucursales } = useSucursalStore()

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      nombre: activeUser?.nombre || '',
      username: activeUser?.username || '',
      seccional_id: activeUser?.seccional_id || '',
      role_id: activeUser?.role_id || ''
    },
    resolver: activeUser ? yupResolver(FormValidationSchemaUpdate) : yupResolver(FormValidationSchema)
  })

  const onSubmit = (data) => {
    startFn(data)
    reset({ username: '', nombre: '', password: '', seccional_id: '', role_id: '' })
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'nombre' && value.nombre) {
        const parts = value.nombre.trim().split(' ')
        if (parts.length > 1) {
          const firstNameInitial = parts[0][0].toLowerCase()
          const lastName = parts.slice(1).join('').toLowerCase()
          const username = `${firstNameInitial}${lastName}`
          setValue('username', username)
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, setValue])

  useEffect(() => {
    startLoadingSucursales()
  }, [])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Textinput
          label='Nombre'
          register={register('nombre')}
          error={errors.nombre}
          placeholder='Nombre'
        />

        <Textinput
          label='Usuario'
          register={register('username')}
          error={errors.username}
          placeholder='Usuario'
        />

        <SelectForm
          register={register('seccional_id')}
          title='Sucursal'
          error={errors.seccional_id}
          options={sucursales}
        />

        <Textinput
          name='password'
          label='Contraseña'
          type='password'
          register={register}
          error={errors.password}
          placeholder='Contraseña'
        />

        <SelectForm
          register={register('role_id')}
          title='Rol'
          error={errors.role_id}
          options={roles}
        />

        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-dark items-center text-center py-2 px-6 rounded-lg'>Guardar</button>
        </div>
      </form>
    </div>
  )
}
