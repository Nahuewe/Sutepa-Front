const HistorialCambios = ({ cambios }) => {
  if (cambios.length === 0) {
    return null
  }

  return (
    <div className='overflow-x-auto mt-4'>
      <table className='table-auto w-full'>
        <thead className='bg-gray-300 dark:bg-gray-700'>
          <tr>
            <th className='px-4 py-2 text-center dark:text-white'>F. Cambio</th>
            <th className='px-4 py-2 text-center dark:text-white'>Cambios</th>
            <th className='px-4 py-2 text-center dark:text-white'>Usuario</th>
          </tr>
        </thead>
        <tbody className='divide-y dark:divide-gray-700'>
          {cambios.map((cambio, index) => (
            <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
              <td className='px-4 py-2 text-center dark:text-white'>{cambio.fecha_cambio}</td>
              <td className='px-4 py-2 text-center dark:text-white'>{cambio.estado}</td>
              <td className='px-4 py-2 text-center dark:text-white'>{cambio.usuario}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default HistorialCambios
