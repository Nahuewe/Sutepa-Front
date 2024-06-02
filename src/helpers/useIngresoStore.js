/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { toast } from 'react-toastify'
import { cleanIngreso, onAddNewIngreso, onUpdateIngreso } from '../store/ingreso'

export const useIngresoStore = () => {
  const dispatch = useDispatch()
  const { ingresos, familiares, documentacion, subsidios, persona, domicilio, datos_laborales, obra_social, activeIngreso } = useSelector(state => state.ingreso)
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

  const startSavingIngreso = async () => {
    try {
      const { data } = await sutepaApi.post('/personas', {
        persona,
        domicilio,
        datos_laborales,
        obra_social,
        familiares,
        documentacion,
        subsidios
      })

      dispatch(onAddNewIngreso(data.ingreso))
      dispatch(cleanIngreso())

      toast.success('Afiliado creado con éxito')
    } catch (error) {
      toast.error('No se pudo agregar los datos')
    }
  }

  // const startLoadingIngreso = async () => {
  //   try {
  //     const { data } = await sutepaApi.get('/ingresos')
  //     dispatch(handleIngreso(data.ingresos))
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const startUpdateIngreso = async () => {
    try {
      const { data } = await sutepaApi.put(`/ingresos/${activeIngreso.id}`, {
        persona,
        domicilio,
        datos_laborales,
        obra_social,
        familiares,
        documentacion,
        subsidios
      })

      // Actualizar el estado de Redux con los datos actualizados del ingreso
      dispatch(onUpdateIngreso(data))
      dispatch(cleanIngreso())

      toast.success('Afiliado actualizado con éxito')
    } catch (error) {
      toast.error('No se pudo actualizar los datos')
    }
  }

  // const startDeleteIngreso = async (id) => {
  //   try {
  //     const { data } = await sutepaApi.delete(`/ingresos/delete/${id}`)
  //     dispatch(onDeleteIngreso(parseInt(id)))

  //     if (data.ok) {
  //       toast.success('Afiliadoo eliminado con exito')
  //     }
  //   } catch (error) {
  //     toast.error('No se pudo modificar los datos')
  //   }
  // }

  return {
    //* Propiedades
    ingresos,
    activeIngreso,

    //* Metodos
    // startLoadingIngreso,
    startSavingIngreso,
    startUpdateIngreso
    // startDeleteIngreso
  }
}
