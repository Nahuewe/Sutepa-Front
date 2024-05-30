import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useIngresoStore } from '@/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import AfiliadoDomicilioData from '@/components/forms/AfiliadoDomicilioData'
import InformacionLaboralData from '@/components/forms/InformacionLaboralData'
import ObraSocialAfiliadoData from '@/components/forms/ObraSocialAfiliadoData'
import FamiliarAcargoData from '@/components/forms/FamiliarAcargoData'
import DocumentacionAdicionalData from '@/components/forms/DocumentacionAdicionalData'
import SubsidioData from '@/components/forms/SubsidioData'
import HistorialCambios from '@/components/forms/HistorialCambios'
import { useSelector } from 'react-redux'

export const ShowIngreso = () => {
  const navigate = useNavigate()
  const { activeIngreso, startSavingIngreso, startUpdateIngreso } = useIngresoStore()
  const { user } = useSelector(state => state.auth)
  const [cambios, setCambios] = useState([])

  const FormValidationSchema = yup.object().shape({
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    legajo: yup.string().required('El legajo es requerido')
  })

  const {
    handleSubmit,
    reset,
    setValue,
    disabled
  } = useForm({
    defaultValues: {
      // agencia_id: activeIngreso?.agencia_id || '',
      // agrupamiento: activeIngreso?.agrupamiento || '',
      // apellido: activeIngreso?.apellido || '',
      // carga_horaria: activeIngreso?.carga_horaria || '',
      // codigo_postal: activeIngreso?.codigo_postal || '',
      // cuil: activeIngreso?.cuil || '',
      // dni: activeIngreso?.dni || '',
      // domicilio: activeIngreso?.domicilio || '',
      // domicilio_trabajo: activeIngreso?.domicilio_trabajo || '',
      // email: activeIngreso?.email || '',
      // email_laboral: activeIngreso?.email_laboral || '',
      // fecha_afiliacion: activeIngreso?.fecha_afiliacion || '',
      // fecha_ingreso: activeIngreso?.fecha_ingreso || '',
      // fecha_nacimiento: activeIngreso?.fecha_nacimiento || '',
      // fecha_otorgamiento: activeIngreso?.fecha_otorgamiento || '',
      // fecha_solicitud: activeIngreso?.fecha_solicitud || '',
      // legajo: activeIngreso?.legajo || '',
      // localidad_id: activeIngreso?.localidad || '',
      // nacionalidad_id: activeIngreso?.nacionalidad_id || '',
      // nombre: activeIngreso?.nombre || '',
      // nombre_familiar: activeIngreso?.nombre_familiar || '',
      // obra_social: activeIngreso?.obra_social || '',
      // observaciones: activeIngreso?.observaciones || '',
      // parentesco: activeIngreso?.parentesco || '',
      // provincia_id: activeIngreso?.provincia_id || '',
      // seccional_id: activeIngreso?.seccional_id || '',
      // sexo: activeIngreso?.sexo || '',
      // telefono: activeIngreso?.telefono || '',
      // telefono_laboral: activeIngreso?.telefono_laboral || '',
      // tipo_archivo: activeIngreso?.tipo_archivo || '',
      // tipo_documento_familiar: activeIngreso?.tipo_documento_familiar || '',
      // tipo_contrato: activeIngreso?.tipo_contrato || '',
      // tipo_documento: activeIngreso?.tipo_documento || '',
      // tipo_obra: activeIngreso?.tipo_obra || '',
      // tipo_subsidio: activeIngreso?.tipo_subsidio || '',
      // tramo: activeIngreso?.tramo || '',
      // ugl_id: activeIngreso?.ugl_id || ''
    },
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = (data) => {
    const fechaCambio = new Date().toLocaleString()
    const nuevoCambio = {
      fecha_cambio: fechaCambio,
      estado: activeIngreso ? 'Actualización' : 'Nuevo Ingreso',
      usuario: user
    }
    setCambios([...cambios, nuevoCambio])

    if (!activeIngreso) {
      startSavingIngreso(data)
    } else {
      startUpdateIngreso(data)
    }

    reset()
    navigate('/afiliados')
  }

  useEffect(() => {
    if (activeIngreso) {
      Object.entries(activeIngreso).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [activeIngreso, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <DatosPersonalesData disabled={disabled} setValue={setValue} />

      <AfiliadoDomicilioData setValue={setValue} disabled={disabled} />

      <InformacionLaboralData setValue={setValue} disabled={disabled} />

      <ObraSocialAfiliadoData setValue={setValue} disabled={disabled} />

      <FamiliarAcargoData setValue={setValue} disabled={disabled} />

      <DocumentacionAdicionalData setValue={setValue} disabled={disabled} />

      <SubsidioData setValue={setValue} disabled={disabled} />

      <HistorialCambios cambios={cambios} />

      <div className='flex justify-end gap-4 mt-8'>
        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/afiliados')}>Volver</button>
        </div>
        <div className='ltr:text-right rtl:text-left'>
          <button type='submit' className='btn-success items-center text-center py-2 px-6 rounded-lg'>Guardar</button>
        </div>
      </div>
    </form>
  )
}
