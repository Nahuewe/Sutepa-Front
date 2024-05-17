import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Numberinput from "@/components/ui/Numberinput";
import { SelectForm } from "@/components/giro/forms";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css";
import { useState } from "react";

const sexo = [
    {
        id: 'PLANTA PERMANENTE',
        nombre: 'PLANTA PERMANENTE'
    },
    {
        id: 'CONTRATO',
        nombre: 'CONTRATO'
    }
]

const flatpickrOptions = {
    dateFormat: "d-m-Y", // Formato de fecha dd-mm-yyyy
    locale: {
        firstDayOfWeek: 1, // Establece el primer día de la semana como lunes (1: lunes, 7: domingo)
        weekdays: {
            shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"], // Abreviaturas de los días de la semana en español
            longhand: [
                "Domingo",
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado"
            ]
        },
        months: {
            shorthand: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"
            ],
            longhand: [
                "Enero",
                "Febrero",
                "Marzo",
                "Abril",
                "Mayo",
                "Junio",
                "Julio",
                "Agosto",
                "Septiembre",
                "Octubre",
                "Noviembre",
                "Diciembre"
            ]
        }
    }
};

function InformacionLaboralData({ register, errors }) {
    const [picker, setPicker] = useState(null);
    return (
        <>
            <h4 className="card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2">
                Información Laboral
            </h4>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <SelectForm
                        register={register("tipoContrato")}
                        title={'Tipo de Contrato'}
                        options={sexo}
                    />

                    <SelectForm
                        register={register("ugl")}
                        title={'UGL'}
                        options={sexo}
                    />

                    <SelectForm
                        register={register("lugarTrabajo")}
                        title={'Lugar de Trabajo'}
                        options={sexo}
                    />

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Domicilio de Trabajo
                        </label>
                        <Textinput
                            name="domicilioTrabajo"
                            type="text"
                            register={register}
                            placeholder="Domicilio de Trabajo"
                            disabled
                        />
                    </div>


                    <SelectForm
                        register={register("seccional")}
                        title={'Seccional SUTEPA'}
                        options={sexo}
                    />

                    <SelectForm
                        register={register("agrupamiento")}
                        title={'Agrupamiento'}
                        options={sexo}
                    />

                    <SelectForm
                        register={register("tramo")}
                        title={'Tramo'}
                        options={sexo}
                    />

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Carga Horaria
                        </label>
                        <Textinput
                            name="cargaHoraria"
                            type="text"
                            register={register}
                            placeholder="Carga horaria"
                            disabled
                        />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Fecha de Ingreso
                        </label>

                        <Flatpickr
                            options={flatpickrOptions}
                            className="form-control py-2 flatPickrBG dark:flatPickrBGDark"
                            value={picker}
                            id='fechaIngreso'
                            placeholder='Fecha de Ingreso'
                            error={errors.fechaIngreso}
                            onChange={(date) => setPicker(date)}
                        />
                        {/* Registrar el campo fuera del componente Flatpickr */}
                        <input type="hidden" {...register("fechaIngreso")} />
                    </div>

                    <Textinput
                        label="Correo Electrónico"
                        register={register}
                        id='email'
                        placeholder='Correo Electrónico'
                        error={errors.email}
                    />

                    <Numberinput
                        label="Teléfono"
                        register={register}
                        id='telefono'
                        placeholder='Teléfono'
                        error={errors.telefono}
                    />
                </div>
            </Card>
        </>
    )
}

export default InformacionLaboralData
