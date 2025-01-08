import { useState } from 'react'
import { formatDate, getTipoContrato } from '@/constant/datos-id'
import { Tooltip } from 'flowbite-react'
import { sutepaApi } from '@/api'
import * as XLSX from 'xlsx'

export const ExportarExcel = () => {
  const [isExporting, setIsExporting] = useState(false)

  async function handlePersonalista () {
    try {
      const response = await sutepaApi.get('/personalista')
      const { data } = response.data
      return data
    } catch (error) {
      console.error('Error al obtener los datos:', error)
      return []
    }
  }

  async function exportToExcel () {
    setIsExporting(true)
    const afiliados = await handlePersonalista()

    if (!afiliados || afiliados.length === 0) {
      console.log('No hay datos para exportar.')
      setIsExporting(false)
      return
    }

    const personasData = []
    const domiciliosData = []
    const datosLaboralesData = []
    const obraSocialData = []
    const documentacionesData = []
    const familiaresData = []
    const subsidiosData = []
    const datosCompletosData = []

    afiliados.forEach((activeAfiliado) => {
      if (activeAfiliado) {
        const afiliadoBase = {
          Legajo: activeAfiliado.persona?.legajo,
          Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
          'Correo Electrónico': activeAfiliado.persona?.email ? activeAfiliado.persona?.email.toLowerCase() : '',
          'Tipo de Documento': activeAfiliado.persona?.tipo_documento || '',
          DNI: activeAfiliado.persona?.dni,
          CUIL: activeAfiliado.persona?.cuil,
          Teléfono: activeAfiliado.persona?.telefono,
          Sexo: activeAfiliado.persona?.sexo,
          'Fecha de Nacimiento': formatDate(activeAfiliado.persona?.fecha_nacimiento),
          'Fecha de Afiliación': formatDate(activeAfiliado.persona?.fecha_afiliacion),
          'Estado Civil': activeAfiliado.persona?.estado_civil,
          Nacionalidad: activeAfiliado.persona?.nacionalidad,
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

        datosCompletosData.push(afiliadoBase)
      }

      if (activeAfiliado.persona) {
        personasData.push({
          Legajo: activeAfiliado.persona?.legajo,
          Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
          'Correo Electrónico': activeAfiliado.persona?.email ? activeAfiliado.persona?.email.toLowerCase() : '',
          'Tipo de Documento': activeAfiliado.persona?.tipo_documento || '',
          DNI: activeAfiliado.persona?.dni,
          CUIL: activeAfiliado.persona?.cuil,
          Teléfono: activeAfiliado.persona?.telefono,
          Sexo: activeAfiliado.persona?.sexo,
          'Fecha de Nacimiento': formatDate(activeAfiliado.persona?.fecha_nacimiento),
          'Fecha de Afiliación': formatDate(activeAfiliado.persona?.fecha_afiliacion),
          'Estado Civil': activeAfiliado.persona?.estado_civil,
          Nacionalidad: activeAfiliado.persona?.nacionalidad,
          UGL: activeAfiliado.datos_laborales?.ugl,
          Agencia: activeAfiliado.datos_laborales?.agencia,
          Seccional: activeAfiliado.datos_laborales?.seccional,
          Estado: activeAfiliado.persona?.estados
        })
      }

      if (activeAfiliado.domicilios) {
        domiciliosData.push({
          Legajo: activeAfiliado.persona?.legajo,
          Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
          Domicilio: activeAfiliado.domicilios?.domicilio?.toUpperCase() || '',
          Provincia: activeAfiliado.domicilios?.provincia,
          Localidad: activeAfiliado.domicilios?.localidad,
          'Código Postal': activeAfiliado.domicilios?.codigo_postal
        })
      }

      if (activeAfiliado.datos_laborales) {
        datosLaboralesData.push({
          Legajo: activeAfiliado.persona?.legajo,
          Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
          'Tipo de Contrato': getTipoContrato(activeAfiliado.datos_laborales?.tipo_contrato_id),
          UGL: activeAfiliado.datos_laborales?.ugl,
          Agencia: activeAfiliado.datos_laborales?.agencia,
          'Domicilio de Trabajo': activeAfiliado.datos_laborales?.domicilio,
          Seccional: activeAfiliado.datos_laborales?.seccional,
          Agrupamiento: activeAfiliado.datos_laborales?.agrupamiento,
          Tramo: activeAfiliado.datos_laborales?.tramo,
          'Carga Horaria': activeAfiliado.datos_laborales?.carga_horaria,
          'Fecha de Ingreso': formatDate(activeAfiliado.datos_laborales?.fecha_ingreso),
          'Correo Electrónico Laboral': activeAfiliado.datos_laborales?.email_laboral ? activeAfiliado.datos_laborales?.email_laboral.toLowerCase() : '',
          Teléfono: activeAfiliado.datos_laborales?.telefono_laboral,
          Estado: activeAfiliado.persona?.estados
        })
      }

      if (activeAfiliado.obraSociales) {
        obraSocialData.push({
          Legajo: activeAfiliado.persona?.legajo,
          Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
          'Tipo de Obra Social': activeAfiliado.obraSociales?.tipo_obra,
          'Obra Social': activeAfiliado.obraSociales?.obra_social?.toUpperCase() || ''
        })
      }

      documentacionesData.push(...activeAfiliado.documentaciones.map(doc => ({
        Legajo: activeAfiliado.persona?.legajo,
        Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
        Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
        'Tipo de Archivo': doc?.tipo_documento || '',
        'Nombre de Archivo': `https://sistema.sutepa.com.ar/uploads/${doc?.archivo}`
      })))

      familiaresData.push(...activeAfiliado.familiares.map(fam => ({
        Legajo: activeAfiliado.persona?.legajo,
        Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
        Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
        'Nombre y Apellido': fam?.nombre_familiar?.toUpperCase() || '',
        'Fecha de Nacimiento': formatDate(fam?.fecha_nacimiento_familiar),
        'Tipo de Documento': fam?.tipo_documento_familiar || '',
        Documento: fam?.documento,
        Parentesco: fam?.parentesco
      })))

      if (activeAfiliado.subsidios) {
        subsidiosData.push(...activeAfiliado.subsidios.map(subsidio => ({
          Legajo: activeAfiliado.persona?.legajo,
          Nombre: activeAfiliado.persona?.nombre?.toUpperCase() || '',
          Apellido: activeAfiliado.persona?.apellido?.toUpperCase() || '',
          'Tipo de Subsidio': subsidio?.tipo_subsidio,
          'Fecha de Solicitud': formatDate(subsidio?.fecha_solicitud),
          'Fecha de Otorgamiento': formatDate(subsidio?.fecha_otorgamiento),
          Observaciones: subsidio?.observaciones?.toUpperCase() || ''
        })))
      }
    })

    const wb = XLSX.utils.book_new()
    const personasSheet = XLSX.utils.json_to_sheet(personasData)
    const domiciliosSheet = XLSX.utils.json_to_sheet(domiciliosData)
    const datosLaboralesSheet = XLSX.utils.json_to_sheet(datosLaboralesData)
    const obraSocialSheet = XLSX.utils.json_to_sheet(obraSocialData)
    const documentacionesSheet = XLSX.utils.json_to_sheet(documentacionesData)
    const familiaresSheet = XLSX.utils.json_to_sheet(familiaresData)
    const subsidiosSheet = XLSX.utils.json_to_sheet(subsidiosData)
    const datosCompletosSheet = XLSX.utils.json_to_sheet(datosCompletosData)

    XLSX.utils.book_append_sheet(wb, personasSheet, 'Personas')
    XLSX.utils.book_append_sheet(wb, domiciliosSheet, 'Domicilios')
    XLSX.utils.book_append_sheet(wb, datosLaboralesSheet, 'Datos Laborales')
    XLSX.utils.book_append_sheet(wb, obraSocialSheet, 'Obra Social')
    XLSX.utils.book_append_sheet(wb, documentacionesSheet, 'Documentaciones')
    XLSX.utils.book_append_sheet(wb, familiaresSheet, 'Familiares')
    XLSX.utils.book_append_sheet(wb, subsidiosSheet, 'Subsidios')
    XLSX.utils.book_append_sheet(wb, datosCompletosSheet, 'Datos Completos')

    XLSX.writeFile(wb, 'afiliados.xlsx')
    setIsExporting(false)
  }

  return (
    <>
      <div>
        <Tooltip content={isExporting ? 'Exportando Excel...' : 'Exportar a Excel'}>
          <button
            type='button'
            onClick={exportToExcel}
            className={`bg-green-500 ${isExporting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
            disabled={isExporting}
          >
            {isExporting ? 'Exportando...' : 'Exportar'}
          </button>
        </Tooltip>
      </div>
    </>
  )
}
