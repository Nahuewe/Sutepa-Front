import Card from "@/components/ui/Card";
import Textarea from "@/components/ui/Textarea";
import { SelectForm } from "@/components/giro/forms";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css";
import { useState } from "react";

const tiposSubsidio = [
    { id: 'TIPO_1', nombre: 'Tipo 1' },
    { id: 'TIPO_2', nombre: 'Tipo 2' },
    { id: 'TIPO_3', nombre: 'Tipo 3' }
];

const flatpickrOptions = {
    dateFormat: "d-m-Y",
    locale: {
        firstDayOfWeek: 1,
        weekdays: {
            shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
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
                "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
            ],
            longhand: [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ]
        }
    }
};

function SubsidioData({ register, errors }) {
    const [fechaSolicitud, setFechaSolicitud] = useState(null);
    const [fechaOtorgamiento, setFechaOtorgamiento] = useState(null);

    return (
        <>
            <h4 className="card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2">
                Subsidios
            </h4>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Tipo de Subsidio
                            <strong className='obligatorio'>(*)</strong>
                        </label>

                        <SelectForm
                            register={register("tipoSubsidio")}
                            options={tiposSubsidio}
                            error={errors.tipoSubsidio}
                        />
                    </div>

                    <div>
                        <label htmlFor="fechaSolicitud" className="form-label">
                            Fecha de Solicitud
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <Flatpickr
                            options={flatpickrOptions}
                            className="form-control py-2 flatPickrBG dark:flatPickrBGDark"
                            value={fechaSolicitud}
                            id='fechaSolicitud'
                            placeholder='Fecha de Solicitud'
                            onChange={(date) => setFechaSolicitud(date)}
                            error={errors.fechaSolicitud}
                        />
                        <input type="hidden" {...register("fechaSolicitud")} />
                    </div>

                    <div>
                        <label htmlFor="fechaOtorgamiento" className="form-label">
                            Fecha de Otorgamiento
                        </label>
                        <Flatpickr
                            options={flatpickrOptions}
                            className="form-control py-2 flatPickrBG dark:flatPickrBGDark"
                            value={fechaOtorgamiento}
                            id='fechaOtorgamiento'
                            placeholder='Fecha de Otorgamiento'
                            onChange={(date) => setFechaOtorgamiento(date)}
                        />
                        <input type="hidden" {...register("fechaOtorgamiento")} />
                    </div>

                    <div>
                        <label htmlFor="observaciones" className="form-label">
                            Observaciones
                        </label>
                        <Textarea
                            name="observaciones"
                            register={register}
                            placeholder="Observaciones"
                        />
                    </div>
                </div>
            </Card>
        </>
    );
}

export default SubsidioData;
