import { useForm } from 'react-hook-form'
import { useIngresoStore } from '@/helpers'
import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch } from 'react-redux'
import { cleanActiveIngreso } from '@/store/ingreso'
import * as yup from 'yup'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import AfiliadoDomicilioData from '@/components/forms/AfiliadoDomicilioData'
import InformacionLaboralData from '@/components/forms/InformacionLaboralData'
import ObraSocialAfiliadoData from '@/components/forms/ObraSocialAfiliadoData'
import FamiliarAcargoData from '@/components/forms/FamiliarAcargoData'
import DocumentacionAdicionalData from '@/components/forms/DocumentacionAdicionalData'
import SubsidioData from '@/components/forms/SubsidioData'

export const ShowIngreso = () => {
  const dispatch = useDispatch()
  const { activeIngreso } = useIngresoStore()
  const FormValidationSchema = yup
    .object().shape({
      nombre: yup.string().required('El nombre es requerido'),
      apellido: yup.string().required('El apellido es requerido'),
      legajo: yup.string().required('El legajo es requerido'),
      // fechaAfiliacion: yup.string().required('La fecha de afiliacion es requerida'),
      // nacionalidad: yup.string().required('La nacionalidad es requerida'),
      // tipoDocumento: yup.string().notOneOf([''], 'Debe seleccionar un tipo de documento'),
      // DNI: yup.string().required('El DNI es requerido'),
      // provincia: yup.string().required('La provincia es requerida'),
      // localidad: yup.string().required('La localidad es requerida'),
      // nombreFamiliar: yup.string().required('El nombre y apellido es requerido'),
      // fechaNacimiento: yup.string().notOneOf([''], 'La fecha de nacimiento es requerida'),
      // parentesco: yup.string().notOneOf([''], 'El parentesco es requerido'),
      // tipoSubsidio: yup.string().notOneOf([''], 'El tipo de subsidio es requerido'),
      // fechaSolicitud: yup.string().notOneOf([''], 'La fecha de la solicitud es requerida')
    })

  const {
    register,
    setValue
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  })

  useEffect(() => {
    if (activeIngreso) {
      Object.entries(activeIngreso).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [])

  return (
    <div className='space-y-4'>

      <DatosPersonalesData register={register} setValue={setValue} disabled />

      <AfiliadoDomicilioData register={register} setValue={setValue} disabled />

      <InformacionLaboralData register={register} setValue={setValue} disabled />

      <ObraSocialAfiliadoData register={register} setValue={setValue} disabled />

      <FamiliarAcargoData register={register} setValue={setValue} disabled />

      <DocumentacionAdicionalData register={register} setValue={setValue} disabled />

      <SubsidioData register={register} setValue={setValue} disabled />

      <div className='flex justify-end gap-4 mt-8'>
        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => dispatch(cleanActiveIngreso())}>Volver</button>
        </div>
      </div>

    </div>
  )
}
