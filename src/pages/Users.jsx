import React, { useState, useMemo, useEffect } from "react";
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
import { UserForm } from "@/components/giro/forms";
import { useUserStore } from "../helpers";
import { DeleteModal } from "../components/giro/forms";
import { useDispatch } from "react-redux";
import { hadleShowDeleteModal, hadleShowModal } from "../store/layout";
import { setActiveUser } from "../store/user";
import EditModal from "../components/giro/forms/EditModal";
import { useAuthStore, useIngresoStore } from "../helpers";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";

const usuarios = [
  {
    id: 1,
    nombre: 'Nahuel Soria Parodi',
    username: 'nsoria',
    sucursal: 'Administrador',
    seccional: 'Catamarca',
    createdAt: '22/07/2001'
  },
  {
    id: 2,
    nombre: 'Gonzalo Turati',
    username: 'gturati',
    sucursal: 'ABM_GENERAL',
    seccional: 'Buenos Aires',
    createdAt: '11/07/2001'
  }
];

const COLUMNS = [
  {
    Header: "Nombre y Apellido",
    accessor: "nombre",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Usuario",
    accessor: "username",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Rol",
    accessor: "sucursal",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Seccional",
    accessor: "seccional",
    Cell: (row) => {
      return <span>{row?.cell?.value || "-"}</span>;
    },
  },
  {
    Header: "Fecha de Creación",
    accessor: "createdAt",
    Cell: (row) => {
      return <span>{row?.cell?.value || "-"}</span>;
    },
  },
  {
    Header: "Estado",
    accessor: "deletedAt",
    Cell: (row) => {
      return (
        <span className="block w-full">
          <span
            className={` inline-block px-3 min-w-[90px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-black ${row?.cell?.value === null
              ? "text-warning-500 bg-warning-500 dark:text-warning-500 dark:bg-warning-500"
              : "text-success-500 bg-success-500 dark:text-success-500 dark:bg-success-500"
              }   
            `}
          >
            {(row?.cell?.value === null) ? 'Inactivo' : 'Activo'}
          </span>
        </span>
      );
    },
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: (row) => {
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Editar" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button" onClick={() => { row.updateUser(row?.cell?.value) }}>
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
            <button className="action-btn" type="button" onClick={() => { row.deleteUser(row?.cell?.value) }}>
              <Icon icon="heroicons:trash" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export const Users = ({ title = "Listado de Usuarios" }) => {
  const { users, activeUser, startLoadingUsers, startSavingUser, startDeleteUser, startUpdateUser } = useUserStore();
  const dispatch = useDispatch();
  const { user: { sucursal } } = useAuthStore();
  const { ingresos, startLoadingIngreso } = useIngresoStore();
  const gridColumns = sucursal !== 1 ? "md:grid-cols-4" : "md:grid-cols-4";

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => users, [users]);

  const tableInstance = useTable(
    {
      columns,
      data: usuarios,
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

  const deleteUser = (id) => {
    dispatch(setActiveUser(id));
    dispatch(hadleShowDeleteModal(true));
  }

  const updateUser = (id) => {
    dispatch(setActiveUser(id));
    dispatch(hadleShowModal(true));
  }

  useEffect(() => {
    startLoadingUsers();
  }, [])

  const { globalFilter, pageIndex, pageSize } = state;
  return (
    <>
      <div className={`mt-4 mb-4 grid ${gridColumns} sm:grid-cols-2 grid-cols-1 gap-4`}>
        <GroupChart3 ingresos={ingresos} />
      </div>

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
              children={<UserForm startFn={startSavingUser} />}
              footerContent={false}
              centered
              scrollContent
              themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
              title="Agregar Usuario"
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
              children={<UserForm activeUser={activeUser} startFn={startUpdateUser} />}
              footerContent={false}
              centered
              scrollContent
              themeClass="bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
              title="Editar Unidad"
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
              title="Eliminar Usuario"
              label="Eliminar"
              labelClass="btn inline-flex justify-center btn-success px-16"
              message="¿Seguro que desea deshabilitar el usuario?"
              labelBtn="Aceptar"
              btnFunction={startDeleteUser}
            />

          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
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
                              {cell.render("Cell", { deleteUser, updateUser })}
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

