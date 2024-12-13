import { createSlice } from '@reduxjs/toolkit'

export const dataAfiliadoSlice = createSlice({
  name: 'dataAfiliado',
  initialState: {
    legajos: JSON.parse(localStorage.getItem('legajos')) || [],
    sexo: JSON.parse(localStorage.getItem('sexo')) || [],
    estadoCivil: JSON.parse(localStorage.getItem('estadoCivil')) || [],
    nacionalidad: JSON.parse(localStorage.getItem('nacionalidad')) || [],
    provincia: JSON.parse(localStorage.getItem('provincia')) || [],
    ugl: JSON.parse(localStorage.getItem('ugl')) || [],
    seccional: JSON.parse(localStorage.getItem('seccional')) || [],
    agrupamiento: JSON.parse(localStorage.getItem('agrupamiento')) || [],
    tramo: JSON.parse(localStorage.getItem('tramo')) || [],
    documentacion: JSON.parse(localStorage.getItem('documentacion')) || [],
    familia: JSON.parse(localStorage.getItem('familia')) || [],
    subsidio: JSON.parse(localStorage.getItem('subsidio')) || [],
    errorMessage: ''
  },
  reducers: {
    handleData: (state, { payload }) => {
      const { type, data } = payload
      if (Array.isArray(data)) {
        state[type] = data
        localStorage.setItem(type, JSON.stringify(data))
      } else {
        state[type] = []
      }
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const { handleData, setErrorMessage } = dataAfiliadoSlice.actions
export default dataAfiliadoSlice.reducer
