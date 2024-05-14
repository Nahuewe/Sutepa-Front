import { useSelector, useDispatch } from "react-redux";
import { giroApi } from "../api";
import { toast } from "react-toastify";
import { hadleShowModal } from "../store/layout";
import { handlePersona, onUpdatePersona } from "../store/persona";

export const usePersonaStore = () => {
    const { personas, activePersona } = useSelector( state => state.persona );
    const dispatch = useDispatch();


    const startLoadingPersonas = async() => {
        try {
            const { data } = await giroApi.get('/personas');
            dispatch( handlePersona( data.personas ) ); 
        } catch (error) {
            console.log(error)
        }
    }

    const startUpdatePersona = async(persona) => {
        try {
            const id = activePersona.id;
            const { data } = await giroApi.put(`/personas/update/${id}`, { ...persona });
            dispatch( onUpdatePersona(data.persona) );
            dispatch( hadleShowModal(false) );

            toast.success('Persona actualizada con exito', {
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
        personas,
        activePersona,

        //* Metodos
        startLoadingPersonas,
        startUpdatePersona
    }
}
