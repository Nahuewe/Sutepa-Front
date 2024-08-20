/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
import { createSlice } from '@reduxjs/toolkit'

export const agenciaSlice = createSlice({
  name: 'agencia',
  initialState: {
    agencias: [],
    agenciasSinPaginar: [],
    activeAgencia: null,
    paginate: null,
    errorMessage: ''
  },
  reducers: {
    handleAgencia: (state, { payload }) => {
      state.agencias = payload.data
      state.paginate = payload.meta
      state.activeAgencia = null
    },
    handleAgenciaSinpaginar: (state, { payload }) => {
      state.agenciasSinPaginar = payload
    },
    onAddNewAgencia: (state, { payload }) => {
      state.agencias.push(payload)
      state.activeAgencia = null
    },
    setActiveAgencia: (state, { payload }) => {
      state.agencias.filter((agencia) => {
        if (agencia.id == payload) { return state.activeAgencia = agencia }
      })
    },
    onDeleteAgencia: (state, { payload }) => {
      state.agencias = state.agencias.map((agencia) => {
        if (agencia.id == payload.id) { return payload }
        return agencia
      })
      state.activeAgencia = null
    },
    onUpdateAgencia: (state, { payload }) => {
      state.agencias = state.agencias.map((agencia) => {
        if (agencia.id == payload.id) { return payload }
        return agencia
      })
      state.activeAgencia = null
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleAgencia,
  handleAgenciaSinpaginar,
  onAddNewAgencia,
  setActiveAgencia,
  onDeleteAgencia,
  onUpdateAgencia,
  setErrorMessage
} = agenciaSlice.actions

export default agenciaSlice.reducer
