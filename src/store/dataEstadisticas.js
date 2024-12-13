import { createSlice } from '@reduxjs/toolkit'

export const dataEstadisticasSlice = createSlice({
  name: 'dataEstadisticas',
  initialState: {
    userAll: JSON.parse(localStorage.getItem('userAll')) || [],
    seccionalAll: JSON.parse(localStorage.getItem('seccionalAll')) || [],
    personaAll: JSON.parse(localStorage.getItem('personaAll')) || [],
    estadisticas: JSON.parse(localStorage.getItem('estadisticas')) || [],
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

export const {
  handleData,
  setErrorMessage
} = dataEstadisticasSlice.actions

export default dataEstadisticasSlice.reducer
