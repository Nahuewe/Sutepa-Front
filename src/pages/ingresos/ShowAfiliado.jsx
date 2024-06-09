import React from 'react'
import { useAfiliadoStore } from '@/helpers'
import { Card } from 'flowbite-react'
import * as XLSX from 'xlsx'
import { useNavigate } from 'react-router-dom'
import { tipoDocumento, tipoDocumentoNombres, formatDate, getParentescoNameById, getTipoSubsidioNombre, getTipoEstadoCivil, getTipoNacionalidad, getTipoProvincia, getTipoSexo } from '@/constant/datos-id'

export const ShowAfiliado = () => {
  const { activeAfiliado } = useAfiliadoStore()
  const navigate = useNavigate()

  const exportToExcel = () => {
    if (!activeAfiliado) return

    const afiliadoData = activeAfiliado.persona
      ? [
          {
            Legajo: activeAfiliado.persona.legajo,
            Nombre: activeAfiliado.persona.nombre,
            Apellido: activeAfiliado.persona.apellido,
            'Correo Electrónico': activeAfiliado.persona.email,
            'Tipo de Documento': tipoDocumento[activeAfiliado.persona.tipo_documento] || '',
            DNI: activeAfiliado.persona.dni,
            CUIL: activeAfiliado.persona.cuil,
            Teléfono: activeAfiliado.persona.telefono,
            Sexo: getTipoSexo(activeAfiliado.persona.sexo_id),
            'Fecha de Nacimiento': formatDate(activeAfiliado.persona.fecha_nacimiento),
            'Fecha de Afiliación': formatDate(activeAfiliado.persona.fecha_afiliacion),
            'Estado Civil': getTipoEstadoCivil(activeAfiliado.persona.estado_civil_id),
            Nacionalidad: getTipoNacionalidad(activeAfiliado.persona.nacionalidad_id)
          }
        ]
      : []

    const domicilioData = activeAfiliado.domicilios
      ? [
          {
            Domicilio: activeAfiliado.domicilios.domicilio,
            Provincia: getTipoProvincia(activeAfiliado.domicilios.provincia_id),
            Localidad: activeAfiliado.domicilios.localidad_id,
            'Código Postal': activeAfiliado.domicilios.codigo_postal
          }
        ]
      : []

    const datosLaboralesData = activeAfiliado.datos_laborales
      ? [
          {
            'Tipo de Contrato': activeAfiliado.datos_laborales.tipo_contrato_id,
            UGL: activeAfiliado.datos_laborales.ugl_id,
            Agencia: activeAfiliado.datos_laborales.agencia_id,
            'Domicilio de Trabajo': activeAfiliado.datos_laborales.domicilio_trabajo,
            Seccional: activeAfiliado.datos_laborales.seccional_id,
            Agrupamiento: activeAfiliado.datos_laborales.agrupamiento_id,
            Tramo: activeAfiliado.datos_laborales.tramo_id,
            'Carga Horaria': activeAfiliado.datos_laborales.carga_horaria,
            'Fecha de Ingreso': formatDate(activeAfiliado.datos_laborales.fecha_ingreso),
            'Correo Electrónico Laboral': activeAfiliado.datos_laborales.email_laboral,
            Teléfono: activeAfiliado.datos_laborales.telefono_laboral
          }
        ]
      : []

    const obraSocialData = activeAfiliado.obraSociales
      ? [
          {
            'Tipo de Obra Social': activeAfiliado.obraSociales.tipo_obra,
            'Obra Social': activeAfiliado.obraSociales.obra_social
          }
        ]
      : []

    const documentacionesData = activeAfiliado.documentaciones.map(doc => ({
      'Tipo de Archivo': tipoDocumentoNombres[doc.tipo_documento_id] || '',
      'Nombre de Archivo': doc.archivo
    }))

    const familiaresData = activeAfiliado.familiares.map(fam => ({
      'Nombre y Apellido': fam.nombre_familiar,
      'Fecha de Nacimiento': formatDate(fam.fecha_nacimiento_familiar),
      'Tipo de Documento': tipoDocumento[fam.tipo_documento_familiar] || '',
      Documento: fam.documento,
      Parentesco: getParentescoNameById(fam.parentesco_id)
    }))

    const subsidiosData = activeAfiliado.subsidios
      ? activeAfiliado.subsidios.map(subsidio => ({
        'Tipo de Subsidio': getTipoSubsidioNombre(subsidio.tipo_subsidio_id),
        'Fecha de Solicitud': formatDate(subsidio.fecha_solicitud),
        'Fecha de Otorgamiento': formatDate(subsidio.fecha_otorgamiento),
        Observaciones: subsidio.observaciones
      }))
      : []

    const wb = XLSX.utils.book_new()
    const afiliadoSheet = XLSX.utils.json_to_sheet(afiliadoData)
    const domicilioSheet = XLSX.utils.json_to_sheet(domicilioData)
    const datosLaboralesSheet = XLSX.utils.json_to_sheet(datosLaboralesData)
    const obraSocialSheet = XLSX.utils.json_to_sheet(obraSocialData)
    const documentacionesSheet = XLSX.utils.json_to_sheet(documentacionesData)
    const familiaresSheet = XLSX.utils.json_to_sheet(familiaresData)
    const subsidiosSheet = XLSX.utils.json_to_sheet(subsidiosData)

    XLSX.utils.book_append_sheet(wb, afiliadoSheet, 'Afiliado')
    XLSX.utils.book_append_sheet(wb, domicilioSheet, 'Domicilio')
    XLSX.utils.book_append_sheet(wb, datosLaboralesSheet, 'Datos Laborales')
    XLSX.utils.book_append_sheet(wb, obraSocialSheet, 'Obra Social')
    XLSX.utils.book_append_sheet(wb, documentacionesSheet, 'Documentaciones')
    XLSX.utils.book_append_sheet(wb, familiaresSheet, 'Familiares')
    XLSX.utils.book_append_sheet(wb, subsidiosSheet, 'Subsidios')

    XLSX.writeFile(wb, 'AfiliadoData.xlsx')
  }

  return (
    activeAfiliado && (
      <Card>

        {/* Formulario de Persona */}

        {activeAfiliado.persona && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos Personales
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Legajo:</strong> {activeAfiliado.persona.legajo}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Nombre:</strong> {activeAfiliado.persona.nombre}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Apellido:</strong> {activeAfiliado.persona.apellido}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Correo Electronico:</strong> {activeAfiliado.persona.email}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Tipo de Documento:</strong> {activeAfiliado.persona.tipo_documento}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>DNI:</strong> {activeAfiliado.persona.dni}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>CUIL:</strong> {activeAfiliado.persona.cuil}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Teléfono:</strong> {activeAfiliado.persona.telefono}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Sexo:</strong> {getTipoSexo(activeAfiliado.persona.sexo_id)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Nacimiento:</strong> {formatDate(activeAfiliado.persona.fecha_nacimiento)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Afiliación:</strong> {formatDate(activeAfiliado.persona.fecha_afiliacion)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Estado Civil:</strong> {getTipoEstadoCivil(activeAfiliado.persona.estado_civil_id)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Nacionalidad:</strong> {getTipoNacionalidad(activeAfiliado.persona.nacionalidad_id)}
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Domicilio */}

        {activeAfiliado.domicilios && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos del Domicilio
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Domicilio:</strong> {activeAfiliado.domicilios.domicilio}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Provincia:</strong> {getTipoProvincia(activeAfiliado.domicilios.provincia_id)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>localidad:</strong> {activeAfiliado.domicilios.localidad_id}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Codigo Postal:</strong> {activeAfiliado.domicilios.codigo_postal}
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Datos Laborales */}

        {activeAfiliado.datos_laborales && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos Laborales
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Tipo de Contrato:</strong> {activeAfiliado.datos_laborales.tipo_contrato_id}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>UGL:</strong> {activeAfiliado.datos_laborales.ugl_id}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Agencia:</strong> {activeAfiliado.datos_laborales.agencia_id}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Domicilio de Trabajo:</strong> {activeAfiliado.datos_laborales.domicilio_trabajo}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Seccional:</strong> {activeAfiliado.datos_laborales.seccional_id}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Agrupamiento:</strong> {activeAfiliado.datos_laborales.agrupamiento_id}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Tramo:</strong> {activeAfiliado.datos_laborales.tramo_id}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Carga Horaria:</strong> {activeAfiliado.datos_laborales.carga_horaria}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Ingreso:</strong> {formatDate(activeAfiliado.datos_laborales.fecha_ingreso)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Correo Electronico Laboral:</strong> {activeAfiliado.datos_laborales.email_laboral}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Teléfono:</strong> {activeAfiliado.datos_laborales.telefono_laboral}
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Obra Social */}

        {activeAfiliado.obraSociales && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Datos de la Obra Social
            </h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4'>
              <div className='border-b py-2 px-4'>
                <strong>Tipo de Obra Social:</strong> {activeAfiliado.obraSociales.tipo_obra}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Obra Social:</strong> {activeAfiliado.obraSociales.obra_social}
              </div>
            </div>
          </div>
        )}

        {/* Tabla de Documentacion */}

        {activeAfiliado.documentaciones && activeAfiliado.documentaciones.length > 0 && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-600 text-white rounded-md p-2'>
              Documentación Adicional
            </h4>
            <div className='overflow-x-auto mt-4'>
              <table className='table-auto w-full'>
                <thead className='bg-gray-300 dark:bg-gray-700'>
                  <tr>
                    <th className='px-4 py-2 text-center dark:text-white'>Tipo de Archivo</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Nombre del Archivo</th>
                  </tr>
                </thead>
                <tbody className='divide-y dark:divide-gray-700'>
                  {activeAfiliado.documentaciones.map((documento, index) => (
                    <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                      <td className='px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center'>
                        {tipoDocumentoNombres[documento.tipo_documento_id] || 'Desconocido'}
                      </td>
                      <td className='px-4 py-2 text-center dark:text-white'>
                        <a href={documento.url} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline'>
                          {documento.archivo}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de Familiares */}

        {activeAfiliado.familiares && activeAfiliado.familiares.length > 0 && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-600 text-white rounded-md p-2'>
              Datos de los Familiares
            </h4>
            <div className='overflow-x-auto mt-4'>
              <table className='table-auto w-full'>
                <thead className='bg-gray-300 dark:bg-gray-700'>
                  <tr>
                    <th className='px-4 py-2 text-center dark:text-white'>Nombre y Apellido</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Nacimiento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Tipo de Documento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Documento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Parentesco</th>
                  </tr>
                </thead>
                <tbody className='divide-y dark:divide-gray-700'>
                  {activeAfiliado.familiares.map(fam => (
                    <tr key={fam.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                      <td className='px-4 py-2 text-center dark:text-white'>{fam.nombre_familiar}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.fecha_nacimiento_familiar)}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{tipoDocumento[fam.tipo_documento_familiar] || ''}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{fam.documento}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>
                        {getParentescoNameById(fam.parentesco_id)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tabla de Subsidios */}

        {activeAfiliado.subsidios && activeAfiliado.subsidios.length > 0 && (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-600 text-white rounded-md p-2'>
              Datos de los Subsidios
            </h4>
            <div className='overflow-x-auto mt-4'>
              <table className='table-auto w-full'>
                <thead className='bg-gray-300 dark:bg-gray-700'>
                  <tr>
                    <th className='px-4 py-2 text-center dark:text-white'>Tipo de Subsidio</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Solicitud</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Otorgamiento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Observaciones</th>
                  </tr>
                </thead>
                <tbody className='divide-y dark:divide-gray-700'>
                  {activeAfiliado.subsidios.map((subsidio, index) => (
                    <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                      <td className='px-4 py-2 text-center dark:text-white'>{getTipoSubsidioNombre(subsidio.tipo_subsidio_id)}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.fecha_solicitud)}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.fecha_otorgamiento)}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{subsidio.observaciones}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exportar a Excel lso datos de la vista */}

        <div className='mt-4 flex justify-end gap-4'>
          <button className='bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded' onClick={() => navigate('/afiliados')}>Volver</button>
          <button onClick={exportToExcel} className='bg-green-500 hover:bg-green-800 text-white px-4 py-2 rounded'>
            Exportar a Excel
          </button>
        </div>

      </Card>
    )
  )
}
