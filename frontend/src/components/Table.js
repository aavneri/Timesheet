import React, { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
//import { defaultData } from "../tableData/defaultData";
import TableCell from "../components/TableCell";
import TableEditCell from "../components/TableEditCell";
import axios from 'axios'

function Table() {
    const columnHelper = createColumnHelper();
    const columns = [
        columnHelper.accessor("_id", {
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

    const [data, setData] = useState(() => []);
    const [originalData, setOriginalData] = useState(() => []);
    useEffect(()=> async () =>{
        
        const { data } = await axios.get("/api/timesheets/1");
        setData(data)
        
    }, [])
    const [editedRows, setEditedRows] = useState({});
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
        <table>
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
