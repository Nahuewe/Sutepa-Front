/* eslint-disable eqeqeq */
/* eslint-disable array-callback-return */
/* eslint-disable no-return-assign */
import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    paginate: null,
    activeUser: null
  },
  reducers: {
    handleUser: (state, { payload }) => {
      state.users = payload.data
      state.paginate = payload.meta
      state.activeUser = null
    },
    onAddNewUser: (state, { payload }) => {
      state.users.push(payload)
      state.activeUser = null
    },
    setActiveUser: (state, { payload }) => {
      state.users.filter((user) => {
        if (user.id == payload) { return state.activeUser = user }
      })
    },
    onDeleteUser: (state, { payload }) => {
      state.users = state.users.map((user) => {
        if (user.id == payload.id) { return payload }
        return user
      })
      state.activeUser = null
    },
    onUpdateUser: (state, { payload }) => {
      state.users = state.users.map((user) => {
        if (user.id == payload.id) { return payload }
        return user
      })
      state.activeUser = null
    },
    updateUserPassword: (state, { payload }) => {
      state.users = state.users.map((user) => {
        if (user.id === payload.id) {
          return { ...user, password: payload.password }
        }
        return user
      })
      if (state.activeUser && state.activeUser.id === payload.id) {
        state.activeUser = { ...state.activeUser, password: payload.password }
      }
    }
  }
})

export const {
  handleUser,
  onAddNewUser,
  setActiveUser,
  onDeleteUser,
  onUpdateUser,
  updateUserPassword
} = userSlice.actions

export default userSlice.reducer
