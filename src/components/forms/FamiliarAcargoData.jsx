import React, { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { onAddOrUpdateFamiliar, onDeleteFamiliar } from '../../store/afiliado'
import Numberinput from '@/components/ui/Numberinput'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import { SelectForm } from '@/components/sutepa/forms'
import { Tooltip } from 'flowbite-react'
import { Icon } from '@iconify/react'
import { sutepaApi } from '../../api'
import DatePicker from '../ui/DatePicker'
import moment from 'moment'

const initialForm = {
  id: null,
  nombre_familiar: '',
  tipo_documento_familiar: '',
  documento: '',
  parentesco_id: '',
  fecha_nacimiento_familiar: null
}

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'PASAPORTE', nombre: 'PASAPORTE' }
]

function FamiliaresaCargo () {
  const dispatch = useDispatch()
  const { register, setValue, reset, watch } = useForm()
  const [picker, setPicker] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [familiares, setFamiliares] = useState([])
  const [editingFamiliarId, setEditingFamiliarId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const { user } = useSelector(state => state.auth)
  const formRef = useRef()
  const [idCounter, setIdCounter] = useState(0)
  const [dni, setDni] = useState('')
  const [parentesco, setParentesco] = useState([])

  async function handleParentescos () {
    const response = await sutepaApi.get('familia')
    const { data } = response.data
    setParentesco(data)
  }

  const handleEdit = (familiar) => {
    setFormData({
      ...familiar,
      fecha_nacimiento_familiar: familiar.fecha_nacimiento_familiar ? moment.utc(familiar.fecha_nacimiento_familiar).format('YYYY-MM-DD') : null
    })
    setEditingFamiliarId(familiar.id)
    setIsEditing(true)
    setPicker(new Date(familiar.fecha_nacimiento_familiar))
    setDni(familiar.documento)

    setValue('nombre_familiar', familiar.nombre_familiar)
    setValue('tipo_documento_familiar', familiar.tipo_documento_familiar)
    setValue('documento', familiar.documento)
    setValue('parentesco_id', familiar.parentesco_id)
    setValue('fecha_nacimiento_familiar', familiar.fecha_nacimiento_familiar ? moment.utc(familiar.fecha_nacimiento_familiar).format('YYYY-MM-DD') : '')
  }

  const onDelete = (id) => {
    const newFamiliares = familiares.filter(familiar => familiar.id !== id)
    setFamiliares(newFamiliares)
    dispatch(onDeleteFamiliar(id))
  }

  const onReset = () => {
    formRef.current.reset()
    setPicker(null)
    setFormData(initialForm)
    setIsEditing(false)
    setEditingFamiliarId(null)
    setDni('')
    reset()
  }

  function formatDate (date) {
    return date ? moment.utc(date).format('DD/MM/YYYY') : ''
  }

  const handleDateChange = (date) => {
    setPicker(date)
    setValue('fecha_nacimiento_familiar', date[0])
    setFormData((prevState) => ({
      ...prevState,
      fecha_nacimiento_familiar: moment.utc(date[0]).format('YYYY-MM-DD')
    }))
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleDniChange = e => {
    const value = e.target.value
    const cleanedValue = value.replace(/[^\d]/g, '')
    const dniFormat = /^(\d{1,2})(\d{3})(\d{3})$/
    let formattedDni = ''
    const maxLength = 8

    if (cleanedValue.length > maxLength) {
      return
    }

    if (cleanedValue.length > 1 && cleanedValue.length <= 9) {
      if (cleanedValue.length <= 5) {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      } else {
        formattedDni = cleanedValue.replace(dniFormat, '$1.$2.$3')
      }
    } else {
      formattedDni = cleanedValue
    }

    setDni(formattedDni)
    setFormData(prevData => ({ ...prevData, documento: formattedDni }))
  }

  const getParentescoNombre = id => {
    const parentescoObj = parentesco.find(item => item.id === id)
    return parentescoObj ? parentescoObj.nombre : ''
  }

  function addFamiliar () {
    const newFamiliar = {
      ...formData,
      id: isEditing ? editingFamiliarId : idCounter,
      parentesco_id: parseInt(watch('parentesco_id')) || null,
      fecha_nacimiento_familiar: picker ? moment.utc(picker[0]).format('YYYY-MM-DD') : null,
      fecha_carga: moment.utc().format('DD/MM/YYYY'),
      user_id: user.id
    }

    if (isEditing) {
      setFamiliares((prevFamiliares) =>
        prevFamiliares.map((familiar) =>
          familiar.id === editingFamiliarId ? newFamiliar : familiar
        )
      )
    } else {
      setFamiliares((prevFamiliares) => [...prevFamiliares, newFamiliar])
      setIdCounter(idCounter + 1)
    }

    dispatch(onAddOrUpdateFamiliar(newFamiliar))
    onReset()
  }

  useEffect(() => {
    handleParentescos()
  }, [])

  return (
    <>
      <h4 className='card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2'>
        Familiares a Cargo
      </h4>

      <Card>
        <form ref={formRef}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='nombre' className='form-label'>
                Nombre y Apellido
              </label>
              <Textinput
                name='nombre_familiar'
                type='text'
                className='mayuscula'
                register={register}
                placeholder='Ingrese el nombre y apellido'
                value={formData.nombre_familiar}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor='fecha_nacimiento_familiar' className='form-label'>
                Fecha de Nacimiento
              </label>
              <DatePicker
                value={picker}
                id='fecha_nacimiento_familiar'
                className='mayuscula'
                onChange={handleDateChange}
                placeholder='Ingrese la fecha de nacimiento'

              />
              <input type='hidden' {...register('fecha_nacimiento_familiar')} />
            </div>

            <SelectForm
              register={register('tipo_documento_familiar')}
              title='Tipo de Documento'
              className='mayuscula'
              options={tipoDocumento}
              value={formData.tipo_documento_familiar}
              onChange={e => setFormData({ ...formData, tipo_documento_familiar: e.target.value })}
            />

            <Numberinput
              label='Documento'
              register={register}
              id='documento'
              placeholder='Ingrese el documento'
              value={dni}
              onChange={handleDniChange}
            />

            <SelectForm
              register={register('parentesco_id')}
              title='Parentesco'
              options={parentesco}
              value={formData.parentesco_id}
              onChange={e => handleInputChange(e)}
            />

          </div>
          <div className='flex justify-end mt-4 gap-4'>
            <button
              type='button'
              className={`btn rounded-lg ${isEditing ? 'btn-purple' : 'btn-primary'}`}
              onClick={addFamiliar}
            >
              {isEditing ? 'Terminar Edición' : 'Agregar Familiar'}
            </button>
          </div>
        </form>
      </Card>

      {familiares.length > 0 && (
        <div className='overflow-x-auto mt-4'>
          <table className='table-auto w-full'>
            <thead className='bg-gray-300 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                <th className='px-4 py-2 text-center dark:text-white'>Nombre y Apellido</th>
                <th className='px-4 py-2 text-center dark:text-white'>Fecha de Nacimiento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Tipo de Documento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Documento</th>
                <th className='px-4 py-2 text-center dark:text-white'>Parentesco</th>
                <th className='px-4 py-2 text-center dark:text-white'>Usuario de Carga</th>
                <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y dark:divide-gray-700'>
              {familiares.map(fam => (
                <tr key={fam.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                  <td className='px-4 py-2 text-center dark:text-white'>{fam.fecha_carga}</td>
                  <td className='px-4 py-2 text-center dark:text-white mayuscula'>{fam.nombre_familiar}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.fecha_nacimiento_familiar)}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{fam.tipo_documento_familiar}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>{fam.documento}</td>
                  <td className='px-4 py-2 text-center dark:text-white'>
                    {getParentescoNombre(fam.parentesco_id)}
                  </td>
                  <td className='px-4 py-2 text-center dark:text-white'>{user.username}</td>
                  <td className='text-center py-2 gap-4 flex justify-center'>
                    <Tooltip content='Editar'>
                      <button
                        type='button'
                        onClick={() => handleEdit(fam)}
                        className='text-purple-600 hover:text-purple-900'
                      >
                        <Icon icon='heroicons:pencil-square' width='24' height='24' />
                      </button>
                    </Tooltip>
                    <Tooltip content='Eliminar'>
                      <button
                        type='button'
                        onClick={() => onDelete(fam.id)}
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

export default FamiliaresaCargo
