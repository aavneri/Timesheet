import React, { useState, useEffect } from "react";

function TableCell({ getValue, row, column, table }) {
    const initialValue = getValue();
    const columnMeta = column.columnDef.meta;
    const tableMeta = table.options.meta;
    const [value, setValue] = useState(initialValue);
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const onBlur = () => {
        let validValue = value;
        if (columnMeta?.min) {
            validValue = Math.max(columnMeta?.min, validValue);
        }
        if (columnMeta?.max) {
            validValue = Math.min(columnMeta?.max, validValue);
        }
        console.log(validValue)
        setValue(validValue);
        table.options.meta?.updateData(row.index, column.id, validValue);
    };

    if (tableMeta?.editedRows[row.id]) {
        return (
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={onBlur}
                type={columnMeta?.type || "text"}
                min={columnMeta?.min || ""}
                max={columnMeta?.max || ""}
            />
        );
    }
    return <span>{value}</span>;
}

export default TableCell;
