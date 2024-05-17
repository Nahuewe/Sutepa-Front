import Card from "@/components/ui/Card";
import { SelectForm } from "@/components/giro/forms";
import { useState } from "react";

const tipoDocumentoOptions = [
    { id: 'CONSTANCIA_DE_ALUMNO_REGULAR', nombre: 'Constancia de Alumno Regular' },
    { id: 'CERTIFICADO_DE_TRABAJO', nombre: 'Certificado de Trabajo' },
    // Añadir más opciones según sea necesario
];

function DocumentacionAdicionalData({ register, errors }) {
    const [documentos, setDocumentos] = useState([]);

    const agregarDocumento = () => {
        const nuevoDocumento = {
            tipoDocumento: '',
            archivo: null
        };
        setDocumentos([...documentos, nuevoDocumento]);
    };

    return (
        <>
            <h4 className="card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2">
                Documentación Adicional
            </h4>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectForm
                        register={register("tipoDocumento")}
                        title={'Tipo de Documento'}
                        options={tipoDocumentoOptions}
                    />
                    <div>
                        <label htmlFor="archivo" className="form-label">Archivo</label>
                        <input
                            type="file"
                            id="archivo"
                            className="form-control"
                            {...register("archivo")}
                        />
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button type="button" className="btn btn-primary" onClick={agregarDocumento}>Agregar</button>
                </div>
            </Card>
        </>
    );
}

export default DocumentacionAdicionalData;
