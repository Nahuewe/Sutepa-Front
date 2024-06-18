import { useState, useEffect } from 'react'

export const SelectForm = ({ register, title, options = [], error = null, disabled = false, onChange }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular una llamada a la API o una espera para cargar opciones
    const fetchData = async () => {
      setIsLoading(true)
      // Simula el tiempo de espera de la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return (
    <div>
      {title && (
        <label htmlFor={`${title}`} className='form-label'>
          {title}
        </label>
      )}

      <select
        {...register}
        className={`form-control py-2 ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} ${disabled || isLoading ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' : 'bg-white dark:bg-gray-900 cursor-pointer'} dark:text-white dark:placeholder-white placeholder-black-900`}
        disabled={disabled || isLoading}
        onChange={onChange}
      >
        {isLoading
          ? (
            <option value=''>Cargando...</option>
            )
          : (
            <>
              <option value='' hidden>Seleccione una opción</option>
              {options.map(op => (
                <option key={op.id} value={op.id}>{op.nombre}</option>
              ))}
            </>
            )}
      </select>

      {error && <p className='mt-2 text-danger-500 block text-sm'>{error.message}</p>}
    </div>
  )
}
