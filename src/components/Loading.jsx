import React from 'react'
import LogoSutepa from '@/assets/images/logo/logo-sutepa.png'

const Loading = () => {
  return (
    <div
      className='flex flex-col items-center justify-center app_height'
      role='status'
      aria-label='Cargando contenido, por favor espere'
    >
      <img
        src={LogoSutepa}
        alt='Logo Sutepa'
        className='h-16 w-56 mb-4 animate-custom-bounce opacity-75'
      />
      <span className='inline-block mt-1 font-medium text-sm text-gray-600'>
        Cargando...
      </span>
      <div className='mt-2 flex space-x-2'>
        <div className='h-2 w-2 rounded-full bg-blue-500 animate-pulse' />
        <div className='h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-150' />
        <div className='h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-300' />
      </div>
    </div>
  )
}

export default Loading

// import React from 'react'
// import LogoSutepa from '@/assets/images/logo/logo-sutepa.png'

// const Loading = () => {
//   return (
//     <div className='flex flex-col items-center justify-center app_height'>
//       <img
//         src={LogoSutepa}
//         alt='Logo Sutepa'
//         className='h-16 w-56 mb-4 animate-bounce opacity-75'
//       />

//       <span className='inline-block mt-1 font-medium text-sm'>Cargando...</span>
//     </div>
//   )
// }

// export default Loading
