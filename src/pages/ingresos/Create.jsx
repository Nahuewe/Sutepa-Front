import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { SelectForm } from "@/components/giro/forms";
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import { useNavigate } from "react-router-dom";
import { useIngresoStore } from "@/helpers";

const FormValidationSchema = yup
    .object({
        sexo: yup.string().notOneOf([""], "Debe seleccionar un sexo"),
        dni: yup.string().required("El DNI es requerido"),
        nombre: yup.string().required("El nombre es requerido"),
        apellido: yup.string().required("El apellido es requerido"),
        telefono: yup.string().required("El telefono es requerido"),
        institucion: yup.string().notOneOf([""], "Debe seleccionar una institución"),
        transporte: yup.string().notOneOf([""], "Debe seleccionar un transporte"),
        ecocanje: yup.string().notOneOf([""], "Debe seleccionar un ecocanje"),
        observaciones: yup.string().nullable(true),
    })
    .required();

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

const transporte = [
    {
        id: 'Caminando',
        nombre: 'Caminando'
    },
    {
        id: 'Auto',
        nombre: 'Auto'
    },
    {
        id: 'Moto',
        nombre: 'Moto'
    },
    {
        id: 'Camioneta',
        nombre: 'Camioneta'
    },
    {
        id: 'Camion',
        nombre: 'Camion'
    }
]

const ecocanje = [
    {
        id: 'Realizado',
        nombre: 'Realizado'
    },
    {
        id: 'No Realizado',
        nombre: 'No Realizado'
    }
]


export const Create = () => {
    const navigate = useNavigate()
    const { activeIngreso, startSavingIngreso, startUpdateIngreso } = useIngresoStore()

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <Card>
                <div className="md:flex justify-between items-center mb-6">
                    <h4 className="card-title">Datos Personales</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Textinput
                        name="legajo"
                        label="Legajo"
                        type="text"
                        register={register}
                        placeholder="Legajo"
                        error={errors.legajo}
                    />

                    <Textinput
                        label="Fecha de Afiliación"
                        register={register}
                        id='fechaAfiliacion'
                        placeholder='Fecha de Afiliación'
                        type='date'
                        error={errors.fechaAfiliacion}
                    />

                    <Textinput
                        name="nombre"
                        label="Nombre"
                        type="text"
                        register={register}
                        placeholder="Nombre"
                        error={errors.nombre}
                    />

                    <Textinput
                        name="apellido"
                        label="Apellido"
                        type="text"
                        register={register}
                        placeholder="Apellido"
                        error={errors.apellido}
                    />

                    <SelectForm
                        register={register("sexo")}
                        title={'Sexo'}
                        options={sexo}
                        error={errors.sexo}
                    />

                    <Textinput
                        label="Fecha de Nacimiento"
                        register={register}
                        id='fechaNacimiento'
                        placeholder='Fecha de Nacimiento'
                        type='date'
                        error={errors.fechaNacimiento}
                    />

                    <SelectForm
                        register={register("estadoCivil")}
                        title={'Estado Civil'}
                        options={estadoCivil}
                        error={errors.estadoCivil}
                    />

                    <SelectForm
                        register={register("transporte")}
                        title={'Tipo de Transporte'}
                        options={transporte}
                        error={errors.transporte}
                    />

                    <Textinput
                        name="matricula"
                        label="Matrícula del transporte"
                        type="text"
                        register={register}
                        placeholder="Matrícula"
                        error={errors.matricula}
                    />

                    <SelectForm
                        register={register("ecocanje")}
                        title={'Ecocanje'}
                        options={ecocanje}
                        error={errors.ecocanje}
                    />

                    <Textarea
                        name="observaciones"
                        label="Observaciones"
                        register={register}
                        placeholder="Observaciones"
                        error={errors.observaciones}
                    />
                </div>
            </Card>

            <div className="flex justify-end gap-4 mt-8">
                <div className="ltr:text-right rtl:text-left">
                    <button className="btn-danger items-center text-center py-2 px-6 rounded-lg" onClick={() => navigate('/ingresos')}>Volver</button>
                </div>
                <div className="ltr:text-right rtl:text-left">
                    <button type="submit" className="btn-dark items-center text-center py-2 px-6 rounded-lg">Guardar</button>
                </div>
            </div>
        </form>
    );
};