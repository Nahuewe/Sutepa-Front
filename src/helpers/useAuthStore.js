import { useSelector } from "react-redux";
import { useDispatch } from "react-redux"
import { clearErrorMessage, handleLogin, handleLogout, onChecking } from "../store/auth";
import { sutepaApi } from "../api";
import { toast } from "react-toastify";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async( { username, password } ) => {
        dispatch( onChecking() );
        const message = 'Credenciales incorrectas.'

        try {
            const { data } = await sutepaApi.post('/auth', { username, password });

            if (data.ok) {
                localStorage.setItem('token', data.token);
                dispatch(handleLogin({ uid: data.uid, nombre: data.nombre, sucursal: data.sucursal }));

            } else {
                dispatch( handleLogout(message) );

                toast.error(message, {
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
            dispatch( handleLogout(message) );

            toast.error(message, {
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

    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if ( !token ) return dispatch( handleLogout() );

        try {
            const { data } = await sutepaApi.get('/auth/renew');

            localStorage.setItem('token', data.token);
            dispatch( handleLogin({ uid: data.uid, nombre: data.nombre, sucursal: data.sucursal }) );
        } catch (error) {
            localStorage.clear();
            dispatch( handleLogout() );
        }
    }

    const startLogout = () => {
        localStorage.clear();
        dispatch( handleLogout() );
    }

    return {
        //* Propiedades
        status, 
        user, 
        errorMessage,

        //* Metodos
        startLogin,
        checkAuthToken,
        startLogout,
    }

}
