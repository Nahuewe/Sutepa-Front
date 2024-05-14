import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { giroApi } from "../api";
import { handleUnidad, onAddNewUnidad, onDeleteUnidad, onUpdateUnidad } from "@/store/unidad";
import { hadleShowModal } from "@/store/layout";

export const useUnidadStore = () => {
    const dispatch = useDispatch();
    const { unidades, activeUnidad } = useSelector( state => state.unidad );

    const startSavingUnidad = async({ nombre }) => {
        try {
            const { data } = await giroApi.post('/unidades/create', { nombre });
            dispatch( onAddNewUnidad( data.unidad ) );

            toast.success('Unidad agregada con exito', {
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

    const startLoadingUnidades = async() => {
        try {
            const { data } = await giroApi.get('/unidades');
            dispatch( handleUnidad( data.unidades) );
        } catch (error) {
            console.log(error)
        }
    }

    const startDeleteUnidad = async() => {
        try { 
            const id = activeUnidad.id;
            const { data } = await giroApi.delete(`/unidades/delete/${id}`);
            dispatch( onDeleteUnidad(id) );

            toast.success('Unidad eliminada con exito', {
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

    const startUpdateUnidad = async({ nombre }) => {
        try {
            const id = activeUnidad.id;
            const { data } = await giroApi.put(`/unidades/update/${id}`, { nombre });
            dispatch( onUpdateUnidad(data.unidad) );
            dispatch( hadleShowModal(false) );

            toast.success('Unidad actualizada con exito', {
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
        unidades,
        activeUnidad,

        //* Metodos
        startSavingUnidad,
        startLoadingUnidades,
        startDeleteUnidad,
        startUpdateUnidad,
    }
}
