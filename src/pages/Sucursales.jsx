import React, { useMemo, useEffect } from "react";
import { useDispatch } from "react-redux";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "@/components/giro/tables/GlobalFilter";
import Modal from "@/components/ui/Modal";
import { useSucursalStore } from "../helpers/useSucursalStore";
import { DeleteModal, SucursalForm } from "../components/giro/forms";
import { hadleShowDeleteModal, hadleShowModal } from "../store/layout";
import { setActiveSucursal } from "../store/sucursal";
import EditModal from "../components/giro/forms/EditModal";

const roles = [
  {
    id: 1,
    nombre: 'Administrador'
  },
  {
    id: 2,
    nombre: 'ABM_GENERAL',
  }
];

const COLUMNS = [
  {
    Header: "Nombre",
    accessor: "nombre",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: (row) => {
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Editar" placement="top" arrow animation="shift-away">
            <button id={row?.cell?.value} className="action-btn" type="button" onClick={() => row.updateSucursal(row?.cell?.value)}>
              <Icon icon="heroicons:pencil-square" />
            </button>
          </Tooltip>

          <Tooltip
            content="Eliminar"
            placement="top"
            arrow
            animation="shift-away"
            theme="danger"
          >
            <button id={row?.cell?.value} className="action-btn" type="button" onClick={() => row.deleteSucursal(row?.cell?.value)} >
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export const Sucursales = ({ title = "Listado de Roles" }) => {
  const { sucursales, activeSucursal, startLoadingSucursales, startDeleteSucursal, startSavingSucursal, startUpdateSucursal } = useSucursalStore();
  const dispatch = useDispatch();

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => sucursales, [sucursales]);

  const tableInstance = useTable(
    {
      columns,
      data: roles
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        ...columns,
      ]);
    }
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  const deleteSucursal = (id) => {
    dispatch(setActiveSucursal(id));
    dispatch(hadleShowDeleteModal(true));
  }

  const updateSucursal = (id) => {
    dispatch(setActiveSucursal(id));
    dispatch(hadleShowModal(true));
  }

  useEffect(() => {
    startLoadingSucursales();
  }, [])

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div className="flex gap-4">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

            <Modal
              activeModal={true}
              onClose
              noFade
              disableBackdrop
              className="max-w-xl"
              children={<SucursalForm startFn={startSavingSucursal} />}
              footerContent={false}
              centered
              scrollContent
              themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
              title="Agregar Rol"
              uncontrol
              label="Agregar"
              labelClass="bg-red-600 text-white items-center text-center px-6 rounded-lg flex"
              btnIcon="plus"
            />

            <EditModal
              activeModal={true}
              onClose
              noFade
              disableBackdrop
              className="max-w-xl"
              children={<SucursalForm sucursal={activeSucursal?.nombre} startFn={startUpdateSucursal} />}
              footerContent={false}
              centered
              scrollContent
              themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
              title="Editar Sucursal"
              uncontrol
              label="Editar"
              labelClass="btn-dark items-center text-center px-6 rounded-lg flex"
              btnIcon="plus"
            />

            <DeleteModal
              activeModal={true}
              onClose
              noFade
              disableBackdrop
              className="max-w-xl"
              footerContent={false}
              centered
              scrollContent
              themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
              title="Eliminar sucursal"
              label="Eliminar"
              labelClass="btn inline-flex justify-center btn-success px-16"
              message="¿Quieres eliminar esta sucursal?"
              labelBtn="Aceptar"
              btnFunction={startDeleteSucursal}
            />

          </div>
        </div>
        <div className="overflow-x-auto -mx-6 capitalize">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          scope="col"
                          className=" table-th "
                        >
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                  {...getTableBodyProps}
                >
                  {page.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                          return (
                            <td {...cell.getCellProps()} className="table-td">
                              {cell.render("Cell", { deleteSucursal, updateSucursal })}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Página{" "}
              <span>
                {pageIndex + 1} de {pageOptions.length}
              </span>
            </span>
          </div>
          <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Anterior
              </button>
            </li>
            {pageOptions.map((page, pageIdx) => (
              <li key={pageIdx}>
                <button
                  href="#"
                  aria-current="page"
                  className={` ${pageIdx === pageIndex
                    ? "bg-red-600  dark:text-slate-200 text-white font-medium "
                    : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                    }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                  onClick={() => gotoPage(pageIdx)}
                >
                  {page + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Siguiente
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${!canNextPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
        {/*end*/}
      </Card>
    </>
  );
};
