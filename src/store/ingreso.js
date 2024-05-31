/* eslint-disable eqeqeq */
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  ingresos: [],
  persona: {},
  domicilios: {},
  datos_laborales: [],
  obraSociales: {},
  familiares: [],
  documentaciones: [],
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
    onAddAgencia: (state, { payload }) => {
      const existe = state.datos_laborales.find((datosLaborales) => datosLaborales.id === payload.id)
      if (!existe) {
        state.datos_laborales.push(payload) // Push en lugar de sobrescribir el array
      }
    },
    onUpdateIngreso: (state, { payload }) => {
      state.ingresos = state.ingresos.map((ingreso) => {
        if (ingreso.id == payload.id) { return payload }
        return ingreso
      })
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
      const existe = state.documentaciones.find((documento) => documento.id === payload.id)
      if (!existe) {
        state.documentaciones = [...state.documentaciones, payload]
      }
    },
    onDeleteDocumento: (state, { payload }) => {
      state.documentaciones = state.documentaciones.filter((documento) => documento.id !== payload)
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
    updateDomicilio: (state, { payload }) => {
      state.domicilios = payload
    },
    updateObraSocial: (state, { payload }) => {
      state.obraSociales = payload
    },
    updatePersona: (state, { payload }) => {
      state.persona = payload
    },
    updateDatosLaborales: (state, { payload }) => {
      state.datos_laborales = payload
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
      state.ingresos = []
      state.persona = []
      state.domicilios = []
      state.datos_laborales = []
      state.obraSociales = []
      state.familiares = []
      state.documentaciones = []
      state.subsidios = []
    }
  }
})

export const {
  handleIngreso,
  onAddNewIngreso,
  onAddAgencia,
  updateDomicilio,
  updateObraSocial,
  updatePersona,
  updateDatosLaborales,
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
