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
    if (activeAfiliado?.obraSociales.length > 0) {
      const firstObraSocial = activeAfiliado.obraSociales[0] // Assuming only one obra social is active at a time
      setFormData({
        tipo_obra: firstObraSocial.tipo_obra,
        obra_social: firstObraSocial.obra_social
      })
    } else {
      setFormData(initialForm)
    }
  }, [activeAfiliado])

  const onChange = ({ target }) => {
    const { name, value } = target
    const newFormData = {
      ...formData,
      [name]: value
    }
    setFormData(newFormData)
    dispatch(updateObraSocial(newFormData))
  }

  async function loadingAfiliado () {
    !isLoading && setIsLoading(true)

    setIsLoading(false)
  }

  useEffect(() => {
    loadingAfiliado()
  }, [])

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
                  <label htmlFor='default-picker' className='form-label'>
                    Tipo de Obra Social
                  </label>
                  <SelectForm
                    register={register('tipo_obra')}
                    options={tipoObraSocial}
                    onChange={onChange}
                    value={formData.tipo_obra}
                  />
                </div>

                <Textinput
                  label='Obra Social'
                  name='obra_social'
                  className='mayuscula'
                  register={register}
                  placeholder='Especifique la obra social'
                  value={formData.obra_social}
                  onChange={onChange}
                />
              </div>
            </Card>
          </div>
          )}
    </>
  )
}

export default ObraSocialAfiliadoData
