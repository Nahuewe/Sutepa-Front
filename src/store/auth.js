import { createSlice } from '@reduxjs/toolkit'
/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
const initialState = {
  status: 'checking', // authenticated, not-authenticated
  user: {},
  activeUser: null
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
      state.activeUser = null
    },
    handleLogout: (state) => {
      state.status = 'not-authenticated'
      state.user = {}
    }
  },
  setActiveUser: (state, { payload }) => {
    state.user.filter((user) => {
      if (user.id == payload) { return state.activeUser = user }
    })
  },
  onUpdateUser: (state, { payload }) => {
    state.user = state.user.map((user) => {
      if (user.id == payload.id) { return payload }
      return user
    })
    state.activeUser = null
  }
})

export const {
  onChecking,
  handleLogin,
  handleLogout,
  clearErrorMessage,
  setActiveUser,
  onUpdateUser
} = authSlice.actions

export default authSlice.reducer
