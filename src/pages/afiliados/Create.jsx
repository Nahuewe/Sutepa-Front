import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { useAfiliadoStore } from '@/helpers'
import { yupResolver } from '@hookform/resolvers/yup'
import { useSelector } from 'react-redux'
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
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isParamsLoading] = useState(true)
  const { activeAfiliado, startSavingAfiliado, startUpdateAfiliado, startEditAfiliado } = useAfiliadoStore()
  const { user } = useSelector((state) => state.auth)

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
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = async (data) => {
    if (!activeAfiliado) {
      await startSavingAfiliado(data)
    } else {
      await startUpdateAfiliado(activeAfiliado.persona.id)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        if (id) {
          await startEditAfiliado(id)
        }
      } catch (error) {
        console.error('Error al cargar los datos del afiliado:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (!id) return setIsLoading(false)
    if (id && !isParamsLoading) {
      startEditAfiliado(id)
    }
  }, [isParamsLoading, id])

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
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {[1, 2, 3].includes(user.roles_id) && (
              <div>
                <DatosPersonalesData register={register} errors={errors} setValue={setValue} watch={watch} isLoadingParent={isLoading} />
                <AfiliadoDomicilioData register={register} setValue={setValue} isLoadingParent={isLoading} />
                <InformacionLaboralData register={register} setValue={setValue} watch={watch} isLoadingParent={isLoading} />
                <ObraSocialAfiliadoData register={register} setValue={setValue} isLoadingParent={isLoading} />
                <FamiliarAcargoData register={register} setValue={setValue} watch={watch} reset={reset} isLoadingParent={isLoading} />
                <DocumentacionAdicionalData register={register} setValue={setValue} reset={reset} isLoadingParent={isLoading} />
              </div>
            )}
            {[1, 2, 4].includes(user.roles_id) && (
              <SubsidioData register={register} setValue={setValue} reset={reset} />
            )}
            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate('/afiliados')}
                >
                  Volver
                </button>
              </div>
              <div className='ltr:text-right rtl:text-left'>
                <Button
                  type='submit'
                  text={isSubmitting ? 'Guardando' : 'Guardar'}
                  className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'} text-white items-center text-center py-2 px-6 rounded-lg`}
                  disabled={isSubmitting}
                  onClick={isSubmitting ? undefined : handleSubmit}
                />
              </div>
            </div>
          </form>
          )}
    </>
  )
}
