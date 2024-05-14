import { createSlice } from "@reduxjs/toolkit";

export const unidadSlice = createSlice({
    name: "unidad",
    initialState: {
        unidades: [],
        activeUnidad: null
    },
    reducers: {
        handleUnidad: (state, { payload }) => {
            state.unidades = payload;
            state.activeUnidad = null;
        },
        onAddNewUnidad: (state, { payload }) => {
            state.unidades.push(payload);
            state.activeUnidad = null;
        },
        onUpdateUnidad: (state, { payload }) => {
            state.unidades = state.unidades.map((unidad) => {
                if (unidad.id == payload.id) { return payload };
                return unidad;
            });
            state.activeUnidad = null;
        },
        onDeleteUnidad: (state, { payload }) => {
            state.unidades = state.unidades.filter((unidad) => {
                if (unidad.id != payload) return unidad;
            });
            state.activeUnidad = null;
        },
        setActiveUnidad: (state, { payload }) => {
            state.unidades.find((unidad) => {
                if (unidad.id == payload) {
                    state.activeUnidad = unidad;
                }
            });
        },
    }
});

export const {
    handleUnidad,
    onAddNewUnidad,
    onDeleteUnidad,
    setActiveUnidad,
    onUpdateUnidad
} = unidadSlice.actions;

export default unidadSlice.reducer;
