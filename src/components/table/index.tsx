import React from "react"

import { TableProps, Column } from "../../types"

export function Table({ columns, rows, sortBy }: TableProps) {
  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <table>
        <TableHead columns={columns} sortBy={sortBy} />
        <TableBody rows={rows} />
      </table>
    </div>
  )
}

type TableHeadProps = {
  columns: Column[]
  sortBy: (column: string, direction?: "asc" | "desc") => void
}

type SortingButtonProps = {
  column: Column
  sortBy: (column: string, direction?: "asc" | "desc") => void
}

function TableHead({ columns, sortBy }: TableHeadProps) {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.id}>
            {/* TODO: checkbox */}
            <div>
              {column.title}
              <SortingButton column={column} sortBy={sortBy} />
            </div>
          </th>
        ))}
      </tr>
    </thead>
  )
}

function SortingButton({ column, sortBy }: SortingButtonProps) {
  if (!column.sortable) return null

  if (column.sorting === "asc")
    return <button onClick={() => sortBy(column.sortKey)}>ASC</button>
  if (column.sorting === "desc")
    return <button onClick={() => sortBy(column.sortKey)}>DESC</button>
  else return <button onClick={() => sortBy(column.sortKey)}>X</button>
}

function TableBody({ rows }: { rows: any[] }) {
  return (
    <tbody>
      {rows.map((row, index) => (
        <tr key={index}>
          {row.map((cell: any, index: number) => (
            <td key={index}>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}
