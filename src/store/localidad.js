import { createSlice } from '@reduxjs/toolkit'

export const localidadSlice = createSlice({
  name: 'localidad',
  initialState: {
    localidades: [],
    activeLocalidad: null,
    paginate: null,
    errorMessage: ''
  },
  reducers: {
    handleLocalidades: (state, { payload }) => {
      state.localidades = payload.data.map(localidad => ({
        ...localidad,
        provincia: localidad.provincia || null
      }))
      state.paginate = payload.meta
      state.activeLocalidad = null
    },
    onAddNewLocalidad: (state, { payload }) => {
      state.localidades = [...state.localidades, payload]
    },
    setActiveLocalidad: (state, { payload }) => {
      state.activeLocalidad = state.localidades.find((localidad) => localidad.id === payload) || null
    },
    onUpdateLocalidad: (state, { payload }) => {
      state.localidades = state.localidades.map((localidad) => {
        if (localidad.id === payload.id) return payload
        return localidad
      })
      state.activeLocalidad = null
    },
    onDeleteLocalidad: (state, { payload }) => {
      state.localidades = state.localidades.filter((localidad) => localidad.id !== payload)
    },
    setErrorMessage: (state, { payload }) => {
      state.errorMessage = payload
    }
  }
})

// Action creators are generated for each case reducer function
export const {
  handleLocalidades,
  onAddNewLocalidad,
  setActiveLocalidad,
  onUpdateLocalidad,
  onDeleteLocalidad,
  setErrorMessage
} = localidadSlice.actions

export default localidadSlice.reducer
