import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAfiliadoStore } from '../../helpers'
import * as yup from 'yup'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import AfiliadoDomicilioData from '@/components/forms/AfiliadoDomicilioData'
import InformacionLaboralData from '@/components/forms/InformacionLaboralData'
import ObraSocialAfiliadoData from '@/components/forms/ObraSocialAfiliadoData'
import FamiliarAcargoData from '@/components/forms/FamiliarAcargoData'
import DocumentacionAdicionalData from '@/components/forms/DocumentacionAdicionalData'
import SubsidioData from '@/components/forms/SubsidioData'

export const Create = () => {
  const navigate = useNavigate()
  const { activeAfiliado } = useAfiliadoStore()

  const FormValidationSchema = yup.object().shape({
    legajo: yup.string().required('El legajo es requerido'),
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido')
  })

  const {
    setValue,
    disabled
  } = useForm({
    defaultValues: {
      agencia_id: activeAfiliado?.agencia_id || '',
      agrupamiento_id: activeAfiliado?.agrupamiento_id || '',
      apellido: activeAfiliado?.apellido || '',
      carga_horaria: activeAfiliado?.carga_horaria || '',
      codigo_postal: activeAfiliado?.codigo_postal || '',
      cuil: activeAfiliado?.cuil || '',
      dni: activeAfiliado?.dni || '',
      domicilio: activeAfiliado?.domicilio || '',
      domicilio_trabajo: activeAfiliado?.domicilio_trabajo || '',
      email: activeAfiliado?.email || '',
      email_laboral: activeAfiliado?.email_laboral || '',
      fecha_afiliacion: activeAfiliado?.fecha_afiliacion || '',
      fecha_ingreso: activeAfiliado?.fecha_ingreso || '',
      fecha_nacimiento: activeAfiliado?.fecha_nacimiento || '',
      fecha_otorgamiento: activeAfiliado?.fecha_otorgamiento || '',
      fecha_solicitud: activeAfiliado?.fecha_solicitud || '',
      legajo: activeAfiliado?.legajo || '',
      localidad_id: activeAfiliado?.localidad || '',
      nacionalidad_id: activeAfiliado?.nacionalidad_id || '',
      nombre: activeAfiliado?.nombre || '',
      nombre_familiar: activeAfiliado?.nombre_familiar || '',
      obra_social: activeAfiliado?.obra_social || '',
      observaciones: activeAfiliado?.observaciones || '',
      parentesco: activeAfiliado?.parentesco || '',
      provincia_id: activeAfiliado?.provincia_id || '',
      seccional_id: activeAfiliado?.seccional_id || '',
      sexo_id: activeAfiliado?.sexo_id || '',
      telefono: activeAfiliado?.telefono || '',
      telefono_laboral: activeAfiliado?.telefono_laboral || '',
      tipo_archivo: activeAfiliado?.tipo_archivo || '',
      tipo_documento_familiar: activeAfiliado?.tipo_documento_familiar || '',
      tipo_contrato: activeAfiliado?.tipo_contrato || '',
      tipo_documento: activeAfiliado?.tipo_documento || '',
      tipo_obra: activeAfiliado?.tipo_obra || '',
      tipo_subsidio: activeAfiliado?.tipo_subsidio || '',
      tramo_id: activeAfiliado?.tramo_id || '',
      ugl_id: activeAfiliado?.ugl_id || ''
    },
    resolver: yupResolver(FormValidationSchema)
  })

  useEffect(() => {
    if (activeAfiliado) {
      Object.entries(activeAfiliado).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [activeAfiliado, setValue])

  return (
    <form className='space-y-4'>
      <DatosPersonalesData disabled={disabled} setValue={setValue} />

      <AfiliadoDomicilioData setValue={setValue} disabled={disabled} />

      <InformacionLaboralData setValue={setValue} disabled={disabled} />

      <ObraSocialAfiliadoData setValue={setValue} disabled={disabled} />

      <FamiliarAcargoData setValue={setValue} disabled={disabled} />

      <DocumentacionAdicionalData setValue={setValue} disabled={disabled} />

      <SubsidioData setValue={setValue} disabled={disabled} />

      <div className='flex justify-end gap-4 mt-8'>
        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/afiliados')}>Volver</button>
        </div>
      </div>
    </form>
  )
}
