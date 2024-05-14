import { createSlice } from "@reduxjs/toolkit";

export const solicitudSlice = createSlice({
    name: "solicitud",
    initialState: {
        solicitudes: [],
        activeSolicitud: null
    },
    reducers: {
        handleSolicitudes: ( state, { payload }) => {
            state.solicitudes = payload;
            state.activeSolicitud = null;
        },
        onAddNewSolicitud: ( state, { payload }) => {
            state.solicitudes.push( payload );
            state.activeSolicitud = null;
        },
        setActiveSolicitud: ( state, { payload } ) => {
            const solicitud = state.solicitudes.find((solicitud) => {
                if (solicitud.id == payload.id) return solicitud;
            })
            state.activeSolicitud = solicitud;
        },
        handleStatusSolicitud: ( state, { payload }) => {
            state.solicitudes = state.solicitudes.map((solicitud) => {
                if(solicitud.id === payload.id) return payload;
                return solicitud;
            });
            state.activeSolicitud = null;
        },
        cleanActiveSolicitud: ( state ) => {
            state.activeSolicitud = null;
        },
        onSelectMaterial: ( state, { payload } ) => {
            state.activeSolicitud.material = state.activeSolicitud.material.map((mat) => {
                if (mat.id === payload) {
                    return {
                        ...mat,
                        estado: !mat.estado,
                        fecha: (!mat.estado) ? new Date().toLocaleDateString('es-AR') : null
                    }
                }

                return mat;
            });
        },
    }
});

export const {
    handleSolicitudes,
    onAddNewSolicitud,
    setActiveSolicitud,
    cleanActiveSolicitud,
    handleStatusSolicitud,
    onSelectMaterial,
} = solicitudSlice.actions;

export default solicitudSlice.reducer;