import { createSlice } from "@reduxjs/toolkit";

export const sucursalSlice = createSlice({
    name: "sucursal",
    initialState: {
        sucursales: [],
        activeSucursal: null
    },
    reducers: {
        handleSucursal: ( state, { payload }) => {
            state.sucursales = payload;
            state.activeSucursal = null;
        },
        onAddNewSucursal: ( state, { payload }) => {
            state.sucursales.push( payload );
            state.activeSucursal = null;
        },
        onDeleteSucursal: ( state, { payload }) => {
            state.sucursales = state.sucursales.filter((sucursal) => {
                if (sucursal.id != payload) return sucursal;
            });
            state.activeSucursal = null;
        },
        setActiveSucursal: ( state, { payload }) => {
            state.sucursales.filter((sucursal) => {
                if (sucursal.id == payload) {
                    state.activeSucursal = sucursal;
                };
            });
        },
        onUpdateSucursal: ( state, { payload }) => {
            state.sucursales = state.sucursales.map((sucursal) => {
                if (sucursal.id == payload.id) { return payload };
                return sucursal;
            });
            state.activeSucursal = null;
        },
    }
});

export const {
    handleSucursal,
    onAddNewSucursal,
    onDeleteSucursal,
    setActiveSucursal,
    onUpdateSucursal,
} = sucursalSlice.actions;

export default sucursalSlice.reducer;
