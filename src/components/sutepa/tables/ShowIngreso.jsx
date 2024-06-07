import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import AfiliadoDomicilioData from '@/components/forms/AfiliadoDomicilioData'
import InformacionLaboralData from '@/components/forms/InformacionLaboralData'
import ObraSocialAfiliadoData from '@/components/forms/ObraSocialAfiliadoData'
import FamiliarAcargoData from '@/components/forms/FamiliarAcargoData'
import DocumentacionAdicionalData from '@/components/forms/DocumentacionAdicionalData'
import SubsidioData from '@/components/forms/SubsidioData'
import Loading from '@/components/Loading'

export const ShowIngreso = ({ disabled }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { startLoadingActiveAfiliado, activeAfiliado } = useAfiliadoStore()
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver()
  })

  useEffect(() => {
    if (id) {
      startLoadingActiveAfiliado(id).then(() => {
        setIsLoading(false)
      })
    }
  }, [id, startLoadingActiveAfiliado])

  useEffect(() => {
    if (activeAfiliado) {
      Object.entries(activeAfiliado).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [activeAfiliado, setValue])

  return (
    <>
      {isLoading
        ? <Loading className='mt-28 md:mt-64' />
        : (
          <form className='space-y-4'>
            <DatosPersonalesData register={register} errors={errors} setValue={setValue} watch={watch} disabled={disabled} />

            <AfiliadoDomicilioData register={register} setValue={setValue} disabled={disabled} />

            <InformacionLaboralData register={register} setValue={setValue} watch={watch} disabled={disabled} />

            <ObraSocialAfiliadoData register={register} setValue={setValue} disabled={disabled} />

            <FamiliarAcargoData register={register} setValue={setValue} watch={watch} disabled={disabled} />

            <DocumentacionAdicionalData register={register} setValue={setValue} disabled={disabled} />

            <SubsidioData register={register} setValue={setValue} disabled={disabled} />

            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button className='btn-danger items-center text-center py-2 px-6 rounded-lg' onClick={() => navigate('/afiliados')}>Volver</button>
              </div>
              <div className='ltr:text-right rtl:text-left'>
                <button type='submit' className='btn-success items-center text-center py-2 px-6 rounded-lg'>Guardar</button>
              </div>
            </div>
          </form>
          )}
    </>
  )
}
