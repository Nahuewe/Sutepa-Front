/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { toast } from 'react-toastify'
import { cleanIngreso, handleIngreso, onAddNewIngreso, onUpdateIngreso } from '../store/ingreso'

export const useIngresoStore = () => {
  const dispatch = useDispatch()
  const { ingresos, familiares, documentacion, subsidios, persona, domicilio, datos_laborales, obra_social, activeIngreso } = useSelector(state => state.ingreso)

  const startGetIngreso = async () => {
    try {
      const { data } = await sutepaApi.get('/personas')
      dispatch(handleIngreso(data.ingresos))
    } catch (error) {
      console.error('Error fetching ingresos:', error)
      toast.error('No se pudo obtener los ingresos')
    }
  }

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
      console.error('Error saving ingreso:', error.response ? error.response.data : error.message)
      toast.error('No se pudo agregar los datos')
    }
  }

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

      dispatch(onUpdateIngreso(data))
      dispatch(cleanIngreso())

      toast.success('Afiliado actualizado con éxito')
    } catch (error) {
      console.error('Error updating ingreso:', error.response ? error.response.data : error.message)
      toast.error('No se pudo actualizar los datos')
    }
  }

  return {
    ingresos,
    activeIngreso,
    startGetIngreso,
    startSavingIngreso,
    startUpdateIngreso
  }
}
