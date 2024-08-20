import React from 'react'
import { useAfiliadoStore } from '@/helpers'
import { Card } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import { formatDate, getTipoContrato } from '@/constant/datos-id'

export const ShowAfiliado = () => {
  const { activeAfiliado, paginate } = useAfiliadoStore()
  const navigate = useNavigate()
  const currentPage = paginate?.current_page || 1

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
                <strong>Fecha de Afiliación:</strong> {formatDate(activeAfiliado.persona.fecha_afiliacion)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Nombre:</strong> <span className='mayuscula'>{activeAfiliado.persona.nombre}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Apellido:</strong> <span className='mayuscula'>{activeAfiliado.persona.apellido}</span>
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Sexo:</strong> {activeAfiliado.persona.sexo}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Nacimiento:</strong> {formatDate(activeAfiliado.persona.fecha_nacimiento)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Estado Civil:</strong> {activeAfiliado.persona.estado_civil}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Nacionalidad:</strong> {activeAfiliado.persona.nacionalidad}
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
                <strong>Correo Electronico:</strong> {activeAfiliado.persona.email}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Teléfono:</strong> {activeAfiliado.persona.telefono}
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
              <div className='border-b py-2 px-4 mayuscula'>
                <strong>Domicilio:</strong> {activeAfiliado.domicilios.domicilio}
              </div>
              <div className='border-b py-2 px-4 mayuscula'>
                <strong>Provincia:</strong> {activeAfiliado.domicilios.provincia}
              </div>
              <div className='border-b py-2 px-4 mayuscula'>
                <strong>localidad:</strong> {activeAfiliado.domicilios.localidad}
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
                <strong>Tipo de Contrato:</strong> {getTipoContrato(activeAfiliado.datos_laborales.tipo_contrato_id)}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>UGL:</strong> {activeAfiliado.datos_laborales.ugl}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Agencia:</strong> {activeAfiliado.datos_laborales.agencia}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Domicilio de Trabajo:</strong> {activeAfiliado.datos_laborales.domicilio}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Seccional:</strong> {activeAfiliado.datos_laborales.seccional}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Agrupamiento:</strong> {activeAfiliado.datos_laborales.agrupamiento}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Tramo:</strong> {activeAfiliado.datos_laborales.tramo}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Carga Horaria:</strong> {activeAfiliado.datos_laborales.carga_horaria}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Correo Electronico Laboral:</strong> {activeAfiliado.datos_laborales.email_laboral}
              </div>
              <div className='border-b py-2 px-4'>
                <strong>Fecha de Ingreso:</strong> {formatDate(activeAfiliado.datos_laborales.fecha_ingreso)}
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
              <div className='border-b py-2 px-4 mayuscula'>
                <strong>Obra Social:</strong> {activeAfiliado.obraSociales.obra_social}
              </div>
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
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Nombre y Apellido</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Nacimiento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Tipo de Documento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Documento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Parentesco</th>
                    {/* <th className='px-4 py-2 text-center dark:text-white'>Usuario de carga</th> */}
                    <th className='px-4 py-2 text-center dark:text-white'>Ultimo Cambio</th>
                  </tr>
                </thead>
                <tbody className='divide-y dark:divide-gray-700'>
                  {activeAfiliado.familiares.map(fam => (
                    <tr key={fam.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.created_at)}</td>
                      <td className='px-4 py-2 text-center dark:text-white mayuscula'>{fam.nombre_familiar}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.fecha_nacimiento_familiar)}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{fam.tipo_documento_familiar || ''}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{fam.documento}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{fam.parentesco}</td>
                      {/* <td className='px-4 py-2 text-center dark:text-white'>{fam.users_nombre}</td> */}
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Tipo de Archivo</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Vista Previa</th>
                    {/* <th className='px-4 py-2 text-center dark:text-white'>Usuario de carga</th> */}
                    <th className='px-4 py-2 text-center dark:text-white'>Ultimo Cambio</th>
                  </tr>
                </thead>
                <tbody className='divide-y dark:divide-gray-700'>
                  {activeAfiliado.documentaciones.map(documento => (
                    <tr key={documento.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(documento.created_at)}</td>
                      <td className='px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center'>
                        {documento.tipo_documento || 'Desconocido'}
                      </td>
                      <td className='px-4 py-2 text-center dark:text-white'>
                        <a
                          href={documento.archivo_url}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline dark:text-blue-400'
                        >
                          Ver Documento
                        </a>
                      </td>
                      {/* <td className='px-4 py-2 text-center dark:text-white'>{documento.users_nombre}</td> */}
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(documento.updated_at)}</td>
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
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Tipo de Subsidio</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Solicitud</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Fecha de Otorgamiento</th>
                    <th className='px-4 py-2 text-center dark:text-white'>Observaciones</th>
                    {/* <th className='px-4 py-2 text-center dark:text-white'>Usuario de carga</th> */}
                    <th className='px-4 py-2 text-center dark:text-white'>Ultimo Cambio</th>

                  </tr>
                </thead>
                <tbody className='divide-y dark:divide-gray-700'>
                  {activeAfiliado.subsidios.map(subsidio => (
                    <tr key={subsidio.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.created_at)}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{subsidio.tipo_subsidio}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.fecha_solicitud)}</td>
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.fecha_otorgamiento)}</td>
                      <td className='px-4 py-2 text-center dark:text-white mayuscula'>{subsidio.observaciones}</td>
                      {/* <td className='px-4 py-2 text-center dark:text-white'>{subsidio.users_nombre}</td> */}
                      <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.updated_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exportar a Excel lso datos de la vista */}

        <div className='mt-4 flex justify-end gap-4'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate(`/afiliados?page=${currentPage}`)}>Volver</button>
        </div>

      </Card>
    )
  )
}
