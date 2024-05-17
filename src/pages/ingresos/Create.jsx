import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useIngresoStore } from "@/helpers";
import DatosPersonalesData from "../../components/forms/DatosPersonalesData";
import AfiliadoDomicilioData from "../../components/forms/AfiliadoDomicilioData";
import { useEffect } from "react";
import InformacionLaboralData from "../../components/forms/InformacionLaboralData";
import ObraSocialAfiliadoData from "../../components/forms/ObraSocialAfiliadoData";
import FamiliarAcargoData from "../../components/forms/FamiliarAcargoData";
import DocumentacionAdicionalData from "../../components/forms/DocumentacionAdicionalData";
import SubsidioData from "../../components/forms/SubsidioData";

const sexo = [
    {
        id: 'HOMBRE',
        nombre: 'HOMBRE'
    },
    {
        id: 'MUJER',
        nombre: 'MUJER'
    },
    {
        id: 'NO INFORMA',
        nombre: 'NO INFORMA'
    }
]

const estadoCivil = [
    {
        id: 'CASADE',
        nombre: 'CASADE'
    },
    {
        id: 'CONCUBINE',
        nombre: 'CONCUBINE'
    },
    {
        id: 'DIVORCIADE',
        nombre: 'DIVORCIADE'
    },
    {
        id: 'SOLTERE',
        nombre: 'SOLTERE'
    },
    {
        id: 'VIUDE',
        nombre: 'VIUDE'
    },
]

const nacionalidad = [
    {
        id: 'ARGENTINO',
        nombre: 'ARGENTINO'
    },
    {
        id: 'CHILENO',
        nombre: 'CHILENO'
    },
    {
        id: 'BOLIVIANO',
        nombre: 'BOLIVIANO'
    },
    {
        id: 'PERUANO',
        nombre: 'PERUANO'
    },
    {
        id: 'PARAGUAYO',
        nombre: 'PARAGUAYO'
    }
]

const tipoDocumento = [
    {
        id: 'DNI',
        nombre: 'DNI'
    },
    {
        id: 'LIBRETA DE ENROLAMIENTO',
        nombre: 'LIBRETA DE ENROLAMIENTO'
    },
    {
        id: 'LIBRETA CIVICA',
        nombre: 'LIBRETA CIVICA'
    },
    {
        id: 'PASAPORTE',
        nombre: 'PASAPORTE'
    }
]


export const Create = () => {
    const navigate = useNavigate()
    const { activeIngreso, startSavingIngreso, startUpdateIngreso } = useIngresoStore()
    const FormValidationSchema = yup
        .object().shape({
            nombre: yup.string().required("El nombre es requerido"),
            apellido: yup.string().required("El apellido es requerido"),
            legajo: yup.string().required("El legajo es requerido"),
            fechaAfiliacion: yup.string().required('La fecha de afiliacion es requerida'),
            nacionalidad: yup.string().required('La nacionalidad es requerida'),
            tipoDocumento: yup.string().notOneOf([""], "Debe seleccionar un tipo de documento"),
            dni: yup.string().required('El DNI es requerido'),
            provincia: yup.string().required("La provincia es requerida"),
            localidad: yup.string().required("La localidad es requerida"),
            nombreFamiliar: yup.string().required("El nombre y apellido es requerido"),
            fechaNacimiento: yup.string().notOneOf([""], 'La fecha de nacimiento es requerida'),
            parentesco: yup.string().notOneOf([""], 'El parentesco es requerido'),
            tipoSubsidio: yup.string().notOneOf([""], 'El tipo de subsidio es requerido'),
            fechaSolicitud: yup.string().notOneOf([""], 'La fecha de la solicitud es requerida'),
        })

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
    });

    const onSubmit = (data) => {

        if (!activeIngreso) {
            startSavingIngreso({ data });
        } else {
            startUpdateIngreso({ data })
        }

        reset();
        navigate('/ingresos')
    };

    useEffect(() => {
        if (activeIngreso) {
            Object.entries(activeIngreso).forEach(([key, value]) => {
                setValue(key, value)
            })
        }
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <DatosPersonalesData register={register} errors={errors}></DatosPersonalesData>

            <AfiliadoDomicilioData register={register} errors={errors}></AfiliadoDomicilioData>

            <InformacionLaboralData register={register} errors={errors}></InformacionLaboralData>

            <ObraSocialAfiliadoData register={register} errors={errors}></ObraSocialAfiliadoData>

            <FamiliarAcargoData register={register} errors={errors}></FamiliarAcargoData>

            <DocumentacionAdicionalData register={register} errors={errors}></DocumentacionAdicionalData>

            <SubsidioData register={register} errors={errors}></SubsidioData>

            <div className="flex justify-end gap-4 mt-8">
                <div className="ltr:text-right rtl:text-left">
                    <button className="btn-danger items-center text-center py-2 px-6 rounded-lg" onClick={() => navigate('/ingresos')}>Volver</button>
                </div>
                <div className="ltr:text-right rtl:text-left">
                    <button type="submit" className="btn-success items-center text-center py-2 px-6 rounded-lg">Guardar</button>
                </div>
            </div>
        </form>
    );
};