import React from 'react'
import LogoSutepa from '@/assets/images/logo/logo-sutepa.png'

const Loading = () => {
  return (
    <div className='flex flex-col items-center justify-center app_height'>
      <img
        src={LogoSutepa}
        alt='Logo Sutepa'
        className='h-16 w-56 mb-4 animate-bounce opacity-75'
      />

      <span className='inline-block mt-1 font-medium text-sm'>Cargando...</span>
    </div>
  )
}

export default Loading
