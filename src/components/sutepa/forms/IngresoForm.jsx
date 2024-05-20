import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup'
import Textinput from '@/components/ui/Textinput'
import * as yup from 'yup'
import { SelectForm } from './SelectForm'
import { useMaterialStore } from '@/helpers/useMaterialStore'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import Textarea from '../../ui/Textarea'

const FormValidationSchema = yup
  .object({
    turno: yup.string().notOneOf([''], 'Debe seleccionar un turno'),
    nombre: yup.string().required('El nombre es requerido'),
    telefono: yup.string().required('El telefono es requerido'),
    institucion: yup.string().notOneOf([''], 'Debe seleccionar una institución'),
    transporte: yup.string().notOneOf([''], 'Debe seleccionar un transporte'),
    ecocanje: yup.string().notOneOf([''], 'Debe seleccionar un ecocanje'),
    observaciones: yup.string().nullable(true)
  })
  .required()

const turno = [
  {
    id: 'Mañana',
    nombre: 'Mañana'
  },
  {
    id: 'Tarde',
    nombre: 'Tarde'
  }
]

const instituciones = [
  {
    id: 'Particular',
    nombre: 'Particular'
  },
  {
    id: 'Institución Pública',
    nombre: 'Institución Pública'
  },
  {
    id: 'Institución Privada',
    nombre: 'Institución Privada'
  }
]

const transporte = [
  {
    id: 'Caminando',
    nombre: 'Caminando'
  },
  {
    id: 'Auto',
    nombre: 'Auto'
  },
  {
    id: 'Moto',
    nombre: 'Moto'
  },
  {
    id: 'Camioneta',
    nombre: 'Camioneta'
  },
  {
    id: 'Camion',
    nombre: 'Camion'
  }
]

const ecocanje = [
  {
    id: 'Realizado',
    nombre: 'Realizado'
  },
  {
    id: 'No Realizado',
    nombre: 'No Realizado'
  }
]

export const IngresoForm = ({ activeIngreso = null, startFn }) => {
  const { startLoadingMaterials, materials } = useMaterialStore()
  const animatedComponents = makeAnimated()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    setValue
  } = useForm({
    defaultValues: {
      turno: (activeIngreso?.turno) || '',
      nombre: (activeIngreso?.nombre) || '',
      telefono: (activeIngreso?.telefono) || '',
      institucion: (activeIngreso?.institucion) || '',
      transporte: (activeIngreso?.transporte) || '',
      matricula: (activeIngreso?.matricula) || '',
      ecocanje: (activeIngreso?.ecocanje) || '',
      observaciones: (activeIngreso?.observaciones) || ''
    },
    resolver: yupResolver(FormValidationSchema)
  })

  const onSubmit = (data) => {
    startFn(data)
    reset()
  }

  useEffect(() => {
    startLoadingMaterials()
  }, [])

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 '>

        <SelectForm
          register={register('turno')}
          title='Turno'
          error={errors.turno}
          options={turno}
        />

        <Textinput
          name='nombre'
          label='Nombre'
          type='text'
          register={register}
          error={errors.nombre}
          placeholder='Nombre'
        />

        <Textinput
          name='telefono'
          label='Telefono'
          type='text'
          register={register}
          error={errors.telefono}
          placeholder='Telefono'
        />

        <SelectForm
          register={register('institucion')}
          title='Tipo de Institución'
          error={errors.institucion}
          options={instituciones}
        />

        <SelectForm
          register={register('transporte')}
          title='Tipo de Transporte'
          error={errors.transporte}
          options={transporte}
        />

        <div className='fromGroup'>
          <label htmlFor='material' className='block capitalize form-label'>
            Material
          </label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            defaultValue={
                            (activeIngreso?.material)
                              ? activeIngreso.material.map((mat) => ({ value: mat.id, label: mat.nombre }))
                              : []
                        }
            onChange={(selectedOption) => {
              const selectedMaterials = selectedOption
                ? selectedOption.map(option => ({
                  id: option.value,
                  nombre: option.label
                }))
                : []
              setValue('material', selectedMaterials)
            }}
            name='material'
            title='Material'
            error={errors.material}
            options={materials.map(material => ({
              value: material.id,
              label: material.nombre
            }))}
            className='text-sm'
            placeholder='Seleccionar material'
          />
        </div>

        <Textinput
          name='matricula'
          label='Matrícula del transporte'
          type='text'
          register={register}
          error={errors.matricula}
          placeholder='Matrícula'
        />

        <SelectForm
          register={register('ecocanje')}
          title='Ecocanje'
          error={errors.ecocanje}
          options={ecocanje}
        />

        <Textarea
          name='observaciones'
          label='Observaciones'
          register={register}
          error={errors.observaciones}
          placeholder='Observaciones'
        />

        <div className='ltr:text-right rtl:text-left'>
          <button className='btn-dark items-center text-center py-2 px-6 rounded-lg'>Guardar</button>
        </div>
      </form>
    </div>
  )
}
