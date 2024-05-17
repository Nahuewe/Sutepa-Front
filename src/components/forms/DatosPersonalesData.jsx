import { useForm } from 'react-hook-form'
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Numberinput from "@/components/ui/Numberinput";
import { SelectForm } from "@/components/giro/forms";
import Flatpickr from "react-flatpickr";
import { useState } from 'react';
import "flatpickr/dist/themes/material_red.css";

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

function DatosPersonalesData({ register, errors }) {
    const [picker, setPicker] = useState(null);
    const [picker2, setPicker2] = useState(null);
    const [cuil, setCuil] = useState('')
    const handleCuilChange = (e) => {
        const value = e.target.value
        // Limpiar cualquier carácter que no sea un número
        const cleanedValue = value.replace(/[^\d]/g, '')

        // Definir el formato del CUIL
        const cuilFormat = /^(\d{2})(\d{7}|\d{8})(\d{1})$/

        let formattedCuil = ''
        const maxLength = 11
        if (cleanedValue.length > maxLength) {
            return
        }

        if (cleanedValue.length > 2 && cleanedValue.length <= 11) {
            // Aplicar el formato del CUIL
            formattedCuil = cleanedValue.replace(cuilFormat, '$1-$2-$3')
        } else {
            // Si el usuario ha ingresado menos de 2 dígitos, mantener el valor original
            formattedCuil = cleanedValue
        }

        // Actualizar el estado de cuil
        setCuil(formattedCuil)
    }

    return (
        <>
            <h4 className="card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2">
                Datos Personales
            </h4>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Legajo
                            <strong className='obligatorio'>(*)</strong>
                        </label>

                        <Numberinput
                            name="legajo"
                            type="number"
                            register={register}
                            placeholder="Legajo"
                            error={errors.legajo}
                        />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Fecha de Afiliacion
                            <strong className='obligatorio'>(*)</strong>
                        </label>

                        <Flatpickr
                            options={flatpickrOptions}
                            className="form-control py-2 flatPickrBG dark:flatPickrBGDark"
                            value={picker}
                            id='fechaAfiliacion'
                            placeholder='Fecha de Afiliacion'
                            error={errors.fechaAfiliacion}
                            onChange={(date) => setPicker(date)}
                        />
                        {/* Registrar el campo fuera del componente Flatpickr */}
                        <input type="hidden" {...register("fechaAfiliacion")} />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Nombre
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <Textinput
                            name="nombre"
                            type="text"
                            register={register}
                            placeholder="Nombre"
                            error={errors.nombre}
                        />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Apellido
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <Textinput
                            name="apellido"
                            type="text"
                            register={register}
                            placeholder="Apellido"
                            error={errors.apellido}
                        />
                    </div>

                    <SelectForm
                        register={register("sexo")}
                        title={'Sexo'}
                        options={sexo}
                        error={errors.sexo}
                    />

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Fecha de Nacimiento
                        </label>

                        <Flatpickr
                            options={flatpickrOptions}
                            className="form-control py-2 flatPickrBG dark:flatPickrBGDark"
                            value={picker2}
                            id='fechaNacimiento'
                            placeholder='Fecha de Nacimiento'
                            error={errors.fechaNacimiento}
                            onChange={(date) => setPicker2(date)}
                        />
                        <input type="hidden" {...register("fechaNacimiento")} />
                    </div>

                    <SelectForm
                        register={register("estadoCivil")}
                        title={'Estado Civil'}
                        options={estadoCivil}
                        error={errors.estadoCivil}
                    />

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Nacionalidad
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <SelectForm
                            register={register("nacionalidad")}
                            options={nacionalidad}
                            error={errors.nacionalidad}
                        />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Tipo de Documento
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <SelectForm
                            register={register("tipoDocumento")}
                            options={tipoDocumento}
                            error={errors.tipoDocumento}
                        />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Documento
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <Numberinput
                            register={register}
                            id='dni'
                            maxLength="8"
                            placeholder='Documento'
                            error={errors.DNI}
                        />
                    </div>

                    <Numberinput
                        label="CUIL"
                        register={register}
                        id='cuil'
                        placeholder='CUIL'
                        error={errors.cuil}
                        value={cuil}
                        onChange={handleCuilChange}
                    />

                    <Textinput
                        label="Correo Electrónico"
                        register={register}
                        id='fechaNacimiento'
                        placeholder='Correo Electrónico'
                        error={errors.fechaNacimiento}
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

export default DatosPersonalesData
