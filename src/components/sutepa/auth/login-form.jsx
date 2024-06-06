import Textinput from '@/components/ui/Textinput'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuthStore } from '@/helpers'

const schema = yup
  .object({
    username: yup.string().required('El usuario es requerido'),
    password: yup.string().required('La contraseña es requerida').min(6, 'La contraseña debe contener al menos 6 caracteres')
  })
  .required()

const LoginForm = () => {
  const { startLogin } = useAuthStore()

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all'
  })

  const onSubmit = (data) => {
    startLogin(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 '>
      <Textinput
        name='username'
        label='usuario'
        type='text'
        register={register}
        error={errors.username}
        className='h-[48px]'
        placeholder='Usuario'
        onChange={(e) => {
          setValue('username', e.target.value)
        }}
      />
      <Textinput
        name='password'
        label='Contraseña'
        type='password'
        register={register}
        error={errors.password}
        className='h-[48px]'
        placeholder='Contraseña'
        onChange={(e) => {
          setValue('password', e.target.value)
        }}
      />

      <button className='btn btn-dark block w-full text-center'>Iniciar Sesión</button>
    </form>
  )
}

export default LoginForm
