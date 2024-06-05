import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  persona: [],
  domicilio: [],
  datos_laborales: [],
  obra_social: [],
  familiares: [],
  documentacion: [],
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
      state.ingresos = [...state.ingresos, payload]
    },
    onUpdateIngreso: (state, { payload }) => {
      state.ingresos = state.ingresos.map((ingreso) => {
        if (ingreso.id == payload.id) {
          return ingreso
        }
        return payload
      })
      state.activeIngreso = null
    },
    onDeleteIngreso: (state, { payload }) => {
      state.ingresos = state.ingresos.filter((ingreso) => ingreso.id !== payload)
    },
    setActiveIngreso: (state, { payload }) => {
      state.activeIngreso = state.ingresos.find((ingreso) => ingreso.id === payload)
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
      const existe = state.documentacion.find((documento) => documento.id === payload.id)
      if (!existe) {
        state.documentacion = [...state.documentacion, payload]
      }
    },
    onDeleteDocumento: (state, { payload }) => {
      state.documentacion = state.documentacion.filter((documento) => documento.id !== payload)
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
    updatePersona: (state, { payload }) => {
      state.persona = payload
    },
    updateDomicilio: (state, { payload }) => {
      state.domicilio = payload
    },
    updateObraSocial: (state, { payload }) => {
      state.obra_social = payload
    },
    updateDatosLaborales: (state, { payload }) => {
      state.datos_laborales = payload
    },
    cleanActiveIngreso: (state) => {
      state.activeIngreso = null
    },
    cleanIngreso: (state) => {
      state.persona = []
      state.domicilio = []
      state.datos_laborales = []
      state.obra_social = []
      state.familiares = []
      state.documentacion = []
      state.subsidios = []
    }
  }
})

export const {
  handleIngreso,
  onAddNewIngreso,
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
