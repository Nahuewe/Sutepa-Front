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
      state.activeAfiliado = state.afiliados.find((afiliado) => afiliado.id === payload)
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
    onAddOrUpdateSubsidio: (state, { payload }) => {
      const index = state.subsidios.findIndex((subsidio) => subsidio.id === payload.id)
      if (index !== -1) {
        state.subsidios[index] = payload // Update existing subsidio
      } else {
        state.subsidios.push(payload) // Add new subsidio
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
    cleanActiveAfiliado: (state) => {
      state.activeAfiliado = null
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
  onAddFamiliar,
  onDeleteFamiliar,
  onAddDocumento,
  onDeleteDocumento,
  onAddOrUpdateSubsidio,
  onDeleteSubsidio,
  updatePersona,
  updateDomicilio,
  updateObraSocial,
  updateDatosLaborales,
  cleanActiveAfiliado,
  cleanAfiliado,
  setErrorMessage
} = afiliadoSlice.actions

export default afiliadoSlice.reducer
