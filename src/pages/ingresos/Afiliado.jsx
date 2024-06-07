import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import Card from '@/components/ui/Card'
import Tooltip from '@/components/ui/Tooltip'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { handleShowDelete } from '@/store/layout'

const columns = [
  {
    label: 'Nombre',
    field: 'nombre'
  },
  {
    label: 'Apellido',
    field: 'apellido'
  },
  {
    label: 'CUIL',
    field: 'cuil'
  },
  {
    label: 'Correo',
    field: 'email'
  },
  {
    label: 'UGL/Nivel Central',
    field: 'ugl'
  },
  {
    label: 'Seccional',
    field: 'seccional'
  },
  {
    label: 'Estado',
    field: 'estado',
    Cell: ({ cell }) => (
      <span className='block w-full'>
        <span
          className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-black ${cell.value === null
            ? 'text-warning-500 bg-warning-500 dark:text-warning-500 dark:bg-warning-500'
            : 'text-success-500 bg-success-500 dark:text-success-500 dark:bg-success-500'
            }`}
        >
          {cell.value === null ? 'INACTIVO' : 'ACTIVO'}
        </span>
      </span>
    )
  },
  {
    label: 'Acciones',
    field: 'acciones'
  }
]

export const Afiliado = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const {
    afiliados,
    paginate,
    startLoadingAfiliado,
    startLoadingActiveAfiliado,
    startDeleteAfiliado,
    startSearchAfiliado
  } = useAfiliadoStore()

  function addAfiliado () {
    navigate('/afiliados/crear')
  }

  const showIngreso = (id) => {
    startLoadingAfiliado(id).then(() => {
      navigate(`/afiliados/ver/${id}`)
    })
  }

  function onEdit (id) {
    startLoadingActiveAfiliado(id)
    navigate(`/afiliados/${id}`)
  }

  function onDelete (id) {
    startLoadingActiveAfiliado(id)
    dispatch(handleShowDelete())
  }

  async function onSearch ({ target: { value } }) {
    setSearch(value)
    if (value.length === 0) await loadingAfiliado()
    if (value.length <= 3) return false
    await startSearchAfiliado(value)
  }

  async function loadingAfiliado (page = 1) {
    !isLoading && setIsLoading(true)

    await startLoadingAfiliado(page)
    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

  return (
    <>
      {
        (isLoading)
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <Card
              title='Listado de Afiliados'
              headerslot={
                <div className='flex gap-4'>
                  <input
                    type='text'
                    placeholder='Buscar...'
                    onChange={onSearch}
                    value={search}
                    className='form-control px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500'
                  />
                  <DeleteModal
                    themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                    centered
                    title='Eliminar Afiliado'
                    label='Eliminar'
                    message='¿Quieres dar de baja a este afiliado?'
                    labelBtn='Aceptar'
                    btnFunction={startDeleteAfiliado}
                  />
                  <button
                    type='button'
                    onClick={addAfiliado}
                    className='bg-red-600 text-white items-center text-center py-2 px-6 rounded-lg'
                  >
                    Agregar
                  </button>
                </div>
                }
              noborder
            >
              <div className='overflow-x-auto -mx-6'>
                <div className='inline-block min-w-full align-middle'>
                  <div className='overflow-hidden '>
                    <table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                      <thead className='bg-slate-200 dark:bg-slate-700'>
                        <tr>
                          {columns.map((column, i) => (
                            <th key={i} scope='col' className=' table-th '>
                              {column.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'>
                        {
                          (afiliados.length > 0) && afiliados.map((afiliado) => (
                            <tr key={afiliado.id}>
                              <td className='table-td'>{afiliado.nombre}</td>
                              <td className='table-td'>{afiliado.apellido}</td>
                              <td className='table-td'>{afiliado.cuil}</td>
                              <td className='table-td'>{afiliado.email}</td>
                              <td className='table-td'>{afiliado.ugl}</td>
                              <td className='table-td'>{afiliado.seccional}</td>
                              <td className='table-td'>
                                <span
                                  className={`inline-block px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25 ${afiliado.estado === 'ACTIVO'
                                      ? 'text-green-800 bg-green-500 dark:text-green-200 dark:bg-green-700'
                                      : 'text-orange-800 bg-orange-500 dark:text-orange-200 dark:bg-orange-700'
                                    }`}
                                >
                                  {afiliado.estado === 'ACTIVO' ? 'ACTIVO' : 'INACTIVO'}
                                </span>
                              </td>
                              <td className='table-td flex justify-start gap-2'>
                                {/* Botones de acción */}
                                <Tooltip content='Ver' placement='top' arrow animation='shift-away'>
                                  <button className='bg-indigo-500 text-white p-2 rounded-lg hover:bg-blue-700' onClick={() => showIngreso(afiliado.id)}>
                                    <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-eye' width='24' height='24' viewBox='0 0 24 24' strokeWidth='1.5' stroke='#ffffff' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                      <path d='M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0' />
                                      <path d='M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6' />
                                    </svg>
                                  </button>
                                </Tooltip>

                                <Tooltip content='Editar' placement='top' arrow animation='shift-away'>
                                  <button className='bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-700' onClick={() => onEdit(afiliado.id)}>
                                    <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-pencil' width='24' height='24' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                      <path stroke='none' d='M0 0h24v24H0z' fill='none' /><path d='M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4' />
                                      <path d='M13.5 6.5l4 4' />
                                    </svg>
                                  </button>
                                </Tooltip>

                                <Tooltip content='Eliminar' placement='top' arrow animation='shift-away'>
                                  <button className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-700' onClick={() => onDelete(afiliado.id)}>
                                    <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-trash' width='24' height='24' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                                      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                                      <path d='M4 7l16 0' /><path d='M10 11l0 6' />
                                      <path d='M14 11l0 6' />
                                      <path d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12' />
                                      <path d='M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3' />
                                    </svg>
                                  </button>
                                </Tooltip>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>

                    {/* Paginado */}
                    {
                      paginate && (
                        <div className='flex justify-center mt-8'>
                          <Pagination
                            paginate={paginate}
                            onPageChange={(page) =>
                              search !== ''
                                ? startSearchAfiliado(search, page)
                                : startLoadingAfiliado(page)}
                            text
                          />
                        </div>
                      )
                    }

                  </div>
                </div>
              </div>
            </Card>
            )
      }
    </>
  )
}
