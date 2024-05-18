import React, { useMemo, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Card from '@/components/ui/Card'
import Icon from '@/components/ui/Icon'
import Tooltip from '@/components/ui/Tooltip'
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination
} from 'react-table'
import GlobalFilter from '@/components/giro/tables/GlobalFilter'
import { useAuthStore, useIngresoStore } from '@/helpers'
import { setActiveIngreso } from '@/store/ingreso'
import { useNavigate } from 'react-router-dom'
import { ShowIngreso } from '@/components/giro/tables/ShowIngreso'
import { DeleteModal } from '@/components/giro/forms/DeleteModal'
import { hadleShowDeleteModal } from '@/store/layout'
import { useUserStore } from '../../helpers'

const Afiliados = [
  {
    id: 1,
    nombre: 'Nahuel',
    apellido: 'Soria Parodi',
    dni: 43532773,
    turno: 'Catamarca',
    sucursal: 'Chau'
  },
  {
    id: 2,
    nombre: 'Nahuel',
    apellido: 'Soria Parodi',
    dni: 43532773,
    turno: 'Catamarca',
    sucursal: 'Hola'
  }
]

export const Ingreso = ({ title = 'Lista de Afiliados' }) => {
  const { user: { sucursal } } = useAuthStore()
  const navigate = useNavigate()

  const COLUMNS = [
    {
      Header: 'Nombre',
      accessor: 'nombre',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'Apellido',
      accessor: 'apellido',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'DNI',
      accessor: 'dni',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'UGL/Nivel Central',
      accessor: 'turno',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'Seccional',
      accessor: 'sucursal',
      Cell: (row) => {
        return <span>{row?.cell?.value.nombre}</span>
      }
    },
    {
      Header: 'Estado',
      accessor: 'deletedAt',
      Cell: (row) => {
        return (
          <span className='block w-full'>
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-black ${row?.cell?.value === null
                                ? 'text-warning-500 bg-warning-500 dark:text-warning-500 dark:bg-warning-500'
                                : 'text-success-500 bg-success-500 dark:text-success-500 dark:bg-success-500'
                                }   
                  `}
            >
              {(row?.cell?.value === null) ? 'Inactivo' : 'Activo'}
            </span>
          </span>
        )
      }
    },
    {
      Header: 'Acciones',
      accessor: 'id',
      Cell: (row) => {
        return (
          <div className='flex space-x-3 rtl:space-x-reverse'>
            <Tooltip content='Ver' placement='top' arrow animation='shift-away'>
              <button id={row?.cell?.value} className='action-btn' type='button' onClick={() => { row.showIngreso(row?.cell?.value) }}>
                <Icon icon='heroicons:eye' />
              </button>
            </Tooltip>

            {
                            (sucursal === 1) && (
                              <Tooltip
                                content='Eliminar'
                                placement='top'
                                arrow
                                animation='shift-away'
                                theme='danger'
                              >
                                <button id={row?.cell?.value} className='action-btn' type='button' onClick={deleteSolicitud}>
                                  <Icon icon='heroicons:trash' />
                                </button>
                              </Tooltip>
                            )
                        }
          </div>
        )
      }
    }
  ]

  const COLUMNSUC = [
    {
      Header: 'Nombre',
      accessor: 'nombre',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'Apellido',
      accessor: 'apellido',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'DNI',
      accessor: 'dni',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'UGL/Nivel Central',
      accessor: 'turno',
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>
      }
    },
    {
      Header: 'Seccional',
      accessor: 'sucursal',
      Cell: (row) => {
        return <span>{row?.cell?.value.nombre}</span>
      }
    },
    {
      Header: 'Estado',
      accessor: 'deletedAt',
      Cell: (row) => {
        return (
          <span className='block w-full'>
            <span
              className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-black ${row?.cell?.value === null
                                ? 'text-success-500 bg-success-500 dark:text-success-500 dark:bg-success-500'
                                : 'text-warning-500 bg-warning-500 dark:text-warning-500 dark:bg-warning-500'
                                }   
                    `}
            >
              {(row?.cell?.value === null) ? 'Activo' : 'Inactivo'}
            </span>
          </span>
        )
      }
    },
    {
      Header: 'Acciones',
      accessor: 'id',
      Cell: (row) => {
        return (
          <div className='flex space-x-3 rtl:space-x-reverse'>
            <Tooltip content='Ver' placement='top' arrow animation='shift-away'>
              <button id={row?.cell?.value} className='action-btn' type='button' onClick={() => { row.showIngreso(row?.cell?.value) }}>
                <Icon icon='heroicons:eye' />
              </button>
            </Tooltip>

            <Tooltip content='Editar' placement='top' arrow animation='shift-away' theme='info'>
              <button className='action-btn' type='button' onClick={() => { row.editIngreso(row?.cell?.value) }}>
                <Icon icon='heroicons:pencil-square' />
              </button>
            </Tooltip>
          </div>
        )
      }
    }
  ]

  const { ingresos, activeIngreso, startLoadingIngreso, startDeleteIngreso } = useIngresoStore()
  const dispatch = useDispatch()
  const [idIngreso, setIdIngreso] = useState()
  // const { selectDateReport, startDownloadReport } = useIngresoStore();

  // const onDownloadReport = () => {
  //     startDownloadReport();
  // };

  const columns = useMemo(() => (sucursal === 1) ? COLUMNS : COLUMNSUC, [])
  const data = useMemo(() => ingresos, [ingresos])

  const tableInstance = useTable(
    {
      columns,
      data: Afiliados
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns
      ])
    }
  )
  const {
    getTableProps,
    getTableBodyProps = { showIngreso },
    headerGroups,
    footerGroups,
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
    navigate(`/ingresos/editar/${id}`)
  }

  const showIngreso = (id) => {
    dispatch(setActiveIngreso(id))
  }

  const deleteSolicitud = (e) => {
    setIdIngreso(e.target.id)
    dispatch(hadleShowDeleteModal(true))
  }

  useEffect(() => {
    startLoadingIngreso()
  }, [])

  return (
    <>
      {
                (activeIngreso)
                  ? (
                    <ShowIngreso />
                    )
                  : (
                    <Card>
                      <div className='md:flex justify-between items-center mb-6'>
                        <h4 className='card-title'>{title}</h4>
                        <div className='flex flex-wrap gap-4'>
                          <div className='flex mt-4 md:mt-0 justify-between'>
                            {sucursal === 1 && (
                              <div className='flex items-center'>
                                <button className='bg-slate-300 dark:bg-slate-900 inline-block text-center px-6 py-2 rounded-lg'>
                                  Exportar
                                </button>
                              </div>
                            )}
                          </div>

                          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

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
                            title='Eliminar Ingreso'
                            label='Eliminar'
                            labelClass='btn inline-flex justify-center btn-success px-16'
                            message='¿Quieres eliminar este ingreso?'
                            labelBtn='Aceptar'
                            btnFunction={() => startDeleteIngreso(idIngreso)}
                          />

                          <div className='ltr:text-right rtl:text-left'>
                            <button className='bg-red-600 text-white items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/ingresos/crear')}>Agregar Afiliado</button>
                          </div>
                        </div>
                      </div>
                      <div className='overflow-x-auto -mx-6 capitalize'>
                        <div className='inline-block min-w-full align-middle'>
                          <div className='overflow-hidden '>
                            <table
                              className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'
                              {...getTableProps}
                            >
                              <thead className='bg-slate-200 dark:bg-slate-700'>
                                {headerGroups.map((headerGroup) => (
                                  <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            {...column.getHeaderProps(
                                                column.getSortByToggleProps()
                                              )}
                                            scope='col'
                                            className=' table-th '
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
                                {...getTableBodyProps}
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
                    )
            }
    </>

  )
}
