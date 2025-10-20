import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import * as yup from 'yup'
import AfiliadoDomicilioData from '@/components/forms/AfiliadoDomicilioData'
import DatosPersonalesData from '@/components/forms/DatosPersonalesData'
import DocumentacionAdicionalData from '@/components/forms/DocumentacionAdicionalData'
import FamiliarAcargoData from '@/components/forms/FamiliarAcargoData'
import InformacionLaboralData from '@/components/forms/InformacionLaboralData'
import ObraSocialAfiliadoData from '@/components/forms/ObraSocialAfiliadoData'
import SubsidioData from '@/components/forms/SubsidioData'
import LoadingData from '@/components/LoadingData'
import Button from '@/components/ui/Button'
import useFetchDatosLaborales from '@/fetches/useFetchDatosLaborales'
import useFetchDatosPersonales from '@/fetches/useFetchDatosPersonales'
import useFetchDocumentacion from '@/fetches/useFetchDocumentacion'
import useFetchDomicilio from '@/fetches/useFetchDomicilio'
import useFetchFamilia from '@/fetches/useFetchFamilia'
import useFetchSubsidio from '@/fetches/useFetchSubsidio'
import { useAfiliadoStore } from '@/helpers'

export const Create = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isLoadingAfiliado, setIsLoadingAfiliado] = useState(!!id)
  const { activeAfiliado, startSavingAfiliado, startUpdateAfiliado, startEditAfiliado, paginate } = useAfiliadoStore()
  const { user } = useSelector((state) => state.auth)
  const currentPage = paginate?.current_page || 1
  const [showLoading, setShowLoading] = useState(true)
  const hasLoadedAfiliado = useRef(false)

  const { isLoading: isLoadingDatosPersonales } = useFetchDatosPersonales()
  const { isLoading: isLoadingDatosLaborales } = useFetchDatosLaborales()
  const { isLoading: isLoadingDocumentacion } = useFetchDocumentacion()
  const { isLoading: isLoadingDomicilio } = useFetchDomicilio()
  const { isLoading: isLoadingFamilia } = useFetchFamilia()
  const { isLoading: isLoadingSubsidio } = useFetchSubsidio()

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
      if (!id || hasLoadedAfiliado.current) {
        if (!id) {
          setIsLoadingAfiliado(false)
        }
        return
      }

      hasLoadedAfiliado.current = true
      setIsLoadingAfiliado(true)

      try {
        await startEditAfiliado(id)
      } catch (error) {
        console.error('Error al cargar los datos del afiliado:', error)
      } finally {
        setIsLoadingAfiliado(false)
      }
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (activeAfiliado && hasLoadedAfiliado.current) {
      Object.entries(activeAfiliado).forEach(([key, value]) => {
        setValue(key, value)
      })
    }
  }, [activeAfiliado])

  const isAdmin = [1, 2, 3].includes(user.roles_id)
  const isSubsidio = [1, 4].includes(user.roles_id)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (
      isLoadingAfiliado ||
      isLoadingDatosPersonales ||
      isLoadingDatosLaborales ||
      isLoadingDocumentacion ||
      isLoadingDomicilio ||
      isLoadingFamilia ||
      isLoadingSubsidio
    ) {
      setShowLoading(true)
      return
    }

    const timeout = setTimeout(() => {
      setShowLoading(false)
    }, 600)

    return () => clearTimeout(timeout)
  }, [
    isLoadingAfiliado,
    isLoadingDatosPersonales,
    isLoadingDatosLaborales,
    isLoadingDocumentacion,
    isLoadingDomicilio,
    isLoadingFamilia,
    isLoadingSubsidio
  ])

  const totalFetches = 7
  const completedFetches = [
    !isLoadingAfiliado,
    !isLoadingDatosPersonales,
    !isLoadingDatosLaborales,
    !isLoadingDocumentacion,
    !isLoadingDomicilio,
    !isLoadingFamilia,
    !isLoadingSubsidio
  ].filter(Boolean).length

  const realProgress = Math.round((completedFetches / totalFetches) * 100)

  return (
    <>
      {showLoading
        ? (
          <LoadingData progress={realProgress} className='mt-28 md:mt-64' />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: isAdmin ? 'block' : 'none' }}>
              <DatosPersonalesData register={register} errors={errors} setValue={setValue} watch={watch} isLoadingParent={false} />
              <AfiliadoDomicilioData register={register} setValue={setValue} isLoadingParent={false} />
              <InformacionLaboralData register={register} setValue={setValue} watch={watch} isLoadingParent={false} />
              <ObraSocialAfiliadoData register={register} setValue={setValue} isLoadingParent={false} />
              <FamiliarAcargoData register={register} setValue={setValue} watch={watch} reset={reset} isLoadingParent={false} />
              <DocumentacionAdicionalData register={register} setValue={setValue} reset={reset} isLoadingParent={false} />
            </div>

            <div style={{ display: isSubsidio ? 'block' : 'none' }}>
              <SubsidioData register={register} setValue={setValue} reset={reset} />
            </div>

            <div className='flex justify-end gap-4 mt-8'>
              <div className='ltr:text-right rtl:text-left'>
                <button
                  type='button'
                  className='btn-danger items-center text-center py-2 px-6 rounded-lg'
                  onClick={() => navigate(`/afiliados?page=${currentPage}`)}
                >
                  Volver
                </button>
              </div>
              <div className='ltr:text-right rtl:text-left'>
                <Button
                  type='submit'
                  text={isSubmitting ? 'Guardando' : 'Guardar'}
                  className={`bg-green-500 ${isSubmitting ? 'cursor-not-allowed opacity-50' : 'hover:bg-green-700'
                    } text-white items-center text-center py-2 px-6 rounded-lg`}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </form>
          )}
    </>
  )
}
