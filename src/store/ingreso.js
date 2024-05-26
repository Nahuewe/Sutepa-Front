/* eslint-disable eqeqeq */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ingresos: [],
  familiares: [],
  documentos: [],
  subsidios: [],
  activeIngreso: null
}

export const ingresoSlice = createSlice({
  name: 'ingreso',
  initialState,
  reducers: {
    handleIngreso: (state, { payload }) => {
      state.ingresos = payload
      state.activeIngreso = null
    },
    onAddNewIngreso: (state, { payload }) => {
      state.ingresos.push(payload)
      state.activeIngreso = null
    },
    onAddFamiliar: (state, { payload }) => {
      const existe = state.familiares.find((familiar) => familiar.id === payload.id)
      if (!existe) {
        state.familiares = [...state.familiares, payload]
      }
    },
    onDeleteFamiliar: (state, { payload }) => {
      state.familiares = state.familiares.filter((familiar) => familiar.id !== payload)
    },
    onAddDocumento: (state, { payload }) => {
      const existe = state.documentos.find((documento) => documento.id === payload.id)
      if (!existe) {
        state.documentos = [...state.documentos, payload]
      }
    },
    onDeleteDocumento: (state, { payload }) => {
      state.documentos = state.documentos.filter((documento) => documento.id !== payload)
    },
    onAddSubsidio: (state, { payload }) => {
      const existe = state.subsidios.find((subsidio) => subsidio.id === payload.id)
      if (!existe) {
        state.subsidios = [...state.subsidios, payload]
      }
    },
    onDeleteSubsidio: (state, { payload }) => {
      state.subsidios = state.subsidios.filter((subsidio) => subsidio.id !== payload)
    },
    onUpdateIngreso: (state, { payload }) => {
      state.ingresos = state.ingresos.map((ingreso) => {
        if (ingreso.id == payload.id) { return payload }
        return ingreso
      })
      state.activeIngreso = null
    },
    setActiveIngreso: (state, { payload }) => {
      state.activeIngreso = state.ingresos.find((ingreso) => ingreso.id === payload)
    },
    onDeleteIngreso: (state, { payload }) => {
      state.ingresos = state.ingresos.filter((ingreso) => ingreso.id !== payload)
    },
    cleanActiveIngreso: (state) => {
      state.activeIngreso = null
    },
    cleanIngreso: (state) => {
      state.documentos = []
      state.familiares = []
      state.ingresos = []
    }
  }
})

export const {
  handleIngreso,
  onAddNewIngreso,
  onUpdateIngreso,
  onDeleteIngreso,
  onAddFamiliar,
  onDeleteFamiliar,
  onAddDocumento,
  onDeleteDocumento,
  onAddSubsidio,
  onDeleteSubsidio,
  setActiveIngreso,
  cleanActiveIngreso,
  cleanIngreso
} = ingresoSlice.actions

export default ingresoSlice.reducer
