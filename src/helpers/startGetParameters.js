import { sutepaApi } from '../api'

export const useGetParameters = () => {
  const startSelectRoles = async () => {
    try {
      const response = await sutepaApi.get('/roles')
      const { data } = response.data

      return formatObject(data)
    } catch (error) {
      console.log(error)
    }
  }

  const startSelectSeccionales = async () => {
    try {
      const response = await sutepaApi.get('/seccional')
      const { data } = response.data

      return formatObject(data)
    } catch (error) {
      console.log(error)
    }
  }

  const formatObject = (data) => {
    const options = data.map((element) => {
      return {
        value: element.id,
        label: element.nombre
      }
    })
    return options
  }

  return {
    startSelectRoles,
    startSelectSeccionales
  }
}
