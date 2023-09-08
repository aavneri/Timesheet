import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import TableCell from "../components/TableCell";
import TableEditCell from "../components/TableEditCell";

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

    const [data, setData] = useState(() => tabelData);
   
    const [originalData, setOriginalData] = useState(() => tabelData);
    const [editedRows, setEditedRows] = useState({});
    useEffect(() => {
        setData(tabelData);
    }, [tabelData]);
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
                            return {
                                ...old[rowIndex],
                                [columnId]: value,
                            };
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
