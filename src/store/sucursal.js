/* eslint-disable eqeqeq */
import { createSlice } from '@reduxjs/toolkit'

export const sucursalSlice = createSlice({
  name: 'seccional',
  initialState: {
    seccionales: [],
    activeSeccional: null
  },
  reducers: {
    handleSeccional: (state, { payload }) => {
      state.seccionales = payload
      state.activeSeccional = null
    },
    onAddNewSeccional: (state, { payload }) => {
      state.seccionales.push(payload)
      state.activeSeccional = null
    },
    onDeleteSeccional: (state, { payload }) => {
      state.seccionales = state.seccionales.filter((seccional) => {
        if (seccional.id != payload) return seccional
      })
      state.activeSeccional = null
    },
    setactiveSeccional: (state, { payload }) => {
      state.seccionales.filter((seccional) => {
        if (seccional.id == payload) {
          state.activeSeccional = seccional
        }
      })
    },
    onUpdatesSeccional: (state, { payload }) => {
      state.seccionales = state.seccionales.map((seccional) => {
        if (seccional.id == payload.id) { return payload }
        return seccional
      })
      state.activeSucursal = null
    }
  }
})

export const {
  handleSeccional,
  onAddNewSeccional,
  onDeleteSeccional,
  setactiveSeccional,
  onUpdatesSeccional
} = sucursalSlice.actions

export default sucursalSlice.reducer
