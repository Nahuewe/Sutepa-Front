/* eslint-disable camelcase */
import { useSelector, useDispatch } from 'react-redux'
import { sutepaApi } from '../api'
import { toast } from 'react-toastify'
import { cleanIngreso, handleIngreso, onAddNewIngreso, onUpdateIngreso } from '../store/ingreso'
import { useNavigate } from 'react-router-dom'

export const useIngresoStore = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { ingresos, familiares, documentacion, subsidios, persona, domicilio, datos_laborales, obra_social, activeIngreso } = useSelector(state => state.ingreso)

  // if (!Array.isArray(ingresos)) {
  //   console.error('Error: state.ingresos is not an array')
  // }


  const startSavingIngreso = async (form) => {
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

      // dispatch(onAddNewIngreso(data.ingreso))
      // await startGetIngreso()
      // dispatch(cleanIngreso())
      navigate('/afiliados')
      toast.success('Afiliado creado con éxito')
    } catch (error) {
      console.error('Error saving ingreso:', error.response ? error.response.data : error.message)
      toast.error('No se pudo agregar los datos')
    }
  }

  const startUpdateIngreso = async () => {
    try {
      const { data } = await sutepaApi.put(`/personas/${activeIngreso.id}`, {
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

    startSavingIngreso,
    startUpdateIngreso
  }
}
