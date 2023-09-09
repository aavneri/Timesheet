import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import TableCell from "../components/TableCell";
import TableEditCell from "../components/TableEditCell";
import axios from "axios";
import { Endpoints } from '../constants'

function Table({ tabelData }) {
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
            },
        }),
        columnHelper.display({
            id: "edit",
            cell: TableEditCell,
        }),
    ];
    const [userInfo, setUserInfo] = useState(
        localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null
    );
    const [data, setData] = useState(() => tabelData);
    const [originalData, setOriginalData] = useState(() => tabelData);
    const [editedRows, setEditedRows] = useState({});
    useEffect(() => {
        setData(tabelData);
    }, [tabelData]);

    const saveLineItem = (lineItem) =>
        (async () => {
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.put(
                `${Endpoints.UPDATE_LINE_ITEM(lineItem.lineItemId)}`,
                lineItem,
                config
            );
            window.dispatchEvent(new Event("lineItemUpdated"));
        })();

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            editedRows,
            setEditedRows,
            revertData: (rowIndex, revert) => {
                if (revert) {
                    setData((old) => old.map((row, index) => (index === rowIndex ? originalData[rowIndex] : row)));
                } else {
                    setOriginalData((old) => old.map((row, index) => (index === rowIndex ? data[rowIndex] : row)));
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
                            saveLineItem(newLineItem);
                            return newLineItem;
                        }
                        return row;
                    })
                );
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
        </table>
    );
}

export default Table;
