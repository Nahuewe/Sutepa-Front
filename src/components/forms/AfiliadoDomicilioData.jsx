import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Numberinput from "@/components/ui/Numberinput";
import { SelectForm } from "@/components/giro/forms";

const tipoDocumento = [
    {
        id: 'CATAMARCA',
        nombre: 'CATAMARCA'
    },
    {
        id: 'BUENOS AIRES',
        nombre: 'BUENOS AIRES'
    }
]

function AfiliadoDomicilioData({ register, errors }) {
    return (
        <>

            <h4 className="card-title text-center bg-red-500 dark:bg-gray-700 text-white rounded-md p-2">
                Datos del Domicilio
            </h4>

            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Textinput
                        name="domicilio"
                        label="Domicilio"
                        register={register}
                        placeholder="Domiclio"
                        error={errors.domicilio}
                    />

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Provincia
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <SelectForm
                            register={register("provincia")}
                            options={tipoDocumento}
                            error={errors.provincia}
                        />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Localidad
                            <strong className='obligatorio'>(*)</strong>
                        </label>
                        <SelectForm
                            register={register("localidad")}
                            options={tipoDocumento}
                            error={errors.localidad}
                        />
                    </div>

                    <div>
                        <label htmlFor="default-picker" className=" form-label">
                            Codigo Postal
                        </label>
                        <Numberinput
                            id='codigoPostal'
                            maxLength="4"
                            placeholder='Codigo Postal'
                        />
                    </div>

                </div>
            </Card>
        </>
    )
}

export default AfiliadoDomicilioData
