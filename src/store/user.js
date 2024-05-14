import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        users: [],
        activeUser: null
    },
    reducers: {
        handleUser: ( state, { payload }) => {
            state.users = payload;
            state.activeUser = null;
        },
        onAddNewUser: ( state, { payload }) => {
            state.users.push(payload);
            state.activeUser = null;
        },
        setActiveUser: ( state, { payload }) => {
            state.users.filter((user) => {
                if(user.id == payload) { return state.activeUser = user }
            });
        },
        onDeleteUser: ( state, { payload }) => {
            state.users = state.users.map((user) => {
                if(user.id == payload.id) { return payload };
                return user;
            });
            state.activeUser = null;
        },
        onUpdateUser: ( state, { payload }) => {
            state.users = state.users.map((user) => {
                if(user.id == payload.id) { return payload };
                return user;
            });
            state.activeUser = null;
        }
    }
});

export const {
    handleUser,
    onAddNewUser,
    setActiveUser,
    onDeleteUser,
    onUpdateUser
} = userSlice.actions;

export default userSlice.reducer;
