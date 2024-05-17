import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'flowbite-react'
import ActaDataTransito from '../ActaDataTransito'
import InfractorData from '../InfractorData'
import InfraccionData from '../InfraccionData'
import CometidasData from '../CometidasData'
import VehiculoData from '../VehiculoData'
import { useCargaStore } from '@/hooks'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

function AfiliadoForm () {
  const { startSavingActa, startUpdateActa, activeActa } = useCargaStore()

  const validationSchema = yup.object().shape({
    nombre: yup.string().required("El nombre es requerido"),
    apellido: yup.string().required("El apellido es requerido"),
    legajo: yup.string().required("El legajo es requerido"),
    fechaAfiliacion: yup.string().required('La fecha de afiliacion es requerida'),
    nacionalidad: yup.string().required('La nacionalidad es requerida'),
    tipoDocumento: yup.string().notOneOf([""], "Debe seleccionar un tipo de documento"),
    dni: yup.string().required('El DNI es requerido'),
    provincia: yup.string().required("La provincia es requerida"),
    localidad: yup.string().required("La localidad es requerida"),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({ resolver: yupResolver(validationSchema) })

  const onSubmit = (data) => {
    if (!activeActa) startSavingActa(data)
    else startUpdateActa(data)
    setCreate(false)
  }

  return (
    <>
      <main>
        <form className='flex flex-col gap-4 w-full' onSubmit={handleSubmit(onSubmit)}>
          <ActaDataTransito register={register} errors={errors} setValue={setValue} tipoActa={tipoActa} />

          <InfractorData />

          <InfraccionData register={register} errors={errors} />

          <CometidasData />

          <VehiculoData />

          <input {...register('tipo_acta')} type='hidden' value='TRANSITO' />
          <div className='flex justify-end'>
            <Button type='submit' className='px-8 titulos'>
              Finalizar
            </Button>
          </div>

        </form>
      </main>
    </>
  )
}

export default AfiliadoForm
