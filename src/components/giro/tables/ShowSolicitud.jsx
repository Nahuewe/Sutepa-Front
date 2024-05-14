import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import BasicMap from "@/pages/map/basic-map";
import Modal from "../../ui/Modal";
import Alert from "../../ui/Alert";
import useWidth from "@/hooks/useWidth";
import Checkbox from "../../ui/Checkbox";
import { AprobarForm, WarningModal } from "../forms";
import { cleanActiveSolicitud } from "@/store/solicitud";

export const ShowSolicitud = ({ activeSolicitud, startFinishEntrega, startAprobarEntrega }) => {
    const columnsShort = [
        {
            label: "Material",
            field: "material",
        },
        {
            label: "Cantidad",
            field: "cantidad",
        },
        {
            label: "Unidad",
            field: "unidad",
        },
    ];

    const { material, persona, estado, destinoMaterial, otroMaterial, createdAt } = activeSolicitud;
    const { width, breakpoints } = useWidth();
    const dispatch = useDispatch();

    const setActiveSolicitud = () => {
        dispatch(cleanActiveSolicitud());
    }

    return (
        <>
            <div className="grid grid-cols-12 gap-6">
                <div className="lg:col-span-4 col-span-12">
                    <Card title="Información">
                        <ul className="list space-y-8">
                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:clipboard-document-check" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        Solicitud
                                    </div>
                                    <span
                                        className="text-base text-slate-600 dark:text-slate-50"
                                    >
                                        N° {activeSolicitud.id}
                                    </span>
                                </div>
                            </li>

                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:user" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        NOMBRE
                                    </div>
                                    <span
                                        className="capitalize text-base text-slate-600 dark:text-slate-50"
                                    >
                                        {persona.nombre} {persona.apellido}
                                    </span>
                                </div>
                            </li>

                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:identification" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        DNI
                                    </div>
                                    <span
                                        className="text-base text-slate-600 dark:text-slate-50"
                                    >
                                        {persona.dni}
                                    </span>
                                </div>
                            </li>

                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:envelope" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        EMAIL
                                    </div>
                                    <span
                                        className="text-base text-slate-600 dark:text-slate-50"
                                    >
                                        {persona.email}
                                    </span>
                                </div>
                            </li>

                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:phone-arrow-up-right" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        Teléfono
                                    </div>
                                    <p className="text-base text-slate-600 dark:text-slate-50">
                                        {persona.telefono}
                                    </p>
                                </div>
                            </li>

                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:clipboard-document" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        MATRICULA
                                    </div>
                                    <div className="text-base text-slate-600 dark:text-slate-50">
                                        {persona?.matricula || '-'}
                                    </div>
                                </div>
                            </li>

                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:calendar-days" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        FECHA
                                    </div>
                                    <div className="text-base text-slate-600 dark:text-slate-50">
                                        {createdAt}
                                    </div>
                                </div>
                            </li>

                            <li className="flex space-x-3 rtl:space-x-reverse">
                                <div className="flex-none text-2xl text-slate-600 dark:text-slate-300">
                                    <Icon icon="heroicons:arrow-top-right-on-square" />
                                </div>
                                <div className="flex-1">
                                    <div className="uppercase text-xs text-slate-500 dark:text-slate-300 mb-1 leading-[12px]">
                                        ESTADO
                                    </div>
                                    <span
                                        className={` inline-block
                                        ${estado.id === 1
                                                ? "text-info-500"
                                                : ""
                                            } 
                                        ${estado.id === 2
                                                ? "text-warning-500"
                                                : ""
                                            } 
                                        ${estado.id === 3
                                                ? "text-primary-500"
                                                : ""
                                            } 
                                        ${estado.id === 4
                                                ? "text-success-500"
                                                : ""
                                            } 
                                        ${estado.id === 5
                                                ? "text-danger-500"
                                                : ""
                                            } 
                                        `}
                                    >
                                        {estado.nombre}
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </Card>
                </div>

                <div className="lg:col-span-8 col-span-12">
                    <BasicMap latitud={persona?.latitud || 0} longitud={persona?.longitud || 0} />
                </div>
            </div>

            {
                (destinoMaterial || otroMaterial) && (
                    <div className="grid grid-cols-1 gap-6 my-5">
                        <Card title="Información Adicional" noborder>
                            <div className="xl:col-span-5 col-span-12 lg:col-span-7">
                                <div>
                                    <div className="text-base font-medium text-slate-800 dark:text-slate-100 mb-1">
                                        Destino de Material
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {destinoMaterial || 'No se especifico el destino del material.'}
                                    </p>
                                </div>
                                <br />
                                <div>
                                    <div className="text-base font-medium text-slate-800 dark:text-slate-100 mb-1">
                                        Otras Sugerencias
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                        {otroMaterial || 'No se realizo ninguna sugerencia.'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }

            <div className="grid grid-cols-1 gap-6 my-5">
                <Card title="Lista de Materiales" noborder>
                    {width > breakpoints.sm && (
                        <div className="overflow-x-auto -mx-6">
                            <div className="inline-block min-w-full align-middle">
                                <div className="overflow-hidden ">
                                    <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                                        <thead className="bg-slate-200 dark:bg-slate-700">
                                            <tr>
                                                {columnsShort.map((column, i) => (
                                                    <th key={i} scope="col" className="table-th">
                                                        {column.label}
                                                    </th>
                                                ))}
                                                {estado.id !== 1 && estado.id !== 2 && estado.id !== 5 && (
                                                    <>
                                                        <th className="table-th">Fecha</th>
                                                        <th className="table-th">Entregado</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                                            {material.map((row, i) => (
                                                <tr
                                                    key={i}
                                                    className="hover:bg-slate-200 dark:hover:bg-slate-700"
                                                >
                                                    <td className="table-td">{row.material}</td>
                                                    <td className="table-td">{row.cantidad}</td>
                                                    <td className="table-td">{row.unidad}</td>
                                                    {estado.id !== 1 && estado.id !== 2 && estado.id !== 5 && (
                                                        <td className="table-td">{row.fecha || '-'}</td>
                                                    )}
                                                    {estado.id !== 1 && estado.id !== 2 && estado.id !== 5 && (
                                                        <td className="table-td">
                                                            <Checkbox
                                                                id={row.id}
                                                                value={row.estado}
                                                                disabled={estado.id !== 3}
                                                            />
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {width < breakpoints.sm && (
                        <div className="bg-slate-100 dark:bg-slate-700 rounded px-4 pt-4 pb-1 flex flex-col flex-wrap justify-between">
                            {
                                material.map((row, i) => (
                                    <div key={i} class="mb-3">
                                        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                            {row.material}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-300">
                                            {`${row.cantidad} ${row.unidad}`}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-300">
                                            {estado.id !== 1 && estado.id !== 2 && estado.id !== 5 && (
                                                `${row.fecha || '-'}`
                                            )}
                                        </div>
                                        <div>
                                            {estado.id !== 1 && estado.id !== 2 && estado.id !== 5 && (
                                                <Checkbox
                                                    id={row.id}
                                                    value={row.estado}
                                                    disabled={estado.id !== 3}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </Card>
            </div>

            {
                (() => {
                    if (estado.id === 1) {
                        return (
                            <div>
                                <div className="flex flex-col justify-center gap-4 mb-4">
                                    <Alert className="alert-info text-black" label={`La solicitud se encuentra en el estado: ${estado.nombre}`} />
                                </div>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <button className="btn text-white bg-danger-600 inline-flex justify-center px-16" onClick={setActiveSolicitud}>Volver</button>
                                    <Modal
                                        activeModal={true}
                                        onClose
                                        noFade
                                        disableBackdrop
                                        className="max-w-xl"
                                        children={<AprobarForm />}
                                        footerContent={false}
                                        centered
                                        scrollContent
                                        themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
                                        title="Aprobar Solicitud"
                                        uncontrol
                                        label="Aprobar"
                                        labelClass="btn inline-flex justify-center btn-success px-16"
                                    />
                                </div>
                            </div>
                        )

                    } else if (estado.id === 2) {

                        return (
                            <div>
                                <div className="flex flex-col justify-center gap-4 mb-4">
                                    <Alert className="alert-warning text-black" label={`La solicitud se encuentra en el estado: ${estado.nombre}`} />
                                </div>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <button className="btn text-white bg-danger-600 inline-flex justify-center px-16" onClick={setActiveSolicitud}>Volver</button>
                                    <WarningModal
                                        activeModal={true}
                                        onClose
                                        noFade
                                        disableBackdrop
                                        className="max-w-xl"
                                        footerContent={false}
                                        centered
                                        scrollContent
                                        themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
                                        title="Aprobar Entrega"
                                        label="Aprobar"
                                        labelClass="btn inline-flex justify-center btn-success px-16"
                                        message="¿Desea aprobar la entrega y enviar aviso al solicitante?"
                                        labelBtn="Aceptar"
                                        btnFunction={startAprobarEntrega}
                                    />
                                </div>
                            </div>
                        )

                    } else if (estado.id === 3) {

                        return (
                            <div>
                                <div className="flex flex-col justify-center gap-4 mb-4">
                                    <Alert className="alert-primary text-black" label={`La solicitud se encuentra en el estado: ${estado.nombre}`} />
                                </div>
                                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                                    <button className="btn text-white bg-danger-600 inline-flex justify-center px-16" onClick={setActiveSolicitud}>Volver</button>
                                    <WarningModal
                                        activeModal={true}
                                        onClose
                                        noFade
                                        disableBackdrop
                                        className="max-w-xl"
                                        footerContent={false}
                                        centered
                                        scrollContent
                                        themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
                                        title="Entregar Materiales"
                                        label="Entregar"
                                        labelClass="btn inline-flex justify-center btn-primary px-16"
                                        message="¿Desea realizar la entrega de los materiales?"
                                        labelBtn="Aceptar"
                                        btnFunction={startFinishEntrega}
                                    />
                                </div>
                            </div>
                        )

                    } else if (estado.id === 4) {

                        return (
                            <div className="flex flex-col justify-center gap-4">
                                <div className="flex flex-col justify-center gap-4 mb-4">
                                    <Alert className="alert-success text-black" label={`La solicitud se encuentra en el estado: ${estado.nombre}`} />
                                </div>
                                <button className="btn text-white bg-danger-600 items-center text-center rounded-lg w-full sm:w-60 sm:block sm:m-auto" onClick={setActiveSolicitud}>Volver</button>
                            </div>
                        )

                    } else {

                        return (
                            <div className="flex flex-col justify-center gap-4">
                                <div className="flex flex-col justify-center gap-4 mb-4">
                                    <Alert className="alert-danger text-black" label={`La solicitud se encuentra en el estado: ${estado.nombre}`} />
                                </div>
                                <button className="btn text-white bg-danger-600 items-center text-center rounded-lg w-full sm:w-60 sm:block sm:m-auto" onClick={setActiveSolicitud}>Volver</button>
                            </div>
                        )

                    }
                })()
            }

        </>
    )
}
