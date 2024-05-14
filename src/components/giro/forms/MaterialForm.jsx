import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { SelectForm } from "./SelectForm";

const FormValidationSchema = yup
  .object({
    nombre: yup.string().required("El nombre es requerido"),
    categoriaId: yup.string().notOneOf([""], "Debe seleccionar una categoria"),
    unidadId: yup.string().notOneOf([""], "Debe seleccionar una unidad")
  })
  .required();

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export const MaterialForm = ({ categories, unidades, activeMaterial = null, startFn }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
          nombre: (activeMaterial?.nombre) || "",
          categoriaId: (activeMaterial?.categoria?.id) || "",
          unidadId: (activeMaterial?.unidad?.id) || "",
        },
        resolver: yupResolver(FormValidationSchema),
    });

    const onSubmit = (data) => {
      startFn(data);
      reset();
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

            <SelectForm 
              register={register("categoriaId")}
              title={'Categorias'}
              error={errors.categoriaId}
              options={ categories }
            />

            <SelectForm 
              register={register("unidadId")}
              title={'Unidades'}
              error={errors.unidadId}
              options={ unidades }
            />

            <div className="ltr:text-right rtl:text-left">
            <button className="btn-dark items-center text-center py-2 px-6 rounded-lg">Guardar</button>
            </div>
        </form>
        </div>
    );
};