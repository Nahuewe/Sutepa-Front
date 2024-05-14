import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { SelectForm } from "@/components/giro/forms";
import makeAnimated from 'react-select/animated';
import Textarea from "@/components/ui/Textarea";
import Card from "@/components/ui/Card";
import { useIngresoStore } from "@/helpers";
import { cleanActiveIngreso } from "@/store/ingreso";
import { useDispatch } from "react-redux";

const FormValidationSchema = yup
    .object({
        turno: yup.string().notOneOf([""], "Debe seleccionar un turno"),
        dni: yup.string().required("El DNI es requerido"),
        nombre: yup.string().required("El nombre es requerido"),
        apellido: yup.string().required("El apellido es requerido"),
        telefono: yup.string().required("El telefono es requerido"),
        institucion: yup.string().notOneOf([""], "Debe seleccionar una institución"),
        transporte: yup.string().notOneOf([""], "Debe seleccionar un transporte"),
        ecocanje: yup.string().notOneOf([""], "Debe seleccionar un ecocanje"),
        observaciones: yup.string().nullable(true)
    })
    .required();

const styles = {
    option: (provided, state) => ({
        ...provided,
        fontSize: "14px",
    }),
};

const turno = [
    {
        id: 'Mañana',
        nombre: 'Mañana'
    },
    {
        id: 'Tarde',
        nombre: 'Tarde'
    }
]

const instituciones = [
    {
        id: 'Particular',
        nombre: 'Particular'
    },
    {
        id: 'Institución Pública',
        nombre: 'Institución Pública'
    },
    {
        id: 'Institución Privada',
        nombre: 'Institución Privada'
    }
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

export const ShowIngreso = () => {
    const dispatch = useDispatch()
    const { activeIngreso } = useIngresoStore()
    const [cart, setCart] = useState([])

    const animatedComponents = makeAnimated();

    const {
        register,
        // formState: { errors },
        setValue,
    } = useForm({
        resolver: yupResolver(FormValidationSchema),
    });

    useEffect(() => {
        if (activeIngreso) {
            Object.entries(activeIngreso).forEach(([key, value]) => {
                if (key !== 'persona' && key !== 'material') setValue(key, value)
            });

            // Completar datos de persona
            Object.entries(activeIngreso.persona).forEach(([key, value]) => {
                setValue(key, value)
            });

            setCart(activeIngreso.material)
        }
    }, []);

    return (
        <Card>
            <div className="md:flex justify-between items-center mb-6">
                <h4 className="card-title">Detalle de Ingreso</h4>
            </div>
            <div className="space-y-4 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectForm
                        register={register("turno")}
                        title={'Turno'}
                        options={turno}
                        disabled
                    />

                    <Textinput
                        name="dni"
                        label="DNI"
                        type="text"
                        register={register}
                        placeholder="DNI"
                        disabled
                    />

                    <Textinput
                        name="nombre"
                        label="Nombre"
                        type="text"
                        register={register}
                        placeholder="Nombre"
                        disabled
                    />

                    <Textinput
                        name="apellido"
                        label="Apellido"
                        type="text"
                        register={register}
                        placeholder="Apellido"
                        disabled
                    />

                    <Textinput
                        name="telefono"
                        label="Telefono"
                        type="text"
                        register={register}
                        placeholder="Telefono"
                        disabled
                    />

                    <SelectForm
                        register={register("institucion")}
                        title={'Tipo de Institución'}
                        options={instituciones}
                        disabled
                    />

                    <SelectForm
                        register={register("transporte")}
                        title={'Tipo de Transporte'}
                        options={transporte}
                        disabled
                    />

                    <Textinput
                        name="matricula"
                        label="Matrícula del transporte"
                        type="text"
                        register={register}
                        placeholder="Matrícula"
                        disabled
                    />

                    <SelectForm
                        register={register("ecocanje")}
                        title={'Ecocanje'}
                        options={ecocanje}
                        disabled
                    />

                    <Textarea
                        name="observaciones"
                        label="Observaciones"
                        register={register}
                        placeholder="Observaciones"
                        disabled
                    />
                </div>

                {
                    cart.length > 0 && (
                        <Card title="Lista de Materiales" noborder>
                            <div className="overflow-x-auto -mx-6">
                                <div className="inline-block min-w-full align-middle">
                                    <div className="overflow-hidden ">
                                        <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                                            <thead className="bg-slate-200 dark:bg-slate-700">
                                                <tr>
                                                    <th className="table-th">Material</th>
                                                    <th className="table-th">Cantidad</th>
                                                    <th className="table-th">Unidad</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                                {cart.map((row) => (
                                                    <tr
                                                        key={row.id}
                                                        className="hover:bg-slate-200 dark:hover:bg-slate-700"
                                                    >
                                                        <td className="table-td">
                                                            {row.material === 'Otro' ? (row.otroMaterial || '-') : row.material}
                                                        </td>
                                                        <td className="table-td">{row.cantidad || '-'}</td>
                                                        <td className="table-td">{row.unidad || '-'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                }

                <div className="flex justify-end gap-4 mt-8">
                    <div className="ltr:text-right rtl:text-left">
                        <button className="btn-danger items-center text-center py-2 px-6 rounded-lg" onClick={() => dispatch(cleanActiveIngreso())}>Volver</button>
                    </div>
                </div>

            </div>
        </Card>
    );
};
