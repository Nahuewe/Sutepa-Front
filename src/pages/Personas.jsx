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
import { hadleShowModal } from "../store/layout";
import { usePersonaStore } from "../helpers";
import { PersonaForm } from "../components/giro/forms";
import EditModal from "../components/giro/forms/EditModal";
import { setActivePersona } from "../store/persona";

const COLUMNS = [
  {
    Header: "ID",
    accessor: (row, rowIndex) => rowIndex + 1,
    Cell: (row) => {
      return <span>{`${row?.cell?.value}`}</span>;
    },
  },
  {
    Header: "Nombre",
    accessor: "nombre",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Apellido",
    accessor: "apellido",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },
  {
    Header: "Documento",
    accessor: "dni",
    Cell: (row) => {
      return <span>{row?.cell?.value}</span>;
    },
  },  
  {
    Header: "Tipo",
    accessor: "tipoPersona",
    Cell: (row) => {
      return (
        <span
          className={` inline-block px-3 min-w-[130px] text-center mx-auto py-1 rounded-[999px] bg-opacity-25 text-black ${
            row?.cell?.value?.id === 1 
              ? "text-success-500 bg-success-500 dark:text-success-500 dark:bg-success-500"
              : "text-warning-500 bg-warning-500 dark:text-warning-500 dark:bg-warning-500"
            }   
          `}
        >
          { row?.cell?.value?.nombre }
        </span>
      )
    },
  },
  {
    Header: "Acciones",
    accessor: "id",
    Cell: (row) => {
      return (
        <div className="flex space-x-3 rtl:space-x-reverse">
          <Tooltip content="Editar" placement="top" arrow animation="shift-away">
            <button className="action-btn" type="button" onClick={ () => { row.updatePersona(row?.cell?.value) } }>
              <Icon icon="heroicons:pencil-square" />
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];

export const Personas = ({ title = "Listado de Personas" }) => {
  const { personas, activePersona, startLoadingPersonas, startUpdatePersona } = usePersonaStore();
  const dispatch = useDispatch();

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => personas, [personas]);

  const tableInstance = useTable(
    {
      columns,
      data,
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

  const updatePersona = (id) => {
    dispatch( setActivePersona(id) );
    dispatch( hadleShowModal(true) );
  }

  useEffect(() => {
    startLoadingPersonas();
  }, [])
  
  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div className="flex gap-4">
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />

            <EditModal
              activeModal={true} 
              onClose
              noFade
              disableBackdrop
              className = "max-w-xl"
              children = { <PersonaForm activePersona={ activePersona } startFn={ startUpdatePersona } /> }
              footerContent = { false }
              centered
              scrollContent
              themeClass = "bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700"
              title = "Editar Persona"
              uncontrol
              label = "Editar"
              labelClass = "btn-dark items-center text-center px-6 rounded-lg flex"
              btnIcon = "plus"
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
                              {cell.render("Cell", { updatePersona })}
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
                      ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
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
