import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import { SelectForm } from '@/components/sutepa/forms'
import { updateObraSocial } from '../../store/afiliado'

const initialForm = {
  tipo_obra: '',
  obra_social: ''
}

const tipoObraSocial = [
  { id: 'SINDICAL', nombre: 'SINDICAL' },
  { id: 'PREPAGA', nombre: 'PREPAGA' }
]

function ObraSocialAfiliadoData ({ register, setValue, disabled }) {
  const dispatch = useDispatch()
  const obraSocialState = useSelector((state) => state.obra_social)
  const [formData, setFormData] = useState(obraSocialState || initialForm)

  useEffect(() => {
    if (obraSocialState) {
      Object.entries(obraSocialState).forEach(([key, value]) => {
        setValue(key, value)
      })
      setFormData(obraSocialState)
    }
  }, [obraSocialState, setValue])

  function onChange ({ target }) {
    const { name, value } = target
    const newFormData = {
      ...formData,
      [name]: value
    }
    setFormData(newFormData)
    dispatch(updateObraSocial(newFormData))
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
              onChange={onChange} // Aquí se mantiene el cambio
            />
          </div>

          <Textinput
            label='Obra Social'
            name='obra_social'
            className='mayuscula'
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
