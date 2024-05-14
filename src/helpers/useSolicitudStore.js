import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { giroApi } from "../api";
import { handleSolicitudes, handleStatusSolicitud } from "../store/solicitud";

export const useSolicitudStore = () => {
    const dispatch = useDispatch();
    const { solicitudes, activeSolicitud } = useSelector(state => state.solicitud);
    const { user } = useSelector(state => state.auth);

    const startLoadingSolicitudes = async () => {
        try {
            const { data } = await giroApi.get('/solicitudes');
            dispatch(handleSolicitudes(data.solicitudes));
        } catch (error) {
            console.log(error)
        }
    }

    const startAddNewEntrega = async ({ sucursalId }) => {
        try {
            const { id } = activeSolicitud; // Solicitud activa
            const { data } = await giroApi.post(`/solicitudes/createEntrega/${id}`, { sucursalId });

            dispatch(handleStatusSolicitud(data.solicitudUpdate));

            toast.success('Solicitud aprobada con exito', {
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

    const startAprobarEntrega = async () => {
        try {
            const { id } = activeSolicitud;
            const { data } = await giroApi.put(`/solicitudes/aprobarEntrega/${id}`);

            dispatch(handleStatusSolicitud(data.solicitud));

            toast.success('Solicitud aprobada con exito', {
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

    const startFinishEntrega = async () => {
        try {
            const { id, material } = activeSolicitud;
            const { data } = await giroApi.post(`/solicitudes/finalizarEntrega/${id}`, { usuarioId: user.uid, material });

            dispatch(handleStatusSolicitud(data.solicitudUpdate));

            toast.success('Solicitud finalizada con exito', {
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

    const startDeleteSolicitud = async (id) => {
        try {
            const { data } = await giroApi.put(`/solicitudes/cancelar/${id}`);
            dispatch(handleStatusSolicitud(data.solicitud));

            toast.success('Solicitud rechazada con exito', {
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

    return {
        //* Propiedades
        solicitudes,
        activeSolicitud,

        //* Metodos
        startLoadingSolicitudes,
        startAddNewEntrega,
        startAprobarEntrega,
        startFinishEntrega,
        startDeleteSolicitud
    }
}