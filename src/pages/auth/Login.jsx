import React from 'react'
import LoginForm from '@/components/sutepa/auth/login-form'
import { ToastContainer } from 'react-toastify'
import Illustration from '@/assets/images/auth/portada-sutepa.jpg'
import LogoSutepa from '@/assets/images/logo/logo.png'
import iconosSutepa from '@/assets/images/auth/iconos.png'

const Login = () => {
  return (
    <>
      <ToastContainer />
      <div className='loginwrapper'>
        <div className='lg-inner-column'>
          <div className='left-column relative z-[1]'>
            <div className='h-full w-full pointer-events-none'>
              <img
                src={Illustration}
                alt='Imagen de SUTEPA'
                className='h-full w-full'
              />
            </div>
          </div>
          <div className='right-column relative'>
            <div className='inner-content h-full flex flex-col bg-[#00273D] dark:bg-slate-800'>
              <img src={iconosSutepa} alt='Iconos SUTEPA' className='hidden md:inline-block md:w-96 pb-6 mx-auto pt-6 pointer-events-none' />
              <div className='auth-box h-full flex flex-col justify-center'>
                <div className='text-center 2xl:mb-10 mb-4'>
                  <img src={LogoSutepa} alt='Logo SUTEPA' className='w-36 md:w-52 pb-6 inline-block mx-auto pointer-events-none' />
                  <h4 className='font-medium text-white'>Iniciar Sesión</h4>
                  <div className='text-slate-500 text-base'>
                    Completa los datos para ingresar al sistema
                  </div>
                </div>
                <LoginForm />
              </div>
              <div className='auth-footer text-center'>
                Copyright &copy; <span>{(new Date().getFullYear())}</span>
                <a target='_blank' rel='noreferrer' className='animate--text dark:animate--text--dark' href='https://linktr.ee/Nahuel_Soria_Parodi'> → Nahuel Soria Parodi - Todos los derechos reservados ← </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
