import { Tooltip } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import Modal from 'react-modal'
import * as XLSX from 'xlsx'
import { sutepaApi } from '@/api'
import { getTipoContrato, getTipoDependencias } from '@/constant/datos-id'

export const ExportarExcel = () => {
  const [isExporting, setIsExporting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState([])
  const [afiliados, setAfiliados] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [progress, setProgress] = useState(0)

  const baseColumns = [
    'Legajo', 'Nombre', 'Apellido', 'Estado del Afiliado', 'Correo Electrónico', 'DNI',
    'CUIL', 'Teléfono', 'Sexo', 'Fecha de Nacimiento',
    'Fecha de Afiliación', 'Estado Civil', 'Nacionalidad',
    'Domicilio', 'Provincia', 'Localidad', 'Código Postal',
    'Tipo de Contrato', 'UGL', 'Agencia', 'Domicilio de Trabajo', 'Seccional', 'Dependencia', 'Agrupamiento',
    'Tramo', 'Carga Horaria', 'Fecha de Ingreso', 'Correo Electrónico Laboral', 'Teléfono Laboral',
    'Tipo de Obra Social', 'Obra Social'
  ]
  const documentacionColumns = ['Tipo de Archivo', 'Link del Archivo']
  const familiaresColumns = ['Nombre y Apellido del Familiar', 'Fecha de Nacimiento del Familiar', 'Documento del Familiar', 'Parentesco del Familiar']
  const subsidiosColumns = ['Tipo de Subsidio', 'Fecha de Solicitud', 'Fecha de Otorgamiento', 'Observaciones']

  const allColumns = [
    { category: 'Datos del Afiliado', columns: baseColumns },
    { category: 'Documentación', columns: documentacionColumns },
    { category: 'Familiares', columns: familiaresColumns },
    { category: 'Subsidios', columns: subsidiosColumns }
  ]

  const formatDate = (dateString) => {
    if (!dateString) {
      return '-'
    }

    const date = new Date(dateString)
    if (isNaN(date)) {
      return '-'
    }

    const userTimezoneOffset = date.getTimezoneOffset() * 60000
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset)

    const day = String(adjustedDate.getDate()).padStart(2, '0')
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0')
    const year = adjustedDate.getFullYear()

    return `${day}/${month}/${year}`
  }

  const fetchAfiliados = async () => {
    try {
      setIsLoading(true)
      setStatusMessage('Iniciando carga de datos...')
      setProgress(5)

      let page = 1
      const pageSize = 100
      let hasMore = true
      let allData = []
      let total = 0

      while (hasMore) {
        const progressValue = Math.min(90, Math.round((allData.length / total) * 100))

        setStatusMessage(
          `Cargando datos... | Progreso: ${progressValue || '-'}% (${allData.length || '-'}/${total || '-'} afiliados)`
        )

        const response = await sutepaApi.get('/personalista', {
          params: { page, pageSize }
        })

        const { data, total: totalRecords } = response.data

        if (page === 1) total = totalRecords

        allData = [...allData, ...data]

        hasMore = page * pageSize < total
        page++

        setProgress(progressValue)
      }

      setProgress(95)

      const formattedData = allData.flatMap((afiliado) => {
        const baseData = {
          Legajo: afiliado?.persona?.legajo || '-',
          Nombre: afiliado?.persona?.nombre?.toUpperCase() || '-',
          Apellido: afiliado?.persona?.apellido?.toUpperCase() || '-',
          'Estado del Afiliado': afiliado?.persona?.estados || '-',
          'Correo Electrónico': afiliado?.persona?.email || '-',
          DNI: afiliado?.persona?.dni || '-',
          CUIL: afiliado?.persona?.cuil || '-',
          Teléfono: afiliado?.persona?.telefono || '-',
          Sexo: afiliado?.persona?.sexo || '-',
          'Fecha de Nacimiento': formatDate(afiliado?.persona?.fecha_nacimiento || '-') || '-',
          'Fecha de Afiliación': formatDate(afiliado?.persona?.fecha_afiliacion || '-') || '-',
          'Estado Civil': afiliado?.persona?.estado_civil || '-',
          Nacionalidad: afiliado?.persona?.nacionalidad || '-',
          Domicilio: afiliado?.domicilios?.domicilio || '-',
          Provincia: afiliado?.domicilios?.provincia || '-',
          Localidad: afiliado?.domicilios?.localidad || '-',
          'Código Postal': afiliado?.domicilios?.codigo_postal || '-',
          'Tipo de Contrato': getTipoContrato(afiliado?.datos_laborales?.tipo_contrato_id || '-') || '-',
          UGL: afiliado?.datos_laborales?.ugl || '-',
          Agencia: afiliado?.datos_laborales?.agencia || '-',
          'Domicilio de Trabajo': afiliado?.datos_laborales?.domicilio || '-',
          Seccional: afiliado?.datos_laborales?.seccional || '-',
          Dependencia: getTipoDependencias(afiliado?.datos_laborales?.dependencia_id || '-') || '-',
          Agrupamiento: afiliado?.datos_laborales?.agrupamiento || '-',
          Tramo: afiliado?.datos_laborales?.tramo || '-',
          'Carga Horaria': afiliado?.datos_laborales?.carga_horaria || '-',
          'Fecha de Ingreso': formatDate(afiliado?.datos_laborales?.fecha_ingreso || '-') || '-',
          'Correo Electrónico Laboral': afiliado?.datos_laborales?.email_laboral?.toLowerCase() || '-',
          'Teléfono Laboral': afiliado?.datos_laborales?.telefono_laboral || '-',
          'Tipo de Obra Social': afiliado?.obraSociales?.tipo_obra || '-',
          'Obra Social': afiliado?.obraSociales?.obra_social?.toUpperCase() || '-'
        }

        const documentaciones = afiliado?.documentaciones?.map((doc) => ({
          ...baseData,
          'Tipo de Archivo': doc?.tipo_documento || '-',
          'Link del Archivo': `https://sistema.sutepa.com.ar/uploads/${doc?.archivo}` || '-'
        })) || []

        const familiares = afiliado?.familiares?.map((fam) => ({
          ...baseData,
          'Nombre y Apellido del Familiar': fam?.nombre_familiar?.toUpperCase() || '-',
          'Fecha de Nacimiento del Familiar': formatDate(fam?.fecha_nacimiento_familiar || '-') || '-',
          'Documento del Familiar': fam?.documento || '-',
          'Parentesco del Familiar': fam?.parentesco || '-'
        })) || []

        const subsidios = afiliado?.subsidios?.map((subsidio) => ({
          ...baseData,
          'Tipo de Subsidio': subsidio?.tipo_subsidio || '-',
          'Fecha de Solicitud': formatDate(subsidio?.fecha_solicitud || '-') || '-',
          'Fecha de Otorgamiento': formatDate(subsidio?.fecha_otorgamiento || '-') || '-',
          Observaciones: subsidio?.observaciones?.toUpperCase() || '-'
        })) || []

        return [baseData, ...documentaciones, ...familiares, ...subsidios]
      })

      setAfiliados(formattedData)
      setDataLoaded(true)
      setStatusMessage('Datos cargados correctamente, elige los filtros y exporta.')
      setProgress(100)
    } catch (error) {
      console.error('Error al obtener los datos:', error)
      setStatusMessage('Hubo un error al cargar los datos.')
      setProgress(0)
    } finally {
      setIsLoading(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const openModal = async () => {
    setIsModalOpen(true)
    if (!dataLoaded) {
      await fetchAfiliados()
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const familiaresColumnsSelected = familiaresColumns.some((col) =>
        selectedColumns.includes(col)
      )
      const documentacionColumnsSelected = documentacionColumns.some((col) =>
        selectedColumns.includes(col)
      )
      const subsidiosColumnsSelected = subsidiosColumns.some((col) =>
        selectedColumns.includes(col)
      )

      let filteredAfiliados = afiliados.filter((row) => {
        if (familiaresColumnsSelected && !row['Nombre y Apellido del Familiar']) {
          return false
        }
        if (documentacionColumnsSelected && !row['Tipo de Archivo']) {
          return false
        }
        if (subsidiosColumnsSelected && !row['Tipo de Subsidio']) {
          return false
        }
        return true
      })

      if (selectedColumns.every(col => baseColumns.includes(col))) {
        filteredAfiliados = filteredAfiliados.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.Legajo === value.Legajo
          ))
        )
      }

      const formattedData = filteredAfiliados.map((row) =>
        Object.fromEntries(
          Object.entries(row)
            .filter(([key]) => selectedColumns.includes(key))
            .filter(([, value]) => value !== '' && value !== null)
        )
      )

      const sheet = XLSX.utils.json_to_sheet(formattedData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, sheet, 'Datos Filtrados')
      XLSX.writeFile(wb, 'afiliados_filtrados.xlsx')
    } catch (error) {
      console.error('Error durante la exportación:', error)
    } finally {
      setIsExporting(false)
      setIsModalOpen(false)
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  return (
    <div>
      <Tooltip content='Seleccionar columnas'>
        <button
          onClick={openModal}
          className='bg-green-500 hover:bg-green-700 text-white py-2 px-6 rounded-lg'
        >
          Exportar
        </button>
      </Tooltip>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel='Seleccionar columnas'
        appElement={document.getElementById('root')}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
          content: {
            maxWidth: '870px',
            margin: 'auto',
            borderRadius: '12px',
            padding: '20px',
            backgroundColor: '#ffffff',
            color: '#333',
            zIndex: '999',
            boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <div className='flex justify-between items-center border-b pb-3 mb-4 md:mt-10 mt-4'>
          <h2 className='text-xl font-semibold text-[#0e7490] dark:text-[#0e7490]'>Exportar Datos de los Afiliados</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className='text-red-700 hover:text-red-800 focus:outline-none'
          >
            ✕
          </button>
        </div>

        <div
          className={`p-3 mb-6 rounded-lg ${
            isLoading
              ? 'bg-yellow-100 text-yellow-700'
              : statusMessage.includes('error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
        >
          <p className='font-medium'>{statusMessage}</p>
        </div>

        {isLoading && (
          <div className='w-full bg-gray-200 rounded-full h-2.5 mb-4'>
            <div
              className='bg-green-500 h-2.5 rounded-full transition-all'
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6 overflow-y-auto max-h-[35rem]'>
          {allColumns.map(({ category, columns }) => (
            <fieldset key={category} className='border p-4 rounded-md shadow-sm'>
              <legend className='text-lg font-bold text-gray-700 mb-3'>{category}</legend>
              <label className='flex items-center space-x-2 mb-3'>
                <input
                  type='checkbox'
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedColumns((prev) => [...new Set([...prev, ...columns])])
                    } else {
                      setSelectedColumns((prev) =>
                        prev.filter((col) => !columns.includes(col))
                      )
                    }
                  }}
                  checked={columns.every((col) => selectedColumns.includes(col))}
                  className='form-checkbox text-green-500 focus:ring-green-400'
                />
                <span className='font-medium text-orange-500'>Seleccionar todo</span>
              </label>
              {columns.map((column) => (
                <label key={column} className='flex items-center space-x-2 mb-2'>
                  <input
                    type='checkbox'
                    value={column}
                    checked={selectedColumns.includes(column)}
                    onChange={(e) => {
                      const value = e.target.value
                      setSelectedColumns((prev) =>
                        e.target.checked
                          ? [...prev, value]
                          : prev.filter((col) => col !== value)
                      )
                    }}
                    className='form-checkbox text-green-500 focus:ring-green-400'
                  />
                  <span className='text-gray-600'>{column}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>

        <div className='flex justify-end gap-4'>
          <button
            onClick={() => setIsModalOpen(false)}
            className='bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400'
          >
            Cancelar
          </button>
          <button
            onClick={handleExport}
            className={`bg-green-500 ${isExporting || !dataLoaded
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-green-600 cursor-pointer'
              } text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400`}
            disabled={!selectedColumns.length || isExporting || !dataLoaded}
          >
            {isExporting || !dataLoaded ? 'Cargando...' : 'Exportar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
