import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: 'checking', // authenticated, not-authenticated
  user: {}
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = 'checking'
      state.user = {}
    },
    handleLogin: (state, { payload }) => {
      state.user = payload
      state.status = 'authenticated'
    },
    handleLogout: (state) => {
      state.status = 'not-authenticated'
      state.user = {}
    }
  }
})

export const {
  onChecking,
  handleLogin,
  handleLogout,
  clearErrorMessage
} = authSlice.actions

export default authSlice.reducer
