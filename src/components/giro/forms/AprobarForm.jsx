import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { SelectForm } from "./SelectForm";
import { useSolicitudStore, useSucursalStore } from "@/helpers";

const FormValidationSchema = yup
  .object({
    sucursalId: yup.string().notOneOf([""], "La sucursal es requerida"),
  })
  .required();

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export const AprobarForm = () => {
    const { startAddNewEntrega } = useSolicitudStore();
    const { sucursales, startLoadingSucursales } = useSucursalStore();
    const options = sucursales.filter((sucursal) => (sucursal.id !== 1 && sucursal) )

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
          sucursalId: "",
        },
        resolver: yupResolver(FormValidationSchema),
    });

    const onSubmit = (data) => {
        startAddNewEntrega(data);
        reset();
    };

    useEffect(() => {
      startLoadingSucursales();
    }, [])
    
    return (
        <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <SelectForm 
              register={register("sucursalId")}
              title={'Sucursal'}
              error={errors.sucursalId}
              options={ options }
            />

            <div className="ltr:text-right rtl:text-left">
            <button className="btn-dark items-center text-center py-2 px-6 rounded-lg">Aprobar</button>
            </div>
        </form>
        </div>
    );
};