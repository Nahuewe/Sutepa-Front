import React, { useMemo, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import Tooltip from '@/components/ui/Tooltip'
import { useTable, useRowSelect, useSortBy, useGlobalFilter, usePagination } from 'react-table'
import GlobalFilter from '@/components/sutepa/tables/GlobalFilter'
import { useAuthStore, useIngresoStore } from '@/helpers'
import { setActiveIngreso } from '@/store/ingreso'
import { useNavigate } from 'react-router-dom'
import { ShowIngreso } from '@/components/sutepa/tables/ShowIngreso'
import { DeleteModal } from '@/components/sutepa/forms/DeleteModal'
import { hadleShowDeleteModal } from '@/store/layout'
import { sutepaApi } from '../../api'

export const Ingreso = ({ title = 'Lista de Afiliados' }) => {
  const { user: { seccional } } = useAuthStore()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { activeIngreso, startDeleteIngreso } = useIngresoStore()

  const [personas, setPersonas] = useState([])
  const [idIngreso, setIdIngreso] = useState()

  const COLUMNS = useMemo(() => [
    {
      Header: 'Nombre',
      accessor: 'nombre'
    },
    {
      Header: 'Apellido',
      accessor: 'apellido'
    },
    {
      Header: 'CUIL',
      accessor: 'cuil'
    },
    {
      Header: 'Correo',
      accessor: 'email'
    },
    {
      Header: 'UGL/Nivel Central',
      accessor: 'ugl'
    },
    {
      Header: 'Seccional',
      accessor: 'seccional'
    },
    {
      Header: 'Estado',
      accessor: 'deletedAt',
      Cell: ({ cell }) => (
        <span className='block w-full'>
          <span
            className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-black ${
              cell.value === null
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
      Header: 'Acciones',
      accessor: 'id',
      Cell: ({ cell: { value } }) => (
        <div className='flex space-x-3 rtl:space-x-reverse'>
          <Tooltip content='Ver' placement='top' arrow animation='shift-away'>
            <button id={value} className='action-btn' type='button' onClick={() => showIngreso(value)}>
              <Icon icon='heroicons:eye' />
            </button>
          </Tooltip>
          <Tooltip content='Editar' placement='top' arrow animation='shift-away'>
            <button className='action-btn' type='button' onClick={() => editIngreso(value)}>
              <Icon icon='heroicons:pencil-square' />
            </button>
          </Tooltip>
          {seccional === 3 && (
            <Tooltip content='Eliminar' placement='top' arrow animation='shift-away' theme='danger'>
              <button id={value} className='action-btn' type='button' onClick={deleteSolicitud}>
                <Icon icon='heroicons:trash' />
              </button>
            </Tooltip>
          )}
        </div>
      )
    }
  ], [seccional])

  const data = useMemo(() => personas.data || [], [personas])

  console.log(data)

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [...columns])
    }
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow
  } = tableInstance

  const { globalFilter, pageIndex, pageSize } = state

  const editIngreso = (id) => {
    dispatch(setActiveIngreso(id))
    navigate(`/personas/${id}`)
  }

  const showIngreso = (id) => {
    dispatch(setActiveIngreso(id))
  }

  const deleteSolicitud = (e) => {
    setIdIngreso(e.target.id)
    dispatch(hadleShowDeleteModal(true))
  }

  useEffect(() => {
    console.log('ingresos')
    const fetchPersonas = async () => {
      try {
        console.log('ingresos2')
        const response = await sutepaApi.get('/personas')
        setPersonas(response.data)
      } catch (error) {
        console.error('Error al obtener los datos:', error)
      }
    }
    fetchPersonas()
  }, [])

  return (
    <>
      {activeIngreso
        ? (
          <ShowIngreso />
          )
        : (
          <Card>
            <div className='md:flex justify-between items-center mb-6'>
              <h4 className='card-title'>{title}</h4>
              <div className='flex flex-wrap gap-4'>
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
                {seccional === 3 && (
                  <button className='bg-slate-300 dark:bg-slate-900 inline-block text-center px-6 py-2 rounded-lg'>
                    Exportar
                  </button>
                )}
                <DeleteModal
                  activeModal
                  onClose
                  noFade
                  disableBackdrop
                  className='max-w-xl'
                  footerContent={false}
                  centered
                  scrollContent
                  themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                  title='Eliminar Afiliado'
                  label='Dar de Baja'
                  labelClass='btn inline-flex justify-center btn-success px-16'
                  message='¿Quieres darle de baja al afiliado?'
                  labelBtn='Aceptar'
                  btnFunction={() => startDeleteIngreso(idIngreso)}
                />
                <button className='bg-red-600 text-white items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/afiliados/crear')}>
                  Agregar Afiliado
                </button>
              </div>
            </div>
            <div className='overflow-x-auto -mx-6 capitalize'>
              <div className='inline-block min-w-full align-middle'>
                <div className='overflow-hidden'>
                  <table
                    className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'
                    {...getTableProps()}
                  >
                    <thead className='bg-slate-200 dark:bg-slate-700'>
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(column.getSortByToggleProps())}
                              scope='col'
                              className='table-th'
                            >
                              {column.render('Header')}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? ' 🔽'
                                    : ' 🔼'
                                  : ''}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody
                      className='bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700'
                      {...getTableBodyProps()}
                    >
                      {page.map((row) => {
                        prepareRow(row)
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td {...cell.getCellProps()} className='table-td'>
                                  {cell.render('Cell', { showIngreso, editIngreso })}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center'>
              <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                <select
                  className='form-control py-2 w-max'
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {[10, 25, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Mostrar {pageSize}
                    </option>
                  ))}
                </select>
                <span className='text-sm font-medium text-slate-600 dark:text-slate-300'>
                  Página{' '}
                  <span>
                    {pageIndex + 1} de {pageOptions.length}
                  </span>
                </span>
              </div>
              <ul className='flex items-center  space-x-3  rtl:space-x-reverse'>
                <li className='text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180'>
                  <button
                    className={` ${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    <Icon icon='heroicons:chevron-double-left-solid' />
                  </button>
                </li>
                <li className='text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180'>
                  <button
                    className={` ${!canPreviousPage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    Anterior
                  </button>
                </li>
                {pageOptions.map((page, pageIdx) => (
                  <li key={pageIdx}>
                    <button
                      href='#'
                      aria-current='page'
                      className={` ${pageIdx === pageIndex
                          ? 'bg-red-600  dark:text-slate-200 text-white font-medium '
                          : 'bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  '
                          }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                      onClick={() => gotoPage(pageIdx)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                <li className='text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180'>
                  <button
                    className={` ${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    Siguiente
                  </button>
                </li>
                <li className='text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180'>
                  <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                    className={` ${!canNextPage ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                  >
                    <Icon icon='heroicons:chevron-double-right-solid' />
                  </button>
                </li>
              </ul>
            </div>
            {/* end */}
          </Card>
          )}
    </>
  )
}
