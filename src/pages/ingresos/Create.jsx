import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import AfiliadoDomicilioData from '@/components/forms/AfiliadoDomicilioData'
import InformacionLaboralData from '@/components/forms/InformacionLaboralData'
import ObraSocialAfiliadoData from '@/components/forms/ObraSocialAfiliadoData'
import FamiliarAcargoData from '@/components/forms/FamiliarAcargoData'
import DocumentacionAdicionalData from '@/components/forms/DocumentacionAdicionalData'
import SubsidioData from '@/components/forms/SubsidioData'
import Loading from '@/components/Loading'
import Button from '@/components/ui/Button'

export const Create = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const { activeAfiliado, startSavingAfiliado, startUpdateAfiliado, startLoadingAfiliado } = useAfiliadoStore()

  const FormValidationSchema = yup.object().shape({
    legajo: yup.string().required('El legajo es requerido'),
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    dni: yup.string().required('El DNI es requerido'),
    cuil: yup.string().required('El CUIL es requerido')
  })

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setValue,
    watch
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

  const onSubmit = async (afiliado) => {
    if (!activeAfiliado) {
      await startSavingAfiliado(afiliado)
    } else {
      await startUpdateAfiliado(afiliado)
    }

    reset()
    // navigate('/afiliados')
  }

  useEffect(() => {
    if (activeAfiliado) {
      Object.entries(activeAfiliado).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [activeAfiliado, setValue])

  async function loadingAfiliado (page = 1) {
    !isLoading && setIsLoading(true)

    await startLoadingAfiliado(page)
    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

  return (
    <>
      {
        (isLoading)
          ? <Loading className='mt-28 md:mt-64' />
          : (
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
                  <Button type='submit' text='Guardar' className='btn btn-success rounded-lg items-center text-center py-2 px-6' isLoading={isSubmitting} />
                </div>
              </div>
            </form>
            )
      }
    </>
  )
}
