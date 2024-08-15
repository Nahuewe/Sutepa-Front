/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
import { createSlice } from '@reduxjs/toolkit'

export const seccionalSlice = createSlice({
  name: 'seccional',
  initialState: {
    seccionales: [],
    seccionalesSinPaginar: [],
    paginate: null,
    activeSeccional: null,
    errorMessage: ''
  },
  reducers: {
    handleSeccional: (state, { payload }) => {
      state.seccionales = payload.data
      state.paginate = payload.meta
      state.activeSeccional = null
    },
    handleSeccionalSinpaginar: (state, { payload }) => {
      state.seccionalesSinPaginar = payload
    },
    onAddNewSeccional: (state, { payload }) => {
      state.seccionales.push(payload)
      state.activeSeccional = null
    },
    setActiveSeccional: (state, { payload }) => {
      state.seccionales.filter((seccional) => {
        if (seccional.id == payload) { return state.activeSeccional = seccional }
      })
    },
    onDeleteSeccional: (state, { payload }) => {
      state.seccionales = state.seccionales.map((seccional) => {
        if (seccional.id == payload.id) { return payload }
        return seccional
      })
      state.activeSeccional = null
    },
    onUpdateSeccional: (state, { payload }) => {
      state.seccionales = state.seccionales.map((seccional) => {
        if (seccional.id == payload.id) { return payload }
        return seccional
      })
      state.activeSeccional = null
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleSeccional,
  handleSeccionalSinpaginar,
  onAddNewSeccional,
  setActiveSeccional,
  onDeleteSeccional,
  onUpdateSeccional,
  setErrorMessage
} = seccionalSlice.actions

export default seccionalSlice.reducer
