import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'

const schema = yup.object({
  newPassword: yup.string().required('La nueva contraseña es requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('newPassword'), null], 'Las contraseñas no coinciden')
    .required('Debe confirmar la nueva contraseña')
}).required()

const ChangePasswordForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
      <div className='relative'>
        <label htmlFor='newPassword' className='form-label '>
          Nueva Contraseña
          <strong className='obligatorio'>(*)</strong>
          <Textinput
            name='newPassword'
            type={showPassword ? 'text' : 'password'}
            placeholder='Nueva Contraseña'
            register={register}
            error={errors.newPassword}
          />
        </label>
      </div>

      <div className='relative'>
        <label htmlFor='confirmPassword' className='form-label'>
          Confirmar Nueva Contraseña
          <strong className='obligatorio'>(*)</strong>
          <Textinput
            name='confirmPassword'
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirmar Nueva Contraseña'
            register={register}
            error={errors.confirmPassword}
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

      <div className='ltr:text-right rtl:text-left'>
        <Button type='submit' text='Guardar' className='btn-dark' isLoading={isSubmitting} />
      </div>
    </form>
  )
}

export default ChangePasswordForm
