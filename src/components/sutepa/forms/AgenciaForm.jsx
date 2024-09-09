import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import { SelectForm } from '@/components/sutepa/forms'
import { sutepaApi } from '../../../api'

const FormValidationSaving = yup
  .object({
    ugl_id: yup.string().notOneOf([''], 'Debe seleccionar una ugl'),
    nombre: yup.string().required('La agencia es requerida')
  })
  .required()

const FormValidationUpdate = yup
  .object({
    ugl_id: yup.string().notOneOf([''], 'Debe seleccionar una ugl'),
    nombre: yup.string().required('La agencia es requerida')
  })
  .required()

export const AgenciaForm = ({ fnAction, activeAgencia = null }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isUglLoading, setIsUglLoading] = useState(true)
  const [ugl, setUgl] = useState([])

  async function handleUgl () {
    try {
      const response = await sutepaApi.get('ugl')
      const { data } = response.data
      setUgl(data)
      setIsUglLoading(false)
    } catch (error) {
      console.error('Error al obtener UGLs:', error)
      setIsUglLoading(false)
    }
  }

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue
  } = useForm({
    resolver: yupResolver(activeAgencia ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    await fnAction(data)
  }

  async function loadingInit () {
    if (activeAgencia) {
      setValue('ugl_id', activeAgencia.ugl_id)
      setValue('nombre', activeAgencia.nombre)
      setValue('domicilio_trabajo', activeAgencia.domicilio_trabajo)
      setValue('telefono_laboral', activeAgencia.telefono_laboral)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    handleUgl()
  }, [])

  useEffect(() => {
    if (ugl.length > 0) {
      loadingInit()
    }
  }, [ugl, activeAgencia])

  return (
    <>
      {isLoading || isUglLoading
        ? (
          <Loading />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
            <div>
              <label htmlFor='ugl_id' className='form-label space-y-2'>
                UGL
                <strong className='obligatorio'>(*)</strong>
                <SelectForm
                  register={register('ugl_id')}
                  options={ugl}
                />
              </label>
            </div>

            <div>
              <label htmlFor='nombre' className='form-label space-y-2'>
                Agencia
                <strong className='obligatorio'>(*)</strong>
                <Textinput
                  name='nombre'
                  type='text'
                  placeholder='Nombre de la agencia'
                  register={register}
                  error={errors.nombre}
                />
              </label>
            </div>

            <div>
              <label htmlFor='domicilio_trabajo' className='form-label space-y-2'>
                Domicilio Laboral
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
                Teléfono Laboral
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
              />
            </div>
          </form>
          )}
    </>
  )
}
