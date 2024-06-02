import React, { useState } from 'react'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import { SelectForm } from '@/components/sutepa/forms'

const initialForm = {
  tipo_obra: '',
  obra_social: ''
}

const tipoObraSocial = [
  { id: 'SINDICAL', nombre: 'SINDICAL' },
  { id: 'PREPAGA', nombre: 'PREPAGA' }
]

function ObraSocialAfiliadoData ({ register, disabled }) {
  const [formData, setFormData] = useState(initialForm)

  function onChange ({ target }) {
    const { name, value } = target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

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
              disabled={disabled}
              onChange={(e) => onChange(e)} // Modificado para enviar el evento completo
            />
          </div>

          <Textinput
            label='Obra Social'
            name='obra_social'
            register={register}
            placeholder='Especifique la obra social'
            disabled={disabled}
            onChange={onChange}
          />
        </div>
      </Card>
    </>
  )
}

export default ObraSocialAfiliadoData
