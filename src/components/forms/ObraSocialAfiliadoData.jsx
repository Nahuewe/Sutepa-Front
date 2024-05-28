import React, { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import { SelectForm } from '@/components/sutepa/forms'
import { useDispatch } from 'react-redux'
import { updateObraSocial } from '../../store/ingreso'

const tipoObraSocial = [
  { id: 'SINDICAL', nombre: 'SINDICAL' },
  { id: 'PREPAGA', nombre: 'PREPAGA' }
]

function ObraSocialAfiliadoData ({ register, disabled }) {
  const dispatch = useDispatch()
  const [tipoObra, setTipoObra] = useState('')
  const [obraSocial, setObraSocial] = useState('')

  useEffect(() => {
    const obraSocialData = {
      tipo_obra: tipoObra,
      obra_social: obraSocial
    }

    dispatch(updateObraSocial(obraSocialData))
  }, [obraSocial, tipoObra, dispatch])

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
              onChange={(e) => setTipoObra(e.target.value)}
            />
          </div>

          <Textinput
            label='Obra Social'
            register={register('obra_social')}
            placeholder='Especifique la obra social'
            disabled={disabled}
            onChange={(e) => setObraSocial(e.target.value)}
          />
        </div>
      </Card>
    </>
  )
}

export default ObraSocialAfiliadoData
