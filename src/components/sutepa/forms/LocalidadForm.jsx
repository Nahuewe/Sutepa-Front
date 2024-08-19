import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Textinput from '@/components/ui/Textinput'
import Button from '@/components/ui/Button'
import Loading from '@/components/Loading'
import { sutepaApi } from '../../../api'
import { Label, Select } from 'flowbite-react'

const FormValidationSaving = yup
  .object({
    nombre: yup.string().required('El nombre es requerido'),
    provincia_id: yup.string().required('La provincia es requerida')
  })
  .required()

const FormValidationUpdate = yup
  .object({
    nombre: yup.string().required('El nombre es requerido'),
    provincia_id: yup.string().required('La provincia es requerida')
  })
  .required()

export const LocalidadForm = ({ fnAction, activeLocalidad = null }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [provincias, setProvincias] = useState([])
  const [provinciaMap, setProvinciaMap] = useState({})

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      nombre: activeLocalidad?.nombre || '',
      provincia_id: activeLocalidad?.provincia_id || ''
    },
    resolver: yupResolver(activeLocalidad ? FormValidationUpdate : FormValidationSaving)
  })

  const onSubmit = async (data) => {
    await fnAction(data)
  }

  const loadProvincias = async () => {
    try {
      const response = await sutepaApi.get('/provincia')
      const { data } = response.data
      setProvincias(data)
      const map = data.reduce((acc, provincia) => {
        acc[provincia.nombre] = provincia.id
        return acc
      }, {})
      setProvinciaMap(map)
    } catch (error) {
      console.error('Error al cargar las provincias:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProvincias()
  }, [])

  useEffect(() => {
    if (activeLocalidad) {
      const provinciaId = provinciaMap[activeLocalidad.provincia] || ''
      setValue('provincia_id', provinciaId)
    }
  }, [activeLocalidad, provinciaMap, setValue])

  return (
    <>
      {isLoading
        ? (
          <Loading />
          )
        : (
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 relative'>
            <div>
              <div className='mb-2 block dark:text-white'>
                <Label color='gray' htmlFor='provincia_id' value='Provincia' />
                <strong className='obligatorio'>(*)</strong>
              </div>
              <Select
                id='provincia_id'
                {...register('provincia_id')}
                className={`form-select ${errors.provincia_id ? 'border-red-500' : ''}`}
              >
                <option value='' hidden>Seleccione una provincia</option>
                {provincias.map((provincia) => (
                  <option key={provincia.id} value={provincia.id}>
                    {provincia.nombre}
                  </option>
                ))}
              </Select>
              {errors.provincia_id && <p className='text-red-500'>{errors.provincia_id.message}</p>}
            </div>

            <div className='mb-4'>
              <div className='mb-2 block dark:text-white'>
                <Label color='gray' htmlFor='nombre' value='Nombre de la Localidad' />
                <strong className='obligatorio'>(*)</strong>
              </div>
              <Textinput
                name='nombre'
                type='text'
                placeholder='Nombre de la localidad'
                register={register}
                error={errors.nombre}
              />
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
