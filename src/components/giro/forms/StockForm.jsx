import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Textinput from "@/components/ui/Textinput";
import * as yup from "yup";
import { useMaterialStore } from "@/helpers";
import { hadleShowModal } from "@/store/layout";

const FormValidationSchema = yup
  .object({
    cantidad: yup.string().required("La cantidad es requerida"),
  })
  .required();

const styles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

export const StockForm = ({ stock }) => {
    const dispatch = useDispatch();
    const { id, cantidad } = stock;
    const { startUpdatingStockMaterial } = useMaterialStore();

    const {
        register,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            cantidad: cantidad,
        },
        resolver: yupResolver(FormValidationSchema),
    });

    const onSubmit = (data) => {
        startUpdatingStockMaterial(id, data);
        reset({ cantidad: null });
        dispatch( hadleShowModal(false) );
    };
    
    return (
        <div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 ">
            <Textinput
                name="cantidad"
                label="Cantidad"
                type="number"
                register={register}
                error={errors.cantidad}
                placeholder="Cantidad"
            />

            <div className="ltr:text-right rtl:text-left">
                <button className="btn-dark items-center text-center py-2 px-6 rounded-lg">Guardar</button>
            </div>
        </form>
        </div>
    );
};