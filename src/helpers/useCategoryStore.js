import { useSelector, useDispatch } from "react-redux";
import { giroApi } from "../api";
import { handleCategories, onAddNewCategory, onDeleteCategory, onUpdateCategory } from "../store/category";
import { toast } from "react-toastify";
import { hadleShowModal } from "../store/layout";

export const useCategoryStore = () => {
    const dispatch = useDispatch();
    const { categories, activeCategory } = useSelector( state => state.category );

    const startSavingCategory = async({ nombre }) => {
        try {
            const { data } = await giroApi.post('/categorias/create', { nombre });
            dispatch( onAddNewCategory( data.categoria ) );

            toast.success('Categoria agregada con exito', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 

        } catch (error) {
            toast.error('No se pudo agregar los datos', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
        }
    }

    const startLoadingCategories = async() => {
        try {
            const { data } = await giroApi.get('/categorias');
            dispatch( handleCategories( data.categorias) ); 
        } catch (error) {
            console.log(error)
        }
    }

    const startDeleteCategories = async() => {
        try {
            const id = activeCategory.id;
            const { data } = await giroApi.delete(`/categorias/delete/${id}`);
            dispatch( onDeleteCategory(id) );

            toast.success('Categoria elimiada con exito', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
        } catch (error) {
            toast.error('No se pudo agregar los datos', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
        }
    }

    const startUpdateCategory = async({ nombre }) => {
        try {
            const id = activeCategory.id;
            const { data } = await giroApi.put(`/categorias/update/${id}`, { nombre });
            dispatch( onUpdateCategory(data.categoria) );
            dispatch( hadleShowModal(false) );
            
            toast.success('Categoria actualizada con exito', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
            
        } catch (error) {
            toast.error('No se pudo modificar los datos', {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            }); 
        }
    }

    return {
        //* Propiedades
        categories,
        activeCategory,

        //* Metodos
        startSavingCategory,
        startLoadingCategories,
        startDeleteCategories,
        startUpdateCategory,
    }
}
