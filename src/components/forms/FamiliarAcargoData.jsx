import React, { useRef, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { onAddOrUpdateFamiliar, onDeleteFamiliar } from '../../store/afiliado'
import { SelectForm } from '@/components/sutepa/forms'
import Tooltip from '@/components/ui/Tooltip'
import { Icon } from '@iconify/react'
import { sutepaApi } from '../../api'
import { formatDate } from '@/constant/datos-id'
import Numberinput from '@/components/ui/Numberinput'
import Card from '@/components/ui/Card'
import Textinput from '@/components/ui/Textinput'
import DatePicker from '../ui/DatePicker'
import moment from 'moment'
import Loading from '@/components/Loading'

const initialForm = {
  id: null,
  nombre_familiar: '',
  tipo_documento_familiar: '',
  documento: '',
  parentesco_id: '',
  fecha_nacimiento_familiar: null,
  users_id: null
}

const tipoDocumento = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'PASAPORTE', nombre: 'PASAPORTE' }
]

function FamiliaresaCargo () {
  const dispatch = useDispatch()
  const formRef = useRef()
  const { register, setValue, reset, watch } = useForm()
  const [picker, setPicker] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [familiares, setFamiliares] = useState([])
  const [editingFamiliarId, setEditingFamiliarId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [idCounter, setIdCounter] = useState(0)
  const [dni, setDni] = useState('')
  const [parentesco, setParentesco] = useState([])
  const { user } = useSelector(state => state.auth)
  const { activeAfiliado } = useSelector(state => state.afiliado)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingFamiliares, setLoadingFamiliares] = useState(false)

  async function handleParentescos () {
    const response = await sutepaApi.get('familia')
    const { data } = response.data
    setParentesco(data)
  }

  const onReset = () => {
    if (formRef.current) {
      formRef.current.reset()
    }
    setPicker(null)
    setFormData(initialForm)
    setIsEditing(false)
    setEditingFamiliarId(null)
    setDni('')
    reset()
  }

  const handleDateChange = (date) => {
    const formattedDate = date.length > 0 ? moment(date[0]).format('YYYY-MM-DD') : ''
    setFormData(prevData => ({
      ...prevData,
      fecha_nacimiento_familiar: formattedDate
    }))
    setPicker(date)
    setValue('fecha_nacimiento_familiar', formattedDate)
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

  function addOrUpdateFamiliar (newFamiliar) {
    const existingFamiliar = familiares.find(familiar => familiar.id === newFamiliar.id)

    if (isEditing) {
      setFamiliares(prevFamiliares =>
        prevFamiliares.map(familiar =>
          familiar.id === editingFamiliarId ? newFamiliar : familiar
        )
      )
      setIsEditing(false)
      setEditingFamiliarId(null)
    } else {
      if (!existingFamiliar) {
        setFamiliares(prevFamiliares => [...prevFamiliares, newFamiliar])
        setIdCounter(idCounter + 1)
      }
    }

    dispatch(onAddOrUpdateFamiliar(newFamiliar))
    onReset()
  }

  const handleAddOrUpdateFamiliar = () => {
    const newFamiliar = {
      ...formData,
      id: isEditing ? editingFamiliarId : idCounter,
      parentesco_id: parseInt(watch('parentesco_id')) || null,
      fecha_nacimiento_familiar: picker ? moment(picker[0]).format('YYYY-MM-DD') : null,
      fecha_carga: new Date(),
      users_id: user.id,
      users_nombre: user.username
    }

    addOrUpdateFamiliar(newFamiliar)
  }

  const handleEdit = familiar => {
    const fechaNacimiento = familiar.fecha_nacimiento_familiar ? moment(familiar.fecha_nacimiento_familiar, 'YYYY-MM-DD').toDate() : null
    setFormData({
      ...familiar,
      fecha_nacimiento_familiar: familiar.fecha_nacimiento_familiar
    })

    setEditingFamiliarId(familiar.id)
    setIsEditing(true)
    setPicker(fechaNacimiento ? [fechaNacimiento] : [])
    setDni(familiar.documento)

    setValue('nombre_familiar', familiar.nombre_familiar)
    setValue('tipo_documento_familiar', familiar.tipo_documento_familiar)
    setValue('documento', familiar.documento)
    setValue('parentesco_id', familiar.parentesco_id)
    setValue('fecha_nacimiento_familiar', familiar.fecha_nacimiento_familiar)
  }

  const onDelete = id => {
    const newFamiliares = familiares.filter(familiar => familiar.id !== id)
    setFamiliares(newFamiliares)
    dispatch(onDeleteFamiliar(id))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeAfiliado?.familiares) {
        if (familiares.length === 0) {
          setFamiliares(activeAfiliado.familiares)
        } else {
          const familiaresExistentesIds = familiares.map(fam => fam.id)
          const nuevosFamiliares = activeAfiliado.familiares.filter(fam => !familiaresExistentesIds.includes(fam.id))
          setFamiliares(prevFamiliares => [...prevFamiliares, ...nuevosFamiliares])
        }
      }
      setLoadingFamiliares(false)
    }, 1)

    return () => clearTimeout(timer)
  }, [activeAfiliado])

  useEffect(() => {
    loadingAfiliado()
  }, [])

  useEffect(() => {
    if (!loadingFamiliares) {
      familiares.forEach(familiar => {
        dispatch(onAddOrUpdateFamiliar(familiar))
      })
    }
  }, [familiares, loadingFamiliares, dispatch])

  async function loadingAfiliado () {
    setIsLoading(true)
    await handleParentescos()
    setIsLoading(false)
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
                    onClick={handleAddOrUpdateFamiliar}
                  >
                    {isEditing ? 'Terminar Edición' : 'Agregar Familiar'}
                  </button>
                </div>
              </form>
            </Card>

            {loadingFamiliares && (
              <Loading className='mt-28 md:mt-64' />
            )}

            {familiares.length > 0 && (
              <div className='overflow-x-auto mt-4 mb-4'>
                <table className='table-auto w-full'>
                  <thead className='bg-gray-300 dark:bg-gray-700'>
                    <tr>
                      <th className='px-4 py-2 text-center dark:text-white'>Fecha de Carga</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Nombre y Apellido</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Fecha de Nacimiento</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Tipo de Documento</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Documento</th>
                      <th className='px-4 py-2 text-center dark:text-white'>Parentesco</th>
                      {/* <th className='px-4 py-2 text-center dark:text-white'>Usuario de Carga</th> */}
                      <th className='px-4 py-2 text-center dark:text-white'>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y dark:divide-gray-700'>
                    {familiares.map(fam => (
                      <tr key={fam.id} className='bg-white dark:bg-gray-800 dark:border-gray-700'>
                        {activeAfiliado && (
                          <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.created_at || fam.fecha_carga)}</td>
                        )}
                        {!activeAfiliado && (
                          <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.fecha_carga)}</td>
                        )}
                        <td className='px-4 py-2 text-center dark:text-white mayuscula'>{fam.nombre_familiar}</td>
                        <td className='px-4 py-2 text-center dark:text-white'>{formatDate(fam.fecha_nacimiento_familiar)}</td>
                        <td className='px-4 py-2 text-center dark:text-white'>{fam.tipo_documento_familiar}</td>
                        <td className='px-4 py-2 text-center dark:text-white'>{fam.documento}</td>
                        <td className='px-4 py-2 text-center dark:text-white'>
                          {fam.parentesco || getParentescoNombre(fam.parentesco_id)}
                        </td>
                        {/* {activeAfiliado
                          ? (
                            <td className='px-4 py-2 text-center dark:text-white'>{fam.users_nombre}</td>
                            )
                          : (
                            <td className='px-4 py-2 text-center dark:text-white'>{user.username}</td>
                            )} */}
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
          </div>
          )}
    </>
  )
}

export default FamiliaresaCargo
