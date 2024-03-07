import { Column } from "use-ful-table"

export default function SimpleTable({
  columns,
  rows,
}: {
  columns: Column[]
  rows: any[]
}) {
  return (
    <div style={{ border: "1px solid black", padding: "10px" }}>
      <table>
        <TableHead columns={columns} />
        <TableBody rows={rows} />
      </table>
    </div>
  )
}

function TableHead({ columns }: { columns: Column[] }) {
  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.id}>
            {/* TODO: sorting */}
            {/* TODO: checkbox */}
            <div>{column.title}</div>
          </th>
        ))}
      </tr>
    </thead>
  )
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
