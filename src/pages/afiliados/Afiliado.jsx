import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { cleanAfiliado, setActiveAfiliado } from '@/store/afiliado'
import { sutepaApi } from '@/api'
import { formatDate, getTipoContrato } from '@/constant/datos-id'
import { DeleteModal } from '@/components/ui/DeleteModal'
import { handleShowDelete } from '@/store/layout'
import * as XLSX from 'xlsx'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import Loading from '@/components/Loading'
import EstadisticasAfiliados from './EstadisticasAfiliados'
import EditButton from '@/components/buttons/EditButton'
import ViewButton from '@/components/buttons/ViewButton'
import AfiliadoButton from '@/components/buttons/AfiliadoButton'
import Tooltip from '@/components/ui/Tooltip'
import { TextInput } from 'flowbite-react'

const columns = [
  {
    label: 'Legajo',
    field: 'legajo'
  },
  {
    label: 'Nombre',
    field: 'nombre'
  },
  {
    label: 'Apellido',
    field: 'apellido'
  },
  {
    label: 'DNI',
    field: 'dni'
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
          className={`inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-black ${cell.value === 'PENDIENTE'
            ? 'text-warning-500 bg-warning-500 dark:text-warning-500 dark:bg-warning-500'
            : cell.value === 'ACTIVO'
              ? 'text-success-500 bg-success-500 dark:text-success-500 dark:bg-success-500'
              : 'text-red-500 bg-red-500 dark:text-red-500 dark:bg-red-500'
            }`}
        >
          {cell.value}
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
  const { user } = useSelector((state) => state.auth)
  const [isLoading, setIsLoading] = useState(true)
  const [showEstadisticas, setShowEstadisticas] = useState(false)
  const [search, setSearch] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [filterPendiente, setFilterPendiente] = useState(false)
  const {
    afiliados,
    afiliadosSinPaginar,
    paginate,
    startLoadingAfiliado,
    startGetAfiliadosSinPaginar,
    startEditAfiliado,
    startDeleteAfiliado,
    startSearchAfiliado
  } = useAfiliadoStore()

  // const filteredAfiliados = (user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) ? afiliados : afiliados.filter(afiliado => afiliado.seccional_id === user.seccional_id)

  const filteredAfiliados = (user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3)
    ? (filterPendiente ? afiliadosSinPaginar.filter(afiliado => afiliado.estado === 'PENDIENTE') : afiliados)
    : (filterPendiente ? afiliados.filter(afiliado => afiliado.estado === 'PENDIENTE' && afiliado.seccional_id === user.seccional_id) : afiliados.filter(afiliado => afiliado.seccional_id === user.seccional_id))

  function addAfiliado () {
    navigate('/afiliados/crear')
    dispatch(cleanAfiliado())
  }

  async function showAfiliado (id) {
    const currentPage = paginate?.current_page
    await startEditAfiliado(id)
    navigate(`/afiliados/ver/${id}?page=${currentPage}`)
    dispatch(cleanAfiliado())
  }

  function onEdit (id) {
    const currentPage = paginate?.current_page || 1
    startEditAfiliado(id)
    navigate(`/afiliados/editar/${id}?page=${currentPage}`)
    dispatch(cleanAfiliado())
  }

  function onDelete (id) {
    const currentPage = paginate?.current_page || 1
    dispatch(setActiveAfiliado(id))
    dispatch(handleShowDelete())
    navigate(`/afiliados?page=${currentPage}`)
  }

  async function onSearch ({ target: { value } }) {
    setSearch(value)
    if (value.length === 0) await loadingAfiliado()
    if (value.length <= 1) return false
    await startSearchAfiliado(value)
  }

  async function loadingAfiliado (page = 1) {
    !isLoading && setIsLoading(true)

    await startGetAfiliadosSinPaginar()
    await startLoadingAfiliado(page)
    setIsLoading(false)
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const page = searchParams.get('page') || 1
    loadingAfiliado(page)
  }, [])

  async function handlePersonalista () {
    try {
      const response = await sutepaApi.get('personalista')
      const { data } = response.data
      return data
    } catch (error) {
      console.error('Error al obtener los datos:', error)
      return []
    }
  }

  // Función para exportar los datos a Excel
  async function exportToExcel () {
    setIsExporting(true)
    const afiliados = await handlePersonalista()

    if (afiliados.length === 0) {
      console.log('No hay datos para exportar.')
      setIsExporting(false)
      return
    }

    const datosCompletosData = []
    const personasData = []
    const domiciliosData = []
    const datosLaboralesData = []
    const obraSocialData = []
    const documentacionesData = []
    const familiaresData = []
    const subsidiosData = []

    afiliados.forEach((activeAfiliado) => {
      if (activeAfiliado) {
        // Datos principales
        const afiliadoBase = {
          Legajo: activeAfiliado.persona.legajo,
          Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
          'Correo Electrónico': activeAfiliado.persona.email ? activeAfiliado.persona.email.toLowerCase() : '',
          'Tipo de Documento': activeAfiliado.persona.tipo_documento || '',
          DNI: activeAfiliado.persona.dni,
          CUIL: activeAfiliado.persona.cuil,
          Teléfono: activeAfiliado.persona.telefono,
          Sexo: activeAfiliado.persona.sexo,
          'Fecha de Nacimiento': formatDate(activeAfiliado.persona.fecha_nacimiento),
          'Fecha de Afiliación': formatDate(activeAfiliado.persona.fecha_afiliacion),
          'Estado Civil': activeAfiliado.persona.estado_civil,
          Nacionalidad: activeAfiliado.persona.nacionalidad,
          Domicilio: activeAfiliado.domicilios?.domicilio?.toUpperCase() || '',
          Provincia: activeAfiliado.domicilios?.provincia,
          Localidad: activeAfiliado.domicilios?.localidad,
          'Código Postal': activeAfiliado.domicilios?.codigo_postal,
          'Tipo de Contrato': getTipoContrato(activeAfiliado.datos_laborales?.tipo_contrato_id),
          UGL: activeAfiliado.datos_laborales?.ugl,
          Agencia: activeAfiliado.datos_laborales?.agencia,
          'Domicilio de Trabajo': activeAfiliado.datos_laborales?.domicilio,
          Seccional: activeAfiliado.datos_laborales?.seccional,
          Agrupamiento: activeAfiliado.datos_laborales?.agrupamiento,
          Tramo: activeAfiliado.datos_laborales?.tramo,
          'Carga Horaria': activeAfiliado.datos_laborales?.carga_horaria,
          'Fecha de Ingreso': formatDate(activeAfiliado.datos_laborales?.fecha_ingreso),
          'Correo Electrónico Laboral': activeAfiliado.datos_laborales?.email_laboral ? activeAfiliado.datos_laborales.email_laboral.toLowerCase() : '',
          'Teléfono Laboral': activeAfiliado.datos_laborales?.telefono_laboral,
          'Tipo de Obra Social': activeAfiliado.obraSociales?.tipo_obra,
          'Obra Social': activeAfiliado.obraSociales?.obra_social?.toUpperCase() || '',
          Estado: activeAfiliado.persona.estados
        }

        activeAfiliado.familiares.forEach(fam => {
          datosCompletosData.push({
            ...afiliadoBase,
            'Nombre y Apellido Familiar': fam.nombre_familiar?.toUpperCase() || '',
            'Fecha de Nacimiento del Familiar': formatDate(fam.fecha_nacimiento_familiar),
            'Tipo de Documento del Familiar': fam.tipo_documento_familiar || '',
            Documento: fam.documento,
            Parentesco: fam.parentesco
          })
        })

        activeAfiliado.documentaciones.forEach(doc => {
          datosCompletosData.push({
            ...afiliadoBase,
            'Tipo de Archivo': doc.tipo_documento || '',
            'Nombre de Archivo': `https://sistema.sutepa.com.ar/uploads/${doc.archivo}`
          })
        })

        activeAfiliado.subsidios.forEach(subsidio => {
          datosCompletosData.push({
            ...afiliadoBase,
            'Tipo de Subsidio': subsidio.tipo_subsidio,
            'Fecha de Solicitud': formatDate(subsidio.fecha_solicitud),
            'Fecha de Otorgamiento': formatDate(subsidio.fecha_otorgamiento),
            Observaciones: subsidio.observaciones?.toUpperCase() || ''
          })
        })

        if (activeAfiliado.documentaciones.length === 0 &&
            activeAfiliado.familiares.length === 0 &&
            activeAfiliado.subsidios.length === 0) {
          datosCompletosData.push(afiliadoBase)
        }
      }

      if (activeAfiliado.persona) {
        personasData.push({
          Legajo: activeAfiliado.persona.legajo,
          Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
          'Correo Electrónico': activeAfiliado.persona.email ? activeAfiliado.persona.email.toLowerCase() : '',
          'Tipo de Documento': activeAfiliado.persona.tipo_documento || '',
          DNI: activeAfiliado.persona.dni,
          CUIL: activeAfiliado.persona.cuil,
          Teléfono: activeAfiliado.persona.telefono,
          Sexo: activeAfiliado.persona.sexo,
          'Fecha de Nacimiento': formatDate(activeAfiliado.persona.fecha_nacimiento),
          'Fecha de Afiliación': formatDate(activeAfiliado.persona.fecha_afiliacion),
          'Estado Civil': activeAfiliado.persona.estado_civil,
          Nacionalidad: activeAfiliado.persona.nacionalidad,
          Estado: activeAfiliado.persona.estados
        })
      }

      if (activeAfiliado.domicilios) {
        domiciliosData.push({
          Legajo: activeAfiliado.persona.legajo,
          Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
          Domicilio: activeAfiliado.domicilios.domicilio?.toUpperCase() || '',
          Provincia: activeAfiliado.domicilios.provincia,
          Localidad: activeAfiliado.domicilios.localidad,
          'Código Postal': activeAfiliado.domicilios.codigo_postal
        })
      }

      if (activeAfiliado.datos_laborales) {
        datosLaboralesData.push({
          Legajo: activeAfiliado.persona.legajo,
          Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
          'Tipo de Contrato': getTipoContrato(activeAfiliado.datos_laborales.tipo_contrato_id),
          UGL: activeAfiliado.datos_laborales.ugl,
          Agencia: activeAfiliado.datos_laborales.agencia,
          'Domicilio de Trabajo': activeAfiliado.datos_laborales.domicilio,
          Seccional: activeAfiliado.datos_laborales.seccional,
          Agrupamiento: activeAfiliado.datos_laborales.agrupamiento,
          Tramo: activeAfiliado.datos_laborales.tramo,
          'Carga Horaria': activeAfiliado.datos_laborales.carga_horaria,
          'Fecha de Ingreso': formatDate(activeAfiliado.datos_laborales.fecha_ingreso),
          'Correo Electrónico Laboral': activeAfiliado.datos_laborales.email_laboral ? activeAfiliado.datos_laborales.email_laboral.toLowerCase() : '',
          Teléfono: activeAfiliado.datos_laborales.telefono_laboral,
          Estado: activeAfiliado.persona.estados
        })
      }

      if (activeAfiliado.obraSociales) {
        obraSocialData.push({
          Legajo: activeAfiliado.persona.legajo,
          Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
          'Tipo de Obra Social': activeAfiliado.obraSociales.tipo_obra,
          'Obra Social': activeAfiliado.obraSociales.obra_social?.toUpperCase() || ''
        })
      }

      documentacionesData.push(...activeAfiliado.documentaciones.map(doc => ({
        Legajo: activeAfiliado.persona.legajo,
        Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
        Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
        'Tipo de Archivo': doc.tipo_documento || '',
        'Nombre de Archivo': `https://sistema.sutepa.com.ar/uploads/${doc.archivo}`
      })))

      familiaresData.push(...activeAfiliado.familiares.map(fam => ({
        Legajo: activeAfiliado.persona.legajo,
        Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
        Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
        'Nombre y Apellido': fam.nombre_familiar?.toUpperCase() || '',
        'Fecha de Nacimiento': formatDate(fam.fecha_nacimiento_familiar),
        'Tipo de Documento': fam.tipo_documento_familiar || '',
        Documento: fam.documento,
        Parentesco: fam.parentesco
      })))

      if (activeAfiliado.subsidios) {
        subsidiosData.push(...activeAfiliado.subsidios.map(subsidio => ({
          Legajo: activeAfiliado.persona.legajo,
          Nombre: activeAfiliado.persona.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona.apellido?.toUpperCase() || '',
          'Tipo de Subsidio': subsidio.tipo_subsidio,
          'Fecha de Solicitud': formatDate(subsidio.fecha_solicitud),
          'Fecha de Otorgamiento': formatDate(subsidio.fecha_otorgamiento),
          Observaciones: subsidio.observaciones?.toUpperCase() || ''
        })))
      }
    })

    const wb = XLSX.utils.book_new()
    const datosCompletosSheet = XLSX.utils.json_to_sheet(datosCompletosData)
    const personasSheet = XLSX.utils.json_to_sheet(personasData)
    const domiciliosSheet = XLSX.utils.json_to_sheet(domiciliosData)
    const datosLaboralesSheet = XLSX.utils.json_to_sheet(datosLaboralesData)
    const obraSocialSheet = XLSX.utils.json_to_sheet(obraSocialData)
    const documentacionesSheet = XLSX.utils.json_to_sheet(documentacionesData)
    const familiaresSheet = XLSX.utils.json_to_sheet(familiaresData)
    const subsidiosSheet = XLSX.utils.json_to_sheet(subsidiosData)

    XLSX.utils.book_append_sheet(wb, datosCompletosSheet, 'Datos Completos')
    XLSX.utils.book_append_sheet(wb, personasSheet, 'Personas')
    XLSX.utils.book_append_sheet(wb, domiciliosSheet, 'Domicilios')
    XLSX.utils.book_append_sheet(wb, datosLaboralesSheet, 'Datos Laborales')
    XLSX.utils.book_append_sheet(wb, obraSocialSheet, 'Obra Social')
    XLSX.utils.book_append_sheet(wb, documentacionesSheet, 'Documentaciones')
    XLSX.utils.book_append_sheet(wb, familiaresSheet, 'Familiares')
    XLSX.utils.book_append_sheet(wb, subsidiosSheet, 'Subsidios')

    XLSX.writeFile(wb, 'afiliados.xlsx')
    setIsExporting(false)
  }

  return (
    <>
      {
        isLoading
          ? <Loading className='mt-28 md:mt-64' />
          : (
            <>
              <Card>
                <div className='mb-4 md:flex md:justify-between'>
                  <h1 className='text-2xl font-semibold dark:text-white mb-4 md:mb-0'>Listado de Afiliados</h1>
                  <div className='flex flex-col md:flex-row items-start md:items-center gap-4'>
                    <div className='relative'>
                      <TextInput
                        name='search'
                        placeholder='Buscar'
                        onChange={onSearch}
                        value={search}
                      />

                      <div
                        type='button'
                        className='absolute top-3 right-2'
                      >
                        <svg xmlns='http://www.w3.org/2000/svg' className='icon icon-tabler icon-tabler-search dark:stroke-white' width='16' height='16' viewBox='0 0 24 24' strokeWidth='1.5' stroke='#000000' fill='none' strokeLinecap='round' strokeLinejoin='round'>
                          <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                          <path d='M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0' />
                          <path d='M21 21l-6 -6' />
                        </svg>
                      </div>
                    </div>

                    <DeleteModal
                      themeClass='bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700'
                      centered
                      title='Acciones del Afiliado'
                      message='¿Estás seguro?'
                      labelBtn='Aceptar'
                      btnFunction={startDeleteAfiliado}
                    />

                    {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
                      <Tooltip content={showEstadisticas ? 'Ocultar estadísticas' : 'Mostrar estadísticas'}>
                        <button
                          onClick={() => setShowEstadisticas(!showEstadisticas)}
                          className='bg-blue-500 hover:bg-blue-700 text-white items-center text-center py-2 px-6 rounded-lg'
                        >
                          {showEstadisticas ? 'Estadísticas' : 'Estadísticas'}
                        </button>
                      </Tooltip>
                    )}

                    <div className='flex gap-4'>
                      {(user.roles_id === 1) && (
                        <button
                          type='button'
                          onClick={() => setFilterPendiente(!filterPendiente)}
                          className={`bg-yellow-500 ${filterPendiente ? 'bg-yellow-700' : 'hover:bg-yellow-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                        >
                          {filterPendiente ? 'Todos' : 'Pendientes'}
                        </button>
                      )}

                      {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
                        <button
                          type='button'
                          onClick={exportToExcel}
                          className={`bg-green-500 ${isExporting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                          disabled={isExporting}
                        >
                          {isExporting ? 'Exportando...' : 'Exportar'}
                        </button>
                      )}

                      {(user.roles_id === 1 || user.roles_id === 2 || user.roles_id === 3) && (
                        <button
                          type='button'
                          onClick={addAfiliado}
                          className='bg-red-600 hover:bg-red-800 text-white items-center text-center py-2 px-6 rounded-lg'
                        >
                          Agregar
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className='mt-4 grid sm:grid-cols-2 md:grid-cols-4 grid-cols-1 gap-4'>
                  {showEstadisticas && <EstadisticasAfiliados afiliadosSinPaginar={afiliadosSinPaginar} />}
                </div>
              </Card>

              <Card noborder>
                <div className='overflow-x-auto -mx-6'>
                  <div className='inline-block min-w-full align-middle'>
                    <div className='overflow-hidden '>
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
                            (filteredAfiliados.length > 0)
                              ? (filteredAfiliados.map((afiliado) => (
                                <tr key={afiliado.id}>
                                  <td className='table-td'>{afiliado.legajo}</td>
                                  <td className='table-td mayuscula'>{afiliado.nombre}</td>
                                  <td className='table-td mayuscula'>{afiliado.apellido}</td>
                                  <td className='table-td'>{afiliado.dni}</td>
                                  <td className='table-td'>{afiliado.ugl}</td>
                                  <td className='table-td'>{afiliado.seccional}</td>
                                  <td className='table-td'>
                                    <span
                                      className={`inline-block text-black px-3 min-w-[90px] text-center py-1 rounded-full bg-opacity-25 ${afiliado.estado === 'ACTIVO'
                                        ? 'text-black bg-success-500 dark:bg-success-400'
                                        : afiliado.estado === 'PENDIENTE'
                                          ? 'text-black bg-warning-500 dark:bg-warning-500'
                                          : 'text-black bg-danger-500 dark:bg-danger-500'
                                        }`}
                                    >
                                      {afiliado.estado}
                                    </span>
                                  </td>
                                  <td className='table-td flex justify-start gap-2'>
                                    <ViewButton afiliado={afiliado} onView={showAfiliado} />

                                    {user.roles_id !== 5 && (
                                      <EditButton afiliado={afiliado} onEdit={onEdit} />
                                    )}

                                    {user.roles_id === 1 && (
                                      <AfiliadoButton afiliado={afiliado} onDelete={onDelete} />
                                    )}
                                  </td>
                                </tr>
                                )))
                              : (<tr><td colSpan='10' className='text-center py-2 dark:bg-gray-800'>No se encontraron resultados</td></tr>)
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
            </>
            )
      }
    </>
  )
}
