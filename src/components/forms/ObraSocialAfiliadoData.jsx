import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SelectForm } from '@/components/sutepa/forms'
import { updateObraSocial } from '@/store/afiliado'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'

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

  function onChange ({ target }) {
    const { name, value } = target
    const newFormData = {
      ...formData,
      [name]: value
    }
    setFormData(newFormData)
    dispatch(updateObraSocial(newFormData))
  }

  useEffect(() => {
    if (activeAfiliado?.obra_social.length > 0) {
      activeAfiliado.obra_social.forEach(item => {
        dispatch(updateObraSocial(item))
      })
    }
  }, [])

  return (
    <>
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
            />
          </div>

          <Textinput
            label='Obra Social'
            name='obra_social'
            className='mayuscula'
            register={register}
            placeholder='Especifique la obra social'
            onChange={onChange}
          />
        </div>
      </Card>
    </>
  )
}

export default ObraSocialAfiliadoData
