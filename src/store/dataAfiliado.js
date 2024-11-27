import { createSlice } from '@reduxjs/toolkit'

export const dataAfiliadoSlice = createSlice({
  name: 'dataAfiliado',
  initialState: {
    legajos: {},
    estadoCivil: [],
    provincia: [],
    nacionalidad: [],
    documentacion: [],
    familia: [],
    subsidio: [],
    sexo: [],
    agrupamiento: [],
    seccional: [],
    ugl: [],
    tramo: [],
    errorMessage: ''
  },
  reducers: {
    handleData: (state, { payload }) => {
      const { type, data } = payload
      if (Array.isArray(data)) {
        state[type] = data
      } else {
        state[type] = []
      }
    },

    // Función para manejar errores
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleData,
  setErrorMessage
} = dataAfiliadoSlice.actions

export default dataAfiliadoSlice.reducer
