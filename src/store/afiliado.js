import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  afiliados: [],
  persona: {},
  domicilio: {},
  datos_laborales: {},
  obra_social: {},
  familiares: [],
  documentacion: [],
  subsidios: [],
  paginate: null,
  activeAfiliado: null,
  errorMessage: ''
}

export const afiliadoSlice = createSlice({
  name: 'afiliado',
  initialState,
  reducers: {
    handleAfiliado: (state, { payload }) => {
      state.afiliados = payload.data
      state.paginate = payload.meta
      state.activeAfiliado = null
    },
    setActiveAfiliado: (state, { payload }) => {
      (!payload)
        ? state.activeAfiliado = null
        : state.activeAfiliado = state.afiliados.find((afiliado) => afiliado.id === payload)
    },
    onUpdateAfiliado: (state, { payload }) => {
      state.afiliados = state.afiliados.map((afiliado) => {
        if (afiliado.id === payload.id) return payload
        return afiliado
      })
    },
    onDeleteAfiliado: (state, { payload }) => {
      state.afiliados = state.afiliados.filter((afiliado) => afiliado.id !== payload.id)
    },
    onShowAfiliado: (state, { payload }) => {
      state.activeAfiliado = payload
    },
    onAddOrUpdateFamiliar: (state, { payload }) => {
      const index = state.familiares.findIndex((familiar) => familiar.id === payload.id)
      if (index !== -1) {
        state.familiares[index] = payload
      } else {
        state.familiares.push(payload)
      }
    },
    onDeleteFamiliar: (state, { payload }) => {
      state.familiares = state.familiares.filter((familiar) => familiar.id !== payload)
    },
    onAddDocumento: (state, { payload }) => {
      const index = state.documentacion.findIndex((documento) => documento.id === payload.id)
      if (index === -1) {
        state.documentacion.push(payload)
      }
    },
    onDeleteDocumento: (state, { payload }) => {
      state.documentacion = state.documentacion.filter((documento) => documento.id !== payload)
    },
    onAddOrUpdateSubsidio: (state, { payload }) => {
      const index = state.subsidios.findIndex((subsidio) => subsidio.id === payload.id)
      if (index !== -1) {
        state.subsidios[index] = payload
      } else {
        state.subsidios.push(payload)
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
    cleanAfiliado: (state) => {
      state.persona = {}
      state.domicilio = {}
      state.datos_laborales = {}
      state.obra_social = {}
      state.familiares = []
      state.documentacion = []
      state.subsidios = []
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

export const {
  handleAfiliado,
  setActiveAfiliado,
  onUpdateAfiliado,
  onDeleteAfiliado,
  onShowAfiliado,
  onAddOrUpdateFamiliar,
  onDeleteFamiliar,
  onAddDocumento,
  onDeleteDocumento,
  onAddOrUpdateSubsidio,
  onDeleteSubsidio,
  updatePersona,
  updateDomicilio,
  updateObraSocial,
  updateDatosLaborales,
  cleanAfiliado,
  setErrorMessage
} = afiliadoSlice.actions

export default afiliadoSlice.reducer
