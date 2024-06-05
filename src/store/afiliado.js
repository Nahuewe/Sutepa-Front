import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  afiliados: [],
  paginate: null,
  activeAfiliado: null
}

export const categoriaSlice = createSlice({
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
    }
  }
})

export const {
  handleAfiliado,
  setActiveAfiliado,
  onUpdateAfiliado,
  onDeleteAfiliado
} = categoriaSlice.actions

export default categoriaSlice.reducer
