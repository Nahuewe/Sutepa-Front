import { createSlice } from "@reduxjs/toolkit";

export const materialSlice = createSlice({
    name: "material",
    initialState: {
        materials: [],
        stockMaterial: [],
        activeMaterial: null
    },
    reducers: {
        handleMaterials: ( state, { payload }) => {
            state.materials = payload;
            state.activeMaterial = null;
        },
        onAddNewMaterial: ( state, { payload }) => {
            state.materials.push( payload );
            state.activeMaterial = null;
        },
        onDeleteMaterial: ( state, { payload }) => {
            state.materials = state.materials.filter((material) => {
                if (material.id != payload) return material;
            });
            state.activeMaterial = null;
        },
        handleStockMaterials: ( state, { payload }) => {
            state.stockMaterial = payload;
            state.activeMaterial = null;
        },
        onUpdateStockMaterial: ( state, { payload }) => {
            state.stockMaterial = state.stockMaterial.map((material) => {
                if (material.MaterialSucursal.id === payload.id) {
                    material.MaterialSucursal.cantidad = payload.cantidad;
                }
                return material;
            });
            state.activeMaterial = null;
        },
        setActiveMaterial: ( state, { payload }) => {
            state.materials.filter((material) => {
                if(material.id == payload) {
                    state.activeMaterial = material;
                }
            })
        },
        onUpdateMaterial: ( state, { payload }) => {
            state.materials = state.materials.map((material) => {
                if (material.id == payload.id) { return payload; } 
                return material;
            });
            state.activeMaterial = null;
        },
    }
});

export const {
    handleMaterials,
    onAddNewMaterial,
    onDeleteMaterial,
    handleStockMaterials,
    onUpdateStockMaterial,
    setActiveMaterial,
    onUpdateMaterial,
} = materialSlice.actions;

export default materialSlice.reducer;
