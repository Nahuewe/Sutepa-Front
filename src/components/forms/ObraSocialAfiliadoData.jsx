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

      dispatch(updateObraSocial(firstObraSocial))
    } else {
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

    dispatch(updateObraSocial(formData))
  }

  useEffect(() => {
    // Llamar a updateObraSocial cuando cambien tipo_obra o obra_social y el afiliado no esté activo
    if (!activeAfiliado || activeAfiliado) {
      dispatch(updateObraSocial(formData))
    }
  }, [formData.tipo_obra, formData.obra_social, activeAfiliado, dispatch])

  useEffect(() => {
    if (activeAfiliado?.ObraSociales) {
      setFormData(activeAfiliado.ObraSociales)
      activeAfiliado.ObraSociales.forEach(item => {
        dispatch(updateObraSocial(item))
      })
    }
  }, [activeAfiliado, dispatch])

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

          <Textinput
            label='Obra Social'
            name='obra_social'
            className='mayuscula'
            register={register}
            placeholder='Especifique la obra social'
            value={formData.obra_social}
            onChange={e => onChange(e)}
          />
        </div>
      </Card>
    </div>
  )
}

export default ObraSocialAfiliadoData
