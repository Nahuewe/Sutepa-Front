import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { SelectForm } from "./SelectForm";

const FormValidationSchema = yup
  .object({
    nombre: yup.string().required("El nombre es requerido"),
    apellido: yup.string().required("El apellido es requerido"),
    dni: yup.string().required("El dni es requerido"),
    email: yup.string().required("El email es requerido"),
    telefono: yup.string().required("El telefono es requerido"),
    matricula: yup.string(),
    tipoPersonaId: yup.string().notOneOf([""], "Debe seleccionar un tipo")
  })
  .required();

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const estados = [
    {
        id: 1,
        nombre: 'Emprendedor'
    },
    {
        id: 2,
        nombre: 'Retiro Eventual'
    }
]

export const PersonaForm = ({ activePersona = null, startFn }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
          nombre: (activePersona?.nombre) || "",
          apellido: (activePersona?.apellido) || "",
          dni: (activePersona?.dni) || "",
          email: (activePersona?.email) || "",
          telefono: (activePersona?.telefono) || "",
          matricula: (activePersona?.matricula) || "",
          tipoPersonaId: (activePersona?.tipoPersona?.id) || "",
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

            <Textinput
              name="apellido"
              label="Apellido"
              type="text"
              register={register}
              error={errors.apellido}
              placeholder="Apellido"
            />

            <Textinput
              name="dni"
              label="Dni"
              type="number"
              register={register}
              error={errors.dni}
              placeholder="Dni"
            />

            <Textinput
              name="email"
              label="Email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Email"
            />

            <Textinput
              name="telefono"
              label="Telefono"
              type="text"
              register={register}
              error={errors.telefono}
              placeholder="Telefono"
            />

            <Textinput
              name="matricula"
              label="Matricula"
              type="text"
              register={register}
              error={errors.matricula}
              placeholder="Matricula"
            />

            <SelectForm 
              register={register("tipoPersonaId")}
              title={'Tipo de Persona'}
              error={errors.tipoPersonaId}
              options={ estados }
            />

            <div className="ltr:text-right rtl:text-left">
            <button className="btn-dark items-center text-center py-2 px-6 rounded-lg">Guardar</button>
            </div>
        </form>
        </div>
    );
};