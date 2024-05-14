import { useSelector, useDispatch } from "react-redux";
import { giroApi } from "../api";
import { handleSucursal, onAddNewSucursal, onDeleteSucursal, onUpdateSucursal } from "../store/sucursal";
import { toast } from "react-toastify";

export const useSucursalStore = () => {
    const dispatch = useDispatch();
    const { sucursales, activeSucursal } = useSelector( state => state.sucursal );

    const startSavingSucursal = async({ nombre }) => {
        try {
            const { data } = await giroApi.post('/sucursales/create', { nombre });
            dispatch( onAddNewSucursal( data.sucursal ) );

            toast.success('Sucursal agregada con exito', {
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

    const startLoadingSucursales = async() => {
        try {
            const { data } = await giroApi.get('/sucursales');
            dispatch( handleSucursal( data.sucursales ) );
        } catch (error) {
            console.log(error)
        }
    }

    const startDeleteSucursal = async() => {
        try {
            const { id }= activeSucursal;
            const { data } = await giroApi.delete(`/sucursales/delete/${id}`);
            dispatch( onDeleteSucursal(id) );

            toast.success('Sucursal eliminada con exito', {
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

    const startUpdateSucursal = async({ nombre }) => {
        try {
            const { id }= activeSucursal;
            const { data } = await giroApi.put(`/sucursales/update/${id}`, { nombre });
            dispatch( onUpdateSucursal( data.sucursal ) ); 

            toast.success('Sucursal actualizada con exito', {
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
        sucursales,
        activeSucursal,

        //* Metodos
        startSavingSucursal,
        startLoadingSucursales,
        startDeleteSucursal,
        startUpdateSucursal
    }
}
