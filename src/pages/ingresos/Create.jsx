import { useEffect } from 'react'
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

export const Create = () => {
  const navigate = useNavigate()
  const { activeIngreso, startSavingIngreso, startUpdateIngreso } = useIngresoStore()

  const FormValidationSchema = yup.object().shape({
    legajo: yup.string().required('El legajo es requerido'),
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido')
  })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: {
      agencia_id: activeIngreso?.agencia_id || '',
      agrupamiento_id: activeIngreso?.agrupamiento_id || '',
      apellido: activeIngreso?.apellido || '',
      carga_horaria: activeIngreso?.carga_horaria || '',
      codigo_postal: activeIngreso?.codigo_postal || '',
      cuil: activeIngreso?.cuil || '',
      dni: activeIngreso?.dni || '',
      domicilio: activeIngreso?.domicilio || '',
      domicilio_trabajo: activeIngreso?.domicilio_trabajo || '',
      email: activeIngreso?.email || '',
      email_laboral: activeIngreso?.email_laboral || '',
      fecha_afiliacion: activeIngreso?.fecha_afiliacion || '',
      fecha_ingreso: activeIngreso?.fecha_ingreso || '',
      fecha_nacimiento: activeIngreso?.fecha_nacimiento || '',
      fecha_otorgamiento: activeIngreso?.fecha_otorgamiento || '',
      fecha_solicitud: activeIngreso?.fecha_solicitud || '',
      legajo: activeIngreso?.legajo || '',
      localidad_id: activeIngreso?.localidad || '',
      nacionalidad_id: activeIngreso?.nacionalidad_id || '',
      nombre: activeIngreso?.nombre || '',
      nombre_familiar: activeIngreso?.nombre_familiar || '',
      obra_social: activeIngreso?.obra_social || '',
      observaciones: activeIngreso?.observaciones || '',
      parentesco: activeIngreso?.parentesco || '',
      provincia_id: activeIngreso?.provincia_id || '',
      seccional_id: activeIngreso?.seccional_id || '',
      sexo_id: activeIngreso?.sexo_id || '',
      telefono: activeIngreso?.telefono || '',
      telefono_laboral: activeIngreso?.telefono_laboral || '',
      tipo_archivo: activeIngreso?.tipo_archivo || '',
      tipo_documento_familiar: activeIngreso?.tipo_documento_familiar || '',
      tipo_contrato: activeIngreso?.tipo_contrato || '',
      tipo_documento: activeIngreso?.tipo_documento || '',
      tipo_obra: activeIngreso?.tipo_obra || '',
      tipo_subsidio: activeIngreso?.tipo_subsidio || '',
      tramo_id: activeIngreso?.tramo_id || '',
      ugl_id: activeIngreso?.ugl_id || ''
    },
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = (ingreso) => {
    if (!activeIngreso) {
      startSavingIngreso(ingreso)
    } else {
      startUpdateIngreso(ingreso)
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
      <DatosPersonalesData register={register} errors={errors} setValue={setValue} watch={watch} />

      <AfiliadoDomicilioData register={register} setValue={setValue} />

      <InformacionLaboralData register={register} setValue={setValue} watch={watch} />

      <ObraSocialAfiliadoData register={register} setValue={setValue} />

      <FamiliarAcargoData register={register} setValue={setValue} watch={watch} />

      <DocumentacionAdicionalData register={register} setValue={setValue} />

      <SubsidioData register={register} setValue={setValue} />

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
