import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Numberinput from "@/components/ui/Numberinput";
import { SelectForm } from "@/components/giro/forms";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css";
import { useState } from "react";

const parentescoOptions = [
    { id: 'CONCUBINE', nombre: 'Concubine' },
    { id: 'MADRE', nombre: 'Madre' },
    // Añadir más opciones según sea necesario
];

const flatpickrOptions = {
    dateFormat: "d/m/Y",
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
                "Ene", "Feb", "Mar", "Abr", "May", "Jun",
                "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
            ],
            longhand: [
                "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
            ]
        }
    }
};

function FamiliarAcargoData({ register, errors }) {
    const [picker, setPicker] = useState(null);
    const [familiares, setFamiliares] = useState([]);

    const agregarFamiliar = () => {
        const nuevoFamiliar = {
            nombre: '',
            apellido: '',
            fechaNacimiento: '',
            tipoDocumento: '',
            documento: '',
            parentesco: ''
        };
        setFamiliares([...familiares, nuevoFamiliar]);
    };

    return (
        <>
            <h4 className="card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2">
                Familiares a Cargo
            </h4>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Nombre y Apellido
                            <strong className='obligatorio'>(*)</strong>
                        </label>

                        <Textinput
                            name="nombreFamiliar"
                            type="text"
                            register={register}
                            placeholder="Nombre y Apellido"
                            error={errors.nombreFamiliar}
                        />
                    </div>
                    <div>
                        <label htmlFor="fechaNacimiento" className="form-label">
                            Fecha de Nacimiento
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <Flatpickr
                            options={flatpickrOptions}
                            className="form-control py-2 flatPickrBG dark:flatPickrBGDark"
                            value={picker}
                            id="fechaNacimiento"
                            placeholder="Fecha de Nacimiento"
                            error={errors.fechaNacimiento}
                            onChange={(date) => setPicker(date)}
                        />
                        <input type="hidden" {...register("fechaNacimiento")} />
                    </div>
                    <SelectForm
                        register={register("tipoDocumento")}
                        title={'Tipo de Documento'}
                        options={[
                            { id: 'DNI', nombre: 'DNI' },
                            { id: 'LIBRETA_DE_ENROLAMIENTO', nombre: 'Libreta de Enrolamiento' },
                            // Añadir más opciones según sea necesario
                        ]}
                        error={errors.tipoDocumento}
                    />
                    <Numberinput
                        label="Documento"
                        register={register}
                        id='documento'
                        placeholder='Documento'
                    />
                    <div>
                        <label htmlFor="default-picker" className="form-label">
                            Tipo de Parentesco
                            <strong className='obligatorio'>(*)</strong>
                        </label>

                        <SelectForm
                            register={register("parentesco")}
                            options={parentescoOptions}
                            error={errors.parentesco}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button type="button" className="btn btn-primary" onClick={agregarFamiliar}>Agregar</button>
                </div>
            </Card>

            {
                familiares.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full">
                            <thead className="bg-gray-300 dark:bg-gray-700">
                                <tr>
                                    <th className="px-4 py-2 text-center dark:text-white">Nombre y Apellido</th>
                                    <th className="px-4 py-2 text-center dark:text-white">Fecha de Nacimiento</th>
                                    <th className="px-4 py-2 text-center dark:text-white">Tipo de Documento</th>
                                    <th className="px-4 py-2 text-center dark:text-white">Documento</th>
                                    <th className="px-4 py-2 text-center dark:text-white">Parentesco</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700">
                                {familiares.map((familiar, index) => (
                                    <tr key={index} className="bg-white dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-4 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-white text-center">
                                            {familiar.nombre} {familiar.apellido}
                                        </td>
                                        <td className="px-4 py-2 text-center dark:text-white">{familiar.fechaNacimiento}</td>
                                        <td className="px-4 py-2 text-center dark:text-white">{familiar.tipoDocumento}</td>
                                        <td className="px-4 py-2 text-center dark:text-white">{familiar.documento}</td>
                                        <td className="px-4 py-2 text-center dark:text-white">{familiar.parentesco}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
        </>
    );
}

export default FamiliarAcargoData;
