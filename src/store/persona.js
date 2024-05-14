import { createSlice } from "@reduxjs/toolkit";

export const personaSlice = createSlice({
    name: "persona",
    initialState: {
        personas: [],
        activePersona: null
    },
    reducers: {
        handlePersona: (state, { payload }) => {
            state.personas = payload;
            state.activePersona = null;
        },
        onUpdatePersona: (state, { payload }) => {
            state.personas = state.personas.map((persona) => {
                if (persona.id == payload.id) { return payload };
                return persona;
            });
            state.activePersona = null;
        },
        setActivePersona: (state, { payload }) => {
            state.personas.find((persona) => {
                if (persona.id == payload) {
                    state.activePersona = persona;
                }
            });
        },
    }
});

export const {
    handlePersona,
    onUpdatePersona,
    setActivePersona
} = personaSlice.actions;

export default personaSlice.reducer;
