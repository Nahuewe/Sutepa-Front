import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { SelectForm } from "./";
import { useSucursalStore, useUserStore } from "@/helpers";

const FormValidationSchema = yup
  .object({
    password: yup.string().required("La contraseña es requerida"),
    nombre: yup.string().required("El nombre es requerido"),
    username: yup.string().required("El usuario es requerido"),
    sucursalId: yup.string().notOneOf([""], "Debe seleccionar una opción")
  })
  .required();

const FormValidationSchemaUpdate = yup
  .object({
    password: yup.string(),
    nombre: yup.string().required("El nombre es requerido"),
    username: yup.string().required("El usuario es requerido"),
    sucursalId: yup.string().notOneOf([""], "Debe seleccionar una opción")
  })
  .required();

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export const UserForm = ({ activeUser = null, startFn }) => {
  const { sucursales, startLoadingSucursales } = useSucursalStore();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      nombre: activeUser?.nombre || "",
      username: activeUser?.username || "",
      sucursalId: activeUser?.sucursal?.id || "",
    },
    resolver: !!activeUser ? yupResolver(FormValidationSchemaUpdate) : yupResolver(FormValidationSchema) ,
  });

  const onSubmit = (data) => {
    startFn(data)
    reset({ username:"", nombre: "", password: "", sucursalId: ""})
  };

  useEffect(() => {
    startLoadingSucursales();
  }, [])
  
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
          name="username"
          label="Usuario"
          type="text"
          register={register}
          error={errors.username}
          placeholder="Usuario"
        />

        <SelectForm 
          register={register("sucursalId")}
          title={'Sucursal'}
          error={errors.sucursal}
          options={ sucursales }
        />

        <Textinput
          name="password"
          label="Contraseña"
          type="password"
          register={register}
          error={errors.password}
          placeholder="Contraseña"
        />

        <div className="ltr:text-right rtl:text-left">
          <button className="btn-dark items-center text-center py-2 px-6 rounded-lg">Guardar</button>
        </div>
      </form>
    </div>
  );
};
