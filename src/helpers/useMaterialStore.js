import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { giroApi } from "../api";
import { handleMaterials, onAddNewMaterial, onDeleteMaterial, handleStockMaterials, onUpdateStockMaterial, onUpdateMaterial } from "../store/material";
import { toast } from "react-toastify";
import { hadleShowModal } from "../store/layout";
import { getEnvVariables } from "../helpers";

export const useMaterialStore = () => {
    const dispatch = useDispatch();
    const [date, setDate] = useState({}); // Rango de fechas para reportes
    const { materials, activeMaterial, stockMaterial } = useSelector( state => state.material );
    const { user: { sucursal } } = useSelector( state => state.auth ); // Id de sucursal del usuario

    const startSavingMaterial = async({ nombre, categoriaId, unidadId }) => {
        try {
            const { data } = await giroApi.post('/materiales/create', { nombre, categoriaId, unidadId });

            if (data.ok) {
                dispatch( onAddNewMaterial( data.material ) );
                toast.success('Material agregado con exito', {
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

    const startLoadingMaterials = async() => {
        try {
            const { data } = await giroApi.get('/materiales');
            dispatch( handleMaterials( data.materiales ) );
        } catch (error) {
            console.log(error)
        }
    }

    const startDeleteMaterial = async() => {
        try {
            const id = activeMaterial.id;
            const { data } = await giroApi.delete(`/materiales/delete/${id}`);
            dispatch( onDeleteMaterial(id) );

            toast.success('Material eliminado con exito', {
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

    const startLoadingStockMaterials = async() => {
        try {
            const { data  } = await giroApi.get('/materiales/stock');

            if (sucursal === 1) { // Consulta por la sucursal del usuario
                const { sucursal } = data;
                dispatch( handleStockMaterials( sucursal ));
            } else {
                const { sucursal: { materiales } } = data;
                dispatch( handleStockMaterials( materiales ));
            }
        } catch (error) {
            console.log(error)
        }
        
    }

    const startUpdatingStockMaterial = async(id, { cantidad }) => {
        try {
            const { data } = await giroApi.put(`/materiales/stock/${id}`, { cantidad });
            dispatch( onUpdateStockMaterial( { id, cantidad } ) );
    
            toast.success('Stock actualizado con exito', {
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
            toast.error('No se pudo actualizar los datos', {
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

    const startUpdateMaterial = async({ nombre, categoriaId, unidadId }) => {
        try {
            const id = activeMaterial.id;
            const { data } = await giroApi.put(`/materiales/update/${id}`, { nombre, categoriaId, unidadId });
            dispatch( onUpdateMaterial(data.material) );
            dispatch( hadleShowModal(false) );

            toast.success('Material actualizado con exito', {
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
                window.open( `${ VITE_API_URL }/reportes/downloadExcelMateriales?startDate=${startDate}&endDate=${endDate}` );  
                
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
        materials,
        activeMaterial,
        stockMaterial,

        //* Metodos
        startSavingMaterial,
        startLoadingMaterials,
        startDeleteMaterial,
        startLoadingStockMaterials,
        startUpdatingStockMaterial,
        startUpdateMaterial,
        startDownloadReport,
        selectDateReport,
    }
}
