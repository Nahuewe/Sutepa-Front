/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import EditModal from '@/components/ui/EditModal'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { useDispatch } from 'react-redux'
import { handleShowDelete, handleShowEdit } from '@/store/layout'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import Tooltip from '@/components/ui/Tooltip'
import { useLocalidadStore } from '@/helpers'
import { setActiveLocalidad } from '../store/localidad'
import { LocalidadForm } from '../components/sutepa/forms/'
import { TextInput } from 'flowbite-react'

const columns = [
  {
    label: 'Provincia',
    field: 'provincia'
  },
  {
    label: 'Localidad',
    field: 'localidad'
  },
  {
    label: 'Acciones',
    field: 'acciones'
  }
]

export const Localidades = () => {
  const { localidades, provincias, paginate, activeLocalidad, startLoadingLocalidad, startSavingLocalidad, startDeleteLocalidad, startUpdateLocalidad, startSearchLocalidad } = useLocalidadStore()
  const dispatch = useDispatch()
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const onEdit = (id) => {
    dispatch(setActiveLocalidad(id))
    dispatch(handleShowEdit())
  }

  const onDelete = (id) => {
    dispatch(setActiveLocalidad(id))
    dispatch(handleShowDelete())
  }

  const onSearch = async ({ target: { value } }) => {
    setSearch(value)
    if (value.length === 0) {
      await loadingLocalidad()
    }
    if (value.length <= 1) return
    await startSearchLocalidad(value)
  }

  const loadingLocalidad = async (page = 1) => {
    if (!isLoading) setIsLoading(true)
    await startLoadingLocalidad(page)
    setIsLoading(false)
  }

  useEffect(() => {
    loadingLocalidad()
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <>
            <Card>
              <div className='mb-4 md:flex md:justify-between'>
                <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>
                  Listado de Localidades
                </h1>
                <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                  <div className='flex gap-2'>
                    <div className='relative'>
                      <TextInput
                        name='search'
                        placeholder='Buscar'
                        onChange={onSearch}
                        value={search}
                      />
                      <div className='absolute top-3 right-2'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='icon icon-tabler icon-tabler-search dark:stroke-white'
                          width='16'
                          height='16'
                          viewBox='0 0 24 24'
                          strokeWidth='1.5'
                          stroke='#000000'
                          fill='none'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                          <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                          <path d='M21 21l-6 -6' />
                        </svg>
                      </div>
                    </div>
                    <Modal
                      title='Agregar localidad'
                      label='Agregar'
                      labelClass='bg-red-600 hover:bg-red-800 text-white items-center text-center py-2 px-6 rounded-lg'
                      centered
                    >
                      <LocalidadForm fnAction={startSavingLocalidad} provincias={provincias} />
                    </Modal>
                    <EditModal
                      title='Editar localidad'
                      centered
                    >
                      <LocalidadForm
                        fnAction={startUpdateLocalidad}
                        provincias={provincias}
                        activeLocalidad={activeLocalidad}
                      />
                    </EditModal>
                    <DeleteModal
                      themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                      centered
                      title='Eliminar localidad'
                      message='¿Estás seguro?'
                      labelBtn='Aceptar'
                      btnFunction={startDeleteLocalidad}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card noborder>
              <div className='overflow-x-auto -mx-6'>
                <div className='inline-block min-w-full align-middle'>
                  <div className='overflow-hidden'>
                    <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                      <thead className='bg-slate-200 dark:bg-slate-700'>
                        <tr>
                          {columns.map((column, i) => (
                            <th key={i} scope='col' className='table-th'>
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                        {
                            (localidades.length > 0)
                              ? (localidades.map((localidad) => (
                                <tr key={localidad.id}>
                                  <td className='table-td'>{localidad.provincia || 'Desconocida'}</td>
                                  <td className='table-td'>{localidad.nombre}</td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <Tooltip content='Editar' placement='top' arrow animation='shift-away'>
                                      <button
                                        className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700'
                                        onClick={() => onEdit(localidad.id)}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          className='icon icon-tabler icon-tabler-pencil'
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          strokeWidth='2'
                                          stroke='currentColor'
                                          fill='none'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        >
                                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                          <path d='M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4' />
                                          <path d='M13.5 6.5l4 4' />
                                        </svg>
                                      </button>
                                    </Tooltip>
                                    <Tooltip content='Eliminar' placement='top' arrow animation='shift-away'>
                                      <button
                                        className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-700'
                                        onClick={() => onDelete(localidad.id)}
                                      >
                                        <svg
                                          xmlns='http://www.w3.org/2000/svg'
                                          className='icon icon-tabler icon-tabler-trash'
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          strokeWidth='1.5'
                                          stroke='currentColor'
                                          fill='none'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        >
                                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                          <path d='M4 7l16 0' />
                                          <path d='M10 11l0 6' />
                                          <path d='M14 11l0 6' />
                                          <path d='M5 7l1 12.5a1 1 0 0 0 1 0.5h10a1 1 0 0 0 1 -0.5l1 -12.5' />
                                          <path d='M9 7l0 -3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1l0 3' />
                                        </svg>
                                      </button>
                                    </Tooltip>
                                  </td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
                    }
                      </tbody>
                    </table>
                    {paginate && (
                      <div className='flex justify-center mt-8'>
                        <Pagination
                          paginate={paginate}
                          onPageChange={(page) =>
                            search !== ''
                              ? startSearchLocalidad(search, page)
                              : startLoadingLocalidad(page)}
                          text
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </>
          )}
    </>
  )
}
