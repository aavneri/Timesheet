import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useLocation, useNavigate } from "react-router-dom";
import TableCell from "../components/TableCell";
import TableEditCell from "../components/TableEditCell";
import TableFooterCell from "../components/TableFooterCell";
import axios from "axios";
import { Endpoints } from "../constants";
import { authRequestConfig } from "../services/RequestConfigs";
import Logout from "../common/Logout";
import Swal from "sweetalert2";

function Table({ tabelData, sheetId }) {
    const location = useLocation();
    const navigate = useNavigate();
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor("lineItemId", {
            header: "ID",
            meta: {
                type: "number",
            },
        }),
        columnHelper.accessor("date", {
            header: "Date",
            cell: TableCell,
            meta: {
                type: "date",
            },
        }),
        columnHelper.accessor("minutes", {
            header: "Minutes",
            cell: TableCell,
            meta: {
                type: "number",
                min: "0",
                max: "1440",
            },
        }),
        columnHelper.display({
            id: "edit",
            cell: TableEditCell,
        }),
    ];
    const [timesheetId, setTimesheetId] = useState(() => sheetId);
    const [data, setData] = useState(() => tabelData);
    const [originalData, setOriginalData] = useState(() => tabelData);
    const [editedRows, setEditedRows] = useState({});
    useEffect(() => {
        setData(tabelData);
    }, [tabelData]);

    const deleteLineItems = async (setFilterFunc, lineItemIds) => {
        try {
            Swal.fire({
                title: "Deleting...",
                html: "Please wait a moment",
            });
            Swal.showLoading();
            const config = authRequestConfig();
            config.data = { lineItemIds: [...lineItemIds] };
            const { data } = await axios.delete(Endpoints.DELETE_LINE_ITEM, config);
            setData(setFilterFunc);
            setOriginalData(setFilterFunc);
            window.dispatchEvent(new Event("lineItemUpdated"));
            Swal.close();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                Logout().then(() => {
                    navigate(`/login?redirect=${location.pathname}`);
                });
            } else {
                Swal.close();
            }
        }
    };

    const saveLineItem = (lineItem) =>
        (async () => {
            try {
                Swal.fire({
                    title: "Saving...",
                    html: "Please wait a moment",
                });
                Swal.showLoading();
                const { data } = await axios.put(
                    `${Endpoints.UPDATE_LINE_ITEM(lineItem.lineItemId)}`,
                    lineItem,
                    authRequestConfig()
                );
                window.dispatchEvent(new Event("lineItemUpdated"));
                Swal.close();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    Logout().then(() => {
                        navigate(`/login?redirect=${location.pathname}`);
                    });
                } else {
                    Swal.close();
                }
            }
        })();
    const date = new Date();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        meta: {
            editedRows,
            setEditedRows,
            revertData: (rowIndex, revert) => {
                if (revert) {
                    setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
                } else {
                    setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
                    saveLineItem(data[rowIndex]);
                }
            },
            updateData: (rowIndex, columnId, value) => {
                setData((old) =>
                    old.map((row, index) => {
                        if (index === rowIndex) {
                            const newLineItem = {
                                ...old[rowIndex],
                                [columnId]: value,
                            };
                            return newLineItem;
                        }
                        return row;
                    })
                );
            },
            addRow: () => {
                (async () => {
                    try {
                        Swal.fire({
                            title: "Adding...",
                            html: "Please wait a moment",
                        });
                        Swal.showLoading();
                        const today = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000)
                            .toISOString()
                            .split("T")[0];

                        const { data } = await axios.post(
                            Endpoints.CREATE_LINE_ITEM,
                            { date: today, minutes: 0, timesheetId: timesheetId },
                            authRequestConfig()
                        );
                        const newRow = {
                            lineItemId: data.lineItemId,
                            date: today,
                            minutes: 0,
                        };
                        const setFunc = (old) => [...old, newRow];
                        setData(setFunc);
                        setOriginalData(setFunc);
                        Swal.close();
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            Logout().then(() => {
                                navigate(`/login?redirect=${location.pathname}`);
                            });
                        } else {
                            Swal.close();
                        }
                    }
                })();
            },
            removeRow: (rowIndex) => {
                const lineItemId = data[rowIndex]["lineItemId"];
                const setFilterFunc = (old) => old.filter((_row, index) => index !== rowIndex);
                deleteLineItems(setFilterFunc, [lineItemId]);
            },
            removeSelectedRows: (selectedRows) => {
                const lineItemIds = data
                    .filter((_, index) => selectedRows.includes(index))
                    .map((row) => row["lineItemId"]);
                const setFilterFunc = (old) => old.filter((_row, index) => !selectedRows.includes(index));
                deleteLineItems(setFilterFunc, lineItemIds);
            },
        },
    });

    return (
        <table className="timesheet">
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={table.getCenterLeafColumns().length} align="right">
                        <TableFooterCell table={table} />
                    </th>
                </tr>
            </tfoot>
        </table>
    );
}

export default Table;
