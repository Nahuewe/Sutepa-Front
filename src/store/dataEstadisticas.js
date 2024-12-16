import { createSlice } from '@reduxjs/toolkit'

export const dataEstadisticasSlice = createSlice({
  name: 'dataEstadisticas',
  initialState: {
    userAll: [],
    seccionalAll: [],
    personaAll: [],
    estadisticas: [],
    errorMessage: ''
  },
  reducers: {
    handleData: (state, { payload }) => {
      const { type, data } = payload
      if (Array.isArray(data) && data.length > 0) {
        state[type] = data
      } else {
        console.warn(`Invalid or empty data received for ${type}`)
      }
    },

    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleData,
  setErrorMessage
} = dataEstadisticasSlice.actions

export default dataEstadisticasSlice.reducer
