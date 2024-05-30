/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { toast } from 'react-toastify'
import { cleanIngreso, handleIngreso, onAddNewIngreso, onDeleteIngreso } from '../store/ingreso'

export const useIngresoStore = () => {
  const dispatch = useDispatch()
  const { ingresos, familiares, documentos, subsidios, personas, domicilio, datos_laborales, obra_social, activeIngreso } = useSelector(state => state.ingreso)
  // const { user: { uid, seccional } } = useSelector(state => state.auth) // Id de seccional del usuario

  // const startSavingIngreso = async (form) => {
  //   try {
  //     const { data } = await sutepaApi.post('/ingresos/create', { ...form, usuarioId: uid, seccionalId: seccional })

  //     if (data.ok) {
  //       dispatch(onAddNewIngreso(data.ingreso))

  //       toast.success('Afiliado creado con exito')
  //     } else {
  //       toast.error(data.message)
  //     }
  //   } catch (error) {
  //     toast.error('No se pudo agregar los datos')
  //   }
  // }

  const startSavingIngreso = async (form) => {
    try {
      const { data } = await sutepaApi.post('/personas', ...form)
      const afiliado = {
        personas,
        domicilio,
        datos_laborales,
        obra_social,
        familiares,
        documentos,
        subsidios
      }

      console.log(afiliado)
      console.log(data)
      if (data.ok) {
        dispatch(onAddNewIngreso(data.ingreso))
        dispatch(cleanIngreso())

        toast.success('Afiliado creado con exito')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('No se pudo agregar los datos')
    }
  }

  const startLoadingIngreso = async () => {
    try {
      const { data } = await sutepaApi.get('/ingresos')
      dispatch(handleIngreso(data.ingresos))
    } catch (error) {
      console.log(error)
    }
  }

  const startUpdateIngreso = async (data) => {
    try {
      const afiliado = {
        ...data
      }

      console.log(afiliado)
      // dispatch(onUpdateIngreso())

      toast.success('Afiliado actualizado con exito')
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  const startDeleteIngreso = async (id) => {
    try {
      const { data } = await sutepaApi.delete(`/ingresos/delete/${id}`)
      dispatch(onDeleteIngreso(parseInt(id)))

      if (data.ok) {
        toast.success('Afiliadoo eliminado con exito')
      }
    } catch (error) {
      toast.error('No se pudo modificar los datos')
    }
  }

  return {
    //* Propiedades
    ingresos,
    activeIngreso,

    //* Metodos
    startLoadingIngreso,
    startSavingIngreso,
    startUpdateIngreso,
    startDeleteIngreso
  }
}
