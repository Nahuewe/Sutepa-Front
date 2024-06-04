import Card from '@/components/ui/Card'
import Textarea from '@/components/ui/Textarea'
import { SelectForm } from '@/components/sutepa/forms'
import { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { onAddSubsidio } from '../../store/ingreso'
import { Tooltip } from 'flowbite-react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { sutepaApi } from '../../api'
import DatePicker from '../ui/DatePicker'
import moment from 'moment'

const initialForm = {
  tipo_subsidio_id: null,
  fecha_solicitud: null,
  fecha_otorgamiento: null,
  observaciones: ''
}

function SubsidioData ({ disabled }) {
  const dispatch = useDispatch()
  const { register, setValue, reset } = useForm()
  const [picker, setPicker] = useState(null)
  const [picker2, setPicker2] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [subsidios, setSubsidios] = useState([])
  const [editingSubsidioId, setEditingSubsidioId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useSelector(state => state.auth)
  const formRef = useRef()
  const [subsidio, setSubsidio] = useState([])

  function onChange ({ target }) {
    const { name, value } = target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  async function handleSubsidio () {
    const response = await sutepaApi.get('subsidio')
    const { data } = response.data
    setSubsidio(data)
  }

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date[0]
    })
    setValue(field, date[0])
    if (field === 'fecha_solicitud') {
      setPicker(date)
      setValue(field, date[0])
    } else if (field === 'fecha_otorgamiento') {
      setPicker2(date)
      setValue(field, date[0])
    }
  }

  const handleEdit = (subsidio) => {
    setFormData({
      ...subsidio,
      fecha_solicitud: picker ? moment(picker[0]).format('YYYY-MM-DD') : null,
      fecha_otorgamiento: picker2 ? moment(picker2[0]).format('YYYY-MM-DD') : null
    })
    setEditingSubsidioId(subsidio.id)
    setIsEditing(true)
    setPicker(new Date(subsidio.fecha_solicitud))
    setPicker2(new Date(subsidio.fecha_otorgamiento))

    setValue('tipo_subsidio_id', subsidio.tipo_subsidio_id)
    setValue('fecha_solicitud', subsidio.fecha_solicitud)
    setValue('fecha_otorgamiento', subsidio.fecha_otorgamiento)
    setValue('observaciones', subsidio.observaciones)
  }

  const onDelete = (id) => {
    const newSubsidios = subsidios.filter(subsidio => subsidio.id !== id)
    setSubsidios(newSubsidios)
  }

  const handleSelectChange = (e) => {
    const { value } = e.target
    const tipoSubsidioId = parseInt(value)
    setFormData((prevState) => ({
      ...prevState,
      tipo_subsidio_id: tipoSubsidioId
    }))
  }

  const onReset = () => {
    formRef.current.reset()
    setPicker(null)
    setPicker2(null)
    setFormData(initialForm)
    setIsEditing(false)
    setEditingSubsidioId(null)
    reset()
  }

  function formatDate (date) {
    return date ? new Date(date).toLocaleDateString() : ''
  }

  function getTipoSubsidioNombre (id) {
    const subsidioEncontrado = subsidio.find(s => s.id === id)
    return subsidioEncontrado ? subsidioEncontrado.nombre : ''
  }

  function addItem () {
    const newSubsidio = {
      ...formData,
      fecha_carga: new Date().toLocaleDateString(),
      id: isEditing ? editingSubsidioId : Date.now(),
      usuario_carga: user.nombre
    }

    if (isEditing) {
      setSubsidios((prevSubsidios) =>
        prevSubsidios.map((subsidio) =>
          subsidio.id === editingSubsidioId ? newSubsidio : subsidio
        )
      )
    } else {
      setSubsidios((prevSubsidios) => [...prevSubsidios, newSubsidio])
    }

    dispatch(onAddSubsidio(newSubsidio))
    onReset()
  }

  useEffect(() => {
    if (isEditing && formData) {
      setValue('tipo_subsidio_id', formData.tipo_subsidio_id)

      if (formData.fecha_solicitud) {
        const fechaSolicitud = new Date(formData.fecha_solicitud)
        if (!isNaN(fechaSolicitud)) {
          setPicker(fechaSolicitud)
          setValue('fecha_solicitud', fechaSolicitud)
        }
      }

      if (formData.fecha_otorgamiento) {
        const fechaOtorgamiento = new Date(formData.fecha_otorgamiento)
        if (!isNaN(fechaOtorgamiento)) {
          setPicker2(fechaOtorgamiento)
          setValue('fecha_otorgamiento', fechaOtorgamiento)
        }
      }
    }
  }, [formData, isEditing, setValue])

  useEffect(() => {
    handleSubsidio()
  }, [])

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Subsidios
      </h4>

      <Card>
        <form ref={formRef}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <SelectForm
              register={register('tipo_subsidio_id')}
              title='Tipo de Subsidio'
              options={subsidio}
              disabled={disabled}
              onChange={handleSelectChange}
            />

            <div>
              <label htmlFor='fecha_solicitud' className='form-label'>
                Fecha de Solicitud
              </label>
              <DatePicker
                value={picker}
                id='fecha_solicitud'
                name='fecha_solicitud'
                placeholder='Ingrese la fecha de solicitud'
                onChange={(date) => handleDateChange(date, 'fecha_solicitud')}
                disabled={disabled}
              />
              <input type='hidden' {...register('fecha_solicitud')} />
            </div>
            <div>
              <label htmlFor='fecha_otorgamiento' className='form-label'>
                Fecha de Otorgamiento
              </label>
              <DatePicker
                value={picker2}
                id='fecha_otorgamiento'
                name='fecha_otorgamiento'
                placeholder='Ingrese la fecha de otorgamiento'
                onChange={(date) => handleDateChange(date, 'fecha_otorgamiento')}
                disabled={disabled}
              />
              <input type='hidden' {...register('fecha_otorgamiento')} />
            </div>
            <div>
              <label htmlFor='observaciones' className='form-label'>
                Observaciones
              </label>
              <Textarea
                name='observaciones'
                value={formData.observaciones}
                onChange={onChange}
                register={register}
                placeholder='Ingrese algunas observaciones'
                disabled={disabled}
              />
            </div>
          </div>
          <div className='flex justify-end mt-4'>
            <button
              type='button'
              className='btn btn-primary rounded-lg'
              onClick={addItem}
              disabled={disabled}
            >
              {isEditing ? 'Terminar Edición' : 'Agregar Subsidio'}
            </button>
          </div>
        </form>
      </Card>

      {subsidios.length > 0 && (
        <div className='overflow-x-auto mt-4'>
          <table className='table-auto w-full'>
            <thead className='bg-gray-300 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                <th className='px-4 py-2 text-center dark:text-white'>Tipo de Subsidio</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Solicitud</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Otorgamiento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Observaciones</th>
                <th className='px-4 py-2 text-center dark:text-white'>Usuario de Carga</th>
                <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y dark:divide-gray-700'>
              {subsidios.map((subsidio, index) => (
                <tr key={index} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.fecha_carga)}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{getTipoSubsidioNombre(subsidio.tipo_subsidio_id)}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.fecha_solicitud)}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{formatDate(subsidio.fecha_otorgamiento)}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{subsidio.observaciones}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{subsidio.usuario_carga}</td>
                  <td className='text-center py-2 gap-4 flex justify-center'>
                    <Tooltip content='Editar'>
                      <button
                        type='button'
                        onClick={() => handleEdit(subsidio)}
                        className='text-purple-600 hover:text-purple-900'
                      >
                        <Icon icon='heroicons:pencil-square' width='24' height='24' />
                      </button>
                    </Tooltip>
                    <Tooltip content='Eliminar'>
                      <button
                        type='button'
                        onClick={() => onDelete(subsidio.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        <Icon icon='heroicons:trash' width='24' height='24' />
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default SubsidioData
