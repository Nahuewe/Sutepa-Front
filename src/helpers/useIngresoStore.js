import { useSelector, useDispatch } from "react-redux";
import { sutepaApi } from "../api";
import { toast } from "react-toastify";
import { handleIngreso, onUpdateIngreso, onAddNewIngreso, onDeleteIngreso } from "../store/ingreso";
import { useState } from "react";
import { getEnvVariables } from "./getEnvVariables";

export const useIngresoStore = () => {
    const dispatch = useDispatch();
    const [date, setDate] = useState({});
    const { ingresos, activeIngreso } = useSelector( state => state.ingreso );
    const { user: { uid, sucursal } } = useSelector( state => state.auth ); // Id de sucursal del usuario

    const startSavingIngreso = async(form) => {
        try {
            const {data} = await sutepaApi.post('/ingresos/create', {...form, usuarioId: uid, sucursalId: sucursal})

            if (data.ok) {
                dispatch( onAddNewIngreso( data.ingreso ) );   

                toast.success('Ingreso creado con exito', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.error(data.message, {
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
    const startLoadingIngreso = async() => {
        try {
            const { data } = await sutepaApi.get('/ingresos');
            dispatch( handleIngreso( data.ingresos ) );
        } catch (error) {
            console.log(error)
        }
    }

    const startUpdateIngreso = async(form) => {
        try {
            const {id} = activeIngreso;
            const { data } = await sutepaApi.put(`/ingresos/update/${id}`, {...form, usuarioId: uid, sucursalId: sucursal});

            if (data.ok) {
                dispatch( onUpdateIngreso(data.ingreso) );  

                toast.success('Ingreso actualizado con exito', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }); 
            } else {
                toast.error(data.message, {
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

    const startDeleteIngreso = async(id) => {
        try {
            const { data } = await sutepaApi.delete(`/ingresos/delete/${id}`);
            dispatch( onDeleteIngreso(parseInt(id)) );
    
            if (data.ok) {
                toast.success('Ingreso eliminado con exito', {
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

    const startDownloadReport = async() => {
        try {
            const { startDate, endDate } = date;

            if (startDate === undefined || endDate === undefined) {

                toast.error('Debe seleccionar un rango de fechas.', {
                    position: "top-right",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }); 

            } else {

                const { VITE_API_URL } = getEnvVariables();
                window.open( `${ VITE_API_URL }/reportes/downloadExcelIngresos?startDate=${startDate}&endDate=${endDate}` );  
                
            }
        } catch (error) {

            toast.error('Error. No se pudo descargar el archivo', {
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

    const selectDateReport = (newDate) => {
        setDate(newDate);
    }

    return {
        //* Propiedades
        ingresos,
        activeIngreso,

        //* Metodos
        startLoadingIngreso,
        startSavingIngreso,
        startUpdateIngreso,
        startDeleteIngreso,
        startDownloadReport,
        selectDateReport,
    }
}
