import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";

const FormValidationSchema = yup
  .object({
    nombre: yup.string().required("El nombre es requerido"),
  })
  .required();

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export const SucursalForm = ({ sucursal = null, startFn }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
      defaultValues: {
        nombre: sucursal,
      },
        resolver: yupResolver(FormValidationSchema),
    });

    const onSubmit = (data) => {
        startFn(data);
        reset({ nombre: null });
    };

    return (
        <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <Textinput
            name="nombre"
            label="Nombre"
            type="text"
            register={register}
            error={errors.nombre}
            placeholder="Nombre"
            />

            <div className="ltr:text-right rtl:text-left">
            <button className="btn-dark items-center text-center py-2 px-6 rounded-lg">Guardar</button>
            </div>
        </form>
        </div>
    );
};