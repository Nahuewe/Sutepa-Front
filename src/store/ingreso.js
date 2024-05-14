import { createSlice } from "@reduxjs/toolkit";

export const ingresoSlice = createSlice({
    name: "ingreso",
    initialState: {
        ingresos: [],
        activeIngreso: null
    },
    reducers: {
        handleIngreso: (state, { payload }) => {
            state.ingresos = payload;
            state.activeIngreso = null;
        },
        onAddNewIngreso: ( state, { payload }) => {
            state.ingresos.push( payload );
            state.activeIngreso = null;
        },
        onUpdateIngreso: (state, { payload }) => {
            state.ingresos = state.ingresos.map((ingreso) => {
                if (ingreso.id == payload.id) { return payload };
                return ingreso;
            });
            state.activeIngreso = null;
        },
        setActiveIngreso: (state, { payload }) => {
            state.ingresos.find((ingreso) => {
                if (ingreso.id == payload) {
                    state.activeIngreso = ingreso;
                }
            });
        },
        onDeleteIngreso: (state, { payload }) => {
            state.ingresos = state.ingresos.filter((ingreso) => ingreso.id !== payload)
        },
        cleanActiveIngreso: ( state ) => {
            state.activeIngreso = null;
        },
    }
});

export const {
    handleIngreso,
    onUpdateIngreso,
    onAddNewIngreso,
    setActiveIngreso,
    onDeleteIngreso,
    cleanActiveIngreso
} = ingresoSlice.actions;

export default ingresoSlice.reducer;
