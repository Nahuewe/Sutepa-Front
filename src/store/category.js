import { createSlice } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        activeCategory: null
    },
    reducers: {
        handleCategories: ( state, { payload }) => {
            state.categories = payload;
            state.activeCategory = null;
        },
        onAddNewCategory: ( state, { payload }) => {
            state.categories.push( payload );
            state.activeCategory = null;
        },
        onDeleteCategory: ( state, { payload }) => {
            state.categories = state.categories.filter((category) => {
                if (category.id != payload) return category;
            });
            state.activeCategory = null;
        },
        setActiveCategory: ( state, { payload }) => {
            state.categories.filter((category) => {
                if(category.id == payload) {
                    state.activeCategory = category;
                }
            })
        },
        onUpdateCategory: ( state, { payload }) => {
            state.categories = state.categories.map((category) => {
                if(category.id == payload.id) { return payload; }
                return category;
            });
            state.activeCategory = null;
        },
    }
});

export const {
    handleCategories,
    onAddNewCategory,
    onDeleteCategory,
    setActiveCategory,
    onUpdateCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
