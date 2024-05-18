import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useIngresoStore } from '@/helpers'
import { useEffect } from 'react'
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
  const FormValidationSchema = yup
    .object().shape({
      nombre: yup.string().required('El nombre es requerido'),
      apellido: yup.string().required('El apellido es requerido'),
      legajo: yup.string().required('El legajo es requerido'),
      fechaAfiliacion: yup.string().required('La fecha de afiliacion es requerida'),
      nacionalidad: yup.string().required('La nacionalidad es requerida'),
      tipoDocumento: yup.string().notOneOf([''], 'Debe seleccionar un tipo de documento'),
      DNI: yup.string().required('El DNI es requerido'),
      provincia: yup.string().required('La provincia es requerida'),
      localidad: yup.string().required('La localidad es requerida')
      // nombreFamiliar: yup.string().required('El nombre y apellido es requerido'),
      // fechaNacimiento: yup.string().notOneOf([''], 'La fecha de nacimiento es requerida'),
      // parentesco: yup.string().notOneOf([''], 'El parentesco es requerido'),
      // tipoSubsidio: yup.string().notOneOf([''], 'El tipo de subsidio es requerido'),
      // fechaSolicitud: yup.string().notOneOf([''], 'La fecha de la solicitud es requerida')
    })

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = (data) => {
    if (!activeIngreso) {
      startSavingIngreso({ data })
    } else {
      startUpdateIngreso({ data })
    }

    reset()
    navigate('/ingresos')
  }

  useEffect(() => {
    if (activeIngreso) {
      Object.entries(activeIngreso).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>

      <DatosPersonalesData register={register} errors={errors} setValue={setValue} />

      <AfiliadoDomicilioData register={register} errors={errors} setValue={setValue} />

      <InformacionLaboralData register={register} errors={errors} setValue={setValue} />

      <ObraSocialAfiliadoData register={register} errors={errors} setValue={setValue} />

      <FamiliarAcargoData register={register} errors={errors} setValue={setValue} />

      <DocumentacionAdicionalData register={register} errors={errors} setValue={setValue} />

      <SubsidioData register={register} errors={errors} setValue={setValue} />

      <div className='flex justify-end gap-4 mt-8'>
        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/ingresos')}>Volver</button>
        </div>
        <div className='ltr:text-right rtl:text-left'>
          <button type='submit' className='btn-success items-center text-center py-2 px-6 rounded-lg'>Guardar</button>
        </div>
      </div>
    </form>
  )
}
