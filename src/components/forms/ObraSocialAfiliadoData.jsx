/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectForm } from '@/components/sutepa/forms'
import { updateObraSocial } from '@/store/afiliado'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import Loading from '@/components/Loading'

const initialForm = {
  tipo_obra: '',
  obra_social: ''
}

const tipoObraSocial = [
  { id: 'SINDICAL', nombre: 'SINDICAL' },
  { id: 'PREPAGA', nombre: 'PREPAGA' }
]

function ObraSocialAfiliadoData ({ register }) {
  const dispatch = useDispatch()
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [formData, setFormData] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeAfiliado && activeAfiliado.obraSociales) {
        const { tipo_obra, obra_social } = activeAfiliado.obraSociales
        setFormData({ tipo_obra, obra_social })
      } else {
        setFormData(initialForm)
      }
      setIsLoading(false)
    }, 1)

    return () => clearTimeout(timer)
  }, [activeAfiliado])

  useEffect(() => {
    if (!isLoading) {
      if (formData.tipo_obra || formData.obra_social) {
        dispatch(updateObraSocial(formData))
      }
    }
  }, [formData, dispatch, isLoading])

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
  }

  return (
    <>
      {isLoading
        ? (
          <Loading className='mt-28 md:mt-64' />
          )
        : (
          <div>
            <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
              Obra Social
            </h4>
            <Card>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label htmlFor='tipo_obra' className='form-label'>
                    Tipo de Obra Social
                  </label>
                  <SelectForm
                    register={register('tipo_obra')}
                    options={tipoObraSocial}
                    onChange={onChange}
                  />
                </div>

                <div>
                  <label htmlFor='obra_social' className='form-label'>
                    Obra Social
                  </label>
                  <Textinput
                    name='obra_social'
                    className='mayuscula'
                    register={register}
                    placeholder='Especifique la obra social'
                    onChange={onChange}
                  />
                </div>
              </div>
            </Card>
          </div>
          )}
    </>
  )
}

export default ObraSocialAfiliadoData
