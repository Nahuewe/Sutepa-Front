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

export const ShowIngreso = () => {
  const navigate = useNavigate()
  const { activeIngreso, startSavingIngreso, startUpdateIngreso } = useIngresoStore()

  const FormValidationSchema = yup.object().shape({
    legajo: yup.string().required('El legajo es requerido'),
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido')
  })

  const {
    handleSubmit,
    reset,
    setValue,
    disabled
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = async (ingreso) => {
    if (!activeIngreso) {
      await startSavingIngreso(ingreso)
    } else {
      await startUpdateIngreso(ingreso)
    }

    reset()
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

      <div className='flex justify-end gap-4 mt-8'>
        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/afiliados')}>Volver</button>
        </div>
      </div>
    </form>
  )
}
