import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { giroApi } from "../api";
import { handleUser, onAddNewUser, onDeleteUser, onUpdateUser } from "../store/user";
import { toast } from "react-toastify";
import { hadleShowModal } from "../store/layout";

export const useUserStore = () => {
    const { users, activeUser } = useSelector( state => state.user );
    const dispatch = useDispatch();

    const startLoadingUsers = async() => {
        try {
            const { data } = await giroApi.get('/auth');
            dispatch( handleUser( data.usuarios ) );
        } catch (error) {
            console.log(error)
        }
    }

    const startSavingUser = async({ nombre, username, password, sucursalId }) => {
        try {
            const { data } = await giroApi.post('/auth/new', { nombre, username, password, sucursalId });
            dispatch( onAddNewUser( data.usuario ) );

            toast.success('Usuario agregado con exito', {
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

    const startDeleteUser = async() => {
        try {
            const id = activeUser.id;
            const { data } = await giroApi.delete(`/auth/delete/${id}`);
            dispatch( onDeleteUser( data.usuario ) );

            toast.success('Usuario desactivado con exito', {
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
            toast.error('No se pudo realizar la operacion', {
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

    const startUpdateUser = async({ nombre, username, password, sucursalId }) => {
        try {
            const id = activeUser.id;
            const { data } = await giroApi.put(`/auth/update/${id}`, { nombre, username, password, sucursalId });
            dispatch( onUpdateUser( data.usuario ) );
            dispatch( hadleShowModal( false ) );

            toast.success('Usuario actualizado con exito', {
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
        users,
        activeUser,

        //* Metodos
        startLoadingUsers,
        startSavingUser,
        startDeleteUser,
        startUpdateUser,
    }
}
