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
    username: yup.string().nullable(),
    password: yup.string().nullable(),
    correo: yup.string().nullable(),
    telefono: yup.string().nullable(),
    roles_id: yup.string().notOneOf([''], 'Debe seleccionar un rol'),
    seccional_id: yup.string().notOneOf([''], 'Debe seleccionar una seccional')
  })
  .required()

const generateUsername = (nombre, apellido) => {
  if (!nombre || !apellido) return ''

  const firstLetterOfFirstName = nombre.trim().charAt(0).toLowerCase()
  const cleanedLastName = apellido.trim().toLowerCase().split(' ')[0] // Toma solo el primer apellido

  return `${firstLetterOfFirstName}${cleanedLastName}`
}

export const UserForm = ({ fnAction, activeUser = null }) => {
  const [roles, setRoles] = useState([])
  const [seccionales, setSeccionales] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { startSelectRoles, startSelectSeccionales } = useGetParameters()

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(activeUser ? FormValidationUpdate : FormValidationSaving)
  })

  const nombre = watch('nombre')
  const apellido = watch('apellido')

  useEffect(() => {
    // Generar y establecer el nombre de usuario automáticamente
    if (nombre && apellido) {
      const newUsername = generateUsername(nombre, apellido)
      setValue('username', newUsername)
    }
  }, [nombre, apellido, setValue])

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
        if (key === 'roles') setValue('roles_id', value.id)
        else setValue(key, value)
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadingInit()
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <Textinput
              name='nombre'
              label='Nombre'
              type='text'
              placeholder='Nombre'
              register={register}
              error={errors.nombre}
            />

            <Textinput
              name='apellido'
              label='Apellido'
              type='text'
              placeholder='Apellido'
              register={register}
              error={errors.apellido}
            />

            <Textinput
              name='username'
              label='Usuario'
              type='text'
              placeholder='Usuario'
              register={register}
              error={errors.username}
            />

            <Textinput
              name='password'
              label='Contraseña'
              type='password'
              placeholder='Contraseña'
              register={register}
              error={errors.password}
            />

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

            <Select
              name='roles_id'
              label='Roles'
              options={roles}
              register={register}
              error={errors.roles_id}
              placeholder='Seleccione un rol'
            />

            <Select
              name='seccional_id'
              label='Seccionales'
              options={seccionales}
              register={register}
              error={errors.seccional_id}
              placeholder='Seleccione una seccional'
            />

            <div className='ltr:text-right rtl:text-left'>
              <Button type='submit' text='Guardar' className='btn-dark' isLoading={isSubmitting} />
            </div>
          </form>
          )}
    </>
  )
}
