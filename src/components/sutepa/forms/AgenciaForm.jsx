import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'

const FormValidationSaving = yup
  .object({
    ugl: yup.string().required('La ugl es requerida'),
    agencia: yup.string().required('La agencia es requerida')
  })
  .required()

const FormValidationUpdate = yup
  .object({
    ugl: yup.string().required('La ugl es requerida'),
    agencia: yup.string().required('La agencia es requerida')
  })
  .required()

export const AgenciaForm = ({ fnAction, activeSeccional = null }) => {
  const [isLoading, setIsLoading] = useState(true)

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(activeSeccional ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    await fnAction(data)
  }

  async function loadingInit () {
    if (activeSeccional) {
      Object.entries(activeSeccional).forEach(([key, value]) => {
        setValue(key, value)
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadingInit()
  }, [])

  return (
    <>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
            <div>
              <label htmlFor='ugl' className='form-label space-y-2'>
                Nombre de la UGL
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='ugl'
                  type='text'
                  placeholder='Nombre de la UGL'
                  register={register}
                  error={errors.ugl}
                />
              </label>
            </div>

            <div>
              <label htmlFor='agencia' className='form-label space-y-2'>
                Nombre de la Agencia
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='agencia'
                  type='text'
                  placeholder='Nombre de la agencia'
                  register={register}
                  error={errors.agencia}
                />
              </label>
            </div>

            <div>
              <label htmlFor='domicilio_trabajo' className='form-label space-y-2'>
                Domicilio Laboral
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='domicilio_trabajo'
                  type='text'
                  placeholder='Domicilio Laboral'
                  register={register}
                />
              </label>
            </div>

            <div>
              <label htmlFor='telefono_laboral' className='form-label space-y-2'>
                Telefono Laboral
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='telefono_laboral'
                  type='text'
                  placeholder='Teléfono Laboral'
                  register={register}
                />
              </label>
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
          </form>
          )}
    </>
  )
}
