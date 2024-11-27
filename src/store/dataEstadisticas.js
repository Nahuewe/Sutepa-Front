import { createSlice } from '@reduxjs/toolkit'

export const dataEstadisticasSlice = createSlice({
  name: 'dataEstadisticas',
  initialState: {
    userAll: [],
    seccionalAll: [],
    estadisticas: [],
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
