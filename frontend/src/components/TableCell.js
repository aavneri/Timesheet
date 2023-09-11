import React, { useState, useEffect } from "react";

function TableCell({ getValue, row, column, table }) {
    const initialValue = getValue();
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const [value, setValue] = useState("");
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = () => {
        table.options.meta?.updateData(row.index, column.id, value);
    };

    if (tableMeta?.editedRows[row.id]) {
        return (
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                type={columnMeta?.type || "text"}
            />
        );
    }
    return <span>{value}</span>;
}

export default TableCell;
