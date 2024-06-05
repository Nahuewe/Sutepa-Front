import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/helpers'
import Textinput from '@/components/ui/Textinput'

const schema = yup
  .object({
    username: yup.string().required('El usuario es requerido'),
    password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe contener al menos 6 caracteres')
  })
  .required()

function LoginForm () {
  const [showPassword, setShowPassword] = useState(false)
  const { startLogin } = useAuthStore()
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register
  } = useForm({
    resolver: yupResolver(schema)
  })
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await startLogin(data)
      navigate('/')
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative space-y-5'>
      <Textinput
        name='username'
        label='usuario'
        autoComplete='username'
        className='h-[48px]'
        style={{ color: 'gray', border: 'none' }}
        placeholder='Usuario'
        register={register}
        onChange={(e) => {
          setValue('username', e.target.value)
        }}
        helperText={errors?.username && errors?.username?.message}
        color={errors?.username && 'failure'}
      />
      <Textinput
        name='password'
        label='Contraseña'
        type={showPassword ? 'text' : 'password'}
        autoComplete='current-password'
        style={{ color: 'gray', border: 'none' }}
        className='h-[48px]'
        placeholder='Contraseña'
        register={register}
        onChange={(e) => {
          setValue('password', e.target.value)
        }}
        helperText={errors?.password && errors?.password?.message}
        color={errors?.password && 'failure'}
      />

      <button
        type='button'
        className='absolute top-1/2 right-3'
        title='Mostrar Contraseña'
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

      <button className='btn btn-dark block w-full text-center mt-4'>Iniciar Sesión</button>
    </form>
  )
}

export default LoginForm
