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
    if (activeAfiliado && Array.isArray(activeAfiliado.obraSociales) && activeAfiliado.obraSociales.length > 0) {
      const firstObraSocial = activeAfiliado.obraSociales[0]
      setFormData({
        tipo_obra: firstObraSocial.tipo_obra,
        obra_social: firstObraSocial.obra_social
      })
      // Despachar la acción para actualizar la obra social seleccionada
      dispatch(updateObraSocial({
        tipo_obra: firstObraSocial.tipo_obra,
        obra_social: firstObraSocial.obra_social
      }))
    } else {
      // Si no hay datos válidos, reiniciar el formulario
      setFormData(initialForm)
    }
    setIsLoading(false)
  }, [activeAfiliado, dispatch])

  const onChange = ({ target }) => {
    const { name, value } = target
    const newFormData = {
      ...formData,
      [name]: value
    }
    setFormData(newFormData)
    // Despachar la acción para actualizar la obra social seleccionada
    dispatch(updateObraSocial(newFormData))
  }

  if (isLoading) {
    return <Loading className='mt-28 md:mt-64' />
  }

  return (
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
              onChange={e => onChange(e)}
              value={formData.tipo_obra}
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
              value={formData.obra_social}
              onChange={e => onChange(e)}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ObraSocialAfiliadoData
