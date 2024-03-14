import React from "react"

import { ColumnDefinition } from "../../types"

export function ColumnsSelector({
  columns,
  hiddenColumns,
  setColumnHidden,
}: {
  columns: ColumnDefinition[]
  hiddenColumns: string[]
  setColumnHidden: (columnId: string, hidden: boolean) => void
}) {
  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      {columns.map((column) => (
        <label key={column.id}>
          <input
            type="checkbox"
            checked={!hiddenColumns.includes(column.id)}
            onChange={(e) => setColumnHidden(column.id, !e.target.checked)}
          />
          {column.title}
        </label>
      ))}
    </div>
  )
}
