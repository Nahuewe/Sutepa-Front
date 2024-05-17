import React, { useState } from 'react';
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import { SelectForm } from "@/components/giro/forms";

const tipoObraSocial = [
    { id: 'SINDICAL', nombre: 'SINDICAL' },
    { id: 'PREPAGA', nombre: 'PREPAGA' },
    { id: 'OTRA', nombre: 'OTRA' }
];

function ObraSocialAfiliadoData({ register }) {
    const [tipoSeleccionado, setTipoSeleccionado] = useState('');

    const handleTipoChange = (event) => {
        setTipoSeleccionado(event.target.value);
    };

    return (
        <>
            <h4 className="card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2">
                Obra Social
            </h4>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="default-picker" className="form-label">
                            Tipo de Obra Social
                        </label>
                        <SelectForm
                            register={register("tipoObraSocial")}
                            options={tipoObraSocial}
                            onChange={handleTipoChange}
                        />
                    </div>

                    {tipoSeleccionado !== 'OTRA' && (
                        <Textinput
                            name="obraSocial"
                            label="Obra Social"
                            register={register}
                            placeholder="Obra Social"
                        />
                    )}

                    {tipoSeleccionado === 'OTRA' && (
                        <Textinput
                            name="Otra"
                            label="Otra"
                            register={register}
                            placeholder="Otra"
                        />
                    )}
                </div>
            </Card>
        </>
    );
}

export default ObraSocialAfiliadoData;
