import { useEffect, useState } from 'react'
import LogoSutepa from '@/assets/images/logo/logo-sutepa.webp'

const LoadingData = ({ progress = 0 }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  useEffect(() => {
    const diff = progress - animatedProgress
    if (diff === 0) return

    const step = diff / 10
    const interval = setInterval(() => {
      setAnimatedProgress((prev) => {
        const next = prev + step
        if ((step > 0 && next >= progress) || (step < 0 && next <= progress)) {
          clearInterval(interval)
          return progress
        }
        return next
      })
    }, 50)

    return () => clearInterval(interval)
  }, [progress])

  return (
    <div
      className='flex flex-col items-center justify-center app_height transition-opacity duration-300'
      role='status'
      aria-label='Cargando datos, por favor espere'
    >
      <img
        src={LogoSutepa}
        alt='Logo Sutepa'
        className='h-16 w-56 mb-4 animate-custom-bounce opacity-75'
      />

      <span className='inline-block mt-1 font-medium text-sm text-gray-600 dark:text-gray-400'>
        Cargando datos, por favor espere...
      </span>

      <div className='w-64 bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-4 overflow-hidden'>
        <div
          className='bg-blue-500 h-3 transition-all duration-300 ease-in-out'
          style={{ width: `${animatedProgress}%` }}
        />
      </div>

      <span className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
        {Math.floor(animatedProgress)}%
      </span>
    </div>
  )
}

export default LoadingData
