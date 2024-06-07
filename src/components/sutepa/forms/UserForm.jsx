import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import { useGetParameters } from '@/helpers'

const FormValidationSaving = yup
  .object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    username: yup.string().required('El usuario es requerido'),
    password: yup.string().required('La contraseña es requerida'),
    correo: yup.string().nullable(),
    telefono: yup.string().nullable(),
    roles_id: yup.string().notOneOf([''], 'Debe seleccionar un rol'),
    seccional_id: yup.string().notOneOf([''], 'Debe seleccionar una seccional')
  })
  .required()

const FormValidationUpdate = yup
  .object({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    username: yup.string().required('El usuario es requerido'),
    correo: yup.string().nullable(),
    telefono: yup.string().nullable(),
    roles_id: yup.string().notOneOf([''], 'Debe seleccionar un rol'),
    seccional_id: yup.string().notOneOf([''], 'Debe seleccionar una seccional')
  })
  .required()

export const UserForm = ({ fnAction, activeUser = null }) => {
  const [roles, setRoles] = useState([])
  const [seccionales, setSeccionales] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const { startSelectRoles, startSelectSeccionales } = useGetParameters()

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(activeUser ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    await fnAction(data)
  }

  async function loadingInit () {
    const rolesData = await startSelectRoles()
    setRoles(rolesData)

    const seccionalesData = await startSelectSeccionales()
    setSeccionales(seccionalesData)

    if (activeUser) {
      Object.entries(activeUser).forEach(([key, value]) => {
        setValue(key, value)
      })

      setValue('roles_id', activeUser.rol)
      setValue('seccional_id', activeUser.seccional)
      setValue('username', activeUser.user)
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadingInit()
  }, [])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
            <div>
              <label htmlFor='nombre' className='form-label space-y-2'>
                Nombre
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='nombre'
                  type='text'
                  placeholder='Nombre'
                  register={register}
                  error={errors.nombre}
                />
              </label>
            </div>

            <div>
              <label htmlFor='apellido' className='form-label space-y-2'>
                Apellido
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='apellido'
                  type='text'
                  placeholder='Apellido'
                  register={register}
                  error={errors.apellido}
                />
              </label>
            </div>

            <div>
              <label htmlFor='username' className='form-label space-y-2'>
                Usuario
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='username'
                  type='text'
                  placeholder='Usuario'
                  register={register}
                  error={errors.username}
                />
              </label>
            </div>

            <div className='relative'>
              <label htmlFor='password' className='form-label space-y-2'>
                Contraseña
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Contraseña'
                  register={register}
                  error={errors.password}
                />
                <button
                  type='button'
                  className='absolute top-1/2 right-4 mb-1'
                  onClick={togglePasswordVisibility}
                >
                  {showPassword
                    ? (
                      <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                        <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
                        <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6' />
                      </svg>
                      )
                    : (
                      <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye-closed dark:stroke-white' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                        <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                        <path d='M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4' />
                        <path d='M3 15l2.5 -3.8' />
                        <path d='M21 14.976l-2.492 -3.776' />
                        <path d='M9 17l.5 -4' />
                        <path d='M15 17l-.5 -4' />
                      </svg>
                      )}
                </button>
              </label>
            </div>

            <Textinput
              name='correo'
              label='Correo'
              type='email'
              placeholder='Correo'
              register={register}
              error={errors.correo}
            />

            <Textinput
              name='telefono'
              label='Telefono'
              placeholder='Telefono'
              register={register}
              error={errors.telefono}
            />

            <div>
              <label htmlFor='roles_id' className='form-label space-y-2'>
                Roles
                <strong className='obligatorio'>(*)</strong>
                <Select
                  name='roles_id'
                  options={roles}
                  register={register}
                  error={errors.roles_id}
                  placeholder='Seleccione un rol'
                />
              </label>
            </div>

            <div>
              <label htmlFor='seccional_id' className='form-label space-y-2'>
                Seccionales
                <strong className='obligatorio'>(*)</strong>
                <Select
                  name='seccional_id'
                  options={seccionales}
                  register={register}
                  error={errors.seccional_id}
                  placeholder='Seleccione una seccional'
                />
              </label>
            </div>

            <div className='ltr:text-right rtl:text-left'>
              <Button type='submit' text='Guardar' className='btn-dark' isLoading={isSubmitting} />
            </div>
          </form>
          )}
    </>
  )
}
