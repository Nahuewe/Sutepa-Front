import { createSlice } from '@reduxjs/toolkit'

export const dataAfiliadoSlice = createSlice({
  name: 'dataAfiliado',
  initialState: {
    legajos: {},
    sexo: [],
    estadoCivil: [],
    nacionalidad: [],
    provincia: [],
    ugl: [],
    agrupamiento: [],
    seccional: [],
    tramo: [],
    familia: [],
    documentacion: [],
    subsidio: [],
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
